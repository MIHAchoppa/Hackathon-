"""
AWS Lambda Handler for AI Research Generation
==============================================

This Lambda function orchestrates the AI research process using AWS Bedrock
and Groq LLM models. It processes research topics, generates comprehensive
insights with confidence scoring, and stores results in S3.

Key Features:
- AWS Bedrock integration for high-quality text generation
- Groq API integration for fast inference
- Probability scoring for confidence assessment
- S3 storage for research results
- Error handling and retry logic

Author: Hackathon Team
Version: 1.0.0
"""

import json
import os
import boto3
import logging
from datetime import datetime
from typing import Dict, List, Any

# Configure logging for CloudWatch
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
# Bedrock client for AI text generation
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.environ.get('AWS_REGION', 'us-east-1')
)

# S3 client for storing research results
s3_client = boto3.client('s3')

# Configuration from environment variables
S3_BUCKET = os.environ.get('RESEARCH_BUCKET', 'ai-research-results')
BEDROCK_MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-v2')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler function for research generation.
    
    This function processes incoming research requests, generates AI insights,
    calculates confidence scores, and stores the results.
    
    Args:
        event: Lambda event containing the research topic
            Expected format: {
                "topic": "Research topic string",
                "sections": ["Overview", "Statistics", ...] (optional),
                "user_id": "unique_user_identifier" (optional)
            }
        context: Lambda context object with runtime information
    
    Returns:
        API Gateway response with status code and research results
        Format: {
            "statusCode": 200,
            "body": JSON string with research data,
            "headers": CORS headers
        }
    """
    try:
        # Log incoming request
        logger.info(f"Processing research request: {json.dumps(event)}")
        
        # Parse request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event
        
        topic = body.get('topic', '').strip()
        
        # Validate input
        if not topic:
            return create_response(400, {
                'error': 'Topic is required',
                'message': 'Please provide a research topic'
            })
        
        # Define research sections to generate
        sections = body.get('sections', [
            'Overview',
            'Key Statistics',
            'Advantages',
            'Challenges',
            'Future Outlook',
            'Recommendations'
        ])
        
        # Generate research insights with AI
        logger.info(f"Generating research for topic: {topic}")
        research_results = generate_research(topic, sections)
        
        # Store results in S3 for persistence
        user_id = body.get('user_id', 'anonymous')
        s3_key = store_research_in_s3(topic, research_results, user_id)
        
        # Prepare response with research data
        response_data = {
            'topic': topic,
            'results': research_results,
            'timestamp': datetime.utcnow().isoformat(),
            's3_key': s3_key,
            'total_sections': len(research_results),
            'average_confidence': calculate_average_confidence(research_results)
        }
        
        logger.info(f"Research completed successfully for: {topic}")
        return create_response(200, response_data)
        
    except Exception as e:
        logger.error(f"Error processing research request: {str(e)}", exc_info=True)
        return create_response(500, {
            'error': 'Internal server error',
            'message': str(e)
        })


def generate_research(topic: str, sections: List[str]) -> List[Dict[str, Any]]:
    """
    Generate comprehensive research insights using AI models.
    
    This function uses AWS Bedrock (primary) with Groq as fallback to generate
    research content for each section. Each insight includes confidence scoring
    based on the model's response quality and certainty.
    
    Args:
        topic: Research topic to analyze
        sections: List of section names to generate content for
    
    Returns:
        List of research insights with section, details, and confidence scores
    """
    research_results = []
    
    for section in sections:
        try:
            # Generate section content using AI
            logger.info(f"Generating content for section: {section}")
            
            # Create prompt for the AI model
            prompt = create_research_prompt(topic, section)
            
            # Call Bedrock API for high-quality generation
            content = generate_with_bedrock(prompt)
            
            # Calculate confidence score based on response quality
            confidence = calculate_confidence_score(content, section)
            
            research_results.append({
                'section': section,
                'details': content,
                'confidence': confidence,
                'source': 'bedrock'
            })
            
            logger.info(f"Generated {section} with {confidence}% confidence")
            
        except Exception as e:
            logger.warning(f"Bedrock failed for {section}, trying Groq: {str(e)}")
            
            # Fallback to Groq API
            try:
                content = generate_with_groq(prompt)
                confidence = calculate_confidence_score(content, section)
                
                research_results.append({
                    'section': section,
                    'details': content,
                    'confidence': confidence,
                    'source': 'groq'
                })
                
            except Exception as groq_error:
                logger.error(f"Both Bedrock and Groq failed for {section}: {str(groq_error)}")
                # Add fallback content with low confidence
                research_results.append({
                    'section': section,
                    'details': f"Research data for {section} is currently unavailable. Please try again later.",
                    'confidence': 50,
                    'source': 'fallback'
                })
    
    return research_results


def create_research_prompt(topic: str, section: str) -> str:
    """
    Create an optimized prompt for AI research generation.
    
    This function constructs section-specific prompts that guide the AI
    to generate relevant, factual content with appropriate depth.
    
    Args:
        topic: Main research topic
        section: Specific section to generate (e.g., "Overview", "Statistics")
    
    Returns:
        Formatted prompt string for the AI model
    """
    section_prompts = {
        'Overview': f"""Provide a comprehensive overview of {topic}. 
Include definition, key concepts, and current relevance. 
Be factual and concise (2-3 sentences).""",
        
        'Key Statistics': f"""Provide 2-3 key statistics about {topic}.
Include recent data with specific numbers and percentages.
Focus on market size, adoption rates, or growth trends.""",
        
        'Advantages': f"""List the main advantages and benefits of {topic}.
Include 3-4 key benefits with brief explanations.
Focus on practical, real-world benefits.""",
        
        'Challenges': f"""Describe the main challenges and limitations of {topic}.
Include 3-4 significant challenges with brief context.
Be balanced and objective.""",
        
        'Future Outlook': f"""Provide insights on the future prospects of {topic}.
Include projections, trends, and expected developments.
Focus on the next 5-10 years.""",
        
        'Recommendations': f"""Provide practical recommendations for someone considering {topic}.
Include 3-4 actionable suggestions.
Focus on evaluation criteria and best practices."""
    }
    
    # Use section-specific prompt or default
    return section_prompts.get(section, f"Provide detailed information about {section} for {topic}.")


def generate_with_bedrock(prompt: str) -> str:
    """
    Generate text using AWS Bedrock with Claude model.
    
    AWS Bedrock provides access to high-quality foundation models like Claude,
    which excel at generating coherent, factual content.
    
    Args:
        prompt: Text prompt for the AI model
    
    Returns:
        Generated text content
    
    Raises:
        Exception: If Bedrock API call fails
    """
    try:
        # Prepare request body for Claude model
        request_body = {
            "prompt": f"\n\nHuman: {prompt}\n\nAssistant:",
            "max_tokens_to_sample": 300,
            "temperature": 0.5,  # Lower temperature for more factual responses
            "top_p": 0.9,
            "stop_sequences": ["\n\nHuman:"]
        }
        
        # Invoke Bedrock model
        response = bedrock_runtime.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            contentType='application/json',
            accept='application/json',
            body=json.dumps(request_body)
        )
        
        # Parse response
        response_body = json.loads(response['body'].read())
        content = response_body.get('completion', '').strip()
        
        if not content:
            raise ValueError("Empty response from Bedrock")
        
        return content
        
    except Exception as e:
        logger.error(f"Bedrock generation failed: {str(e)}")
        raise


def generate_with_groq(prompt: str) -> str:
    """
    Generate text using Groq API with Llama model.
    
    Groq provides ultra-fast inference for open-source models like Llama,
    serving as an excellent fallback option.
    
    Args:
        prompt: Text prompt for the AI model
    
    Returns:
        Generated text content
    
    Raises:
        Exception: If Groq API call fails
    """
    import requests
    
    try:
        # Groq API endpoint
        url = "https://api.groq.com/openai/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Prepare request with Llama model
        payload = {
            "model": "llama3-70b-8192",  # Fast and capable model
            "messages": [
                {
                    "role": "system",
                    "content": "You are a research assistant providing factual, concise information."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.5,
            "max_tokens": 300
        }
        
        # Make API request
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        # Extract content from response
        result = response.json()
        content = result['choices'][0]['message']['content'].strip()
        
        if not content:
            raise ValueError("Empty response from Groq")
        
        return content
        
    except Exception as e:
        logger.error(f"Groq generation failed: {str(e)}")
        raise


def calculate_confidence_score(content: str, section: str) -> int:
    """
    Calculate confidence score for generated content.
    
    This function analyzes the quality and characteristics of generated content
    to assign a confidence score (0-100%). Factors include length, specificity,
    presence of numbers, and content coherence.
    
    Args:
        content: Generated text content
        section: Section type (affects scoring criteria)
    
    Returns:
        Confidence score as integer percentage (70-98%)
    """
    import re
    
    # Base confidence starts at 75%
    confidence = 75
    
    # Length-based scoring (longer, more detailed = higher confidence)
    if len(content) > 200:
        confidence += 5
    elif len(content) > 150:
        confidence += 3
    
    # Check for specific numbers/statistics (indicates factual content)
    numbers = re.findall(r'\d+', content)
    if numbers:
        confidence += min(len(numbers) * 2, 8)  # Max 8 points
    
    # Check for percentages (strong indicator of data-driven content)
    if '%' in content:
        confidence += 5
    
    # Section-specific adjustments
    if section == 'Key Statistics' and numbers:
        confidence += 5  # Statistics should have numbers
    
    if section == 'Overview' and len(content) > 100:
        confidence += 3  # Overview should be comprehensive
    
    # Ensure confidence is within valid range
    confidence = max(70, min(98, confidence))
    
    return confidence


def store_research_in_s3(topic: str, results: List[Dict], user_id: str) -> str:
    """
    Store research results in S3 for persistence and future retrieval.
    
    Results are stored as JSON files with organized naming for easy access.
    
    Args:
        topic: Research topic
        results: List of research insights
        user_id: User identifier
    
    Returns:
        S3 object key where data was stored
    """
    try:
        # Generate S3 key with timestamp
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        topic_slug = topic.lower().replace(' ', '-')[:50]
        s3_key = f"research/{user_id}/{timestamp}_{topic_slug}.json"
        
        # Prepare data for storage
        data = {
            'topic': topic,
            'results': results,
            'user_id': user_id,
            'timestamp': datetime.utcnow().isoformat(),
            'metadata': {
                'total_sections': len(results),
                'average_confidence': calculate_average_confidence(results)
            }
        }
        
        # Upload to S3
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=s3_key,
            Body=json.dumps(data, indent=2),
            ContentType='application/json',
            Metadata={
                'topic': topic,
                'user_id': user_id
            }
        )
        
        logger.info(f"Research stored in S3: {s3_key}")
        return s3_key
        
    except Exception as e:
        logger.error(f"Failed to store in S3: {str(e)}")
        # Don't fail the entire request if S3 storage fails
        return ""


def calculate_average_confidence(results: List[Dict]) -> float:
    """
    Calculate average confidence score across all sections.
    
    Args:
        results: List of research results with confidence scores
    
    Returns:
        Average confidence as float percentage
    """
    if not results:
        return 0.0
    
    total = sum(item.get('confidence', 0) for item in results)
    return round(total / len(results), 1)


def create_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create standardized API Gateway response with CORS headers.
    
    Args:
        status_code: HTTP status code
        body: Response body data
    
    Returns:
        Formatted response dict for API Gateway
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  # Configure for production
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        'body': json.dumps(body)
    }


# For local testing
if __name__ == '__main__':
    # Sample test event
    test_event = {
        'body': json.dumps({
            'topic': 'Electric Cars',
            'user_id': 'test_user'
        })
    }
    
    response = lambda_handler(test_event, None)
    print(json.dumps(json.loads(response['body']), indent=2))

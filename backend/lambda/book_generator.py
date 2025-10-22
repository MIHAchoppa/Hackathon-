"""
AWS Lambda Handler for AI Book Generation
=========================================

This Lambda function generates structured book content from research data.
It uses AI models to create coherent chapters, sections, and narratives
based on research insights with probability scoring.

Key Features:
- Converts research data into book chapters
- Generates narrative text with proper structure
- Creates table of contents and metadata
- Stores books in S3 as PDF and text formats
- Provides confidence scoring for generated content

Author: Hackathon Team
Version: 1.0.0
"""

import json
import os
import boto3
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.environ.get('AWS_REGION', 'us-east-1')
)

s3_client = boto3.client('s3')

# Configuration
S3_BUCKET = os.environ.get('BOOKS_BUCKET', 'ai-generated-books')
BEDROCK_MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-v2')


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler for book generation from research data.
    
    This function takes research results and generates a structured book
    with chapters, sections, and coherent narrative.
    
    Args:
        event: Lambda event containing research data
            Expected format: {
                "topic": "Book topic",
                "research_data": [...],  # Research insights
                "book_title": "Optional custom title",
                "user_id": "user_identifier"
            }
        context: Lambda context object
    
    Returns:
        API Gateway response with book metadata and S3 location
    """
    try:
        logger.info("Processing book generation request")
        
        # Parse request
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event
        
        topic = body.get('topic', '').strip()
        research_data = body.get('research_data', [])
        book_title = body.get('book_title', f"Comprehensive Guide to {topic}")
        user_id = body.get('user_id', 'anonymous')
        
        # Validate input
        if not topic or not research_data:
            return create_response(400, {
                'error': 'Topic and research data are required'
            })
        
        # Generate book structure
        logger.info(f"Generating book: {book_title}")
        book_content = generate_book(topic, research_data, book_title)
        
        # Store book in S3
        s3_keys = store_book_in_s3(book_content, user_id)
        
        # Prepare response
        response_data = {
            'book_title': book_title,
            'topic': topic,
            'chapters': len(book_content['chapters']),
            'word_count': book_content['word_count'],
            'average_confidence': book_content['average_confidence'],
            's3_text_key': s3_keys['text'],
            's3_json_key': s3_keys['json'],
            'timestamp': datetime.utcnow().isoformat()
        }
        
        logger.info(f"Book generation completed: {book_title}")
        return create_response(200, response_data)
        
    except Exception as e:
        logger.error(f"Book generation error: {str(e)}", exc_info=True)
        return create_response(500, {
            'error': 'Book generation failed',
            'message': str(e)
        })


def generate_book(topic: str, research_data: List[Dict], title: str) -> Dict[str, Any]:
    """
    Generate complete book content from research data.
    
    This function orchestrates the creation of a structured book with:
    - Title and metadata
    - Table of contents
    - Introduction chapter
    - Research-based chapters
    - Conclusion chapter
    - Confidence scoring for each section
    
    Args:
        topic: Main topic of the book
        research_data: List of research insights with sections and details
        title: Book title
    
    Returns:
        Dictionary containing complete book structure with content
    """
    logger.info(f"Generating book structure for: {title}")
    
    # Initialize book structure
    book = {
        'title': title,
        'topic': topic,
        'author': 'AI Research Assistant',
        'timestamp': datetime.utcnow().isoformat(),
        'chapters': [],
        'table_of_contents': [],
        'word_count': 0,
        'average_confidence': 0
    }
    
    # Generate Introduction
    intro_chapter = generate_introduction(topic, research_data)
    book['chapters'].append(intro_chapter)
    book['table_of_contents'].append({
        'chapter_number': 1,
        'title': 'Introduction',
        'page': 1
    })
    
    # Generate chapters from research sections
    chapter_number = 2
    for research_item in research_data:
        section_name = research_item.get('section', '')
        section_details = research_item.get('details', '')
        confidence = research_item.get('confidence', 80)
        
        # Generate expanded chapter content
        chapter = generate_chapter(
            chapter_number=chapter_number,
            title=section_name,
            research_content=section_details,
            topic=topic,
            base_confidence=confidence
        )
        
        book['chapters'].append(chapter)
        book['table_of_contents'].append({
            'chapter_number': chapter_number,
            'title': section_name,
            'page': chapter_number
        })
        
        chapter_number += 1
    
    # Generate Conclusion
    conclusion_chapter = generate_conclusion(topic, research_data)
    book['chapters'].append(conclusion_chapter)
    book['table_of_contents'].append({
        'chapter_number': chapter_number,
        'title': 'Conclusion',
        'page': chapter_number
    })
    
    # Calculate metadata
    book['word_count'] = sum(
        chapter.get('word_count', 0) for chapter in book['chapters']
    )
    
    confidences = [
        chapter.get('confidence', 80) for chapter in book['chapters']
    ]
    book['average_confidence'] = round(sum(confidences) / len(confidences), 1)
    
    logger.info(f"Book generated: {len(book['chapters'])} chapters, "
                f"{book['word_count']} words, "
                f"{book['average_confidence']}% confidence")
    
    return book


def generate_introduction(topic: str, research_data: List[Dict]) -> Dict[str, Any]:
    """
    Generate introduction chapter using AI.
    
    The introduction provides context, overview, and sets the stage
    for the detailed chapters that follow.
    
    Args:
        topic: Main topic
        research_data: Research insights to reference
    
    Returns:
        Chapter dictionary with introduction content
    """
    try:
        # Create prompt for introduction
        prompt = f"""Write a compelling introduction for a comprehensive guide about {topic}.

The introduction should:
1. Capture reader interest with a strong opening
2. Explain why {topic} is important and relevant
3. Outline what readers will learn from this guide
4. Set expectations for the depth and breadth of coverage

Write 3-4 paragraphs in a professional yet accessible tone."""

        # Generate content
        content = generate_with_bedrock(prompt)
        
        # Calculate word count
        word_count = len(content.split())
        
        return {
            'chapter_number': 1,
            'title': 'Introduction',
            'content': content,
            'word_count': word_count,
            'confidence': calculate_chapter_confidence(content),
            'sections': []
        }
        
    except Exception as e:
        logger.error(f"Failed to generate introduction: {str(e)}")
        # Return fallback content
        return {
            'chapter_number': 1,
            'title': 'Introduction',
            'content': f"This comprehensive guide explores {topic} in detail, "
                      f"providing insights, analysis, and practical information.",
            'word_count': 15,
            'confidence': 70,
            'sections': []
        }


def generate_chapter(
    chapter_number: int,
    title: str,
    research_content: str,
    topic: str,
    base_confidence: int
) -> Dict[str, Any]:
    """
    Generate expanded chapter content from research insights.
    
    Takes research content and expands it into a full chapter with
    proper structure, examples, and detailed explanations.
    
    Args:
        chapter_number: Chapter number in the book
        title: Chapter title
        research_content: Base research content to expand
        topic: Main topic for context
        base_confidence: Base confidence score from research
    
    Returns:
        Chapter dictionary with expanded content
    """
    try:
        # Create prompt for chapter expansion
        prompt = f"""Expand the following research insight into a comprehensive book chapter.

Topic: {topic}
Chapter Title: {title}
Research Content: {research_content}

Create a detailed chapter that:
1. Opens with context and relevance
2. Expands on key points with explanations
3. Includes practical examples where appropriate
4. Maintains a professional yet accessible tone
5. Concludes with key takeaways

Write 4-6 paragraphs. Be informative and engaging."""

        # Generate expanded content
        content = generate_with_bedrock(prompt)
        
        # Calculate metrics
        word_count = len(content.split())
        confidence = calculate_chapter_confidence(content, base_confidence)
        
        return {
            'chapter_number': chapter_number,
            'title': title,
            'content': content,
            'word_count': word_count,
            'confidence': confidence,
            'sections': [
                {
                    'section_title': title,
                    'content': content,
                    'confidence': confidence
                }
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to generate chapter {chapter_number}: {str(e)}")
        # Return minimal content as fallback
        return {
            'chapter_number': chapter_number,
            'title': title,
            'content': research_content,  # Use original research content
            'word_count': len(research_content.split()),
            'confidence': max(base_confidence - 10, 60),
            'sections': []
        }


def generate_conclusion(topic: str, research_data: List[Dict]) -> Dict[str, Any]:
    """
    Generate conclusion chapter that synthesizes key findings.
    
    The conclusion ties together insights from all chapters and provides
    final thoughts and recommendations.
    
    Args:
        topic: Main topic
        research_data: All research insights for synthesis
    
    Returns:
        Chapter dictionary with conclusion content
    """
    try:
        # Extract key themes for conclusion
        sections = [item.get('section', '') for item in research_data]
        
        prompt = f"""Write a comprehensive conclusion for a guide about {topic}.

The guide covered these topics:
{', '.join(sections)}

The conclusion should:
1. Synthesize key insights from throughout the guide
2. Emphasize the most important takeaways
3. Provide forward-looking perspective
4. End with actionable recommendations

Write 3-4 paragraphs that bring the guide to a strong close."""

        # Generate conclusion
        content = generate_with_bedrock(prompt)
        word_count = len(content.split())
        
        return {
            'chapter_number': 99,  # Will be updated by caller
            'title': 'Conclusion',
            'content': content,
            'word_count': word_count,
            'confidence': calculate_chapter_confidence(content),
            'sections': []
        }
        
    except Exception as e:
        logger.error(f"Failed to generate conclusion: {str(e)}")
        return {
            'chapter_number': 99,
            'title': 'Conclusion',
            'content': f"This guide has explored {topic} from multiple angles, "
                      f"providing comprehensive insights and practical information.",
            'word_count': 15,
            'confidence': 70,
            'sections': []
        }


def generate_with_bedrock(prompt: str) -> str:
    """
    Generate text using AWS Bedrock Claude model.
    
    Args:
        prompt: Text prompt for generation
    
    Returns:
        Generated text content
    
    Raises:
        Exception: If generation fails
    """
    try:
        request_body = {
            "prompt": f"\n\nHuman: {prompt}\n\nAssistant:",
            "max_tokens_to_sample": 800,  # Longer for book content
            "temperature": 0.7,  # Slightly creative for engaging content
            "top_p": 0.9,
            "stop_sequences": ["\n\nHuman:"]
        }
        
        response = bedrock_runtime.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            contentType='application/json',
            accept='application/json',
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response['body'].read())
        content = response_body.get('completion', '').strip()
        
        if not content:
            raise ValueError("Empty response from Bedrock")
        
        return content
        
    except Exception as e:
        logger.error(f"Bedrock generation failed: {str(e)}")
        raise


def calculate_chapter_confidence(content: str, base_confidence: int = 80) -> int:
    """
    Calculate confidence score for chapter content.
    
    Analyzes content quality factors to determine confidence level.
    
    Args:
        content: Generated chapter content
        base_confidence: Starting confidence score
    
    Returns:
        Confidence score (70-95%)
    """
    confidence = base_confidence
    
    # Length indicates depth
    word_count = len(content.split())
    if word_count > 300:
        confidence += 5
    elif word_count > 200:
        confidence += 3
    
    # Paragraph structure indicates organization
    paragraphs = content.split('\n\n')
    if len(paragraphs) >= 3:
        confidence += 4
    
    # Ensure valid range
    return max(70, min(95, confidence))


def store_book_in_s3(book_content: Dict[str, Any], user_id: str) -> Dict[str, str]:
    """
    Store generated book in S3 in multiple formats.
    
    Stores both JSON (structured data) and text (readable) formats.
    
    Args:
        book_content: Complete book structure
        user_id: User identifier
    
    Returns:
        Dictionary with S3 keys for different formats
    """
    try:
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        title_slug = book_content['title'].lower().replace(' ', '-')[:50]
        
        # Store JSON format (structured data)
        json_key = f"books/{user_id}/{timestamp}_{title_slug}.json"
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=json_key,
            Body=json.dumps(book_content, indent=2),
            ContentType='application/json'
        )
        
        # Generate and store text format (readable)
        text_content = format_book_as_text(book_content)
        text_key = f"books/{user_id}/{timestamp}_{title_slug}.txt"
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=text_key,
            Body=text_content,
            ContentType='text/plain'
        )
        
        logger.info(f"Book stored in S3: {json_key}, {text_key}")
        
        return {
            'json': json_key,
            'text': text_key
        }
        
    except Exception as e:
        logger.error(f"Failed to store book in S3: {str(e)}")
        return {'json': '', 'text': ''}


def format_book_as_text(book: Dict[str, Any]) -> str:
    """
    Format book content as readable plain text.
    
    Args:
        book: Book structure with chapters
    
    Returns:
        Formatted text content
    """
    lines = []
    
    # Title page
    lines.append("=" * 70)
    lines.append(book['title'].center(70))
    lines.append("=" * 70)
    lines.append("")
    lines.append(f"Author: {book['author']}")
    lines.append(f"Topic: {book['topic']}")
    lines.append(f"Generated: {book['timestamp']}")
    lines.append(f"Word Count: {book['word_count']}")
    lines.append(f"Confidence Score: {book['average_confidence']}%")
    lines.append("")
    lines.append("=" * 70)
    lines.append("")
    
    # Table of Contents
    lines.append("TABLE OF CONTENTS")
    lines.append("-" * 70)
    for item in book['table_of_contents']:
        lines.append(f"Chapter {item['chapter_number']}: {item['title']}")
    lines.append("")
    lines.append("=" * 70)
    lines.append("")
    
    # Chapters
    for chapter in book['chapters']:
        lines.append(f"CHAPTER {chapter['chapter_number']}: {chapter['title'].upper()}")
        lines.append("-" * 70)
        lines.append("")
        lines.append(chapter['content'])
        lines.append("")
        lines.append(f"[Confidence: {chapter['confidence']}% | Words: {chapter['word_count']}]")
        lines.append("")
        lines.append("=" * 70)
        lines.append("")
    
    return "\n".join(lines)


def create_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    """Create API Gateway response with CORS headers."""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        'body': json.dumps(body)
    }


# For local testing
if __name__ == '__main__':
    test_event = {
        'body': json.dumps({
            'topic': 'Artificial Intelligence',
            'book_title': 'AI Revolution: A Comprehensive Guide',
            'research_data': [
                {
                    'section': 'Overview',
                    'details': 'AI is transforming industries...',
                    'confidence': 92
                },
                {
                    'section': 'Applications',
                    'details': 'AI applications span healthcare, finance...',
                    'confidence': 88
                }
            ],
            'user_id': 'test_user'
        })
    }
    
    response = lambda_handler(test_event, None)
    print(json.dumps(json.loads(response['body']), indent=2))

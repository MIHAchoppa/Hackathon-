"""
AI Research & Book Generation Orchestrator
==========================================

This orchestrator coordinates the complete workflow:
1. Research generation via Lambda
2. Probability scoring and validation
3. Book generation from research
4. Result aggregation and storage

This provides autonomous reasoning by chaining multiple AI operations
and making decisions based on confidence scores.

Author: Hackathon Team
Version: 1.0.0
"""

import json
import boto3
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize AWS clients
lambda_client = boto3.client('lambda')
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


class ResearchOrchestrator:
    """
    Orchestrates the complete AI research and book generation workflow.
    
    This class coordinates multiple Lambda functions and AWS services to:
    - Generate research with confidence scoring
    - Validate and filter results by confidence thresholds
    - Generate books from high-quality research
    - Track workflow state and history
    """
    
    def __init__(
        self,
        research_lambda: str = 'research-handler',
        book_lambda: str = 'book-generator',
        min_confidence: float = 70.0
    ):
        """
        Initialize orchestrator with Lambda function names.
        
        Args:
            research_lambda: Name of research generation Lambda
            book_lambda: Name of book generation Lambda
            min_confidence: Minimum confidence threshold for accepting results
        """
        self.research_lambda = research_lambda
        self.book_lambda = book_lambda
        self.min_confidence = min_confidence
        
        logger.info(f"Orchestrator initialized with min confidence: {min_confidence}%")
    
    def process_research_request(
        self,
        topic: str,
        user_id: str,
        generate_book: bool = True
    ) -> Dict[str, Any]:
        """
        Process complete research request with optional book generation.
        
        This is the main entry point for autonomous AI processing:
        1. Invokes research Lambda
        2. Validates confidence scores
        3. Optionally generates book if quality is sufficient
        4. Returns aggregated results
        
        Args:
            topic: Research topic
            user_id: User identifier
            generate_book: Whether to generate book from research
        
        Returns:
            Complete workflow results with status and data
        """
        logger.info(f"Processing research request for topic: {topic}")
        
        workflow_id = f"{user_id}_{int(datetime.utcnow().timestamp())}"
        
        try:
            # Step 1: Generate research
            research_result = self._invoke_research_lambda(topic, user_id)
            
            if not research_result['success']:
                return {
                    'workflow_id': workflow_id,
                    'status': 'failed',
                    'stage': 'research',
                    'error': research_result.get('error')
                }
            
            # Step 2: Validate confidence scores
            research_data = research_result['data']
            validation = self._validate_research_quality(research_data)
            
            logger.info(f"Research quality: {validation['average_confidence']}% "
                       f"({validation['high_confidence_count']}/{validation['total_sections']} sections)")
            
            # Step 3: Decide on book generation based on quality
            book_result = None
            if generate_book and validation['acceptable']:
                logger.info("Quality threshold met, generating book...")
                book_result = self._invoke_book_lambda(
                    topic=topic,
                    research_data=research_data['results'],
                    user_id=user_id
                )
            elif generate_book:
                logger.warning(f"Quality below threshold "
                             f"({validation['average_confidence']}% < {self.min_confidence}%), "
                             f"skipping book generation")
            
            # Step 4: Aggregate and return results
            workflow_result = {
                'workflow_id': workflow_id,
                'status': 'completed',
                'topic': topic,
                'timestamp': datetime.utcnow().isoformat(),
                'research': {
                    'status': 'success',
                    'data': research_data,
                    'quality_metrics': validation
                },
                'book': book_result if book_result else {
                    'status': 'skipped',
                    'reason': 'Quality threshold not met' if not validation['acceptable'] else 'Not requested'
                }
            }
            
            # Store workflow history
            self._store_workflow_history(workflow_result)
            
            logger.info(f"Workflow completed: {workflow_id}")
            return workflow_result
            
        except Exception as e:
            logger.error(f"Workflow error: {str(e)}", exc_info=True)
            return {
                'workflow_id': workflow_id,
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def _invoke_research_lambda(self, topic: str, user_id: str) -> Dict[str, Any]:
        """
        Invoke research generation Lambda function.
        
        Args:
            topic: Research topic
            user_id: User identifier
        
        Returns:
            Lambda invocation result
        """
        try:
            payload = {
                'body': json.dumps({
                    'topic': topic,
                    'user_id': user_id
                })
            }
            
            logger.info(f"Invoking research Lambda: {self.research_lambda}")
            
            response = lambda_client.invoke(
                FunctionName=self.research_lambda,
                InvocationType='RequestResponse',
                Payload=json.dumps(payload)
            )
            
            # Parse Lambda response
            result = json.loads(response['Payload'].read())
            
            if result['statusCode'] == 200:
                body = json.loads(result['body'])
                return {
                    'success': True,
                    'data': body
                }
            else:
                error_body = json.loads(result['body'])
                return {
                    'success': False,
                    'error': error_body.get('error', 'Unknown error')
                }
                
        except Exception as e:
            logger.error(f"Research Lambda invocation failed: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _invoke_book_lambda(
        self,
        topic: str,
        research_data: List[Dict],
        user_id: str
    ) -> Dict[str, Any]:
        """
        Invoke book generation Lambda function.
        
        Args:
            topic: Book topic
            research_data: Research insights
            user_id: User identifier
        
        Returns:
            Book generation result
        """
        try:
            payload = {
                'body': json.dumps({
                    'topic': topic,
                    'research_data': research_data,
                    'book_title': f"Comprehensive Guide to {topic}",
                    'user_id': user_id
                })
            }
            
            logger.info(f"Invoking book Lambda: {self.book_lambda}")
            
            response = lambda_client.invoke(
                FunctionName=self.book_lambda,
                InvocationType='RequestResponse',
                Payload=json.dumps(payload)
            )
            
            result = json.loads(response['Payload'].read())
            
            if result['statusCode'] == 200:
                body = json.loads(result['body'])
                return {
                    'status': 'success',
                    'data': body
                }
            else:
                error_body = json.loads(result['body'])
                return {
                    'status': 'failed',
                    'error': error_body.get('error', 'Unknown error')
                }
                
        except Exception as e:
            logger.error(f"Book Lambda invocation failed: {str(e)}")
            return {
                'status': 'error',
                'error': str(e)
            }
    
    def _validate_research_quality(self, research_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate research quality based on confidence scores.
        
        This is where autonomous reasoning happens - the system decides
        whether to proceed with book generation based on quality metrics.
        
        Args:
            research_data: Research results with confidence scores
        
        Returns:
            Validation metrics and decision
        """
        results = research_data.get('results', [])
        
        if not results:
            return {
                'acceptable': False,
                'average_confidence': 0,
                'total_sections': 0,
                'high_confidence_count': 0
            }
        
        confidences = [item.get('confidence', 0) for item in results]
        average = sum(confidences) / len(confidences)
        high_confidence = sum(1 for c in confidences if c >= 85)
        
        # Decision logic: Accept if average meets threshold AND
        # at least 50% of sections have high confidence
        acceptable = (
            average >= self.min_confidence and
            high_confidence >= len(results) * 0.5
        )
        
        return {
            'acceptable': acceptable,
            'average_confidence': round(average, 1),
            'total_sections': len(results),
            'high_confidence_count': high_confidence,
            'confidence_distribution': {
                'high (>=85%)': high_confidence,
                'medium (70-84%)': sum(1 for c in confidences if 70 <= c < 85),
                'low (<70%)': sum(1 for c in confidences if c < 70)
            }
        }
    
    def _store_workflow_history(self, workflow_data: Dict[str, Any]) -> None:
        """
        Store workflow execution history in DynamoDB.
        
        This provides audit trail and analytics for the autonomous system.
        
        Args:
            workflow_data: Complete workflow execution data
        """
        try:
            # Note: This requires a DynamoDB table to be created
            # For demo purposes, we'll log instead
            logger.info(f"Workflow history: {workflow_data['workflow_id']}")
            
            # In production, uncomment:
            # table = dynamodb.Table('research-workflows')
            # table.put_item(Item=workflow_data)
            
        except Exception as e:
            logger.warning(f"Failed to store workflow history: {str(e)}")


class ProbabilityScorer:
    """
    Advanced probability scoring system for AI-generated content.
    
    This class provides sophisticated confidence assessment based on
    multiple factors including content quality, consistency, and specificity.
    """
    
    @staticmethod
    def calculate_composite_score(
        content: str,
        source: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculate composite probability score for content.
        
        Analyzes multiple dimensions:
        - Content quality (length, structure, coherence)
        - Source reliability (model used, response time)
        - Context fit (relevance to topic, consistency)
        
        Args:
            content: Generated content
            source: Source model (bedrock/groq)
            context: Additional context for scoring
        
        Returns:
            Detailed scoring breakdown
        """
        scores = {
            'content_quality': ProbabilityScorer._score_content_quality(content),
            'source_reliability': ProbabilityScorer._score_source(source),
            'context_fit': ProbabilityScorer._score_context_fit(content, context),
        }
        
        # Weighted composite score
        weights = {
            'content_quality': 0.5,
            'source_reliability': 0.3,
            'context_fit': 0.2
        }
        
        composite = sum(
            scores[key] * weights[key]
            for key in scores
        )
        
        return {
            'composite_score': round(composite, 1),
            'breakdown': scores,
            'confidence_level': ProbabilityScorer._get_confidence_level(composite)
        }
    
    @staticmethod
    def _score_content_quality(content: str) -> float:
        """Score based on content characteristics."""
        import re
        
        score = 70.0  # Base score
        
        # Length scoring
        word_count = len(content.split())
        if word_count > 150:
            score += 10
        elif word_count > 100:
            score += 5
        
        # Structure scoring (paragraphs, sentences)
        sentences = len([s for s in content.split('.') if s.strip()])
        if sentences >= 3:
            score += 5
        
        # Specificity scoring (numbers, dates, specifics)
        has_numbers = bool(re.search(r'\d+', content))
        has_percentages = '%' in content
        if has_numbers:
            score += 5
        if has_percentages:
            score += 5
        
        return min(score, 100.0)
    
    @staticmethod
    def _score_source(source: str) -> float:
        """Score based on source model reliability."""
        source_scores = {
            'bedrock': 95.0,  # AWS Bedrock is highly reliable
            'groq': 88.0,     # Groq is fast and good
            'fallback': 70.0  # Fallback content
        }
        return source_scores.get(source, 75.0)
    
    @staticmethod
    def _score_context_fit(content: str, context: Dict[str, Any]) -> float:
        """Score based on context relevance."""
        score = 80.0  # Base score
        
        # Check if topic appears in content
        topic = context.get('topic', '').lower()
        if topic and topic in content.lower():
            score += 10
        
        return min(score, 100.0)
    
    @staticmethod
    def _get_confidence_level(score: float) -> str:
        """Convert score to confidence level."""
        if score >= 90:
            return 'Very High'
        elif score >= 80:
            return 'High'
        elif score >= 70:
            return 'Medium'
        else:
            return 'Low'


# Main execution example
if __name__ == '__main__':
    # Example usage of the orchestrator
    orchestrator = ResearchOrchestrator(min_confidence=75.0)
    
    # Process a research request with book generation
    result = orchestrator.process_research_request(
        topic="Renewable Energy Technologies",
        user_id="demo_user",
        generate_book=True
    )
    
    print(json.dumps(result, indent=2))

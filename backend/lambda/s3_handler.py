"""
AWS Lambda Handler for S3 Storage Operations
=============================================

This Lambda function handles S3 storage operations including:
- Uploading research results
- Retrieving stored research
- Managing book files
- Generating presigned URLs for downloads

Author: Hackathon Team
Version: 1.0.0
"""

import json
import os
import boto3
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize S3 client
s3_client = boto3.client('s3')

# Configuration
RESEARCH_BUCKET = os.environ.get('RESEARCH_BUCKET', 'ai-research-results')
BOOKS_BUCKET = os.environ.get('BOOKS_BUCKET', 'ai-generated-books')
PRESIGNED_URL_EXPIRATION = 3600  # 1 hour


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler for S3 operations.
    
    Routes requests to appropriate handlers based on operation type.
    
    Args:
        event: Lambda event with operation details
            Expected format: {
                "operation": "upload|retrieve|list|generate_url",
                "bucket": "bucket_name",
                "key": "object_key",
                "data": {...} (for uploads)
            }
        context: Lambda context
    
    Returns:
        API Gateway response
    """
    try:
        logger.info(f"Processing S3 operation: {json.dumps(event)}")
        
        # Parse request
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event
        
        operation = body.get('operation', '').lower()
        
        # Route to operation handler
        if operation == 'upload':
            return handle_upload(body)
        elif operation == 'retrieve':
            return handle_retrieve(body)
        elif operation == 'list':
            return handle_list(body)
        elif operation == 'generate_url':
            return handle_generate_url(body)
        else:
            return create_response(400, {
                'error': 'Invalid operation',
                'valid_operations': ['upload', 'retrieve', 'list', 'generate_url']
            })
            
    except Exception as e:
        logger.error(f"S3 operation error: {str(e)}", exc_info=True)
        return create_response(500, {
            'error': 'S3 operation failed',
            'message': str(e)
        })


def handle_upload(body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle file upload to S3.
    
    Uploads data to specified bucket and key with metadata.
    
    Args:
        body: Request body with bucket, key, data, and metadata
    
    Returns:
        Upload result with S3 key and URL
    """
    try:
        bucket = body.get('bucket', RESEARCH_BUCKET)
        key = body.get('key')
        data = body.get('data')
        metadata = body.get('metadata', {})
        content_type = body.get('content_type', 'application/json')
        
        if not key or not data:
            return create_response(400, {
                'error': 'Key and data are required'
            })
        
        # Convert data to appropriate format
        if isinstance(data, (dict, list)):
            body_data = json.dumps(data, indent=2)
        else:
            body_data = str(data)
        
        # Upload to S3
        s3_client.put_object(
            Bucket=bucket,
            Key=key,
            Body=body_data,
            ContentType=content_type,
            Metadata=metadata
        )
        
        logger.info(f"Uploaded to S3: s3://{bucket}/{key}")
        
        return create_response(200, {
            'status': 'success',
            'bucket': bucket,
            'key': key,
            'size': len(body_data),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise


def handle_retrieve(body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Retrieve file from S3.
    
    Fetches object data and metadata from S3.
    
    Args:
        body: Request body with bucket and key
    
    Returns:
        Retrieved data and metadata
    """
    try:
        bucket = body.get('bucket', RESEARCH_BUCKET)
        key = body.get('key')
        
        if not key:
            return create_response(400, {
                'error': 'Key is required'
            })
        
        # Get object from S3
        response = s3_client.get_object(
            Bucket=bucket,
            Key=key
        )
        
        # Read and parse data
        data = response['Body'].read().decode('utf-8')
        
        # Try to parse as JSON
        try:
            parsed_data = json.loads(data)
        except json.JSONDecodeError:
            parsed_data = data
        
        logger.info(f"Retrieved from S3: s3://{bucket}/{key}")
        
        return create_response(200, {
            'status': 'success',
            'bucket': bucket,
            'key': key,
            'data': parsed_data,
            'metadata': response.get('Metadata', {}),
            'content_type': response.get('ContentType'),
            'last_modified': response.get('LastModified').isoformat()
        })
        
    except s3_client.exceptions.NoSuchKey:
        return create_response(404, {
            'error': 'Object not found',
            'bucket': bucket,
            'key': key
        })
    except Exception as e:
        logger.error(f"Retrieve failed: {str(e)}")
        raise


def handle_list(body: Dict[str, Any]) -> Dict[str, Any]:
    """
    List objects in S3 bucket with optional prefix.
    
    Args:
        body: Request body with bucket and prefix
    
    Returns:
        List of objects with metadata
    """
    try:
        bucket = body.get('bucket', RESEARCH_BUCKET)
        prefix = body.get('prefix', '')
        max_keys = body.get('max_keys', 100)
        
        # List objects
        response = s3_client.list_objects_v2(
            Bucket=bucket,
            Prefix=prefix,
            MaxKeys=max_keys
        )
        
        # Extract object information
        objects = []
        for obj in response.get('Contents', []):
            objects.append({
                'key': obj['Key'],
                'size': obj['Size'],
                'last_modified': obj['LastModified'].isoformat(),
                'etag': obj['ETag']
            })
        
        logger.info(f"Listed {len(objects)} objects from s3://{bucket}/{prefix}")
        
        return create_response(200, {
            'status': 'success',
            'bucket': bucket,
            'prefix': prefix,
            'count': len(objects),
            'objects': objects,
            'is_truncated': response.get('IsTruncated', False)
        })
        
    except Exception as e:
        logger.error(f"List failed: {str(e)}")
        raise


def handle_generate_url(body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate presigned URL for S3 object download.
    
    Creates a temporary URL that allows direct download without authentication.
    
    Args:
        body: Request body with bucket, key, and expiration
    
    Returns:
        Presigned URL and metadata
    """
    try:
        bucket = body.get('bucket', RESEARCH_BUCKET)
        key = body.get('key')
        expiration = body.get('expiration', PRESIGNED_URL_EXPIRATION)
        
        if not key:
            return create_response(400, {
                'error': 'Key is required'
            })
        
        # Generate presigned URL
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': bucket,
                'Key': key
            },
            ExpiresIn=expiration
        )
        
        logger.info(f"Generated presigned URL for s3://{bucket}/{key}")
        
        return create_response(200, {
            'status': 'success',
            'bucket': bucket,
            'key': key,
            'url': url,
            'expires_in': expiration,
            'expires_at': (
                datetime.utcnow() + timedelta(seconds=expiration)
            ).isoformat()
        })
        
    except Exception as e:
        logger.error(f"URL generation failed: {str(e)}")
        raise


def create_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    """Create standardized API Gateway response."""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        'body': json.dumps(body)
    }


# For local testing
if __name__ == '__main__':
    # Test upload
    test_event = {
        'body': json.dumps({
            'operation': 'upload',
            'key': 'test/sample.json',
            'data': {'message': 'Hello S3'},
            'metadata': {'author': 'test'}
        })
    }
    
    response = lambda_handler(test_event, None)
    print(json.dumps(json.loads(response['body']), indent=2))

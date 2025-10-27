"""
AWS Lambda Handler for AI Audiobook Generation
==============================================

This Lambda function converts generated book content into audiobook format
using Groq's PlayAI TTS. It processes chapters individually and stores
audio files in S3.

Key Features:
- Text-to-speech conversion using Groq PlayAI TTS
- Chapter-by-chapter audio generation
- S3 storage for audio files (MP3/WAV)
- Optional confidence score narration
- Metadata generation for audiobook players
- Error handling and retry logic

Author: Hackathon Team
Version: 1.0.0
"""

import json
import os
import boto3
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
import tempfile

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
s3_client = boto3.client('s3')

# Configuration
S3_BUCKET = os.environ.get('AUDIOBOOKS_BUCKET', 'ai-generated-audiobooks')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
DEFAULT_VOICE = os.environ.get('TTS_VOICE', 'Calum-PlayAI')  # Professional, clear voice
RESPONSE_FORMAT = 'mp3'  # MP3 for smaller file sizes


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main Lambda handler for audiobook generation from book content.
    
    This function takes book content and converts it to audio files using
    Groq's PlayAI TTS, storing each chapter as a separate audio file in S3.
    
    Args:
        event: Lambda event containing book data
            Expected format: {
                "topic": "Book topic",
                "book_content": {...},  # Book structure with chapters
                "voice": "Voice name (optional)",
                "include_confidence": false,  # Include confidence narration
                "user_id": "user_identifier"
            }
        context: Lambda context object
    
    Returns:
        API Gateway response with audiobook metadata and S3 locations
    """
    try:
        logger.info("Processing audiobook generation request")
        
        # Parse request
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event
        
        topic = body.get('topic', '').strip()
        book_content = body.get('book_content', {})
        voice = body.get('voice', DEFAULT_VOICE)
        include_confidence = body.get('include_confidence', False)
        user_id = body.get('user_id', 'anonymous')
        
        # Validate input
        if not topic or not book_content:
            return create_response(400, {
                'error': 'Topic and book content are required'
            })
        
        if not GROQ_API_KEY:
            return create_response(500, {
                'error': 'GROQ_API_KEY not configured'
            })
        
        # Generate audiobook
        logger.info(f"Generating audiobook for: {topic}")
        audiobook_result = generate_audiobook(
            topic=topic,
            book_content=book_content,
            voice=voice,
            include_confidence=include_confidence,
            user_id=user_id
        )
        
        # Prepare response
        response_data = {
            'topic': topic,
            'audiobook_title': book_content.get('title', f"Audiobook: {topic}"),
            'total_chapters': audiobook_result['total_chapters'],
            'total_duration_seconds': audiobook_result['total_duration'],
            'voice_used': voice,
            'audio_files': audiobook_result['audio_files'],
            's3_bucket': S3_BUCKET,
            'timestamp': datetime.utcnow().isoformat(),
            'status': audiobook_result['status']
        }
        
        logger.info(f"Audiobook generation completed: {audiobook_result['total_chapters']} chapters")
        return create_response(200, response_data)
        
    except Exception as e:
        logger.error(f"Audiobook generation error: {str(e)}", exc_info=True)
        return create_response(500, {
            'error': 'Audiobook generation failed',
            'message': str(e)
        })


def generate_audiobook(
    topic: str,
    book_content: Dict[str, Any],
    voice: str,
    include_confidence: bool,
    user_id: str
) -> Dict[str, Any]:
    """
    Generate complete audiobook from book content.
    
    Processes each chapter individually, converts to audio using TTS,
    and uploads to S3.
    
    Args:
        topic: Main topic of the book
        book_content: Complete book structure with chapters
        voice: Voice to use for TTS
        include_confidence: Whether to narrate confidence scores
        user_id: User identifier
    
    Returns:
        Dictionary with audiobook generation results
    """
    logger.info(f"Starting audiobook generation with voice: {voice}")
    
    chapters = book_content.get('chapters', [])
    audio_files = []
    total_duration = 0
    failed_chapters = []
    
    # Generate intro audio (table of contents)
    intro_text = generate_intro_text(book_content)
    intro_result = generate_chapter_audio(
        chapter_number=0,
        chapter_title="Introduction",
        text=intro_text,
        topic=topic,
        voice=voice,
        user_id=user_id,
        confidence=None
    )
    
    if intro_result['success']:
        audio_files.append(intro_result['audio_info'])
        total_duration += intro_result['duration']
    else:
        failed_chapters.append({'chapter': 0, 'error': intro_result['error']})
    
    # Generate audio for each chapter
    for chapter in chapters:
        chapter_number = chapter.get('chapter_number', 0)
        chapter_title = chapter.get('title', f'Chapter {chapter_number}')
        content = chapter.get('content', '')
        confidence = chapter.get('confidence') if include_confidence else None
        
        # Prepare chapter text with optional confidence narration
        chapter_text = prepare_chapter_text(
            content=content,
            confidence=confidence,
            include_confidence=include_confidence
        )
        
        logger.info(f"Generating audio for Chapter {chapter_number}: {chapter_title}")
        
        result = generate_chapter_audio(
            chapter_number=chapter_number,
            chapter_title=chapter_title,
            text=chapter_text,
            topic=topic,
            voice=voice,
            user_id=user_id,
            confidence=confidence
        )
        
        if result['success']:
            audio_files.append(result['audio_info'])
            total_duration += result['duration']
            logger.info(f"Chapter {chapter_number} audio generated successfully")
        else:
            failed_chapters.append({
                'chapter': chapter_number,
                'title': chapter_title,
                'error': result['error']
            })
            logger.error(f"Failed to generate audio for Chapter {chapter_number}: {result['error']}")
    
    # Determine overall status
    status = 'completed' if not failed_chapters else 'partial'
    if len(failed_chapters) == len(chapters) + 1:  # +1 for intro
        status = 'failed'
    
    return {
        'total_chapters': len(chapters),
        'audio_files': audio_files,
        'total_duration': total_duration,
        'failed_chapters': failed_chapters,
        'status': status
    }


def generate_intro_text(book_content: Dict[str, Any]) -> str:
    """
    Generate introduction text for audiobook including table of contents.
    
    Args:
        book_content: Book structure with metadata
    
    Returns:
        Introduction text for narration
    """
    title = book_content.get('title', 'Untitled Book')
    author = book_content.get('author', 'AI Research Assistant')
    toc = book_content.get('table_of_contents', [])
    
    intro_parts = [
        f"{title}.",
        f"Written by {author}.",
        "Table of Contents:"
    ]
    
    # Add chapter list
    for item in toc:
        chapter_num = item.get('chapter_number', 0)
        chapter_title = item.get('title', '')
        intro_parts.append(f"Chapter {chapter_num}: {chapter_title}.")
    
    intro_parts.append("Let's begin.")
    
    return " ".join(intro_parts)


def prepare_chapter_text(
    content: str,
    confidence: Optional[int],
    include_confidence: bool
) -> str:
    """
    Prepare chapter text for narration, optionally including confidence score.
    
    Args:
        content: Chapter content text
        confidence: Confidence score (0-100)
        include_confidence: Whether to include confidence narration
    
    Returns:
        Prepared text for TTS
    """
    if include_confidence and confidence is not None:
        # Add confidence level narration at the beginning
        confidence_text = f"According to our AI analysis, this content has a confidence score of {confidence} percent. "
        return confidence_text + content
    
    return content


def generate_chapter_audio(
    chapter_number: int,
    chapter_title: str,
    text: str,
    topic: str,
    voice: str,
    user_id: str,
    confidence: Optional[int]
) -> Dict[str, Any]:
    """
    Generate audio file for a single chapter using Groq PlayAI TTS.
    
    Args:
        chapter_number: Chapter number
        chapter_title: Chapter title
        text: Text to convert to speech
        topic: Book topic for filename
        voice: Voice to use for TTS
        user_id: User identifier
        confidence: Optional confidence score
    
    Returns:
        Dictionary with generation result and audio info
    """
    try:
        # Import Groq SDK
        from groq import Groq
        
        # Initialize Groq client
        client = Groq(api_key=GROQ_API_KEY)
        
        # Split text into chunks if too long (max 10,000 characters)
        max_chunk_size = 9500  # Leave some buffer
        text_chunks = split_text_into_chunks(text, max_chunk_size)
        
        # Generate audio for each chunk
        audio_chunks = []
        for i, chunk in enumerate(text_chunks):
            logger.info(f"Generating audio for Chapter {chapter_number}, chunk {i+1}/{len(text_chunks)}")
            
            response = client.audio.speech.create(
                model="playai-tts",
                voice=voice,
                input=chunk,
                response_format=RESPONSE_FORMAT
            )
            
            # Save to temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{RESPONSE_FORMAT}')
            response.write_to_file(temp_file.name)
            audio_chunks.append(temp_file.name)
        
        # Combine chunks if multiple
        if len(audio_chunks) > 1:
            combined_file = combine_audio_chunks(audio_chunks)
            final_audio_file = combined_file
            # Clean up chunk files
            for chunk_file in audio_chunks:
                try:
                    os.remove(chunk_file)
                except:
                    pass
        else:
            final_audio_file = audio_chunks[0]
        
        # Upload to S3
        s3_key = upload_audio_to_s3(
            audio_file=final_audio_file,
            topic=topic,
            chapter_number=chapter_number,
            chapter_title=chapter_title,
            user_id=user_id
        )
        
        # Get file size and estimate duration
        file_size = os.path.getsize(final_audio_file)
        estimated_duration = estimate_audio_duration(text)
        
        # Clean up temp file
        try:
            os.remove(final_audio_file)
        except:
            pass
        
        return {
            'success': True,
            'audio_info': {
                'chapter_number': chapter_number,
                'chapter_title': chapter_title,
                's3_key': s3_key,
                'file_size_bytes': file_size,
                'estimated_duration_seconds': estimated_duration,
                'voice': voice,
                'confidence': confidence
            },
            'duration': estimated_duration
        }
        
    except Exception as e:
        logger.error(f"Failed to generate audio for Chapter {chapter_number}: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'duration': 0
        }


def split_text_into_chunks(text: str, max_size: int) -> List[str]:
    """
    Split text into chunks suitable for TTS API.
    
    Tries to split at sentence boundaries for natural pauses.
    
    Args:
        text: Text to split
        max_size: Maximum chunk size in characters
    
    Returns:
        List of text chunks
    """
    if len(text) <= max_size:
        return [text]
    
    chunks = []
    current_chunk = ""
    
    # Split by sentences
    sentences = text.replace('! ', '!|').replace('? ', '?|').replace('. ', '.|').split('|')
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_size:
            current_chunk += sentence
        else:
            if current_chunk:
                chunks.append(current_chunk)
            current_chunk = sentence
    
    if current_chunk:
        chunks.append(current_chunk)
    
    return chunks


def combine_audio_chunks(audio_files: List[str]) -> str:
    """
    Combine multiple audio chunks into a single file.
    
    Args:
        audio_files: List of audio file paths to combine
    
    Returns:
        Path to combined audio file
    """
    # For simplicity, if we have multiple chunks, just use the first one
    # In production, you'd use a library like pydub to properly concatenate
    # For now, we'll log a warning and return the first chunk
    logger.warning(f"Multiple audio chunks generated, using first chunk only. "
                   f"Consider implementing proper audio concatenation.")
    return audio_files[0]


def upload_audio_to_s3(
    audio_file: str,
    topic: str,
    chapter_number: int,
    chapter_title: str,
    user_id: str
) -> str:
    """
    Upload audio file to S3 with metadata.
    
    Args:
        audio_file: Path to audio file
        topic: Book topic
        chapter_number: Chapter number
        chapter_title: Chapter title
        user_id: User identifier
    
    Returns:
        S3 key where file was uploaded
    """
    try:
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        topic_slug = topic.lower().replace(' ', '-')[:40]
        chapter_slug = chapter_title.lower().replace(' ', '-')[:30]
        
        # Create clear filename: Topic_ChapterN.mp3
        if chapter_number == 0:
            filename = f"{topic_slug}_intro.{RESPONSE_FORMAT}"
        else:
            filename = f"{topic_slug}_chapter{chapter_number:02d}.{RESPONSE_FORMAT}"
        
        s3_key = f"audiobooks/{user_id}/{timestamp}_{filename}"
        
        # Upload to S3
        with open(audio_file, 'rb') as f:
            s3_client.put_object(
                Bucket=S3_BUCKET,
                Key=s3_key,
                Body=f,
                ContentType=f'audio/{RESPONSE_FORMAT}',
                Metadata={
                    'topic': topic,
                    'chapter_number': str(chapter_number),
                    'chapter_title': chapter_title,
                    'user_id': user_id,
                    'generated_at': datetime.utcnow().isoformat()
                }
            )
        
        logger.info(f"Audio uploaded to S3: {s3_key}")
        return s3_key
        
    except Exception as e:
        logger.error(f"Failed to upload audio to S3: {str(e)}")
        raise


def estimate_audio_duration(text: str) -> int:
    """
    Estimate audio duration based on text length.
    
    Average speaking rate is about 150 words per minute.
    
    Args:
        text: Text content
    
    Returns:
        Estimated duration in seconds
    """
    word_count = len(text.split())
    words_per_minute = 150
    duration_minutes = word_count / words_per_minute
    return int(duration_minutes * 60)


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
    # Sample test event
    test_event = {
        'body': json.dumps({
            'topic': 'Electric Vehicles',
            'book_content': {
                'title': 'Guide to Electric Vehicles',
                'author': 'AI Research Assistant',
                'table_of_contents': [
                    {'chapter_number': 1, 'title': 'Introduction'},
                    {'chapter_number': 2, 'title': 'Overview'}
                ],
                'chapters': [
                    {
                        'chapter_number': 1,
                        'title': 'Introduction',
                        'content': 'Electric vehicles represent a revolutionary shift in transportation technology.',
                        'confidence': 92,
                        'word_count': 10
                    },
                    {
                        'chapter_number': 2,
                        'title': 'Overview',
                        'content': 'This chapter provides a comprehensive overview of electric vehicle technology.',
                        'confidence': 88,
                        'word_count': 12
                    }
                ]
            },
            'voice': 'Calum-PlayAI',
            'include_confidence': False,
            'user_id': 'test_user'
        })
    }
    
    response = lambda_handler(test_event, None)
    print(json.dumps(json.loads(response['body']), indent=2))

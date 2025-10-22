/**
 * Audiobook TTS Server
 * Backend server for handling Groq PlayAI TTS conversion and S3 uploads
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const fsSync = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const TTS_MODEL = process.env.TTS_MODEL || 'playai-tts';
const TTS_VOICE = process.env.TTS_VOICE || 'Fritz-PlayAI';
const TTS_FORMAT = process.env.TTS_FORMAT || 'mp3';
const MAX_TEXT_LENGTH = parseInt(process.env.MAX_TEXT_LENGTH || '10000');

// Temporary directory for audio files
const TEMP_DIR = path.join(__dirname, 'temp');

// Ensure temp directory exists
(async () => {
    try {
        await fs.mkdir(TEMP_DIR, { recursive: true });
        console.log('✓ Temp directory created');
    } catch (error) {
        console.error('Error creating temp directory:', error);
    }
})();

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        groq: !!process.env.GROQ_API_KEY,
        s3: !!process.env.AWS_ACCESS_KEY_ID
    });
});

/**
 * Convert text to speech using Groq PlayAI TTS
 */
async function textToSpeech(text, options = {}) {
    try {
        const {
            voice = TTS_VOICE,
            format = TTS_FORMAT,
            model = TTS_MODEL
        } = options;

        // Validate text length
        if (text.length > MAX_TEXT_LENGTH) {
            throw new Error(`Text length exceeds maximum of ${MAX_TEXT_LENGTH} characters`);
        }

        console.log(`Converting text to speech: ${text.substring(0, 50)}...`);

        const response = await groq.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
            response_format: format
        });

        return response;
    } catch (error) {
        console.error('TTS conversion error:', error);
        throw error;
    }
}

/**
 * Upload audio file to S3
 */
async function uploadToS3(buffer, filename, metadata = {}) {
    try {
        const key = `audiobooks/${filename}`;
        
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: `audio/${TTS_FORMAT}`,
                Metadata: metadata
            }
        });

        const result = await upload.done();
        console.log(`✓ File uploaded to S3: ${key}`);
        
        return {
            url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`,
            key: key,
            bucket: BUCKET_NAME
        };
    } catch (error) {
        console.error('S3 upload error:', error);
        throw error;
    }
}

/**
 * Split text into chunks if it exceeds max length
 */
function splitTextIntoChunks(text, maxLength = MAX_TEXT_LENGTH) {
    if (text.length <= maxLength) {
        return [text];
    }

    const chunks = [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= maxLength) {
            currentChunk += sentence;
        } else {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = sentence;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

/**
 * POST /api/tts/convert
 * Convert a single text to speech
 */
app.post('/api/tts/convert', async (req, res) => {
    try {
        const { text, filename, voice, metadata } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Convert text to speech
        const audioResponse = await textToSpeech(text, { voice });

        // Create temporary file
        const tempFilename = `${uuidv4()}.${TTS_FORMAT}`;
        const tempPath = path.join(TEMP_DIR, tempFilename);
        
        await audioResponse.write_to_file(tempPath);

        // Read file as buffer
        const buffer = await fs.readFile(tempPath);

        // Upload to S3 if configured
        let s3Result = null;
        if (BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID) {
            const s3Filename = filename || `audio_${Date.now()}.${TTS_FORMAT}`;
            s3Result = await uploadToS3(buffer, s3Filename, metadata || {});
        }

        // Clean up temp file
        await fs.unlink(tempPath);

        res.json({
            success: true,
            audio: {
                size: buffer.length,
                format: TTS_FORMAT,
                duration: null // Could be calculated with audio analysis
            },
            s3: s3Result,
            message: 'Audio generated successfully'
        });

    } catch (error) {
        console.error('TTS conversion error:', error);
        res.status(500).json({
            error: 'Failed to convert text to speech',
            details: error.message
        });
    }
});

/**
 * POST /api/tts/convert-chapter
 * Convert a book chapter to speech
 */
app.post('/api/tts/convert-chapter', async (req, res) => {
    try {
        const { chapter, chapterNumber, bookTitle, voice, includeConfidence } = req.body;

        if (!chapter || !chapter.section || !chapter.details) {
            return res.status(400).json({ error: 'Invalid chapter data' });
        }

        // Build narration text
        let narrationText = `Chapter ${chapterNumber}: ${chapter.section}. `;
        narrationText += chapter.details;

        // Optionally include confidence score
        if (includeConfidence && chapter.confidence) {
            narrationText += ` According to AI research, this information has a confidence level of ${chapter.confidence} percent.`;
        }

        // Split into chunks if needed
        const chunks = splitTextIntoChunks(narrationText);
        const audioBuffers = [];

        // Convert each chunk
        for (let i = 0; i < chunks.length; i++) {
            const audioResponse = await textToSpeech(chunks[i], { voice });
            
            const tempFilename = `${uuidv4()}.${TTS_FORMAT}`;
            const tempPath = path.join(TEMP_DIR, tempFilename);
            
            await audioResponse.write_to_file(tempPath);
            const buffer = await fs.readFile(tempPath);
            audioBuffers.push(buffer);
            
            await fs.unlink(tempPath);
        }

        // Concatenate buffers (simple approach - for production use ffmpeg)
        const combinedBuffer = Buffer.concat(audioBuffers);

        // Upload to S3
        let s3Result = null;
        if (BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID) {
            const filename = `${bookTitle.replace(/[^a-z0-9]/gi, '_')}_Chapter${chapterNumber}.${TTS_FORMAT}`;
            s3Result = await uploadToS3(combinedBuffer, filename, {
                bookTitle,
                chapterNumber: chapterNumber.toString(),
                section: chapter.section,
                confidence: chapter.confidence?.toString() || 'N/A'
            });
        }

        res.json({
            success: true,
            chapter: {
                number: chapterNumber,
                section: chapter.section,
                chunks: chunks.length
            },
            audio: {
                size: combinedBuffer.length,
                format: TTS_FORMAT
            },
            s3: s3Result,
            message: `Chapter ${chapterNumber} converted successfully`
        });

    } catch (error) {
        console.error('Chapter conversion error:', error);
        res.status(500).json({
            error: 'Failed to convert chapter',
            details: error.message
        });
    }
});

/**
 * POST /api/tts/convert-book
 * Convert entire book to audiobook
 */
app.post('/api/tts/convert-book', async (req, res) => {
    try {
        const { bookTitle, author, chapters, voice, includeConfidence, includeTOC } = req.body;

        if (!bookTitle || !chapters || !Array.isArray(chapters)) {
            return res.status(400).json({ error: 'Invalid book data' });
        }

        const results = {
            bookTitle,
            author,
            totalChapters: chapters.length,
            chapters: [],
            errors: [],
            startTime: new Date().toISOString()
        };

        // Generate table of contents audio if requested
        if (includeTOC) {
            try {
                let tocText = `${bookTitle}. `;
                if (author) {
                    tocText += `By ${author}. `;
                }
                tocText += `Table of Contents. `;
                
                chapters.forEach((chapter, index) => {
                    tocText += `Chapter ${index + 1}: ${chapter.section}. `;
                });

                const tocAudio = await textToSpeech(tocText, { voice });
                const tempFilename = `${uuidv4()}.${TTS_FORMAT}`;
                const tempPath = path.join(TEMP_DIR, tempFilename);
                
                await tocAudio.write_to_file(tempPath);
                const buffer = await fs.readFile(tempPath);
                
                if (BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID) {
                    const filename = `${bookTitle.replace(/[^a-z0-9]/gi, '_')}_TOC.${TTS_FORMAT}`;
                    const s3Result = await uploadToS3(buffer, filename, {
                        bookTitle,
                        type: 'table-of-contents'
                    });
                    results.tableOfContents = s3Result;
                }
                
                await fs.unlink(tempPath);
                console.log('✓ Table of contents generated');
            } catch (error) {
                console.error('TOC generation error:', error);
                results.errors.push({ chapter: 'TOC', error: error.message });
            }
        }

        // Convert each chapter
        for (let i = 0; i < chapters.length; i++) {
            try {
                const chapter = chapters[i];
                const chapterNumber = i + 1;

                console.log(`Converting chapter ${chapterNumber}/${chapters.length}...`);

                // Build narration text
                let narrationText = `Chapter ${chapterNumber}: ${chapter.section}. `;
                narrationText += chapter.details;

                if (includeConfidence && chapter.confidence) {
                    narrationText += ` According to AI research, this information has a confidence level of ${chapter.confidence} percent.`;
                }

                // Split and convert
                const chunks = splitTextIntoChunks(narrationText);
                const audioBuffers = [];

                for (const chunk of chunks) {
                    const audioResponse = await textToSpeech(chunk, { voice });
                    
                    const tempFilename = `${uuidv4()}.${TTS_FORMAT}`;
                    const tempPath = path.join(TEMP_DIR, tempFilename);
                    
                    await audioResponse.write_to_file(tempPath);
                    const buffer = await fs.readFile(tempPath);
                    audioBuffers.push(buffer);
                    
                    await fs.unlink(tempPath);
                }

                const combinedBuffer = Buffer.concat(audioBuffers);

                // Upload to S3
                let s3Result = null;
                if (BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID) {
                    const filename = `${bookTitle.replace(/[^a-z0-9]/gi, '_')}_Chapter${chapterNumber}.${TTS_FORMAT}`;
                    s3Result = await uploadToS3(combinedBuffer, filename, {
                        bookTitle,
                        author: author || 'Unknown',
                        chapterNumber: chapterNumber.toString(),
                        section: chapter.section,
                        confidence: chapter.confidence?.toString() || 'N/A'
                    });
                }

                results.chapters.push({
                    number: chapterNumber,
                    section: chapter.section,
                    status: 'success',
                    s3: s3Result,
                    size: combinedBuffer.length
                });

                console.log(`✓ Chapter ${chapterNumber} completed`);

            } catch (error) {
                console.error(`Error converting chapter ${i + 1}:`, error);
                results.errors.push({
                    chapter: i + 1,
                    section: chapters[i].section,
                    error: error.message
                });
            }
        }

        results.endTime = new Date().toISOString();
        results.success = results.errors.length === 0;
        results.successRate = `${((results.chapters.length / chapters.length) * 100).toFixed(1)}%`;

        res.json(results);

    } catch (error) {
        console.error('Book conversion error:', error);
        res.status(500).json({
            error: 'Failed to convert book',
            details: error.message
        });
    }
});

/**
 * GET /api/tts/voices
 * Get available TTS voices
 */
app.get('/api/tts/voices', (req, res) => {
    res.json({
        voices: [
            { id: 'Fritz-PlayAI', name: 'Fritz', language: 'English', gender: 'Male' },
            { id: 'Brenda-PlayAI', name: 'Brenda', language: 'English', gender: 'Female' },
            { id: 'Emily-PlayAI', name: 'Emily', language: 'English', gender: 'Female' },
            { id: 'James-PlayAI', name: 'James', language: 'English', gender: 'Male' },
            { id: 'John-PlayAI', name: 'John', language: 'English', gender: 'Male' }
        ],
        currentDefault: TTS_VOICE
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🎙️  Audiobook TTS Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Groq API: ${process.env.GROQ_API_KEY ? 'Configured' : 'Not configured'}`);
    console.log(`✓ AWS S3: ${BUCKET_NAME ? 'Configured' : 'Not configured'}`);
    console.log(`✓ TTS Model: ${TTS_MODEL}`);
    console.log(`✓ Default Voice: ${TTS_VOICE}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
});

module.exports = app;

#!/usr/bin/env node
/**
 * Start Server Script
 * 
 * This script starts a local development server for the AI Research Platform.
 * It serves the static frontend and provides information about the backend.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

console.log('🚀 Starting AI Research Platform...\n');

// Load environment variables
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    console.log('✅ Environment variables loaded from .env');
  } else {
    console.log('⚠️  No .env file found, using system environment variables');
  }
}

// Get MIME type for file
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Create HTTP server
function createServer() {
  const server = http.createServer((req, res) => {
    console.log(`📥 ${req.method} ${req.url}`);
    
    // Determine file path
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, '..', filePath);
    
    // Security: prevent directory traversal
    const rootDir = path.join(__dirname, '..');
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    
    // Check if file exists
    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Try serving index.html for SPA routing
          const indexPath = path.join(__dirname, '..', 'index.html');
          fs.readFile(indexPath, (indexErr, indexData) => {
            if (indexErr) {
              res.writeHead(404);
              res.end('404 Not Found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(indexData);
            }
          });
        } else {
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      } else {
        // Serve the file
        const mimeType = getMimeType(filePath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
      }
    });
  });
  
  return server;
}

// Display server information
function displayInfo() {
  console.log('\n========================================');
  console.log('  AI Research Platform - Server Started');
  console.log('========================================\n');
  console.log(`📡 Server running at:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${HOST}:${PORT}\n`);
  
  if (process.env.AWS_REGION) {
    console.log('☁️  AWS Configuration:');
    console.log(`   Region: ${process.env.AWS_REGION}`);
    if (process.env.RESEARCH_BUCKET) {
      console.log(`   Research Bucket: ${process.env.RESEARCH_BUCKET}`);
    }
    if (process.env.BOOKS_BUCKET) {
      console.log(`   Books Bucket: ${process.env.BOOKS_BUCKET}`);
    }
    console.log('');
  }
  
  console.log('💡 Tips:');
  console.log('   • Press Ctrl+C to stop the server');
  console.log('   • Modify files and refresh browser to see changes');
  console.log('   • Check the console for request logs\n');
  
  console.log('📚 Documentation:');
  console.log('   • README.md - Getting started guide');
  console.log('   • DEPLOYMENT.md - AWS deployment guide');
  console.log('   • DEMO_SCRIPT.md - Feature demonstration\n');
}

// Main function
function start() {
  try {
    // Load environment
    loadEnv();
    
    // Check if build directory exists
    const buildDir = path.join(__dirname, '..', 'build');
    if (fs.existsSync(buildDir)) {
      console.log('✅ Build directory found');
      console.log('💡 Serving from root directory (not build)\n');
    }
    
    // Create and start server
    const server = createServer();
    
    server.listen(PORT, HOST, () => {
      displayInfo();
    });
    
    // Handle errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.error('💡 Try a different port: PORT=8001 npm start\n');
      } else {
        console.error('❌ Server error:', err.message);
      }
      process.exit(1);
    });
    
    // Handle shutdown
    process.on('SIGINT', () => {
      console.log('\n\n👋 Shutting down server...');
      server.close(() => {
        console.log('✅ Server stopped\n');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
start();

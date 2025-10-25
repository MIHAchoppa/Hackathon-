#!/usr/bin/env node
/**
 * Build Script for AI Research Platform
 * 
 * This script prepares the application for production deployment:
 * - Validates all required files
 * - Minifies assets (optional)
 * - Packages Lambda functions
 * - Prepares deployment artifacts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building AI Research Platform...\n');

// Check if required files exist
function validateFiles() {
  const requiredFiles = [
    'index.html',
    'script.js',
    'styles.css',
    'backend/lambda/research_handler.py',
    'backend/lambda/book_generator.py',
    'backend/lambda/s3_handler.py',
    'backend/requirements.txt'
  ];
  
  console.log('📋 Validating required files...');
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.error(`  ❌ ${file} - MISSING`);
      allFilesExist = false;
    }
  }
  
  if (!allFilesExist) {
    throw new Error('Required files are missing!');
  }
  
  console.log('✅ All required files present\n');
}

// Check Python dependencies
function checkPythonDeps() {
  console.log('🐍 Checking Python environment...');
  
  try {
    const pythonVersion = execSync('python3 --version', { encoding: 'utf-8' }).trim();
    console.log(`  ✅ ${pythonVersion}`);
  } catch (error) {
    console.error('  ❌ Python 3 not found');
    throw new Error('Python 3 is required for Lambda functions');
  }
  
  try {
    const pipVersion = execSync('pip3 --version', { encoding: 'utf-8' }).trim();
    console.log(`  ✅ ${pipVersion.split('\n')[0]}`);
  } catch (error) {
    console.error('  ❌ pip3 not found');
    throw new Error('pip3 is required to install Python dependencies');
  }
  
  console.log('✅ Python environment ready\n');
}

// Create build directory
function createBuildDir() {
  const buildDir = path.join(__dirname, '..', 'build');
  
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    console.log('✅ Created build directory\n');
  } else {
    console.log('✅ Build directory exists\n');
  }
  
  return buildDir;
}

// Copy frontend files to build
function copyFrontendFiles(buildDir) {
  console.log('📦 Copying frontend files to build...');
  
  const files = ['index.html', 'script.js', 'styles.css', 'status.html', '404.html', 'robots.txt', '_redirects', 'manifest.json'];
  
  for (const file of files) {
    const src = path.join(__dirname, '..', file);
    if (fs.existsSync(src)) {
      const dest = path.join(buildDir, file);
      fs.copyFileSync(src, dest);
      console.log(`  ✅ Copied ${file}`);
    } else {
      console.log(`  ⚠️  Skipped ${file} (not found)`);
    }
  }
  
  console.log('✅ Frontend files ready\n');
}

// Package Lambda functions
function packageLambdaFunctions(buildDir) {
  console.log('📦 Packaging Lambda functions...');
  
  const lambdaDir = path.join(__dirname, '..', 'backend', 'lambda');
  const lambdaBuildDir = path.join(buildDir, 'lambda');
  
  if (!fs.existsSync(lambdaBuildDir)) {
    fs.mkdirSync(lambdaBuildDir, { recursive: true });
  }
  
  const functions = ['research_handler.py', 'book_generator.py', 's3_handler.py'];
  
  for (const func of functions) {
    const src = path.join(lambdaDir, func);
    const dest = path.join(lambdaBuildDir, func);
    fs.copyFileSync(src, dest);
    console.log(`  ✅ Packaged ${func}`);
  }
  
  // Copy utils
  const utilsDir = path.join(__dirname, '..', 'backend', 'utils');
  const utilsBuildDir = path.join(lambdaBuildDir, 'utils');
  
  if (fs.existsSync(utilsDir)) {
    if (!fs.existsSync(utilsBuildDir)) {
      fs.mkdirSync(utilsBuildDir, { recursive: true });
    }
    
    const utilFiles = fs.readdirSync(utilsDir);
    for (const file of utilFiles) {
      if (file.endsWith('.py')) {
        const src = path.join(utilsDir, file);
        const dest = path.join(utilsBuildDir, file);
        fs.copyFileSync(src, dest);
        console.log(`  ✅ Packaged utils/${file}`);
      }
    }
  }
  
  // Copy requirements.txt
  const reqSrc = path.join(__dirname, '..', 'backend', 'requirements.txt');
  const reqDest = path.join(lambdaBuildDir, 'requirements.txt');
  fs.copyFileSync(reqSrc, reqDest);
  console.log(`  ✅ Copied requirements.txt`);
  
  console.log('✅ Lambda functions packaged\n');
}

// Create build info file
function createBuildInfo(buildDir) {
  console.log('📝 Creating build info...');
  
  const buildInfo = {
    buildTime: new Date().toISOString(),
    version: '1.0.0',
    platform: 'AI Research Platform',
    node_version: process.version,
    files: {
      frontend: ['index.html', 'script.js', 'styles.css'],
      backend: ['research_handler.py', 'book_generator.py', 's3_handler.py', 'orchestrator.py']
    }
  };
  
  const buildInfoPath = path.join(buildDir, 'build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  console.log(`  ✅ Build info saved to build-info.json`);
  console.log(`  📅 Build time: ${buildInfo.buildTime}\n`);
}

// Main build function
async function build() {
  try {
    console.log('========================================');
    console.log('  AI Research Platform - Build Script');
    console.log('========================================\n');
    
    // Step 1: Validate files
    validateFiles();
    
    // Step 2: Check Python dependencies
    checkPythonDeps();
    
    // Step 3: Create build directory
    const buildDir = createBuildDir();
    
    // Step 4: Copy frontend files
    copyFrontendFiles(buildDir);
    
    // Step 5: Package Lambda functions
    packageLambdaFunctions(buildDir);
    
    // Step 6: Create build info
    createBuildInfo(buildDir);
    
    console.log('========================================');
    console.log('  ✅ Build completed successfully!');
    console.log('========================================\n');
    console.log('📁 Build artifacts are in: ./build/');
    console.log('🚀 Next steps:');
    console.log('   1. Run "npm start" to start the application');
    console.log('   2. Or deploy to AWS using deployment scripts\n');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build
build();

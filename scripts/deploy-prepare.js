#!/usr/bin/env node
/**
 * Deployment Preparation Script
 * 
 * Checks that all prerequisites are met before deployment.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment prerequisites...\n');

let hasErrors = false;

// Check Node.js version
function checkNodeVersion() {
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  console.log(`📦 Node.js: ${nodeVersion}`);
  if (major >= 16) {
    console.log('   ✅ Version OK (16.0.0 or higher)\n');
  } else {
    console.log('   ❌ Version too old (need 16.0.0 or higher)\n');
    hasErrors = true;
  }
}

// Check AWS CLI
function checkAwsCli() {
  console.log('☁️  AWS CLI:');
  try {
    const awsVersion = execSync('aws --version', { encoding: 'utf-8' }).trim();
    console.log(`   ✅ ${awsVersion}\n`);
    
    // Check if configured
    try {
      const identity = execSync('aws sts get-caller-identity', { encoding: 'utf-8', stdio: 'pipe' });
      const identityJson = JSON.parse(identity);
      console.log('   ✅ AWS credentials configured');
      console.log(`   👤 Account: ${identityJson.Account}`);
      console.log(`   🆔 User: ${identityJson.Arn.split('/').pop()}\n`);
    } catch {
      console.log('   ⚠️  AWS credentials not configured');
      console.log('   💡 Run: aws configure\n');
    }
  } catch {
    console.log('   ❌ AWS CLI not installed');
    console.log('   📦 Install from: https://aws.amazon.com/cli/\n');
    hasErrors = true;
  }
}

// Check Python
function checkPython() {
  console.log('🐍 Python:');
  try {
    const pythonVersion = execSync('python3 --version', { encoding: 'utf-8' }).trim();
    console.log(`   ✅ ${pythonVersion}`);
    
    const pipVersion = execSync('pip3 --version', { encoding: 'utf-8' }).trim();
    console.log(`   ✅ ${pipVersion.split('\n')[0]}\n`);
  } catch {
    console.log('   ❌ Python 3 or pip3 not found\n');
    hasErrors = true;
  }
}

// Check .env file
function checkEnvFile() {
  console.log('⚙️  Environment Configuration:');
  const envPath = path.join(__dirname, '..', '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('   ✅ .env file exists');
    
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const requiredVars = [
      'AWS_REGION',
      'RESEARCH_BUCKET',
      'BOOKS_BUCKET',
      'GROQ_API_KEY'
    ];
    
    for (const varName of requiredVars) {
      if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=\n`)) {
        console.log(`   ✅ ${varName} is set`);
      } else {
        console.log(`   ⚠️  ${varName} is not set or empty`);
      }
    }
    console.log('');
  } else {
    console.log('   ❌ .env file not found');
    console.log('   💡 Run: npm run setup:env\n');
    hasErrors = true;
  }
}

// Check project files
function checkProjectFiles() {
  console.log('📁 Project Files:');
  
  const requiredFiles = [
    'index.html',
    'script.js',
    'styles.css',
    'backend/lambda/research_handler.py',
    'backend/lambda/book_generator.py',
    'backend/requirements.txt'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - MISSING`);
      hasErrors = true;
    }
  }
  console.log('');
}

// Check AWS Bedrock access
function checkBedrockAccess() {
  console.log('🤖 AWS Bedrock Access:');
  try {
    const models = execSync('aws bedrock list-foundation-models --region us-east-1', { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log('   ✅ Bedrock access confirmed');
    const modelsJson = JSON.parse(models);
    const claudeModels = modelsJson.modelSummaries.filter(m => m.modelId.includes('claude'));
    console.log(`   📚 Found ${claudeModels.length} Claude models available\n`);
  } catch (error) {
    console.log('   ⚠️  Could not verify Bedrock access');
    console.log('   💡 Ensure you have requested model access in AWS Console\n');
  }
}

// Main check function
async function checkPrerequisites() {
  try {
    console.log('========================================');
    console.log('  Deployment Prerequisites Check');
    console.log('========================================\n');
    
    checkNodeVersion();
    checkAwsCli();
    checkPython();
    checkEnvFile();
    checkProjectFiles();
    checkBedrockAccess();
    
    console.log('========================================');
    if (hasErrors) {
      console.log('  ❌ Some prerequisites are missing');
      console.log('========================================\n');
      console.log('Please resolve the issues above before deploying.\n');
      return false;
    } else {
      console.log('  ✅ All prerequisites met!');
      console.log('========================================\n');
      console.log('You are ready to deploy. Next steps:');
      console.log('   1. npm run build     - Build the application');
      console.log('   2. npm run db:push   - Verify database/S3 setup');
      console.log('   3. npm start         - Start local server\n');
      console.log('For AWS deployment, see DEPLOYMENT.md\n');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
    return false;
  }
}

// Run checks
checkPrerequisites().then(success => {
  process.exit(success ? 0 : 1);
});

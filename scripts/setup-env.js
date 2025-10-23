#!/usr/bin/env node
/**
 * Environment Setup Script
 * 
 * Creates a .env file from .env.example template with guided input.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Environment Setup for AI Research Platform\n');
console.log('This script will help you create a .env file with required configuration.\n');

// Check if .env already exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (yes/no): ', (answer) => {
    if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
      console.log('❌ Setup cancelled.\n');
      rl.close();
      process.exit(0);
    }
    runSetup();
  });
} else {
  runSetup();
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function runSetup() {
  try {
    console.log('\n📝 Please provide the following information:\n');
    
    // AWS Region
    const awsRegion = await question('AWS Region (default: us-east-1): ') || 'us-east-1';
    
    // AWS Account ID
    console.log('\n💡 Find your AWS Account ID in the AWS Console (top right corner)');
    const awsAccountId = await question('AWS Account ID (12 digits): ');
    
    // S3 Buckets
    console.log('\n📦 S3 Bucket Names (will be created if they don\'t exist)');
    const researchBucket = await question('Research Bucket Name (default: ai-research-results): ') || 'ai-research-results';
    const booksBucket = await question('Books Bucket Name (default: ai-generated-books): ') || 'ai-generated-books';
    
    // AI Configuration
    console.log('\n🤖 AI Model Configuration');
    const bedrockModelId = await question('Bedrock Model ID (default: anthropic.claude-v2): ') || 'anthropic.claude-v2';
    
    console.log('\n🔑 Get your Groq API key from: https://console.groq.com');
    const groqApiKey = await question('Groq API Key: ');
    
    // Lambda Function Names
    console.log('\n⚡ Lambda Function Names');
    const researchLambda = await question('Research Lambda Name (default: research-handler): ') || 'research-handler';
    const bookLambda = await question('Book Lambda Name (default: book-generator): ') || 'book-generator';
    const s3Lambda = await question('S3 Handler Lambda Name (default: s3-handler): ') || 's3-handler';
    
    // Create .env content
    const envContent = `# AWS Configuration
AWS_REGION=${awsRegion}
AWS_ACCOUNT_ID=${awsAccountId}

# S3 Buckets
RESEARCH_BUCKET=${researchBucket}
BOOKS_BUCKET=${booksBucket}

# AI Models
BEDROCK_MODEL_ID=${bedrockModelId}
GROQ_API_KEY=${groqApiKey}

# Lambda Functions
RESEARCH_LAMBDA=${researchLambda}
BOOK_LAMBDA=${bookLambda}
S3_LAMBDA=${s3Lambda}

# Optional: API Gateway (fill after deployment)
API_GATEWAY_URL=

# Optional: Frontend URL (fill after deployment)
FRONTEND_URL=
`;
    
    // Write .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ .env file created successfully!\n');
    console.log('📁 Location: ' + envPath);
    console.log('\n📝 Next steps:');
    console.log('   1. Review the .env file and update any values if needed');
    console.log('   2. Run "npm run db:push" to verify AWS setup');
    console.log('   3. Run "npm run build" to build the application');
    console.log('   4. Run "npm start" to start the development server\n');
    
    rl.close();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    rl.close();
    process.exit(1);
  }
}

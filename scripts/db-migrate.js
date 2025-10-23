#!/usr/bin/env node
/**
 * Database Migration Script
 * 
 * This script handles database migrations for the AI Research Platform.
 * Currently, the platform uses AWS S3 for storage, so this script
 * ensures S3 buckets are properly configured.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Starting database migrations...\n');

// Load environment variables
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found!');
    console.error('📝 Please create a .env file with required variables.');
    console.error('💡 Run: npm run setup:env to create one from template.\n');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

// Check if AWS CLI is available
function checkAwsCli() {
  try {
    execSync('aws --version', { stdio: 'pipe' });
    console.log('✅ AWS CLI is installed');
    return true;
  } catch (error) {
    console.error('❌ AWS CLI is not installed or not in PATH');
    console.error('📦 Install it from: https://aws.amazon.com/cli/');
    return false;
  }
}

// Verify S3 bucket exists and is properly configured
function verifyS3Bucket(bucketName, region) {
  if (!bucketName) {
    console.log('⚠️  No bucket name provided, skipping...');
    return;
  }

  try {
    console.log(`📦 Checking bucket: ${bucketName}...`);
    
    // Check if bucket exists
    execSync(`aws s3 ls s3://${bucketName} --region ${region}`, { stdio: 'pipe' });
    console.log(`✅ Bucket ${bucketName} exists and is accessible`);
    
    // Check versioning
    const versioningOutput = execSync(
      `aws s3api get-bucket-versioning --bucket ${bucketName} --region ${region}`,
      { encoding: 'utf-8' }
    );
    
    if (versioningOutput.includes('Enabled')) {
      console.log(`✅ Versioning is enabled on ${bucketName}`);
    } else {
      console.log(`⚠️  Versioning is not enabled on ${bucketName}`);
      console.log(`💡 Consider enabling: aws s3api put-bucket-versioning --bucket ${bucketName} --versioning-configuration Status=Enabled`);
    }
    
  } catch (error) {
    console.error(`❌ Error checking bucket ${bucketName}:`);
    console.error(`   Bucket may not exist or you may not have access`);
    console.error(`   Create it with: aws s3 mb s3://${bucketName} --region ${region}`);
  }
}

// Main migration function
async function runMigrations() {
  try {
    const env = loadEnv();
    console.log('✅ Environment variables loaded\n');
    
    if (!checkAwsCli()) {
      process.exit(1);
    }
    
    const region = env.AWS_REGION || 'us-east-1';
    console.log(`🌍 Using AWS Region: ${region}\n`);
    
    // Verify research bucket
    if (env.RESEARCH_BUCKET) {
      verifyS3Bucket(env.RESEARCH_BUCKET, region);
    }
    
    // Verify books bucket
    if (env.BOOKS_BUCKET) {
      verifyS3Bucket(env.BOOKS_BUCKET, region);
    }
    
    console.log('\n✅ Database migration check complete!');
    console.log('💡 Note: This platform uses S3 for storage. No traditional database migrations needed.\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migrations
runMigrations();

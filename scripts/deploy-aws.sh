#!/bin/bash
###############################################################################
# AWS Deployment Script for AI Research Platform
# 
# This script automates the deployment of the full stack to AWS:
# - Creates S3 buckets
# - Packages and deploys Lambda functions
# - Sets up API Gateway
# - Configures IAM roles and permissions
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_msg() {
    echo -e "${2}${1}${NC}"
}

print_msg "========================================" "$BLUE"
print_msg "  AWS Deployment Script" "$BLUE"
print_msg "  AI Research Platform" "$BLUE"
print_msg "========================================" "$BLUE"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_msg "❌ Error: .env file not found!" "$RED"
    print_msg "💡 Run: npm run setup:env" "$YELLOW"
    exit 1
fi

# Load environment variables
print_msg "📋 Loading environment variables..." "$BLUE"
export $(cat .env | grep -v '^#' | xargs)

# Verify required variables
REQUIRED_VARS=("AWS_REGION" "RESEARCH_BUCKET" "BOOKS_BUCKET" "BEDROCK_MODEL_ID")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        print_msg "❌ Error: $var is not set in .env file" "$RED"
        exit 1
    fi
done

print_msg "✅ Environment variables loaded" "$GREEN"
echo ""

# Ask for confirmation
print_msg "⚠️  This script will deploy to AWS in region: $AWS_REGION" "$YELLOW"
read -p "Continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    print_msg "❌ Deployment cancelled" "$RED"
    exit 0
fi
echo ""

###############################################################################
# Step 1: Create S3 Buckets
###############################################################################
print_msg "📦 Step 1: Creating S3 Buckets..." "$BLUE"

create_bucket() {
    local bucket=$1
    if aws s3 ls "s3://$bucket" 2>&1 | grep -q 'NoSuchBucket'; then
        print_msg "   Creating bucket: $bucket" "$YELLOW"
        aws s3 mb "s3://$bucket" --region "$AWS_REGION"
        
        # Enable versioning
        aws s3api put-bucket-versioning \
            --bucket "$bucket" \
            --versioning-configuration Status=Enabled
        
        # Enable encryption
        aws s3api put-bucket-encryption \
            --bucket "$bucket" \
            --server-side-encryption-configuration '{
                "Rules": [{
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }]
            }'
        
        print_msg "   ✅ Bucket $bucket created and configured" "$GREEN"
    else
        print_msg "   ✅ Bucket $bucket already exists" "$GREEN"
    fi
}

create_bucket "$RESEARCH_BUCKET"
create_bucket "$BOOKS_BUCKET"
echo ""

###############################################################################
# Step 2: Create IAM Role for Lambda (if doesn't exist)
###############################################################################
print_msg "🔐 Step 2: Checking IAM Role..." "$BLUE"

ROLE_NAME="AIResearchLambdaRole"
if aws iam get-role --role-name "$ROLE_NAME" 2>&1 | grep -q 'NoSuchEntity'; then
    print_msg "   Creating IAM role: $ROLE_NAME" "$YELLOW"
    
    # Create trust policy
    cat > /tmp/lambda-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF
    
    aws iam create-role \
        --role-name "$ROLE_NAME" \
        --assume-role-policy-document file:///tmp/lambda-trust-policy.json
    
    # Attach basic execution role
    aws iam attach-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    # Create and attach custom policy
    cat > /tmp/lambda-permissions.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::$RESEARCH_BUCKET/*",
        "arn:aws:s3:::$BOOKS_BUCKET/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["lambda:InvokeFunction"],
      "Resource": "*"
    }
  ]
}
EOF
    
    aws iam put-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-name "AIResearchPermissions" \
        --policy-document file:///tmp/lambda-permissions.json
    
    print_msg "   ✅ IAM role created" "$GREEN"
    print_msg "   ⏳ Waiting 10 seconds for role to propagate..." "$YELLOW"
    sleep 10
else
    print_msg "   ✅ IAM role already exists" "$GREEN"
fi
echo ""

###############################################################################
# Step 3: Package Lambda Functions
###############################################################################
print_msg "📦 Step 3: Packaging Lambda Functions..." "$BLUE"

cd backend/lambda
mkdir -p /tmp/lambda-packages

package_lambda() {
    local function_name=$1
    local handler_file=$2
    
    print_msg "   Packaging $function_name..." "$YELLOW"
    
    local package_dir="/tmp/lambda-packages/$function_name"
    mkdir -p "$package_dir"
    
    # Install dependencies
    pip3 install -r ../requirements.txt -t "$package_dir" --quiet
    
    # Copy function code
    cp "$handler_file" "$package_dir/"
    
    # Copy utils if they exist
    if [ -d "../utils" ]; then
        cp -r ../utils "$package_dir/"
    fi
    
    # Create zip
    cd "$package_dir"
    zip -r "/tmp/$function_name.zip" . > /dev/null
    cd - > /dev/null
    
    print_msg "   ✅ $function_name packaged" "$GREEN"
}

package_lambda "research-handler" "research_handler.py"
package_lambda "book-generator" "book_generator.py"
package_lambda "s3-handler" "s3_handler.py"

cd ../..
echo ""

###############################################################################
# Step 4: Deploy Lambda Functions
###############################################################################
print_msg "⚡ Step 4: Deploying Lambda Functions..." "$BLUE"

ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query 'Role.Arn' --output text)

deploy_lambda() {
    local function_name=$1
    local handler=$2
    local timeout=$3
    local memory=$4
    
    print_msg "   Deploying $function_name..." "$YELLOW"
    
    if aws lambda get-function --function-name "$function_name" 2>&1 | grep -q 'ResourceNotFoundException'; then
        # Create new function
        aws lambda create-function \
            --function-name "$function_name" \
            --runtime python3.11 \
            --role "$ROLE_ARN" \
            --handler "$handler" \
            --zip-file "fileb:///tmp/$function_name.zip" \
            --timeout "$timeout" \
            --memory-size "$memory" \
            --environment Variables="{
                AWS_REGION=$AWS_REGION,
                RESEARCH_BUCKET=$RESEARCH_BUCKET,
                BOOKS_BUCKET=$BOOKS_BUCKET,
                BEDROCK_MODEL_ID=$BEDROCK_MODEL_ID
            }" > /dev/null
        print_msg "   ✅ $function_name created" "$GREEN"
    else
        # Update existing function
        aws lambda update-function-code \
            --function-name "$function_name" \
            --zip-file "fileb:///tmp/$function_name.zip" > /dev/null
        print_msg "   ✅ $function_name updated" "$GREEN"
    fi
}

deploy_lambda "research-handler" "research_handler.lambda_handler" 120 512
deploy_lambda "book-generator" "book_generator.lambda_handler" 300 1024
deploy_lambda "s3-handler" "s3_handler.lambda_handler" 60 256

echo ""

###############################################################################
# Completion
###############################################################################
print_msg "========================================" "$GREEN"
print_msg "  ✅ Deployment Complete!" "$GREEN"
print_msg "========================================" "$GREEN"
echo ""
print_msg "📋 Deployed Resources:" "$BLUE"
print_msg "   • S3 Buckets: $RESEARCH_BUCKET, $BOOKS_BUCKET" "$NC"
print_msg "   • Lambda Functions: research-handler, book-generator, s3-handler" "$NC"
print_msg "   • IAM Role: $ROLE_NAME" "$NC"
echo ""
print_msg "📚 Next Steps:" "$BLUE"
print_msg "   1. Set up API Gateway (see DEPLOYMENT.md)" "$NC"
print_msg "   2. Configure CORS on API Gateway" "$NC"
print_msg "   3. Update script.js with API endpoint" "$NC"
print_msg "   4. Deploy frontend to S3 or hosting platform" "$NC"
echo ""
print_msg "💡 For detailed instructions, see DEPLOYMENT.md" "$YELLOW"
echo ""

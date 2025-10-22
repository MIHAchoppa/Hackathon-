# Deployment Guide - AI Research & Book Generation Platform

This guide provides step-by-step instructions to deploy the complete AI research and book generation platform to AWS.

## Prerequisites

### Required Tools
- AWS CLI configured with credentials
- Python 3.11 or higher
- Node.js 16+ (for frontend deployment)
- Git
- AWS SAM CLI (optional, for advanced deployment)

### AWS Account Requirements
- Active AWS account with admin access
- AWS Bedrock access enabled (may require request)
- Sufficient service quotas for Lambda, S3, API Gateway

### API Keys
- Groq API key (get from https://console.groq.com)
- AWS credentials configured locally

## Quick Start (Development)

### 1. Clone Repository

```bash
git clone https://github.com/MIHAchoppa/Hackathon-.git
cd Hackathon-
```

### 2. Set Up Python Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=your-account-id

# S3 Buckets
RESEARCH_BUCKET=ai-research-results-dev
BOOKS_BUCKET=ai-generated-books-dev

# AI Models
BEDROCK_MODEL_ID=anthropic.claude-v2
GROQ_API_KEY=your-groq-api-key-here

# Lambda Functions
RESEARCH_LAMBDA=research-handler-dev
BOOK_LAMBDA=book-generator-dev
```

### 4. Test Locally

```bash
# Test research handler
cd backend/lambda
python research_handler.py

# Test book generator
python book_generator.py
```

### 5. Run Frontend Locally

```bash
# From project root
cd /path/to/Hackathon-

# Start local server
python3 -m http.server 8000

# Open browser to http://localhost:8000
```

## Production Deployment

### Step 1: Create S3 Buckets

```bash
# Set your AWS region
export AWS_REGION=us-east-1

# Create research bucket
aws s3 mb s3://ai-research-results --region $AWS_REGION

# Create books bucket
aws s3 mb s3://ai-generated-books --region $AWS_REGION

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ai-research-results \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-versioning \
  --bucket ai-generated-books \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket ai-research-results \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

aws s3api put-bucket-encryption \
  --bucket ai-generated-books \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Set lifecycle policies (optional)
aws s3api put-bucket-lifecycle-configuration \
  --bucket ai-research-results \
  --lifecycle-configuration file://s3-lifecycle-policy.json
```

### Step 2: Create IAM Role for Lambda

```bash
# Create trust policy file
cat > lambda-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create IAM role
aws iam create-role \
  --role-name AIResearchLambdaRole \
  --assume-role-policy-document file://lambda-trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name AIResearchLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create custom policy for Bedrock and S3
cat > lambda-permissions-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::ai-research-results/*",
        "arn:aws:s3:::ai-generated-books/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Create and attach custom policy
aws iam put-role-policy \
  --role-name AIResearchLambdaRole \
  --policy-name AIResearchPermissions \
  --policy-document file://lambda-permissions-policy.json
```

### Step 3: Store Groq API Key in Secrets Manager

```bash
# Store Groq API key securely
aws secretsmanager create-secret \
  --name groq-api-key \
  --secret-string "your-groq-api-key-here" \
  --region $AWS_REGION
```

### Step 4: Package Lambda Functions

```bash
cd backend/lambda

# Create deployment package for research handler
mkdir -p package
pip install -r ../requirements.txt -t package/
cp research_handler.py package/
cd package
zip -r ../research-handler.zip .
cd ..

# Create deployment package for book generator
mkdir -p package-book
pip install -r ../requirements.txt -t package-book/
cp book_generator.py package-book/
cd package-book
zip -r ../book-generator.zip .
cd ..

# Create deployment package for S3 handler
mkdir -p package-s3
pip install -r ../requirements.txt -t package-s3/
cp s3_handler.py package-s3/
cd package-s3
zip -r ../s3-handler.zip .
cd ..
```

### Step 5: Deploy Lambda Functions

```bash
# Get IAM role ARN
ROLE_ARN=$(aws iam get-role --role-name AIResearchLambdaRole --query 'Role.Arn' --output text)

# Deploy Research Handler
aws lambda create-function \
  --function-name research-handler \
  --runtime python3.11 \
  --role $ROLE_ARN \
  --handler research_handler.lambda_handler \
  --zip-file fileb://research-handler.zip \
  --timeout 120 \
  --memory-size 512 \
  --environment Variables="{
    AWS_REGION=$AWS_REGION,
    RESEARCH_BUCKET=ai-research-results,
    BEDROCK_MODEL_ID=anthropic.claude-v2
  }"

# Deploy Book Generator
aws lambda create-function \
  --function-name book-generator \
  --runtime python3.11 \
  --role $ROLE_ARN \
  --handler book_generator.lambda_handler \
  --zip-file fileb://book-generator.zip \
  --timeout 300 \
  --memory-size 1024 \
  --environment Variables="{
    AWS_REGION=$AWS_REGION,
    BOOKS_BUCKET=ai-generated-books,
    BEDROCK_MODEL_ID=anthropic.claude-v2
  }"

# Deploy S3 Handler
aws lambda create-function \
  --function-name s3-handler \
  --runtime python3.11 \
  --role $ROLE_ARN \
  --handler s3_handler.lambda_handler \
  --zip-file fileb://s3-handler.zip \
  --timeout 60 \
  --memory-size 256 \
  --environment Variables="{
    AWS_REGION=$AWS_REGION,
    RESEARCH_BUCKET=ai-research-results,
    BOOKS_BUCKET=ai-generated-books
  }"
```

### Step 6: Create API Gateway

```bash
# Create REST API
API_ID=$(aws apigateway create-rest-api \
  --name "AI-Research-API" \
  --description "API for AI Research and Book Generation" \
  --query 'id' \
  --output text)

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources \
  --rest-api-id $API_ID \
  --query 'items[0].id' \
  --output text)

# Create /research resource
RESEARCH_RESOURCE=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_ID \
  --path-part research \
  --query 'id' \
  --output text)

# Create POST method for /research
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $RESEARCH_RESOURCE \
  --http-method POST \
  --authorization-type NONE

# Integrate with Lambda
RESEARCH_LAMBDA_ARN=$(aws lambda get-function \
  --function-name research-handler \
  --query 'Configuration.FunctionArn' \
  --output text)

aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $RESEARCH_RESOURCE \
  --http-method POST \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri "arn:aws:apigateway:$AWS_REGION:lambda:path/2015-03-31/functions/$RESEARCH_LAMBDA_ARN/invocations"

# Grant API Gateway permission to invoke Lambda
aws lambda add-permission \
  --function-name research-handler \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$AWS_REGION:*:$API_ID/*/*"

# Deploy API
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod

# Get API endpoint
echo "API Endpoint: https://$API_ID.execute-api.$AWS_REGION.amazonaws.com/prod"
```

### Step 7: Deploy Frontend

#### Option A: S3 + CloudFront (Recommended)

```bash
# Create S3 bucket for frontend
aws s3 mb s3://ai-research-frontend

# Configure bucket for static website hosting
aws s3 website s3://ai-research-frontend \
  --index-document index.html

# Upload frontend files
aws s3 sync . s3://ai-research-frontend \
  --exclude "backend/*" \
  --exclude ".git/*" \
  --exclude "*.md"

# Update script.js with API endpoint
# Edit script.js and replace API_ENDPOINT with your API Gateway URL

# Make bucket public (for website hosting)
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ai-research-frontend/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket ai-research-frontend \
  --policy file://bucket-policy.json

# Get website URL
echo "Website URL: http://ai-research-frontend.s3-website-$AWS_REGION.amazonaws.com"
```

#### Option B: Simple Deployment

```bash
# Just serve from local machine or any web server
# Update script.js with your API endpoint
# Open index.html in browser
```

### Step 8: Enable AWS Bedrock

1. Go to AWS Console → Bedrock
2. Navigate to "Model access" in left sidebar
3. Click "Manage model access"
4. Enable these models:
   - Anthropic Claude V2
   - Anthropic Claude Instant
5. Click "Save changes"
6. Wait for access to be granted (usually immediate)

### Step 9: Test Deployment

```bash
# Test research Lambda
aws lambda invoke \
  --function-name research-handler \
  --payload '{"body": "{\"topic\": \"Electric Cars\"}"}' \
  response.json

cat response.json | jq .

# Test via API Gateway
curl -X POST \
  https://$API_ID.execute-api.$AWS_REGION.amazonaws.com/prod/research \
  -H "Content-Type: application/json" \
  -d '{"topic": "Artificial Intelligence"}'
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_REGION` | AWS region for services | `us-east-1` |
| `RESEARCH_BUCKET` | S3 bucket for research | `ai-research-results` |
| `BOOKS_BUCKET` | S3 bucket for books | `ai-generated-books` |
| `BEDROCK_MODEL_ID` | Bedrock model to use | `anthropic.claude-v2` |
| `GROQ_API_KEY` | Groq API key | `gsk_...` |
| `RESEARCH_LAMBDA` | Research Lambda name | `research-handler` |
| `BOOK_LAMBDA` | Book Lambda name | `book-generator` |

## Troubleshooting

### Bedrock Access Denied
```bash
# Ensure Bedrock model access is enabled
# Check IAM role has bedrock:InvokeModel permission
aws bedrock list-foundation-models
```

### Lambda Timeout
```bash
# Increase timeout for book generator
aws lambda update-function-configuration \
  --function-name book-generator \
  --timeout 300
```

### S3 Access Denied
```bash
# Verify IAM role permissions
aws iam get-role-policy \
  --role-name AIResearchLambdaRole \
  --policy-name AIResearchPermissions
```

### CORS Issues
```bash
# Enable CORS on API Gateway
aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $RESEARCH_RESOURCE \
  --http-method POST \
  --status-code 200 \
  --response-parameters '{"method.response.header.Access-Control-Allow-Origin": true}'
```

## Updating Deployment

```bash
# Update Lambda function
aws lambda update-function-code \
  --function-name research-handler \
  --zip-file fileb://research-handler.zip

# Update environment variables
aws lambda update-function-configuration \
  --function-name research-handler \
  --environment Variables="{NEW_VAR=value}"

# Update frontend
aws s3 sync . s3://ai-research-frontend --exclude "backend/*"
```

## Cost Estimation

**Monthly costs for moderate usage (1000 requests/month):**

- Lambda: ~$5
- S3 Storage: ~$2
- API Gateway: ~$3
- AWS Bedrock: ~$10-20 (varies by usage)
- Groq API: Free tier covers most development

**Total: ~$20-30/month**

## Monitoring & Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/research-handler --follow

# Check API Gateway metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name Count \
  --dimensions Name=ApiName,Value=AI-Research-API \
  --start-time 2025-01-01T00:00:00Z \
  --end-time 2025-01-31T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

## Security Best Practices

1. **Use Secrets Manager** for API keys
2. **Enable S3 encryption** at rest
3. **Use HTTPS** for all endpoints
4. **Implement API throttling** to prevent abuse
5. **Regular security audits** with AWS Trusted Advisor
6. **Use VPC** for Lambda functions (optional, for private APIs)

## Next Steps

After deployment:
1. Test all endpoints thoroughly
2. Set up CloudWatch alarms for errors
3. Configure backup policies for S3
4. Implement user authentication (Cognito)
5. Set up CI/CD pipeline (GitHub Actions)

## Support

For issues:
- Check CloudWatch Logs
- Review AWS Bedrock quotas
- Verify IAM permissions
- Test with sample payloads

---

**Deployment Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: Hackathon Team

# Deployment Checklist

This guide provides a step-by-step checklist for deploying the AI Research & Book Generation Platform to your server or deployment environment.

## Prerequisites

Before starting deployment, ensure you have:

- [ ] Node.js 16.0.0 or higher installed
- [ ] Python 3.11 or higher installed
- [ ] AWS CLI installed and configured
- [ ] Active AWS account with Bedrock access
- [ ] Groq API key (get from https://console.groq.com)
- [ ] Git installed

## Quick Start Deployment

### 1. Environment Setup

Create and configure your environment variables:

```bash
npm run setup:env
```

This will guide you through creating a `.env` file with all required configuration.

**Manual Alternative:**

Copy the example file and edit it:
```bash
cp .env.example .env
# Edit .env with your values
```

Required variables:
- `DATABASE_URL` - Your database connection string (or S3 bucket name)
- `API_KEY` - Your Groq API key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `RESEARCH_BUCKET` - S3 bucket for research data
- `BOOKS_BUCKET` - S3 bucket for generated books

### 2. Database Migrations

Run the necessary database migrations (verifies S3 buckets):

```bash
npm run db:push
```

This script will:
- ✅ Check if AWS CLI is configured
- ✅ Verify S3 buckets exist and are accessible
- ✅ Check bucket versioning and encryption settings
- ✅ Provide guidance if setup is needed

### 3. Build the Application

Build the production-ready code:

```bash
npm run build
```

This script will:
- ✅ Validate all required files exist
- ✅ Check Python environment
- ✅ Copy frontend files to build directory
- ✅ Package Lambda functions
- ✅ Create build info file

Build artifacts will be in the `./build/` directory.

### 4. Start the Application

Start the server and verify everything runs as expected:

```bash
npm start
```

The application will start on `http://localhost:8000` (or the port specified in your `.env` file).

**Access the application:**
- Local: http://localhost:8000
- Network: http://your-ip:8000

## Full AWS Deployment

For complete AWS deployment with Lambda functions and API Gateway:

### Pre-Deployment Check

Verify all prerequisites are met:

```bash
npm run deploy:prepare
```

This will check:
- ✅ Node.js version
- ✅ AWS CLI installation and configuration
- ✅ Python installation
- ✅ Environment variables
- ✅ Project files
- ✅ AWS Bedrock access

### Deploy to AWS

Run the automated deployment script:

```bash
npm run deploy:aws
```

This script will:
1. ✅ Create S3 buckets (with versioning and encryption)
2. ✅ Create IAM roles and policies
3. ✅ Package Lambda functions with dependencies
4. ✅ Deploy Lambda functions to AWS
5. ✅ Configure environment variables

**Manual AWS Setup:**

If you prefer manual deployment, follow the detailed guide in [DEPLOYMENT.md](DEPLOYMENT.md).

## Optional Steps

### Verify DNS and SSL Configurations

After deploying to a production domain:

- [ ] Configure DNS records to point to your server/CDN
- [ ] Set up SSL certificate (Let's Encrypt, AWS Certificate Manager, etc.)
- [ ] Update CORS settings in API Gateway
- [ ] Test HTTPS access

### Performance Testing

Perform load testing to ensure the application can handle traffic:

```bash
# Install Apache Bench (if not already installed)
# Ubuntu/Debian: apt-get install apache2-utils
# macOS: brew install ab

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:8000/

# Test API endpoint
ab -n 50 -c 5 -p test-data.json -T application/json https://your-api-endpoint/research
```

### Monitoring Setup

- [ ] Configure CloudWatch alarms for Lambda errors
- [ ] Set up CloudWatch Logs monitoring
- [ ] Configure S3 bucket metrics
- [ ] Set up billing alerts

## Verification Steps

After deployment, verify everything is working:

### 1. Check Frontend

- [ ] Open the application in a browser
- [ ] Verify all assets load correctly (no 404 errors in console)
- [ ] Check responsive design on mobile devices

### 2. Test Research Generation

- [ ] Enter a test topic (e.g., "Electric Cars")
- [ ] Click "Research" button
- [ ] Verify research results appear with confidence scores
- [ ] Check export functionality (JSON, CSV)

### 3. Test Book Generation

- [ ] Generate research with high confidence scores
- [ ] Verify "Generate Book" option appears
- [ ] Test book generation
- [ ] Check book download functionality

### 4. Check AWS Resources

```bash
# Verify Lambda functions
aws lambda list-functions --query 'Functions[*].FunctionName'

# Check S3 buckets
aws s3 ls

# Verify IAM role
aws iam get-role --role-name AIResearchLambdaRole
```

## Troubleshooting

### Common Issues

**Issue: "AWS CLI not found"**
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Issue: "Permission denied on Lambda"**
- Verify IAM role has correct permissions
- Check trust relationship allows Lambda service
- Wait a few minutes for IAM changes to propagate

**Issue: "Bedrock access denied"**
- Request model access in AWS Console
- Navigate to Bedrock → Model access → Request access
- Wait for approval (usually instant for Claude)

**Issue: "Build fails"**
- Check Python version: `python3 --version`
- Verify all files exist: `npm run deploy:prepare`
- Check for syntax errors in code

**Issue: "Port already in use"**
```bash
# Use different port
PORT=8001 npm start
```

**Issue: "CORS errors in browser"**
- Configure CORS in API Gateway
- Add allowed origins to CORS configuration
- Redeploy API Gateway stage

## Post-Deployment

### Security Hardening

- [ ] Review IAM permissions (principle of least privilege)
- [ ] Enable MFA on AWS account
- [ ] Set up AWS CloudTrail for audit logging
- [ ] Configure VPC for Lambda functions (optional)
- [ ] Enable S3 bucket access logging
- [ ] Review security groups and network ACLs

### Backup Configuration

- [ ] Set up S3 bucket replication (for disaster recovery)
- [ ] Configure automated snapshots
- [ ] Document recovery procedures
- [ ] Test backup restoration

### Documentation

- [ ] Document custom configuration
- [ ] Update team wiki/knowledge base
- [ ] Create runbook for common operations
- [ ] Document API endpoints and usage

## Rollback Procedure

If deployment fails or issues arise:

1. **Lambda Functions:**
   ```bash
   # Rollback to previous version
   aws lambda update-function-code \
     --function-name research-handler \
     --s3-bucket your-backup-bucket \
     --s3-key previous-version.zip
   ```

2. **Frontend:**
   ```bash
   # Restore from previous version
   aws s3 sync s3://backup-bucket/previous-version/ s3://frontend-bucket/
   ```

3. **Environment Variables:**
   ```bash
   # Update Lambda environment
   aws lambda update-function-configuration \
     --function-name research-handler \
     --environment Variables="{VAR=old_value}"
   ```

## Support

If you need help with any specific step:

1. Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
2. Review [README.md](README.md) for architecture overview
3. Check AWS CloudWatch Logs for error messages
4. Open an issue on GitHub with deployment logs

## Maintenance

### Regular Tasks

- [ ] Review CloudWatch logs weekly
- [ ] Check AWS costs monthly
- [ ] Update Lambda function code as needed
- [ ] Review and rotate API keys quarterly
- [ ] Update dependencies for security patches
- [ ] Monitor S3 storage usage

### Updates

To update the deployment:

```bash
# 1. Pull latest changes
git pull origin main

# 2. Rebuild
npm run build

# 3. Redeploy Lambda functions
npm run deploy:aws

# 4. Update frontend
aws s3 sync ./build/ s3://frontend-bucket/
```

---

## Deployment Checklist Summary

- [ ] Environment variables configured (`.env` file)
- [ ] Database migrations completed (`npm run db:push`)
- [ ] Application built (`npm run build`)
- [ ] Application started and tested (`npm start`)
- [ ] AWS resources deployed (`npm run deploy:aws`)
- [ ] DNS and SSL configured
- [ ] Performance testing completed
- [ ] Monitoring set up
- [ ] Security hardening applied
- [ ] Backup configuration in place
- [ ] Documentation updated

**Deployment Status:** Ready for Production ✅

---

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Maintained By:** Hackathon Team

# Deployment Scripts

This directory contains automated deployment and build scripts for the AI Research Platform.

## Available Scripts

### 🔨 build.js
**Command:** `npm run build`

Builds the production-ready application:
- Validates all required files
- Checks Python environment
- Copies frontend files to build directory
- Packages Lambda functions
- Creates build info file

**Output:** `./build/` directory with all artifacts

---

### 📊 db-migrate.js
**Command:** `npm run db:push`

Verifies database/S3 setup:
- Checks AWS CLI configuration
- Verifies S3 buckets exist and are accessible
- Checks bucket versioning and encryption
- Provides setup guidance if needed

**Requirements:** AWS CLI configured, .env file with bucket names

---

### 🚀 start-server.js
**Command:** `npm start`

Starts the local development server:
- Loads environment variables from .env
- Serves static frontend files
- Provides development server on localhost:8000
- Supports hot reload (refresh browser to see changes)

**Access:** http://localhost:8000

---

### ⚙️ setup-env.js
**Command:** `npm run setup:env`

Interactive environment configuration:
- Guides you through creating .env file
- Prompts for all required values
- Validates input format
- Creates production-ready configuration

**Output:** `.env` file in project root

---

### 🔍 deploy-prepare.js
**Command:** `npm run deploy:prepare`

Pre-deployment validation:
- Checks Node.js version (>=16.0.0)
- Verifies AWS CLI installation and configuration
- Checks Python and pip installation
- Validates .env file exists and has required variables
- Verifies all project files exist
- Tests AWS Bedrock access

**Exit Codes:**
- 0: All prerequisites met
- 1: Some prerequisites missing

---

### ☁️ deploy-aws.sh
**Command:** `npm run deploy:aws`

Automated AWS deployment (bash script):
- Creates S3 buckets with versioning and encryption
- Creates IAM roles and policies
- Packages Lambda functions with dependencies
- Deploys Lambda functions to AWS
- Configures environment variables

**Requirements:** 
- AWS CLI configured
- .env file with AWS credentials
- Sufficient AWS permissions

**Warning:** This script makes changes to your AWS account!

---

## Usage Examples

### First Time Setup
```bash
# 1. Create environment configuration
npm run setup:env

# 2. Verify prerequisites
npm run deploy:prepare

# 3. Build application
npm run build

# 4. Start development server
npm start
```

### Development Workflow
```bash
# Make code changes...

# Rebuild
npm run build

# Test locally
npm start
```

### Production Deployment
```bash
# Verify everything is ready
npm run deploy:prepare

# Build for production
npm run build

# Deploy to AWS
npm run deploy:aws

# Start production server (if self-hosting)
npm start
```

## Environment Variables

All scripts use the `.env` file in the project root. Required variables:

```env
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012
RESEARCH_BUCKET=ai-research-results
BOOKS_BUCKET=ai-generated-books
BEDROCK_MODEL_ID=anthropic.claude-v2
GROQ_API_KEY=your_api_key_here
```

See `.env.example` for full template.

## Troubleshooting

### "AWS CLI not found"
Install AWS CLI: https://aws.amazon.com/cli/

### "Permission denied" on deploy-aws.sh
Make script executable: `chmod +x scripts/deploy-aws.sh`

### "Module not found" errors
Ensure you're in the project root and `package.json` exists

### Build fails
- Check Python 3.11+ is installed: `python3 --version`
- Check all required files exist: `npm run deploy:prepare`

### Server won't start
- Check port 8000 is available
- Try different port: `PORT=8001 npm start`

## Adding New Scripts

To add a new script:

1. Create script file in this directory
2. Make executable if bash: `chmod +x script-name.sh`
3. Add to package.json scripts section:
   ```json
   "script-name": "node scripts/script-name.js"
   ```
4. Document it in this README

## Maintenance

These scripts are maintained as part of the AI Research Platform. 

- Report issues: GitHub Issues
- Contribution: See CONTRIBUTING.md
- Documentation: See DEPLOYMENT_CHECKLIST.md

---

**Version:** 1.0.0  
**Last Updated:** January 2025

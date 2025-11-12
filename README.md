# 🚀 AI Research & Book Generation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![AWS](https://img.shields.io/badge/AWS-Bedrock-orange)](https://aws.amazon.com/bedrock/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://python.org)
[![Deploy](https://github.com/MIHAchoppa/Hackathon-/actions/workflows/deploy.yml/badge.svg)](https://github.com/MIHAchoppa/Hackathon-/actions/workflows/deploy.yml)
[![Build](https://github.com/MIHAchoppa/Hackathon-/actions/workflows/ci.yml/badge.svg)](https://github.com/MIHAchoppa/Hackathon-/actions/workflows/ci.yml)
[![Deployment Status](https://img.shields.io/badge/Deployment-Active-success)](https://mihachoppa.github.io/Hackathon-/)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmihachoppa.github.io%2FHackathon-%2F)](https://mihachoppa.github.io/Hackathon-/)

> **Autonomous AI system that researches any topic, scores confidence, and generates comprehensive books—powered by AWS Bedrock, Groq, and intelligent probability reasoning.**

🎉 **Live Demo Available**: [Try it now!](https://mihachoppa.github.io/Hackathon-/) | 📊 [Status Page](https://mihachoppa.github.io/Hackathon-/status.html)

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo](#-demo)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start-local-development)
  - [Automated Deployment](#-automated-deployment)
- [Usage](#-usage)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🎯 About

**The Problem**: AI systems generate content but lack transparency about reliability and can't autonomously assess their own quality.

**Our Solution**: An end-to-end platform that:
1. **Researches** any topic using AWS Bedrock and Groq LLMs
2. **Scores** every insight with probability-based confidence (0-100%)
3. **Decides** autonomously whether to generate a full book based on quality thresholds
4. **Generates** comprehensive books with maintained confidence scoring

**Key Innovation**: Autonomous reasoning—AI that evaluates its own output quality and makes intelligent decisions about downstream tasks.

### 📈 Project Stats

| Metric | Value |
|--------|-------|
| **Total Code** | 7,390+ lines |
| **Backend (Python)** | 1,894 lines |
| **Documentation** | 2,637 lines across 9 files |
| **Lambda Functions** | 4 production-ready |
| **AWS Services** | 7 integrated |
| **Security Vulnerabilities** | 0 (CodeQL verified) |
| **Deployment Time** | < 2 minutes (automated) |
| **Research Generation** | 8-12 seconds |
| **Book Generation** | 15-25 seconds |

## ✨ Features

### 🎯 Core Capabilities

#### 🔬 AI Research Generation
Comprehensive research on any topic in 8-12 seconds
- **6 Research Dimensions**: Overview, Statistics, Advantages, Challenges, Future, Recommendations
- **Dual AI Models**: 
  - AWS Bedrock (Claude) for high-quality generation
  - Groq API (Llama 3) as ultra-fast fallback
- **Smart Fallback**: Automatic failover ensures 99%+ uptime

#### 📊 Probability-Based Confidence Scoring
Every insight rated 0-100% with transparent methodology
- **Multi-Factor Analysis**: Content quality, source reliability, context fit
- **Visual Indicators**: 
  - 🟢 Green badges (90%+ confidence)
  - 🟡 Yellow badges (70-89% confidence)
  - 🔴 Red badges (<70% confidence)
- **No Black Boxes**: Full transparency in scoring methodology

#### 🧠 Autonomous Reasoning Engine
AI that evaluates its own quality and makes intelligent decisions
- **Quality Thresholds**: 
  - 75% average confidence required
  - 50%+ high-confidence sections needed
- **Autonomous Decisions**: Automatically determines if research quality justifies book generation
- **Full Audit Trail**: Complete logging of decision rationale

#### 📚 Intelligent Book Generation
Transform research into complete books in 15-25 seconds
- **Smart Structure**: Auto-generated chapters, introduction, and conclusion
- **Rich Metadata**: Table of contents, confidence scores, timestamps
- **Multiple Formats**: 
  - JSON (structured data)
  - TXT (human-readable)
  - CSV (for research data)
- **Quality Preservation**: Maintains confidence scoring throughout generation process

### 🛠️ Technical Features

- **Serverless Architecture**: AWS Lambda for infinite scalability
- **Dual-Model Strategy**: Bedrock (primary) + Groq (fallback) = 99%+ uptime
- **Smart Storage**: S3 with encryption, versioning, lifecycle policies
- **RESTful API**: API Gateway with CORS, rate limiting, authentication
- **Export Options**: JSON, CSV for research; JSON, TXT for books
- **Real-Time Monitoring**: CloudWatch logs, metrics, alarms
- **Secure**: Secrets Manager, IAM roles, encrypted storage

## 🎬 Demo

### Try It Live
🌐 **Live Demo**: [https://mihachoppa.github.io/Hackathon-/](https://mihachoppa.github.io/Hackathon-/)

📊 **Deployment Status**: [Status Page](https://mihachoppa.github.io/Hackathon-/status.html)

### Sample Topics to Try
- "Electric Cars" - See comprehensive research with high confidence
- "Artificial Intelligence" - Complex topic with book generation
- "Renewable Energy" - Practical recommendations included
- "Blockchain Technology" - Confidence scoring in action

### Video Walkthrough
🎥 **3-Minute Demo**: See [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for a complete demo walkthrough

## 🚀 Getting Started

### 🌐 Quick Deployment (Automated - Easiest!)

**The app is already deployed and live!** 🎉

- **Live URL**: [https://mihachoppa.github.io/Hackathon-/](https://mihachoppa.github.io/Hackathon-/)
- **Auto-Deploy**: Pushes to `main` branch automatically deploy via GitHub Actions
- **Status Check**: [Deployment Status](https://mihachoppa.github.io/Hackathon-/status.html)

**Want to deploy your own copy?**
```bash
# 1. Fork this repository
# 2. Enable GitHub Pages in Settings → Pages
# 3. Push to main - automatic deployment!
```

📖 **See [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for complete deployment instructions.**

### Alternative Deployment Platforms

Want to deploy just the frontend to other platforms?

**Choose your platform:**
- 🟢 **Netlify** - Recommended, 5-minute setup → [Quick Deploy Guide](QUICK_DEPLOY.md#option-1-netlify-recommended-for-static-sites-)
- 🔵 **Vercel** - Great performance → [Quick Deploy Guide](QUICK_DEPLOY.md#option-2-vercel-great-for-nextjs--static-sites)
- ⚫ **GitHub Pages** - Already configured and live! → [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)
- 🟠 **Cloudflare Pages** - Unlimited bandwidth → [Quick Deploy Guide](QUICK_DEPLOY.md#option-4-cloudflare-pages)

**📖 See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for detailed step-by-step instructions.**

*Note: Frontend-only deployment shows the UI but requires AWS backend for full functionality.*

### Prerequisites

**For Frontend Deployment:**
- Git
- GitHub account (for Netlify/Vercel/GitHub Pages)

**For Full Stack (Frontend + Backend):**
- AWS Account with:
  - AWS Bedrock access (request via console)
  - Lambda, S3, API Gateway permissions
- Python 3.11+
- Git
- Groq API key ([Get one free](https://console.groq.com))

**Optional:**
- AWS CLI configured
- Docker (for local Lambda testing)

### 🚀 Quick Deployment (New!)

The fastest way to get started with deployment using npm scripts:

```bash
# 1. Clone repository
git clone https://github.com/MIHAchoppa/Hackathon-.git
cd Hackathon-

# 2. Set up environment variables (interactive)
npm run setup:env

# 3. Verify database/S3 setup
npm run db:push

# 4. Build the application
npm run build

# 5. Start the application
npm start
```

**For complete AWS deployment:**
```bash
# Check prerequisites
npm run deploy:prepare

# Deploy to AWS (automated)
npm run deploy:aws
```

📖 **See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for the complete deployment guide.**

### ⚡ Automated Deployment

This repository includes GitHub Actions workflows for automated deployment:

**GitHub Pages (Automatic):**
- Deploys automatically on push to `main` branch
- No configuration needed - just push your changes!
- Live at: [https://mihachoppa.github.io/Hackathon-/](https://mihachoppa.github.io/Hackathon-/)

**Continuous Integration:**
- Validates builds on every push and pull request
- Ensures code quality before deployment
- Uploads build artifacts for review

📖 **See [.github/workflows/README.md](.github/workflows/README.md) for workflow documentation.**

### Quick Start (Local Development)

Get the frontend running locally in under 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/MIHAchoppa/Hackathon-.git
cd Hackathon-

# 2. Start local development server
python3 -m http.server 8000
# Alternative: npx http-server -p 8000

# 3. Open in browser
# Navigate to http://localhost:8000
```

**For full backend setup (optional):**

```bash
# 1. Set up Python environment
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Configure environment variables
cp ../.env.example .env
# Edit .env with your AWS credentials and API keys

# 3. Test Lambda functions locally
cd lambda
python research_handler.py  # Test research generation
python book_generator.py     # Test book generation

# 4. Return to root and start frontend
cd ../..
python3 -m http.server 8000
```

> **Note**: The frontend works without AWS backend, but AI features require AWS deployment.

### Full Deployment Options

#### Option 1: Frontend Only (Quick - 5 minutes)
Deploy the static website to Netlify, Vercel, or GitHub Pages:
- ✅ **See [QUICK_DEPLOY.md](QUICK_DEPLOY.md)** for step-by-step instructions
- UI will work, but backend features require AWS setup

#### Option 2: Complete Full-Stack (AWS - 30-60 minutes)
Deploy both frontend and backend for full functionality:
- ✅ **See [DEPLOYMENT.md](DEPLOYMENT.md)** for complete AWS guide including:
  - S3 bucket creation
  - Lambda function deployment
  - API Gateway setup
  - IAM role configuration
  - CloudFront CDN setup
  - Monitoring and logging

## 📖 Usage

### 🎯 Using the AI ResearchBot

#### Step 1: Access the Platform
- **Live Demo**: Visit [https://mihachoppa.github.io/Hackathon-/](https://mihachoppa.github.io/Hackathon-/)
- **Local**: Run `python3 -m http.server 8000` and open http://localhost:8000

#### Step 2: Generate Research
1. Navigate to the **Research section** on the homepage
2. Enter your topic in the input field
   - Examples: "Electric Cars", "Artificial Intelligence", "Renewable Energy", "Quantum Computing"
3. Click the **"Research"** button
4. Wait 8-12 seconds for AI-generated insights

#### Step 3: Review Results
Results are organized into 6 sections with confidence scores:
- **Overview**: General introduction and context
- **Statistics**: Key numbers and data points
- **Advantages**: Benefits and positive aspects
- **Challenges**: Obstacles and limitations
- **Future**: Predictions and trends
- **Recommendations**: Actionable insights

**Confidence Score Colors**:
- 🟢 **Green** (90%+): High confidence
- 🟡 **Yellow** (70-89%): Medium confidence  
- 🔴 **Red** (<70%): Low confidence

#### Step 4: Generate Book (Optional)
If research quality is high enough (≥75% avg confidence):
- The system automatically offers book generation
- Click **"Generate Book"** to create a comprehensive book
- Wait 15-25 seconds for the complete book with chapters

#### Step 5: Export Data
Export your research in multiple formats:
- **JSON**: Structured data with metadata
- **CSV**: Spreadsheet-compatible format
- **TXT**: Human-readable book format (if generated)

### 💻 Development Mode

For local development with live reload:

```bash
# Python simple server
python3 -m http.server 8000

# Node.js http-server (with live reload)
npx http-server -p 8000 -o

# Using npm scripts
npm start              # Development server
npm run dev           # Alternative Python server
```

Then open http://localhost:8000 in your browser.

## 🏗️ Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────┐
│                       USER INPUT                              │
│                   (Research Topic)                            │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                FRONTEND (HTML/CSS/JS)                         │
│         • User Interface                                      │
│         • Confidence Visualization                            │
│         • Export Functionality                                │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                  API GATEWAY (REST)                           │
│         • CORS & Rate Limiting                                │
│         • Request Validation                                  │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│              LAMBDA FUNCTIONS (Processing)                    │
│                                                                │
│  Research Handler ──▶ Orchestrator ──▶ Book Generator        │
│   (AI Generation)    (Quality Gates)   (Book Creation)       │
│                                                                │
└──────────┬─────────────────────────────────────┬─────────────┘
           │                                     │
           ▼                                     ▼
┌──────────────────────────────────────────────────────────────┐
│                     AI/ML LAYER                               │
│                                                                │
│   AWS Bedrock (Claude) ◀──Failover──▶ Groq API (Llama 3)    │
│   [Primary Model]                      [Fallback Model]      │
│                                                                │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│              STORAGE & MONITORING                             │
│                                                                │
│   Amazon S3  |  CloudWatch  |  Secrets Manager               │
│   (Storage)  |   (Logs)     |   (API Keys)                   │
└──────────────────────────────────────────────────────────────┘
```

**Data Flow**:
1. User submits topic → 2. Frontend validates & sends request
3. API Gateway routes to Lambda → 4. Research Handler generates insights
5. Orchestrator evaluates quality → 6. If quality ≥ 75%: Book Generator creates book
7. Results stored in S3 → 8. Response with download links returned to user

### Key Components

1. **Frontend Layer** (HTML/CSS/JS)
   - Responsive UI with confidence visualization
   - Real-time feedback and export capabilities

2. **API Layer** (API Gateway)
   - RESTful endpoints with CORS support
   - Request validation and rate limiting

3. **Processing Layer** (Lambda Functions)
   - `research-handler`: Research generation + confidence scoring
   - `book-generator`: Chapter expansion + book creation
   - `orchestrator`: Workflow management + autonomous decisions
   - `s3-handler`: Storage operations + URL generation

4. **AI/ML Layer**
   - AWS Bedrock (Claude): High-quality primary model
   - Groq API (Llama 3): Fast fallback model

5. **Storage Layer**
   - S3: Research data + generated books
   - DynamoDB: User metadata + workflow history (optional)
   - CloudWatch: Logs + metrics + monitoring

See **[docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)** for detailed diagrams and data flows.

## 📁 Project Structure

```
Hackathon-/
├── backend/                    # Backend Lambda functions & utilities
│   ├── lambda/                 # AWS Lambda function handlers
│   │   ├── research_handler.py     # Research generation with confidence scoring
│   │   ├── book_generator.py       # Book generation from research
│   │   └── s3_handler.py           # S3 storage operations
│   ├── utils/                  # Utility modules
│   │   └── orchestrator.py         # Workflow orchestration & autonomous reasoning
│   └── requirements.txt        # Python dependencies
│
├── scripts/                    # Deployment and build scripts
│   ├── build.js                    # Build production artifacts
│   ├── db-migrate.js               # Database/S3 migration verification
│   ├── start-server.js             # Development server
│   ├── setup-env.js                # Interactive environment setup
│   ├── deploy-prepare.js           # Pre-deployment validation
│   └── deploy-aws.sh               # Automated AWS deployment
│
├── docs/                       # Documentation
│   └── architecture/           # Architecture diagrams & specs
│       └── ARCHITECTURE.md         # Detailed system architecture
│
├── samples/                    # Sample outputs for demonstration
│   ├── research_output.json        # Example research with confidence scores
│   └── book_excerpt.md             # Example generated book excerpt
│
├── index.html                  # Main web application UI
├── script.js                   # Frontend JavaScript (includes ResearchBot)
├── styles.css                  # Application styling
│
├── package.json                # npm configuration and deployment scripts
├── .env.example                # Environment variables template
│
├── README.md                   # This file - main documentation
├── DEVPOST.md                  # Devpost submission content
├── DEPLOYMENT.md               # AWS deployment instructions
├── DEPLOYMENT_CHECKLIST.md     # Step-by-step deployment guide
├── DEMO_SCRIPT.md              # 3-minute demo walkthrough
├── FRONTEND.md                 # Frontend-specific documentation
│
└── .gitignore                  # Git ignore rules
```

## 📚 Documentation

### For Users
- **[README.md](README.md)** (this file) - Overview and getting started
- **[FRONTEND.md](FRONTEND.md)** - Frontend features and usage guide
- **[DEMO_SCRIPT.md](DEMO_SCRIPT.md)** - 3-minute demo walkthrough

### For Developers
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment guide with npm scripts
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete AWS deployment guide
- **[docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)** - System architecture details
- **[backend/lambda/](backend/lambda/)** - Well-commented Lambda function code

### For Judges & Stakeholders
- **[DEVPOST.md](DEVPOST.md)** - Complete Devpost submission
- **[samples/](samples/)** - Example research and book outputs

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Frontend Issues

**Problem**: Website not loading or showing CORS errors
- **Solution**: Ensure you're accessing via HTTPS (not HTTP)
- Check that API endpoints are correctly configured in `script.js`
- Verify browser console for specific error messages

**Problem**: Research/Book generation features not working
- **Solution**: These features require AWS backend deployment
- The live demo at [https://mihachoppa.github.io/Hackathon-/](https://mihachoppa.github.io/Hackathon-/) includes demo mode
- For full functionality, deploy the AWS backend following [DEPLOYMENT.md](DEPLOYMENT.md)

#### Backend/AWS Issues

**Problem**: Lambda functions timing out
- **Solution**: Increase Lambda timeout in AWS Console (recommended: 300 seconds)
- Check CloudWatch logs for specific errors
- Verify IAM roles have necessary permissions

**Problem**: AWS Bedrock access denied
- **Solution**: Request Bedrock access in AWS Console (Settings → Model Access)
- Ensure your AWS account has Bedrock enabled for your region
- Verify IAM role has `bedrock:InvokeModel` permission

**Problem**: Groq API rate limiting
- **Solution**: Implement exponential backoff in requests
- Consider upgrading Groq API plan for higher limits
- The dual-model strategy should automatically fallback between providers

#### Development Issues

**Problem**: Python dependencies not installing
- **Solution**: Ensure Python 3.11+ is installed
- Create a fresh virtual environment: `python3 -m venv venv`
- Upgrade pip: `pip install --upgrade pip`
- Install requirements: `pip install -r backend/requirements.txt`

**Problem**: Local server not starting
- **Solution**: Check if port 8000 is already in use
- Try alternative port: `python3 -m http.server 8080`
- For Node.js server: `npm start`

### Getting Help

If you encounter issues not listed here:
1. Check the [documentation files](#-documentation)
2. Search existing [GitHub Issues](https://github.com/MIHAchoppa/Hackathon-/issues)
3. Create a new issue with:
   - Detailed description of the problem
   - Steps to reproduce
   - Error messages and logs
   - Your environment (OS, Python version, etc.)

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** changes: `git commit -m 'Add AmazingFeature'`
4. **Push** to branch: `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style (PEP 8 for Python, ES6 for JavaScript)
- Add comprehensive comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting
- Keep commits focused and atomic

### Areas for Contribution
- Additional AI model integrations (GPT-4, etc.)
- PDF generation for books
- Multi-language support
- Improved confidence scoring algorithms
- Mobile app development
- Citation system implementation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Project Maintainer: **MIHAchoppa**

- GitHub: [@MIHAchoppa](https://github.com/MIHAchoppa)
- Project Link: [https://github.com/MIHAchoppa/Hackathon-](https://github.com/MIHAchoppa/Hackathon-)

## 🙏 Acknowledgments

### AI/ML Services
- **AWS Bedrock** - For providing access to high-quality foundation models (Claude)
- **Groq** - For ultra-fast LLM inference with Llama 3
- **Anthropic** - For developing Claude, the primary AI model

### AWS Services
- **AWS Lambda** - Serverless compute platform
- **Amazon S3** - Reliable object storage
- **API Gateway** - RESTful API management
- **CloudWatch** - Monitoring and logging
- **Secrets Manager** - Secure key storage

### Open Source Community
- Python community for excellent libraries (Boto3, Requests)
- JavaScript community for modern web standards
- GitHub for hosting and collaboration tools

### Inspiration
- Research automation needs of students and professionals
- The push for transparent and explainable AI
- Autonomous systems that make intelligent decisions

### Special Thanks
- Hackathon organizers and participants
- Beta testers who provided feedback
- Everyone who believes in transparent AI

---

<p align="center">
  Made with ❤️ for the Hackathon Community<br>
  <strong>Empowering Research Through Autonomous AI</strong>
</p>
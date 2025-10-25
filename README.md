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

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Full Deployment](#full-deployment)
- [Usage](#usage)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 About

**The Problem**: AI systems generate content but lack transparency about reliability and can't autonomously assess their own quality.

**Our Solution**: An end-to-end platform that:
1. **Researches** any topic using AWS Bedrock and Groq LLMs
2. **Scores** every insight with probability-based confidence (0-100%)
3. **Decides** autonomously whether to generate a full book based on quality thresholds
4. **Generates** comprehensive books with maintained confidence scoring

**Key Innovation**: Autonomous reasoning—AI that evaluates its own output quality and makes intelligent decisions about downstream tasks.

## ✨ Features

### 🎯 Core Capabilities

- **AI Research Generation**: Comprehensive research on any topic in 8-12 seconds
  - 6 research dimensions: Overview, Statistics, Advantages, Challenges, Future, Recommendations
  - AWS Bedrock (Claude) for high-quality generation
  - Groq API (Llama 3) as ultra-fast fallback

- **Probability-Based Confidence Scoring**: Every insight rated 0-100%
  - Multi-factor analysis: content quality, source reliability, context fit
  - Color-coded badges: Green (90%+), Yellow (70-89%), Red (<70%)
  - Transparent methodology—no black boxes

- **Autonomous Reasoning Engine**: AI that evaluates its own quality
  - Quality threshold gates (75% avg, 50% high-confidence sections)
  - Autonomous decision: generate book or return research only
  - Full logging of decision rationale

- **Intelligent Book Generation**: Research → Complete book in 15-25 seconds
  - Auto-generated chapters with introduction and conclusion
  - Table of contents and metadata
  - Multiple formats: JSON (structured), TXT (readable)
  - Maintained confidence scoring throughout

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

```bash
# 1. Clone repository
git clone https://github.com/MIHAchoppa/Hackathon-.git
cd Hackathon-

# 2. Set up Python environment
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Configure environment
cat > .env << EOF
AWS_REGION=us-east-1
GROQ_API_KEY=your_groq_key_here
BEDROCK_MODEL_ID=anthropic.claude-v2
EOF

# 4. Test Lambda functions locally
cd lambda
python research_handler.py
python book_generator.py

# 5. Run frontend
cd ../..
python3 -m http.server 8000
# Open http://localhost:8000
```

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

### AI ResearchBot

The ResearchBot feature allows you to generate comprehensive research insights with AI confidence scoring:

1. **Navigate to the Research section** on the homepage
2. **Enter a topic** in the input field (e.g., "Electric Cars", "AI Technology", "Renewable Energy")
3. **Click the "Research" button** to generate insights
4. **View results** organized by sections with confidence scores:
   - 🟢 Green badges: High confidence (90%+)
   - 🟡 Yellow badges: Medium confidence (70-89%)
   - 🔴 Red badges: Low confidence (<70%)
5. **Export your research** using the JSON or CSV export buttons

### Development

For local development:

```bash
# Start a local server
python -m http.server 8000
# or
npx http-server

# Open in browser
# Navigate to http://localhost:8000
```

## 🏗️ Architecture

### High-Level Overview

```
User → Frontend → API Gateway → Lambda Functions → AWS Bedrock/Groq → S3 Storage
                                      ↓
                              Orchestrator (Autonomous Reasoning)
                                      ↓
                         Quality Gates → Book Generation (if quality ≥ threshold)
```

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
# 🚀 Hackathon Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## 🎯 About

This repository contains the codebase for an innovative hackathon project. Our goal is to build a cutting-edge solution that addresses real-world challenges through collaborative development and creative problem-solving.

## ✨ Features

### 🤖 Autonomous AI Agent System
- **Full Autonomy**: Complete self-directed task execution through ORABL (Observe-Reason-Act-Learn) loop
- **Transparent Reasoning**: Every decision includes detailed reasoning chain with confidence scores
- **Continuous Learning**: Agent learns from outcomes and improves over time
- **Real-time Monitoring**: Live dashboard showing agent phases, iterations, and confidence levels
- **AWS Integration**: Bedrock, Lambda, DynamoDB, S3 orchestration (production-ready architecture)
- **Groq/Grok AI**: Enhanced reasoning with multiple AI model support
- **Pattern Recognition**: Learns and stores successful patterns for future use

### 🔬 AI ResearchBot with Agent Enhancement
- **Intelligent Research**: AI-powered research assistant with autonomous orchestration
- **Probability Scoring**: Confidence scores (0-100%) on every research point with 5-factor calculation
- **Structured Insights**: Organized research covering overview, statistics, advantages, challenges, outlook, and recommendations
- **Multi-Model Enhancement**: Combines Bedrock AI and Groq insights for comprehensive results
- **Export Functionality**: Download research as JSON or CSV with full metadata

### 📚 AI Book Generator
- **Autonomous Book Creation**: Generate complete books from research with AI enhancement
- **Multiple Styles**: Academic, Narrative, Technical, Educational, Executive, Conversational
- **Flexible Structures**: Chapters, Sections, Q&A, Timeline, Comparison formats
- **Confidence Tracking**: Every section includes agent reasoning and confidence scores
- **Export Options**: HTML, PDF, Markdown formats

### 🎯 Technical Excellence
- **Production-Ready**: Enterprise-grade architecture with scalability and security
- **State Management**: Persistent agent state with memory across sessions
- **Performance Optimized**: Debounced updates, lazy loading, efficient algorithms
- **Accessibility First**: ARIA labels, keyboard navigation, screen reader support
- **Modern Stack**: ES6+, Modular architecture, Best practices
- **Comprehensive Documentation**: Agent docs, architecture diagrams, demo scripts

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Git for version control
- A modern code editor (VS Code, Sublime, etc.)
- Node.js (v14 or higher) - if applicable
- npm or yarn package manager - if applicable

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MIHAchoppa/Hackathon-.git
   cd Hackathon-
   ```

2. Install dependencies (if applicable):
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables (if applicable):
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development environment:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📖 Usage

### 🤖 Autonomous Agent Monitoring

Watch the AI agent work in real-time:

1. **Agent Dashboard** appears at the top after page loads
2. **Monitor agent phases**: Idle → Observing → Reasoning → Acting → Learning
3. **Track metrics**: Iteration count, confidence scores, memory items
4. **View reasoning chain**: Live updates showing agent's decision-making process
5. **Console commands** for deep inspection:
   ```javascript
   autonomousAgent.getStatus()        // Current agent state
   autonomousAgent.getReport()        // Full execution report
   agentDashboard.getFormattedReport() // Formatted readable report
   agentOrchestrator.getLogs()        // Orchestration event logs
   ```

### 🔬 AI ResearchBot with Agent Enhancement

Generate comprehensive research with autonomous AI orchestration:

1. **Navigate to the Research section**
2. **Enter a topic** (e.g., "Electric Cars", "AI Technology", "Renewable Energy")
3. **Click "Research"** - Agent will autonomously:
   - Observe: Gather information and check memory
   - Reason: Analyze data and calculate confidence (5-factor algorithm)
   - Act: Execute research generation with Bedrock & Groq AI
   - Learn: Store patterns and improve for next time
4. **View results** with confidence badges:
   - 🟢 Green: High confidence (90%+)
   - 🟡 Yellow: Medium confidence (70-89%)
   - 🔴 Red: Low confidence (<70%)
5. **Agent metrics** show: iterations, overall confidence, orchestration logs
6. **Export** as JSON or CSV with full metadata

### 📚 Book Generation

Create complete books from research:

1. **Select sections** from research results (checkboxes)
2. **Click "Create Book"**
3. **Configure**:
   - Title and author
   - Style (Academic, Narrative, Technical, etc.)
   - Structure (Chapters, Sections, Q&A, etc.)
4. **Generate** - Agent enhances content with AI insights
5. **Preview** with confidence scores on each section
6. **Export** as HTML, PDF, or Markdown

### 🛠️ Development

#### Local Server

```bash
# Start a local server
python3 -m http.server 8000
# or
npx http-server

# Open in browser
# Navigate to http://localhost:8000
```

#### Console Debugging

```javascript
// Check agent status
autonomousAgent.getStatus()
// => { phase: 'idle', iteration: 0, running: false, ... }

// Get full report
autonomousAgent.getReport()
// => Complete reasoning chain, action log, learned patterns

// View orchestration logs
agentOrchestrator.getLogs()
// => AWS service calls, timing, results

// Formatted report
agentDashboard.getFormattedReport()
// => Human-readable full report
```

### 📚 Documentation

- **[Agent Documentation](AGENT_DOCUMENTATION.md)** - Complete technical guide
- **[Demo Script](DEMO_SCRIPT.md)** - Presentation guide for judges
- **[Architecture](ARCHITECTURE.md)** - System architecture diagrams
- **[Frontend Docs](FRONTEND.md)** - UI and frontend details

## 📁 Project Structure

```
Hackathon-/
├── index.html                  # Main HTML with Agent Dashboard & ResearchBot
├── script.js                   # Main application logic
├── styles.css                  # Complete styling including agent dashboard
├── agent-core.js              # Autonomous Agent Core (ORABL Loop)
├── agent-integration.js       # AWS & Groq Integration Layer
├── agent-ui.js                # Agent Dashboard Controller
├── AGENT_DOCUMENTATION.md     # Complete agent technical documentation
├── ARCHITECTURE.md            # System architecture diagrams
├── DEMO_SCRIPT.md             # Presentation guide for judges
├── FRONTEND.md                # Frontend documentation
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

### Key Components

#### Agent Core (`agent-core.js`)
- **AutonomousAgent**: Main agent implementing ORABL loop
- **ProbabilityScorer**: 5-factor confidence calculation
- **ReasoningEngine**: Observation analysis and conclusion generation
- **ActionExecutor**: Confidence-based action planning and execution
- **LearningSystem**: Pattern recognition and continuous improvement
- **AgentState**: State management with persistent memory

#### Integration Layer (`agent-integration.js`)
- **AgentOrchestrator**: Workflow coordination and service integration
- **AWSBedrockSimulator**: AI model integration (Bedrock)
- **DynamoDBSimulator**: State persistence
- **S3Simulator**: Artifact storage
- **LambdaSimulator**: Function orchestration
- **GroqAPISimulator**: Groq/Grok AI integration

#### User Interface
- **AgentDashboardController**: Real-time agent monitoring
- **ResearchBot**: Enhanced with agent orchestration
- **BookGenerator**: AI-powered content generation
- **Navigation**: Smooth scrolling and active link tracking
- **FormHandler**: Contact form with validation

## 🔄 Agent Lifecycle (ORABL Loop)

The autonomous agent operates through a continuous decision-making cycle:

### 1. Observe 👁️
- Gather information about the task
- Retrieve relevant memories from previous executions
- Assess data quality and source reliability
- Log all observations with metadata

### 2. Reason 🧠
- Analyze observations for quality and consensus
- Generate conclusions based on analysis
- Calculate confidence scores using 5-factor algorithm:
  - Data Quality (25%)
  - Source Reliability (20%)
  - Model Uncertainty (20%)
  - Historical Accuracy (20%)
  - Consensus Level (15%)
- Build transparent reasoning chain

### 3. Act ⚡
- Plan action based on confidence level:
  - **≥90% confidence**: Execute fully autonomous
  - **70-89% confidence**: Execute with monitoring
  - **<70% confidence**: Request human guidance
- Execute planned action
- Integrate with AWS services and AI models
- Log action results

### 4. Learn 📚
- Compare predicted confidence with actual outcomes
- Extract insights (calibration, patterns, success factors)
- Update probability scoring for future tasks
- Store learned patterns in memory
- Adjust decision thresholds

**The loop continues until the task is complete or maximum iterations are reached.**

## 🧮 Probability Scoring System

Every output includes a confidence score (0-100%) calculated through:

1. **Weighted Factor Analysis**:
   - Analyzes 5 key factors with specific weights
   - Combines scores using weighted average
   - Outputs normalized 0-100% confidence

2. **Confidence Levels**:
   - 🟢 **High (90-100%)**: Very reliable, full autonomy
   - 🟡 **Medium (70-89%)**: Reliable, monitoring recommended
   - 🔴 **Low (0-69%)**: Uncertain, human review needed

3. **Aggregation**:
   - Multi-step processes use weighted average
   - Recent iterations weighted more heavily
   - Provides overall execution confidence

4. **Continuous Calibration**:
   - Agent learns from outcome accuracy
   - Adjusts scoring based on historical performance
   - Improves confidence prediction over time

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details on our code of conduct and development process.

### Code Style

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Project Maintainer: **MIHAchoppa**

- GitHub: [@MIHAchoppa](https://github.com/MIHAchoppa)
- Project Link: [https://github.com/MIHAchoppa/Hackathon-](https://github.com/MIHAchoppa/Hackathon-)

## 🙏 Acknowledgments

- Thanks to all contributors who participate in this project
- Inspiration and resources from the open-source community
- Hackathon organizers and participants
- Special thanks to everyone who provides feedback and suggestions

---

<p align="center">Made with ❤️ for the Hackathon Community</p>
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

- **AI ResearchBot**: Intelligent research assistant with confidence scoring on any topic
- **Voice Input Integration**: Use Groq's Whisper model for voice-to-text research topics
- **Custom Distance/Range Input**: Add kilometer-based context to your research with distance analysis
- **Probability-Based Insights**: Each research point includes confidence scores (0-100%)
- **Structured Research**: Organized insights covering overview, statistics, distance analysis, pros/cons, and recommendations
- **Export Functionality**: Download research results as JSON or CSV
- **Book Generation**: Create formatted books from your research with multiple styles and structures
- **Innovative Solution**: Addresses specific problem domain with modern technology
- **Scalable Architecture**: Built with best practices and scalability in mind
- **Open Source**: Community-driven development with transparent processes
- **Well-Documented**: Comprehensive documentation for developers and users
- **Extensible**: Modular design allowing easy customization and extensions

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

### AI ResearchBot

The ResearchBot feature allows you to generate comprehensive research insights with AI confidence scoring:

1. **Navigate to the Research section** on the homepage
2. **Enter a topic** in the input field (e.g., "Electric Cars", "AI Technology", "Renewable Energy")
   - **OR use voice input** by clicking the 🎤 microphone button to speak your topic
3. **Optionally add distance/range context** in the km input field (e.g., 500 for 500 kilometers)
   - This adds a "Distance Analysis" section to your results with km-specific insights
4. **Click the "Research" button** to generate insights
5. **View results** organized by sections with confidence scores:
   - 🟢 Green badges: High confidence (90%+)
   - 🟡 Yellow badges: Medium confidence (70-89%)
   - 🔴 Red badges: Low confidence (<70%)
6. **Export your research** using the JSON or CSV export buttons

### Voice Input with Groq Whisper

To enable voice-to-text transcription:

1. **Get a free Groq API key** at [https://console.groq.com/keys](https://console.groq.com/keys)
2. **Set your API key** in the browser console:
   ```javascript
   localStorage.setItem('groq_api_key', 'your_groq_api_key_here')
   ```
3. **Click the microphone button** and speak your research topic
4. **The text will appear** in the research input field automatically

**Note**: If a Groq API key is not configured, the system will fall back to the browser's built-in speech recognition (if available).

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

## 📁 Project Structure

```
Hackathon-/
├── index.html          # Main HTML with ResearchBot UI
├── script.js           # JavaScript including ResearchBot class
├── styles.css          # Styling for all components
├── FRONTEND.md         # Frontend documentation
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

### Key Components

- **ResearchBot Class**: Handles topic research, confidence scoring, and export functionality
- **Research Section**: Interactive UI for entering topics and viewing results
- **Confidence Display**: Visual indicators with color-coded badges and progress bars
- **Export System**: JSON and CSV download capabilities

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
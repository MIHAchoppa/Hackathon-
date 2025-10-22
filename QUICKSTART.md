# Quick Start Guide - 5 Minutes to Running

Get the AI Research & Book Generation Platform running in 5 minutes!

## Option 1: Local Frontend Only (2 minutes)

**Try the UI without AWS setup:**

```bash
# Clone repo
git clone https://github.com/MIHAchoppa/Hackathon-.git
cd Hackathon-

# Start local server
python3 -m http.server 8000

# Open browser
open http://localhost:8000
```

**Note**: Research function uses mock data without AWS backend.

---

## Option 2: Full Stack Local Testing (5 minutes)

**Test Lambda functions locally:**

```bash
# 1. Setup Python environment
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Set environment variables
export AWS_REGION=us-east-1
export GROQ_API_KEY=your_key_here  # Get free at console.groq.com

# 3. Test Lambda functions
cd lambda
python research_handler.py
python book_generator.py

# 4. Run frontend
cd ../..
python3 -m http.server 8000
```

---

## Option 3: Full AWS Deployment (30 minutes)

**Deploy everything to AWS:**

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.

**Summary:**
1. Create S3 buckets (2 minutes)
2. Set up IAM role (3 minutes)
3. Package Lambda functions (5 minutes)
4. Deploy Lambdas (10 minutes)
5. Configure API Gateway (5 minutes)
6. Deploy frontend to S3 (5 minutes)

---

## What You'll Get

### Research Generation
```
Input: "Electric Cars"
Output (8 seconds):
- Overview (94% confidence)
- Statistics (91% confidence)
- Advantages (89% confidence)
- Challenges (87% confidence)
- Future Outlook (85% confidence)
- Recommendations (88% confidence)
```

### Autonomous Decision
```
Quality Check:
✓ Average: 89% (threshold: 75%)
✓ High confidence: 67% (threshold: 50%)
→ Decision: Generate book
```

### Book Generation
```
Output (20 seconds):
- 8 complete chapters
- 2,847 words
- Table of contents
- Confidence scores maintained
- Multiple formats (JSON, TXT)
```

---

## Sample Topics to Try

**High Quality (will generate books):**
- "Electric Cars"
- "Artificial Intelligence"
- "Renewable Energy"
- "Blockchain Technology"

**Complex (shows reasoning):**
- "Quantum Computing"
- "Gene Therapy"
- "Dark Matter"

**Fun (shows versatility):**
- "Coffee Culture"
- "Video Game Design"
- "Jazz Music"

---

## Troubleshooting

### "AWS Bedrock Access Denied"
```bash
# Enable Bedrock model access in AWS Console:
# 1. Go to Bedrock service
# 2. Click "Model access"
# 3. Enable Claude models
# 4. Wait for approval (usually instant)
```

### "Groq API Error"
```bash
# Get free API key:
# 1. Visit https://console.groq.com
# 2. Sign up (free)
# 3. Generate API key
# 4. Set: export GROQ_API_KEY=your_key
```

### "Lambda Timeout"
```bash
# Increase timeout:
aws lambda update-function-configuration \
  --function-name research-handler \
  --timeout 120
```

---

## Next Steps

After testing:
1. **Read**: [DEVPOST.md](DEVPOST.md) for complete project overview
2. **Deploy**: [DEPLOYMENT.md](DEPLOYMENT.md) for AWS setup
3. **Demo**: [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for presentation guide
4. **Architecture**: [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)

---

## Get Help

- **Documentation**: Check README.md and other docs
- **Issues**: Open GitHub issue
- **Code**: All Lambda functions have detailed comments

---

**Ready in 5 minutes!** 🚀

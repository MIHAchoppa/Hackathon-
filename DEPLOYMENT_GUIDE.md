# Deployment Instructions

This document provides a complete overview of all deployment options for the AI Research & Book Generation Platform.

## 🎯 Quick Summary

| Platform | Setup Time | Automation | Best For |
|----------|-----------|------------|----------|
| **GitHub Pages** | 2 min | ✅ Automatic | Quick demo, open source projects |
| **Netlify** | 5 min | ✅ Git-based | Production sites, custom domains |
| **Vercel** | 5 min | ✅ Git-based | Modern web apps, edge deployment |
| **AWS Full Stack** | 30-60 min | ⚠️ Manual | Complete backend + frontend |

## 🚀 Recommended: GitHub Pages (Automated)

This is the **easiest and fastest** way to deploy the frontend.

### Setup (One-time, 2 minutes)

1. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **"GitHub Actions"**
   - Save

2. **That's it!** The workflow is already configured.

### Deploy

Every time you push to the `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The site automatically deploys to: `https://yourusername.github.io/repository-name/`

### Monitor

- Go to the **Actions** tab in your repository
- Watch the "Deploy to GitHub Pages" workflow
- Deployment completes in ~30-60 seconds

## 🌐 Alternative: Manual Deployment

### Netlify

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Vercel

```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## ☁️ Full Stack: AWS Deployment

For complete functionality including AI backend:

### Prerequisites

- AWS Account with Bedrock access
- AWS CLI configured
- Python 3.11+
- Groq API key

### Steps

1. **Set up environment**
   ```bash
   npm run setup:env
   ```

2. **Check prerequisites**
   ```bash
   npm run deploy:prepare
   ```

3. **Deploy to AWS**
   ```bash
   npm run deploy:aws
   ```

4. **Deploy frontend**
   ```bash
   # Upload to S3
   aws s3 sync . s3://your-bucket-name --exclude "backend/*"
   ```

📖 **See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed AWS deployment instructions.**

## 🔄 Continuous Integration

The repository includes a CI workflow that:

- ✅ Validates builds on every push
- ✅ Tests Python dependencies
- ✅ Runs on pull requests
- ✅ Uploads build artifacts

No configuration needed - it runs automatically!

## 📊 Workflow Status

Check deployment and build status:

- Deployment: ![Deploy Status](https://github.com/MIHAchoppa/Hackathon-/actions/workflows/deploy.yml/badge.svg)
- CI Build: ![Build Status](https://github.com/MIHAchoppa/Hackathon-/actions/workflows/ci.yml/badge.svg)

## 🛠️ Troubleshooting

### GitHub Pages

**Issue: 404 error after deployment**
- Wait 2-3 minutes for propagation
- Check Settings → Pages shows the correct URL
- Verify workflow completed successfully

**Issue: Workflow doesn't trigger**
- Ensure you're pushing to the `main` branch
- Check that GitHub Actions is enabled for your repository
- Verify the workflow file exists in `.github/workflows/deploy.yml`

### Build Failures

**Issue: Python errors in CI**
- Check Python version is 3.11+
- Verify `requirements.txt` is valid
- Review error logs in Actions tab

**Issue: Node.js errors**
- Ensure Node.js 16+ is installed
- Check `package.json` syntax
- Verify all dependencies are listed

### AWS Deployment

**Issue: Lambda deployment fails**
- Verify IAM role permissions
- Check AWS credentials are configured
- Ensure Bedrock access is enabled

**Issue: API Gateway errors**
- Verify CORS settings
- Check Lambda integration
- Review CloudWatch logs

## 📚 Additional Resources

- **Workflow Documentation**: [.github/workflows/README.md](.github/workflows/README.md)
- **Quick Deploy Guide**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **Full Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Deployment Checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## 💡 Tips

1. **Use GitHub Pages for demos** - It's free, fast, and automatic
2. **Use Netlify/Vercel for production** - Better performance and features
3. **Use AWS for full stack** - Complete AI functionality with backend

## 🎉 Success!

Once deployed, test your site:

- ✅ Navigate to all pages
- ✅ Try the Research feature (requires backend)
- ✅ Check mobile responsiveness
- ✅ Verify HTTPS is working
- ✅ Test on different browsers

---

**Questions?** Open an issue or check the documentation links above!

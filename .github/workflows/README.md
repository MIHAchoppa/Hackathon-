# GitHub Actions Workflows

This directory contains automated workflows for the AI Research & Book Generation Platform.

## Workflows

### 1. Deploy to GitHub Pages (`deploy.yml`)

**Trigger**: Automatically runs on push to `main` branch, or manually via workflow_dispatch

**Purpose**: Deploys the frontend application to GitHub Pages

**Steps**:
- Checks out the repository
- Configures GitHub Pages
- Uploads the entire repository as a static site
- Deploys to GitHub Pages

**URL**: https://mihachoppa.github.io/Hackathon-/

**Note**: This workflow requires GitHub Pages to be enabled in repository settings.
To enable:
1. Go to Settings → Pages
2. Set Source to "GitHub Actions"

### 2. Build and Test (`ci.yml`)

**Trigger**: Runs on push to `main` or `develop` branches, and on pull requests

**Purpose**: Validates that the project builds correctly

**Steps**:
- Sets up Node.js and Python environments
- Installs dependencies
- Runs the build script
- Validates Python dependencies
- Uploads build artifacts for review

## Manual Deployment

While these workflows automate deployment, you can also deploy manually:

### GitHub Pages (Manual)
```bash
git push origin main
```
The deploy workflow will trigger automatically.

### Netlify
```bash
netlify deploy --prod
```

### Vercel
```bash
vercel --prod
```

### AWS
```bash
npm run deploy:aws
```

## Environment Variables

For AWS deployment workflows (not included), you would need to add these secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `GROQ_API_KEY`

## Monitoring

- Check workflow runs in the Actions tab
- Build artifacts are retained for 7 days
- Failed builds will send notifications to repository maintainers

## Troubleshooting

### Deploy workflow fails
- Ensure GitHub Pages is enabled in Settings → Pages
- Set source to "GitHub Actions"
- Check that permissions are set correctly

### Build workflow fails
- Check Node.js and Python versions match requirements
- Verify all required files are present
- Review build logs in Actions tab

## Documentation

For more details, see:
- [DEPLOYMENT.md](../../DEPLOYMENT.md) - Full deployment guide
- [QUICK_DEPLOY.md](../../QUICK_DEPLOY.md) - Quick deployment options
- [DEPLOYMENT_CHECKLIST.md](../../DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist

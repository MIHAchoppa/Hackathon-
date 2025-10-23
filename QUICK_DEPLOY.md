# Quick Deployment Guide

This guide provides simple instructions to deploy the AI Research & Book Generation Platform to free hosting platforms.

## 🚀 Deployment Options

### Option 1: Netlify (Recommended for Static Sites) ⭐

**Pros:**
- Free tier with 100GB bandwidth
- Automatic HTTPS
- Continuous deployment from Git
- Built-in CDN
- Easy setup (5 minutes)

**Steps:**

1. **Sign up/Login to Netlify**
   - Go to [netlify.com](https://www.netlify.com/)
   - Sign up with GitHub (recommended)

2. **Deploy via Git (Recommended)**
   ```bash
   # Push your code to GitHub (if not already done)
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```
   
   - In Netlify dashboard, click "Add new site" → "Import an existing project"
   - Choose GitHub and select this repository
   - Configure build settings:
     - Build command: (leave empty)
     - Publish directory: `.` (root)
   - Click "Deploy site"

3. **Manual Deploy (Alternative)**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy from project root
   cd /path/to/Hackathon-
   netlify deploy --prod
   ```

4. **Configure Environment (Optional)**
   - Go to Site settings → Environment variables
   - Add any required API keys (if using serverless functions)

5. **Custom Domain (Optional)**
   - Site settings → Domain management
   - Add your custom domain

**Your site will be live at:** `https://your-site-name.netlify.app`

---

### Option 2: Vercel (Great for Next.js & Static Sites)

**Pros:**
- Free tier with 100GB bandwidth
- Excellent performance
- GitHub integration
- Automatic HTTPS
- Edge network

**Steps:**

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Sign up with GitHub

2. **Deploy via Git (Recommended)**
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Other
     - Root Directory: `./`
     - Build Command: (leave empty)
     - Output Directory: (leave empty)
   - Click "Deploy"

3. **CLI Deploy (Alternative)**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login
   vercel login
   
   # Deploy
   cd /path/to/Hackathon-
   vercel --prod
   ```

**Your site will be live at:** `https://your-project-name.vercel.app`

---

### Option 3: GitHub Pages (Simplest)

**Pros:**
- Completely free
- Direct GitHub integration
- No signup needed (uses GitHub account)

**Steps:**

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main`, folder: `/ (root)`
   - Save

2. **Wait 1-2 minutes for deployment**

**Your site will be live at:** `https://yourusername.github.io/repository-name/`

---

### Option 4: Cloudflare Pages

**Pros:**
- Unlimited bandwidth (free)
- Global CDN
- Fast deployment
- Great for static sites

**Steps:**

1. **Sign up at** [pages.cloudflare.com](https://pages.cloudflare.com/)
2. **Connect your GitHub repository**
3. **Configure:**
   - Build command: (leave empty)
   - Build output directory: `./`
4. **Deploy**

**Your site will be live at:** `https://your-project.pages.dev`

---

### Option 5: Render (Full-Stack Option)

**Pros:**
- Free tier available
- Can host static sites and APIs
- Good for Python backends

**Steps:**

1. **Sign up at** [render.com](https://render.com/)
2. **New Static Site**
3. **Connect GitHub repository**
4. **Configure:**
   - Build Command: (leave empty)
   - Publish Directory: `.`
5. **Deploy**

---

## ⚙️ Configuration Files Included

This repository includes configuration files for:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `vercel.json` - Vercel configuration

These files include:
- Security headers
- Cache control
- CORS settings
- Redirect rules (for API proxy if needed)

---

## 🔧 Backend Considerations

**Important:** The frontend can be deployed to any platform above, but the **backend (AWS Lambda functions)** requires AWS infrastructure:

### If you only deploy frontend:
- ✅ The website UI will work
- ❌ Research and Book Generation features won't work (require AWS backend)

### To enable full functionality:

1. **Deploy Backend to AWS** (see [DEPLOYMENT.md](DEPLOYMENT.md))
   - Set up Lambda functions
   - Configure API Gateway
   - Enable AWS Bedrock

2. **Update Frontend API Endpoint**
   - Edit `script.js`
   - Replace `API_ENDPOINT` with your API Gateway URL
   - Redeploy frontend

### Alternative: Netlify/Vercel Serverless Functions

You can migrate Lambda functions to Netlify/Vercel serverless functions:

**Netlify Functions:**
```bash
# Create netlify/functions directory
mkdir -p netlify/functions

# Move Lambda functions there
# Adapt code for Netlify Functions format
```

**Vercel Functions:**
```bash
# Create api directory
mkdir -p api

# Move Lambda functions there
# Adapt code for Vercel Serverless Functions
```

*Note: This requires code adaptation and API key management.*

---

## 📱 Post-Deployment Checklist

After deploying:

- [ ] ✅ Site loads successfully
- [ ] ✅ Navigation works
- [ ] ✅ Responsive design on mobile
- [ ] ✅ HTTPS enabled (automatic on all platforms)
- [ ] ⚠️ API endpoints configured (if using backend)
- [ ] 📊 Analytics setup (optional)
- [ ] 🔒 Environment variables secured
- [ ] 🌐 Custom domain configured (optional)

---

## 🐛 Troubleshooting

### Site not loading?
- Check build logs in platform dashboard
- Verify all files are committed to Git
- Ensure no build errors

### API calls failing?
- Check CORS settings
- Verify API endpoint URL in `script.js`
- Check browser console for errors

### Images/assets not loading?
- Verify file paths are correct
- Check file names match (case-sensitive)

---

## 💰 Cost Comparison

| Platform | Free Tier Bandwidth | Custom Domain | Serverless Functions |
|----------|-------------------|---------------|---------------------|
| **Netlify** | 100GB/month | ✅ Free | ✅ 125k requests/month |
| **Vercel** | 100GB/month | ✅ Free | ✅ 100k requests/month |
| **GitHub Pages** | 100GB/month | ✅ Free | ❌ Not available |
| **Cloudflare Pages** | ♾️ Unlimited | ✅ Free | ✅ 100k requests/day |
| **Render** | 100GB/month | ✅ Free | ✅ 750 hours/month |

**Recommendation:** 
- For **static site only**: Cloudflare Pages (unlimited bandwidth)
- For **site + serverless**: Netlify or Vercel
- For **simplest setup**: GitHub Pages

---

## 🔗 Useful Links

- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Full AWS Deployment Guide](DEPLOYMENT.md)

---

## 🆘 Need Help?

1. Check the [Issues](https://github.com/MIHAchoppa/Hackathon-/issues) page
2. Review platform-specific documentation
3. Check deployment logs in platform dashboard
4. Ensure all prerequisites are met

---

**Ready to deploy?** Pick a platform above and follow the steps! 🚀

Most users can have their site live in under 5 minutes using Netlify or Vercel.

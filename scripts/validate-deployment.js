#!/usr/bin/env node
/**
 * Deployment Validation Script
 * 
 * This script validates that the deployment is ready and all files are correct.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating deployment readiness...\n');

let errors = 0;
let warnings = 0;

// Check if required files exist
function checkRequiredFiles() {
  console.log('📁 Checking required files...');
  
  const files = {
    'index.html': 'Main HTML file',
    'script.js': 'JavaScript functionality',
    'styles.css': 'Stylesheets',
    'README.md': 'Documentation',
    'netlify.toml': 'Netlify configuration',
    'vercel.json': 'Vercel configuration',
    '_redirects': 'Netlify redirects'
  };
  
  for (const [file, description] of Object.entries(files)) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file} - ${description}`);
    } else {
      console.log(`  ⚠️  ${file} - MISSING (${description})`);
      warnings++;
    }
  }
  console.log('');
}

// Check HTML file for issues
function checkHTML() {
  console.log('🌐 Validating HTML...');
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Check for common issues
  if (!html.includes('<!DOCTYPE html>')) {
    console.log('  ⚠️  Missing DOCTYPE declaration');
    warnings++;
  } else {
    console.log('  ✅ DOCTYPE present');
  }
  
  if (!html.includes('<meta charset=')) {
    console.log('  ⚠️  Missing charset meta tag');
    warnings++;
  } else {
    console.log('  ✅ Charset meta tag present');
  }
  
  if (!html.includes('viewport')) {
    console.log('  ⚠️  Missing viewport meta tag');
    warnings++;
  } else {
    console.log('  ✅ Viewport meta tag present');
  }
  
  if (!html.includes('<title>')) {
    console.log('  ❌ Missing title tag');
    errors++;
  } else {
    console.log('  ✅ Title tag present');
  }
  
  console.log('');
}

// Check for broken links
function checkLinks() {
  console.log('🔗 Checking asset links...');
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Check for script.js
  if (html.includes('script.js')) {
    const scriptPath = path.join(__dirname, '..', 'script.js');
    if (fs.existsSync(scriptPath)) {
      console.log('  ✅ script.js linked and exists');
    } else {
      console.log('  ❌ script.js linked but missing');
      errors++;
    }
  }
  
  // Check for styles.css
  if (html.includes('styles.css')) {
    const cssPath = path.join(__dirname, '..', 'styles.css');
    if (fs.existsSync(cssPath)) {
      console.log('  ✅ styles.css linked and exists');
    } else {
      console.log('  ❌ styles.css linked but missing');
      errors++;
    }
  }
  
  console.log('');
}

// Check GitHub workflows
function checkWorkflows() {
  console.log('⚙️  Checking GitHub Actions workflows...');
  const workflowsDir = path.join(__dirname, '..', '.github', 'workflows');
  
  if (fs.existsSync(workflowsDir)) {
    const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.yml'));
    console.log(`  ✅ Found ${workflows.length} workflow(s):`);
    workflows.forEach(w => console.log(`     • ${w}`));
  } else {
    console.log('  ⚠️  No workflows directory found');
    warnings++;
  }
  
  console.log('');
}

// Check deployment configurations
function checkDeployConfigs() {
  console.log('🚀 Checking deployment configurations...');
  
  const configs = [
    { file: 'netlify.toml', platform: 'Netlify' },
    { file: 'vercel.json', platform: 'Vercel' },
    { file: '.github/workflows/deploy-pages.yml', platform: 'GitHub Pages' }
  ];
  
  for (const config of configs) {
    const configPath = path.join(__dirname, '..', config.file);
    if (fs.existsSync(configPath)) {
      console.log(`  ✅ ${config.platform} config found (${config.file})`);
    } else {
      console.log(`  ⚠️  ${config.platform} config missing (${config.file})`);
      warnings++;
    }
  }
  
  console.log('');
}

// Check file sizes
function checkFileSizes() {
  console.log('📊 Checking file sizes...');
  
  const files = ['index.html', 'script.js', 'styles.css'];
  let totalSize = 0;
  
  for (const file of files) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      totalSize += stats.size;
      
      // Warn if files are too large
      if (stats.size > 1024 * 1024) { // > 1MB
        console.log(`  ⚠️  ${file}: ${sizeKB} KB (consider optimization)`);
        warnings++;
      } else {
        console.log(`  ✅ ${file}: ${sizeKB} KB`);
      }
    }
  }
  
  const totalKB = (totalSize / 1024).toFixed(2);
  console.log(`  📦 Total size: ${totalKB} KB\n`);
}

// Main validation function
function validate() {
  console.log('========================================');
  console.log('  Deployment Validation');
  console.log('========================================\n');
  
  checkRequiredFiles();
  checkHTML();
  checkLinks();
  checkWorkflows();
  checkDeployConfigs();
  checkFileSizes();
  
  console.log('========================================');
  console.log('  Validation Results');
  console.log('========================================\n');
  
  if (errors === 0 && warnings === 0) {
    console.log('✅ All checks passed! Ready to deploy.\n');
    console.log('📚 Next steps:');
    console.log('   1. Run "npm run build:prod" for production build');
    console.log('   2. Push to main branch to trigger GitHub Pages deployment');
    console.log('   3. Or deploy manually using QUICK_DEPLOY.md\n');
    return true;
  } else {
    if (errors > 0) {
      console.log(`❌ Found ${errors} error(s)`);
    }
    if (warnings > 0) {
      console.log(`⚠️  Found ${warnings} warning(s)`);
    }
    console.log('\nPlease fix the issues above before deploying.\n');
    return false;
  }
}

// Run validation
const success = validate();
process.exit(success ? 0 : 1);

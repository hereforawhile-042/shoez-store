# 🚀 Deployment Guide

## Overview

This guide covers deploying your Shoez e-commerce store to various platforms.

---

## 🌐 Deployment Options

### 1. Vercel (Recommended)

**Pros:**

- Zero configuration
- Automatic HTTPS
- Global CDN
- Serverless functions support
- Free tier available

**Steps:**

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

4. **Configure Environment Variables**

   - Go to Vercel Dashboard
   - Select your project
   - Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Deploy to Production**

```bash
vercel --prod
```

**Custom Domain:**

```bash
vercel domains add yourdomain.com
```

---

### 2. Netlify

**Pros:**

- Easy setup
- Form handling
- Split testing
- Free tier available

**Steps:**

1. **Install Netlify CLI**

```bash
npm install -g netlify-cli
```

2. **Build the Project**

```bash
npm run build
```

3. **Deploy**

```bash
netlify deploy
```

4. **Configuration**

   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Add in Netlify dashboard

5. **Production Deploy**

```bash
netlify deploy --prod
```

---

### 3. GitHub Pages

**Steps:**

1. **Install gh-pages**

```bash
npm install --save-dev gh-pages
```

2. **Update vite.config.js**

```javascript
export default defineConfig({
  base: "/your-repo-name/",
  // ... rest of config
});
```

3. **Add Deploy Script to package.json**

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

4. **Deploy**

```bash
npm run deploy
```

---

### 4. AWS S3 + CloudFront

**Steps:**

1. **Build the Project**

```bash
npm run build
```

2. **Create S3 Bucket**

   - Enable static website hosting
   - Set bucket policy for public read

3. **Upload dist/ folder**

```bash
aws s3 sync dist/ s3://your-bucket-name
```

4. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Configure SSL certificate
   - Set up custom domain

---

### 5. Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run:**

```bash
docker build -t shoez-ecommerce .
docker run -p 80:80 shoez-ecommerce
```

---

## 🔧 Pre-Deployment Checklist

### Code Quality

- [ ] Run `npm run lint` and fix all errors
- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm run preview`
- [ ] Remove console.logs
- [ ] Remove commented code

### Environment Variables

- [ ] All environment variables set in deployment platform
- [ ] No sensitive data in code
- [ ] `.env` file in `.gitignore`

### Supabase Configuration

- [ ] RLS policies configured
- [ ] Database indexes created
- [ ] Storage buckets set up
- [ ] CORS configured

### Performance

- [ ] Images optimized
- [ ] Bundle size checked
- [ ] Lighthouse audit passed (90+)
- [ ] Mobile performance tested

### Security

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Input validation implemented
- [ ] Rate limiting considered

### SEO

- [ ] Meta tags configured
- [ ] Sitemap generated
- [ ] robots.txt created
- [ ] Open Graph tags added

---

## 🌍 Environment Variables

### Required Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_APP_URL=https://yourdomain.com
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx (if using Stripe)
```

---

## 📊 Post-Deployment

### Monitoring

1. **Set up Analytics**

   - Google Analytics
   - Vercel Analytics
   - Supabase Analytics

2. **Error Tracking**

   - Sentry
   - LogRocket
   - Rollbar

3. **Performance Monitoring**
   - Lighthouse CI
   - WebPageTest
   - GTmetrix

### Maintenance

- Regular dependency updates
- Security patches
- Database backups
- Performance monitoring
- User feedback collection

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 🆘 Troubleshooting

### Build Fails

**Issue:** Build fails with module not found
**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

**Issue:** Variables undefined in production
**Solution:**

- Ensure variables start with `VITE_`
- Rebuild after adding variables
- Check deployment platform settings

### 404 on Refresh

**Issue:** Page not found when refreshing on routes
**Solution:** Configure redirects

**Vercel (vercel.json):**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Netlify (\_redirects):**

```
/*    /index.html   200
```

---

## 📞 Support

For deployment issues, contact:

- Email: support@shoez.com
- GitHub Issues: [Create Issue](https://github.com/yourusername/shoez/issues)

---

**Last Updated:** 2025-11-22

# GN Foundation Website - Deployment Guide

This guide walks you through deploying the GN Foundation website to Vercel with MongoDB Atlas and Cloudinary.

## Architecture

- **Frontend & Backend**: Next.js 15 (deployed on Vercel)
- **Database**: MongoDB Atlas (cloud database)
- **File Storage**: Cloudinary (student images & PDF templates)
- **Certificate Generation**: On-demand PDF generation using pdf-lib

---

## Prerequisites

Before deploying, you'll need accounts for:

1. **Vercel** - https://vercel.com (free tier available)
2. **MongoDB Atlas** - https://www.mongodb.com/cloud/atlas (free tier: 512MB)
3. **Cloudinary** - https://cloudinary.com (you already have this)
4. **GitHub/GitLab/Bitbucket** - For source code hosting

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create a Cluster

1. Log in to MongoDB Atlas: https://cloud.mongodb.com
2. Click "Build a Database"
3. Choose **M0 Free Tier** (512MB, no credit card required)
4. Select a cloud provider and region (choose one closest to your users)
5. Name your cluster (e.g., "gnfoundation")
6. Click "Create"

### 1.2 Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `gnfoundation_user` (or your choice)
5. Auto-generate a secure password (save this!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.3 Whitelist IP Addresses

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is safe for Atlas as authentication is required
4. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" driver version 5.5 or later
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your database user
7. Replace `<password>` with your password
8. Add database name after `.net/`: `gnfoundation`

Final format:
```
mongodb+srv://gnfoundation_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gnfoundation?retryWrites=true&w=majority
```

---

## Step 2: Set Up Cloudinary

Since you already have a Cloudinary account:

1. Log in to Cloudinary: https://cloudinary.com
2. Go to Dashboard
3. Copy these values:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Reveal" to see it)

---

## Step 3: Prepare Your Code for Deployment

### 3.1 Update Environment Variables

1. Open `.env.local` in your project
2. Fill in the real values:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://gnfoundation_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gnfoundation?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!

# Next.js Configuration (update in production)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3.2 Push Code to Git Repository

If not already done:

```bash
git init
git add .
git commit -m "Initial commit - GN Foundation website"
git branch -M main
git remote add origin https://github.com/yourusername/gnfoundation.git
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### 4.1 Connect Repository

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Select the "GNFoundation" repository

### 4.2 Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (leave as is)
3. **Build Command**: `npm run build` (default)
4. **Install Command**: `npm install` (default)

### 4.3 Add Environment Variables

Click "Environment Variables" and add these (one by one):

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `ADMIN_USERNAME` | admin (or your choice) |
| `ADMIN_PASSWORD` | Your secure admin password |
| `NEXT_PUBLIC_APP_URL` | https://your-project.vercel.app |

**Important**: Select "Production", "Preview", and "Development" for all variables.

### 4.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. Vercel will give you a URL like `https://gnfoundation.vercel.app`

---

## Step 5: Test Your Deployment

### 5.1 Test Admin Panel

1. Go to `https://your-project.vercel.app/login`
2. Login with your admin credentials
3. Test uploading a certificate template (PDF file)
4. Test uploading student data (Excel file)
5. Test adding an awardee with a photo

### 5.2 Test Certificate Download

1. After uploading student data, go to `/participation`
2. Enter an admission number from your uploaded data
3. Click "Find Certificate"
4. Click "Download" to generate and download the PDF

### 5.3 Test Awards Page

1. Go to `/awards`
2. Verify that awardees appear
3. Test filtering by year, school, class

---

## Step 6: Custom Domain (Optional)

### 6.1 Purchase Domain

Buy a domain from:
- Namecheap (https://www.namecheap.com)
- GoDaddy (https://www.godaddy.com)
- Cloudflare (https://www.cloudflare.com)

### 6.2 Connect to Vercel

1. In Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain (e.g., `gnfoundation.org`)
3. Follow Vercel's DNS instructions:
   - If using nameservers: Point to Vercel's nameservers
   - If using A/CNAME records: Add records as shown

### 6.3 Update Environment Variable

Update `NEXT_PUBLIC_APP_URL` to your custom domain:
```
NEXT_PUBLIC_APP_URL=https://gnfoundation.org
```

---

## Usage Guide

### For Admins

#### Uploading Certificate Templates

1. Login at `/login`
2. Go to "Manage Certificates" tab
3. For each exam type (RMTH/RSTH):
   - Select year
   - Upload PDF template
   - Click "Upload Template"

#### Uploading Student Data

1. Prepare Excel file with columns:
   - Admission Number
   - Student Name
   - Father Name
   - School
   - Class
   - Marks (optional)
   - Rank (optional)
   - Grade (optional)

2. In admin panel > "Manage Certificates" tab:
   - Select exam type (RMTH/RSTH)
   - Select year
   - Choose Excel file
   - Click "Upload File"

#### Adding Awardees

1. Go to "Manage Awards" tab
2. Fill in awardee details
3. Upload student photo
4. Click "Add Awardee"

### For Students

#### Downloading Certificates

1. Go to `/participation`
2. Enter admission number (e.g., RMTH2024001)
3. Click "Find Certificate"
4. Click "Download for [Name]"

---

## Maintenance

### Updating Environment Variables

1. Go to Vercel project dashboard
2. Settings > Environment Variables
3. Edit the variable
4. Click "Save"
5. Redeploy the project (Production tab > click the latest deployment > Redeploy)

### Monitoring

- **Vercel Dashboard**: View deployment logs, analytics, errors
- **MongoDB Atlas**: Monitor database usage, slow queries
- **Cloudinary**: Track storage usage, bandwidth

### Backups

#### MongoDB Backup

1. In MongoDB Atlas, go to your cluster
2. Click "..." > "Load Sample Dataset" (for testing)
3. For production: Set up automated backups in Atlas (paid feature)
4. Free alternative: Use `mongodump` locally:
   ```bash
   mongodump --uri="your-mongodb-uri" --out=./backup
   ```

#### Cloudinary Backup

- Cloudinary doesn't automatically backup
- Download important files periodically
- Use Cloudinary API to list and download assets

---

## Troubleshooting

### Certificate Generation Fails

**Error**: "Failed to generate certificate"

**Solutions**:
1. Check if template exists for that exam type + year
2. Verify Cloudinary template URL is accessible
3. Check MongoDB connection
4. View Vercel deployment logs for errors

### Images Not Loading

**Error**: Images show broken icon

**Solutions**:
1. Verify `CLOUDINARY_*` environment variables are set
2. Check `next.config.ts` includes `res.cloudinary.com` in image remotePatterns
3. Ensure images were uploaded successfully (check Cloudinary dashboard)

### MongoDB Connection Errors

**Error**: "MongooseError: connect ETIMEDOUT"

**Solutions**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas > Network Access allows 0.0.0.0/0
3. Verify database user has correct permissions
4. Check password doesn't have special characters that need URL encoding

### Deployment Build Fails

**Error**: Build failed on Vercel

**Solutions**:
1. Check Vercel deployment logs
2. Ensure all environment variables are set
3. Run `npm run build` locally to test
4. Check for TypeScript errors (currently ignored in config)

---

## Scaling Considerations

### As Your Usage Grows

1. **MongoDB Atlas**:
   - Free tier: 512MB, shared CPU
   - Upgrade to M10+ for dedicated resources (~$57/month)

2. **Cloudinary**:
   - Free tier: 25GB storage, 25GB bandwidth/month
   - Upgrade if you exceed limits (~$99/month for pro)

3. **Vercel**:
   - Free tier: 100GB bandwidth, unlimited static requests
   - Serverless functions: 100 hours/month execution time
   - Upgrade to Pro ($20/month) for higher limits

### Performance Optimization

1. **Enable caching** for awardees API (add revalidation time)
2. **Compress PDF templates** before upload
3. **Optimize images** using Cloudinary transformations
4. **Add CDN** for static assets (Vercel includes this)

---

## Security Best Practices

1. **Strong Admin Password**: Use a password manager
2. **Environment Variables**: Never commit `.env.local` to Git
3. **HTTPS Only**: Enforced by default on Vercel
4. **Rate Limiting**: Consider adding rate limiting for certificate downloads
5. **Input Validation**: Already implemented with Zod schemas
6. **MongoDB**: Use strong database password with special characters

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **pdf-lib Docs**: https://pdf-lib.js.org

---

## Summary Checklist

- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Cloudinary credentials collected
- [ ] Code pushed to Git repository
- [ ] Vercel project created and connected to repository
- [ ] All environment variables added to Vercel
- [ ] Successful deployment completed
- [ ] Admin login tested
- [ ] Certificate template uploaded
- [ ] Student data uploaded via Excel
- [ ] Certificate download tested
- [ ] Awardee added with photo
- [ ] Awards page displays correctly
- [ ] Custom domain configured (optional)

---

**Congratulations!** Your GN Foundation website is now live! 🎉

For any issues, check the Troubleshooting section or review deployment logs in Vercel.

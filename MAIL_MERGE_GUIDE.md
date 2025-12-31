# Mail Merge Certificate System - Admin Guide

## 🎉 What's New: Visual Certificate Designer!

Your certificate system now works like **mail merge** - customize the design visually without touching code!

---

## How It Works

### 1. **HTML-Based Certificates**
- Certificates are generated from HTML templates (like Word mail merge)
- Student data automatically fills in
- No more X/Y coordinate positioning!

### 2. **Visual Designer**
- Customize colors, fonts, text from admin panel
- Live preview
- Save configurations per exam type/year

---

## Admin Panel Guide

### Step 1: Open Certificate Designer

1. Go to **Admin Panel** → **Manage Certificates** tab
2. Scroll down to see **Certificate Designer** cards for RMTH and RSTH

### Step 2: Customize Your Certificate

**Content Tab:**
- Organization Name (e.g., "GN Foundation")
- Certificate Title (e.g., "Certificate of Participation")
- Subtitle Text (use `{examType}` and `{year}` for dynamic values)
- Footer Text
- Signature settings

**Colors & Style Tab:**
- Primary Color (main color for titles, borders)
- Secondary Color (gradient background)
- Text Color
- Background Color
- Border Style (double, solid, dashed, none)
- Border Color

**Advanced Tab:**
- Title Font
- Body Font
- Show/hide logo
- Available merge fields

### Step 3: Use Merge Fields

In any text field, you can use these placeholders:
- `{admissionNumber}` → Student's admission number
- `{studentName}` → Student's name
- `{school}` → School name
- `{class}` → Class
- `{examType}` → RMTH or RSTH
- `{year}` → 2025

**Example:**
```
Subtitle: "For excellent performance in {examType} {year}"
Result: "For excellent performance in RMTH 2025"
```

### Step 4: Save & Preview

1. Click **"Save Template"** button
2. Click **"Preview"** to see how it looks
3. Configuration is saved per exam type and year

---

## Student Certificate Download

Students just:
1. Go to Participation page
2. Enter admission number
3. Download certificate with all their data filled in!

---

## Features

✅ **No coordinate positioning** - Everything auto-placed
✅ **Visual customization** - Colors, fonts, borders
✅ **Mail merge fields** - Dynamic text replacement
✅ **Separate configs** - Different designs for RMTH/RSTH
✅ **Preview function** - See before publishing
✅ **Professional design** - Gradient backgrounds, borders, signatures

---

## Example Configurations

### Formal Style
- Primary Color: #1a365d (Dark Blue)
- Secondary Color: #2c5282 (Medium Blue)
- Border: Double
- Title Font: Georgia
- Body Font: Times New Roman

### Modern Style
- Primary Color: #667eea (Purple)
- Secondary Color: #764ba2 (Deep Purple)
- Border: Solid
- Title Font: Arial
- Body Font: Helvetica

### Minimal Style
- Primary Color: #333333 (Dark Gray)
- Secondary Color: #666666 (Medium Gray)
- Border: None
- Title Font: Helvetica
- Body Font: Arial

---

## Tips

1. **Test First**: Use preview before going live
2. **Keep it Simple**: Don't use too many colors
3. **Readable Fonts**: Stick to standard fonts for compatibility
4. **Contrast**: Ensure text is readable on background
5. **Consistent Branding**: Use same colors for RMTH and RSTH

---

## Troubleshooting

**Q: Changes not showing?**
A: Make sure you clicked "Save Template" before testing

**Q: Preview not working?**
A: Ensure you have test student data in the database

**Q: Certificate looks wrong?**
A: Try resetting to default values and start over

---

## Quick Start

1. Start server: `npm run dev`
2. Go to: http://localhost:7000/admin
3. Click "Manage Certificates" tab
4. Customize in Certificate Designer
5. Save & preview
6. Test download at /participation

That's it! **No more coordinate positioning!** 🎊

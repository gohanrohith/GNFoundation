# Certificate Setup Guide

## How to Set Up Certificate Generation

### Step 1: Upload PDF Template

1. Go to **Admin Panel** → **Manage Certificates** tab
2. Click **"Upload RMTH Template"** or **"Upload RSTH Template"**
3. Select Year: **2025**
4. Choose your PDF file: `RMTH & RSTH @2025.pdf`
5. Click **"Upload Template"**

### Step 2: Configure Field Positions

After uploading the template, you need to tell the system WHERE to place each field on the PDF.

**OPTION A: Use the Visual Coordinate Finder (RECOMMENDED)**
1. Open browser to: `http://localhost:7000/coordinate-finder.html`
2. Upload your PDF template
3. Click "Start Placing Fields"
4. Click on the PDF where each field should appear
5. Copy the coordinates shown

**OPTION B: Use Configure Fields Dialog**
1. In the **"Configure Field Positions"** section
2. Click **"Configure Fields"** for RMTH or RSTH
3. A dialog will open showing these fields:
   - Admission Number
   - Student Name
   - School
   - Class

4. For each field, set:
   - **X Position**: Horizontal position (0 = left edge, higher = move right)
   - **Y Position**: Vertical position (0 = bottom edge, higher = move up)
   - **Font Size**: Text size (10-24 recommended)

5. Click **"Save Positions"**

**See FIELD_POSITIONING_GUIDE.md for detailed instructions and coordinate examples.**

### Step 3: Upload Student Data

1. Prepare Excel file with these 4 columns (REQUIRED):
   ```
   Admission Number | Student Name | School | Class
   ```

   Example:
   ```
   RMTH2025001 | Aarav Kumar | S-Greenwood School Main Campus | 9th Class
   RMTH2025002 | Priya Sharma | S-Greenwood School Main Campus | 9th Class
   ```

2. Select Exam Type: **RMTH** or **RSTH**
3. Select Year: **2025**
4. Upload Excel file (.xlsx or .csv)
5. Students are saved to database

**Sample file provided**: `public/Sample_Student_Data.csv`

### Step 4: Test Certificate Download

1. Go to **Participation** page
2. Enter admission number (from your Excel file)
3. Click **"Find Certificate"**
4. Click **"Download"**
5. Check if fields appear in correct positions

### Adjusting Field Positions

If fields don't appear in the right place:

1. Open a PDF editor (like Adobe Acrobat or online PDF tools)
2. Measure where you want each field to appear
3. Note the coordinates
4. Go back to **"Configure Fields"**
5. Update the X, Y positions
6. Save and test again

### Tips for Getting Coordinates

**Method 1: Trial and Error**
- Start with default positions
- Generate a test certificate
- Adjust X/Y values up or down
- Regenerate and check

**Method 2: Use PDF Editor**
- Open your template in Adobe Acrobat or similar
- Enable ruler/grid
- Hover over where you want text
- Note the X, Y coordinates
- Enter those in the Configure Fields dialog

**Coordinate System:**
- X: 0 (left) → 612 (right) for A4 portrait
- Y: 0 (bottom) → 792 (top) for A4 portrait
- Origin (0,0) is at BOTTOM-LEFT corner

### Example Starting Positions

For a typical certificate (adjust based on your template):
```
Admission Number: X: 450, Y: 750, Size: 12 (top-right area)
Student Name:     X: 150, Y: 450, Size: 24 (center area, large)
School:           X: 150, Y: 350, Size: 14 (below name)
Class:            X: 150, Y: 300, Size: 14 (below school)
```

**These are just starting points!** Use the coordinate finder tool or trial-and-error to find the perfect positions for your certificate design.

**For detailed positioning guidance**, see: `FIELD_POSITIONING_GUIDE.md`

### Troubleshooting

**Problem**: Student not found
- **Solution**: Check admission number spelling, ensure Excel was uploaded for correct exam type/year

**Problem**: Fields appear in wrong place
- **Solution**: Adjust X/Y coordinates in Configure Fields

**Problem**: Text too big/small
- **Solution**: Adjust Font Size in Configure Fields

**Problem**: Text overlaps template graphics
- **Solution**: Move X/Y position to empty space on template

---

## Quick Workflow Summary

1. ✅ Upload PDF template (RMTH/RSTH)
2. ✅ Configure field positions (X, Y, Size)
3. ✅ Upload student Excel data
4. ✅ Test with one admission number
5. ✅ Adjust positions if needed
6. ✅ Roll out to students!

That's it! Students can now download their personalized certificates.

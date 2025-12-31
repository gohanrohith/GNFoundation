# Certificate Field Positioning Guide

## Current Status

Your certificate system is now configured to use only **4 fields**:
- Admission Number
- Student Name
- School
- Class

PDFs are generating successfully, but the text needs to be positioned correctly on your certificate template.

---

## Method 1: Using the Coordinate Finder Tool (RECOMMENDED)

### Step 1: Open the Coordinate Finder
1. Open your browser and go to: `http://localhost:7000/coordinate-finder.html`
2. You'll see a visual tool for finding coordinates

### Step 2: Upload Your PDF
1. Click "Choose File" and select your certificate template: `RMTH & RSTH @2025.pdf`
2. The PDF will be displayed on the screen

### Step 3: Click to Place Fields
1. Click the "Start Placing Fields" button
2. The tool will ask you to click where each field should appear
3. Click on the PDF in this order:
   - **First click**: Where "Admission Number" should appear (usually top-right corner)
   - **Second click**: Where "Student Name" should appear (usually center, large text)
   - **Third click**: Where "School" should appear
   - **Fourth click**: Where "Class" should appear

4. The coordinates will be displayed automatically

### Step 4: Copy the Coordinates
After clicking all 4 positions, copy the coordinates shown for each field.

### Step 5: Enter in Admin Panel
1. Go to Admin Panel → Manage Certificates tab
2. Click "Configure Fields" for RMTH (or RSTH)
3. Enter the X, Y, and Font Size values from the coordinate finder
4. Click "Save Positions"

---

## Method 2: Using the Admin Panel Directly (Trial and Error)

### Current Default Positions

Your system currently uses these default positions:

```
Admission Number: X: 400, Y: 150, Font Size: 12
Student Name:     X: 300, Y: 250, Font Size: 18
School:           X: 200, Y: 330, Font Size: 12
Class:            X: 200, Y: 370, Font Size: 12
```

### How to Adjust:

1. **Go to Admin Panel** → Manage Certificates tab
2. **Click "Configure Fields"** for RMTH or RSTH
3. **Start with one field** (e.g., Student Name)
4. **Make small adjustments**:
   - Increase X to move text **RIGHT**
   - Decrease X to move text **LEFT**
   - Increase Y to move text **UP**
   - Decrease Y to move text **DOWN**
   - Adjust Font Size to make text bigger/smaller

5. **Save and Test**:
   - Click "Save Positions"
   - Go to Participation page
   - Enter a test admission number (e.g., RMTH2025001)
   - Download certificate
   - Check if the field moved in the right direction

6. **Repeat** until all fields are correctly positioned

---

## Understanding the Coordinate System

### PDF Coordinate System (Important!)
```
┌─────────────────────────────┐
│                      (612,792)│ ← Top Right
│                              │
│         Y increases          │
│              ↑               │
│              │               │
│     X increases →            │
│                              │
│(0,0)                         │ ← Bottom Left (Origin)
└─────────────────────────────┘
```

- **Origin (0,0)** is at BOTTOM-LEFT corner
- **X-axis**: 0 (left) → 612 (right) for A4 portrait
- **Y-axis**: 0 (bottom) → 792 (top) for A4 portrait
- Higher Y = text moves UP (not down!)

---

## Example Positioning for Typical Certificate

Here's a common layout you can use as a starting point:

```
┌─────────────────────────────────────────┐
│  Admission Number: RMTH2025001    ← (450, 750)
│                                         │
│                                         │
│         Student Name (Large)      ← (150, 450)
│              Aarav Kumar                │
│                                         │
│    School: S-Greenwood School     ← (150, 350)
│    Class: 9th Class               ← (150, 300)
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Suggested Coordinates:**
```
Admission Number:
  X: 450 (right side)
  Y: 750 (near top)
  Font Size: 10 or 12 (small, subtle)

Student Name:
  X: 150 (left-aligned, or use 306 for center)
  Y: 450 (middle area)
  Font Size: 20 or 24 (large, prominent)

School:
  X: 150 (left-aligned)
  Y: 350 (below student name)
  Font Size: 14 (medium)

Class:
  X: 150 (aligned with school)
  Y: 300 (below school)
  Font Size: 14 (medium)
```

---

## Tips for Best Results

### Font Sizes
- **Admission Number**: 10-12 (small, reference number)
- **Student Name**: 18-24 (large, most important)
- **School**: 12-16 (medium)
- **Class**: 12-16 (medium)

### Common Positioning Patterns

**Pattern 1: Center-aligned (Formal)**
```
Admission Number: Top-right corner (500, 750)
Student Name: Center (250, 450) - Large font
School: Center (250, 350)
Class: Center (250, 300)
```

**Pattern 2: Left-aligned (Clean)**
```
Admission Number: Top-right (450, 750)
Student Name: Left-center (150, 500) - Large font
School: Left (150, 400)
Class: Left (150, 350)
```

**Pattern 3: Mixed**
```
Admission Number: Top-right (480, 760)
Student Name: Center (200, 480) - Large font
School: Left (100, 350)
Class: Right (400, 350)
```

---

## Step-by-Step Workflow

### Initial Setup
1. ✅ Upload PDF template (already done or do it in Admin Panel)
2. ✅ Upload student Excel file (already done or do it in Admin Panel)
3. ⬜ Configure field positions (use one of the methods above)
4. ⬜ Test with sample admission number
5. ⬜ Adjust positions if needed
6. ⬜ Done!

### Quick Test Process
1. Open Admin Panel → Manage Certificates
2. Click "Configure Fields" for RMTH
3. Enter coordinates (use suggested values above or coordinate finder)
4. Click "Save Positions"
5. Go to Participation page
6. Enter: `RMTH2025001`
7. Click "Find Certificate"
8. Download and check PDF
9. If positions are wrong, adjust and repeat

---

## Troubleshooting

### Problem: Text appears too far left
**Solution**: Increase X value by 50-100

### Problem: Text appears too far down
**Solution**: Increase Y value by 50-100 (remember: higher Y = move UP!)

### Problem: Text is cut off or too small
**Solution**: Adjust Font Size (try 12, 14, 16, 18, 20, 24)

### Problem: Text overlaps template graphics
**Solution**: Move X/Y to empty space on certificate

### Problem: Can't find the right position
**Solution**:
1. Use the coordinate finder tool at `/coordinate-finder.html`
2. OR start with suggested coordinates above
3. OR look at your PDF in a PDF editor and note where empty spaces are

---

## Need Help?

If you're still having trouble:

1. **Check your PDF template**: Make sure there's enough empty space for text
2. **Try the coordinate finder first**: It's visual and much easier
3. **Start with Student Name only**: Get one field right, then do the rest
4. **Use whole numbers**: No decimals needed for X, Y coordinates
5. **Keep font sizes reasonable**: Between 10-24 works for most certificates

---

## Quick Reference Card

| Field | Typical X | Typical Y | Font Size |
|-------|-----------|-----------|-----------|
| Admission Number | 400-500 | 700-760 | 10-12 |
| Student Name | 150-300 | 400-500 | 18-24 |
| School | 150-250 | 300-400 | 12-16 |
| Class | 150-250 | 250-350 | 12-16 |

**Remember**: These are just starting points! Your certificate layout may need different values.

---

That's it! Once you've configured the positions, students can download their certificates with correctly placed text.

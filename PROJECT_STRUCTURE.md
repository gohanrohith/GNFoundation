# GN Foundation - Project Structure

## Overview
This is a Next.js 15.5.9 application for managing academic awards and generating certificates for the GN Foundation. The system uses MongoDB for data storage, Cloudinary for image hosting, and implements a visual mail-merge certificate builder.

## Technology Stack
- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **Cloud Storage**: Cloudinary
- **PDF Generation**: Puppeteer
- **UI Library**: shadcn/ui + Tailwind CSS
- **Authentication**: Custom JWT-based

---

## Project Tree Structure

```
GNFoundation/
│
├── 📁 public/                          # Static assets
│   ├── coordinate-finder.html          # Tool to find X,Y coordinates on images
│   ├── RMTH & RSTH @2025.pdf          # Sample certificate template
│   ├── Sample_Student_Data.csv         # Sample Excel data format
│   └── docs/                           # Additional documentation
│
├── 📁 src/                             # Source code
│   │
│   ├── 📁 app/                         # Next.js App Router pages & API
│   │   │
│   │   ├── 📁 (dashboard)/            # Public-facing pages (grouped route)
│   │   │   ├── layout.tsx              # Dashboard layout with header/footer
│   │   │   ├── page.tsx                # Homepage
│   │   │   │
│   │   │   ├── 📁 about/
│   │   │   │   └── page.tsx            # About page
│   │   │   │
│   │   │   ├── 📁 awards/
│   │   │   │   └── page.tsx            # Awards listing page
│   │   │   │
│   │   │   ├── 📁 contact/
│   │   │   │   ├── page.tsx            # Contact page
│   │   │   │   ├── actions.ts          # Server actions for contact form
│   │   │   │   └── _components/
│   │   │   │       └── contact-form.tsx # Contact form component
│   │   │   │
│   │   │   ├── 📁 participation/       # Certificate download portal
│   │   │   │   ├── page.tsx            # Certificate lookup page
│   │   │   │   ├── actions.ts          # Server actions for certificate lookup
│   │   │   │   └── _components/
│   │   │   │       └── certificate-form.tsx # Admission number input form
│   │   │   │
│   │   │   └── 📁 talent-hunt/
│   │   │       └── page.tsx            # Talent hunt information page
│   │   │
│   │   ├── 📁 admin/                   # Admin panel (protected)
│   │   │   ├── layout.tsx              # Admin layout (auth wrapper)
│   │   │   ├── page.tsx                # Admin dashboard
│   │   │   ├── actions.ts              # Server actions for admin operations
│   │   │   │
│   │   │   └── 📁 _components/         # Admin-specific components
│   │   │       ├── add-awardee-form.tsx           # Add new award winners
│   │   │       ├── awardees-table.tsx             # Display all awardees
│   │   │       ├── certificate-designer.tsx       # Legacy certificate designer
│   │   │       ├── certificate-upload-form.tsx    # Upload student Excel data
│   │   │       ├── template-field-editor.tsx      # Edit field positions (legacy)
│   │   │       ├── template-upload-card.tsx       # Upload certificate template
│   │   │       └── visual-certificate-builder.tsx # 🎨 NEW: Visual drag-and-drop builder
│   │   │
│   │   ├── 📁 login/                   # Authentication
│   │   │   ├── page.tsx                # Login page
│   │   │   └── _components/
│   │   │       └── login-form.tsx      # Login form component
│   │   │
│   │   ├── 📁 api/                     # API Routes
│   │   │   │
│   │   │   ├── 📁 admin/               # Admin API endpoints
│   │   │   │   ├── certificate-config/
│   │   │   │   │   └── route.ts        # Certificate configuration CRUD
│   │   │   │   │
│   │   │   │   ├── update-field-positions/
│   │   │   │   │   └── route.ts        # Update field positions (legacy)
│   │   │   │   │
│   │   │   │   ├── upload-background/
│   │   │   │   │   └── route.ts        # Upload certificate background to Cloudinary
│   │   │   │   │
│   │   │   │   ├── upload-students/
│   │   │   │   │   └── route.ts        # Upload student Excel data
│   │   │   │   │
│   │   │   │   ├── upload-template/
│   │   │   │   │   └── route.ts        # Upload certificate template (legacy)
│   │   │   │   │
│   │   │   │   └── visual-template/
│   │   │   │       └── route.ts        # 🎨 NEW: Visual template configuration API
│   │   │   │
│   │   │   ├── 📁 auth/                # Authentication
│   │   │   │   └── login/
│   │   │   │       └── route.ts        # Login endpoint
│   │   │   │
│   │   │   ├── 📁 awardees/            # Awardees data
│   │   │   │   └── route.ts            # CRUD operations for award winners
│   │   │   │
│   │   │   └── 📁 certificates/        # Certificate generation
│   │   │       ├── generate/
│   │   │       │   └── route.ts        # Generate PDF certificate (legacy PDF-lib)
│   │   │       │
│   │   │       └── generate-html/
│   │   │           └── route.ts        # 🎨 NEW: Generate PDF using HTML + Puppeteer
│   │   │
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Root redirect page
│   │
│   ├── 📁 components/                  # Reusable components
│   │   │
│   │   ├── 📁 layout/                  # Layout components
│   │   │   ├── header.tsx              # Site header/navigation
│   │   │   └── footer.tsx              # Site footer
│   │   │
│   │   └── 📁 ui/                      # shadcn/ui components
│   │       ├── button.tsx              # Button component
│   │       ├── card.tsx                # Card component
│   │       ├── input.tsx               # Input component
│   │       ├── select.tsx              # Select dropdown
│   │       ├── table.tsx               # Table component
│   │       ├── tabs.tsx                # Tabs component
│   │       ├── toast.tsx               # Toast notifications
│   │       ├── calendar.tsx            # Calendar picker
│   │       └── ...                     # 30+ other UI components
│   │
│   ├── 📁 lib/                         # Utility libraries
│   │   ├── mongodb.ts                  # MongoDB connection utility
│   │   ├── cloudinary.ts               # Cloudinary upload utility
│   │   ├── utils.ts                    # General utility functions (cn, etc.)
│   │   ├── awardees.ts                 # Awardees type definitions
│   │   └── placeholder-images.ts       # Placeholder image configurations
│   │
│   ├── 📁 models/                      # MongoDB Mongoose Models
│   │   ├── Awardee.ts                  # Award winners schema
│   │   ├── Student.ts                  # Student/participant schema
│   │   ├── CertificateTemplate.ts      # 🎨 Certificate template schema (backgrounds + fields)
│   │   └── CertificateConfig.ts        # Legacy certificate configuration schema
│   │
│   └── 📁 hooks/                       # Custom React hooks
│       ├── use-toast.ts                # Toast notification hook
│       └── use-mobile.tsx              # Mobile device detection hook
│
├── 📄 Configuration Files              # Root configuration
│   ├── package.json                    # Dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── tailwind.config.ts              # Tailwind CSS configuration
│   ├── next.config.ts                  # Next.js configuration
│   ├── components.json                 # shadcn/ui configuration
│   ├── .env.local                      # Environment variables (not in git)
│   └── apphosting.yaml                 # Firebase/Google App Hosting config
│
└── 📄 Documentation                    # Project documentation
    ├── README.md                       # Main project documentation
    ├── QUICK_START.md                  # Quick start guide
    ├── DEPLOYMENT.md                   # Deployment instructions
    ├── CERTIFICATE_SETUP_GUIDE.md      # Certificate system setup
    ├── FIELD_POSITIONING_GUIDE.md      # Field positioning instructions
    ├── MAIL_MERGE_GUIDE.md            # Mail merge system guide
    └── PROJECT_STRUCTURE.md            # This file
```

---

## Key Features Breakdown

### 1. 🎨 Visual Certificate Builder
**Location**: `src/app/admin/_components/visual-certificate-builder.tsx`

**Purpose**: Allows admins to visually design certificate templates by:
- Uploading certificate backgrounds (images/PDFs)
- Clicking or dragging to position text fields
- Customizing fonts, sizes, and colors
- Switching between portrait/landscape orientation
- Real-time preview of certificate layout

**Related Files**:
- API: `src/app/api/admin/visual-template/route.ts`
- API: `src/app/api/admin/upload-background/route.ts`
- Model: `src/models/CertificateTemplate.ts`
- PDF Generation: `src/app/api/certificates/generate-html/route.ts`

### 2. 📜 Certificate Generation System
**Purpose**: Mail-merge style certificate generation where student data is overlaid on certificate backgrounds

**Two Implementations**:
1. **Legacy (PDF-lib)**: `src/app/api/certificates/generate/route.ts`
   - Direct PDF manipulation
   - More complex positioning

2. **New (HTML + Puppeteer)**: `src/app/api/certificates/generate-html/route.ts` ✨
   - Generates HTML with background image
   - Converts to PDF using Puppeteer
   - More flexible and maintainable
   - Supports both portrait and landscape

**Flow**:
1. Admin uploads background → Cloudinary
2. Admin positions fields using visual builder
3. Admin uploads student data (Excel/CSV)
4. Students enter admission number
5. System generates personalized PDF certificate

### 3. 📊 Student Data Management
**Location**: `src/app/api/admin/upload-students/route.ts`

**Purpose**: Upload and parse Excel/CSV files with student data

**Required Columns**:
- Admission Number (required, unique)
- Student Name (optional)
- School (optional)
- Class (optional)

**Model**: `src/models/Student.ts`

### 4. 🏆 Awards Management
**Location**: `src/app/admin/page.tsx` (Manage Awards tab)

**Purpose**: Manage award winners displayed on the public awards page

**Components**:
- `add-awardee-form.tsx` - Add new awardees
- `awardees-table.tsx` - View/edit/delete awardees

**Model**: `src/models/Awardee.ts`

### 5. 🔐 Authentication
**Location**: `src/app/login/` and `src/app/api/auth/login/route.ts`

**Purpose**: Simple admin authentication using environment variables

**Credentials Stored In**: `.env.local`
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
JWT_SECRET=your_secret
```

### 6. 🎨 UI Component Library
**Location**: `src/components/ui/`

**Purpose**: Pre-built, styled components from shadcn/ui

**30+ Components Including**:
- Forms (input, select, textarea, checkbox, radio)
- Feedback (toast, alert, dialog, popover)
- Layout (card, tabs, sheet, separator)
- Data Display (table, calendar, badge, avatar)
- Navigation (menubar, dropdown)

---

## Data Flow Diagrams

### Certificate Generation Flow

```
┌─────────────────┐
│  Admin Panel    │
└────────┬────────┘
         │
         ├─1─→ Upload Background Image
         │     ↓
         │     Cloudinary → Store URL
         │
         ├─2─→ Visual Certificate Builder
         │     ↓
         │     Position Fields (x, y, font, color)
         │     ↓
         │     Save to MongoDB (CertificateTemplate)
         │
         └─3─→ Upload Student Data (Excel)
               ↓
               Parse CSV/Excel
               ↓
               Save to MongoDB (Student)

┌─────────────────┐
│ Student Portal  │
└────────┬────────┘
         │
         └─4─→ Enter Admission Number
               ↓
               Lookup Student in MongoDB
               ↓
               Fetch CertificateTemplate
               ↓
               Generate HTML (background + data overlay)
               ↓
               Puppeteer: HTML → PDF
               ↓
               Download PDF Certificate
```

### Database Schema Relationships

```
CertificateTemplate (MongoDB)
├── examType: 'RMTH' | 'RSTH'
├── year: 2025
├── templateUrl: 'https://cloudinary.com/...'
├── orientation: 'portrait' | 'landscape'
└── fieldPositions: [
    {
      id: 'studentName',
      x: 300,
      y: 400,
      fontSize: 28,
      fontFamily: 'Arial',
      color: '#000000',
      text: '{studentName}'
    },
    ...
]

Student (MongoDB)
├── admissionNumber: 'RMTH/2025/001' (unique, indexed)
├── studentName: 'John Doe'
├── school: 'ABC School'
├── class: '10th Grade'
├── examType: 'RMTH' | 'RSTH'
├── year: 2025
└── certificateGenerated: false

Awardee (MongoDB)
├── name: 'Jane Smith'
├── award: 'Gold Medal'
├── year: 2025
├── examType: 'RMTH'
├── rank: 1
├── marks: 98
├── school: 'XYZ School'
├── imageUrl: 'https://cloudinary.com/...'
└── imageId: 'cloudinary_public_id'
```

---

## Environment Variables

Required in `.env.local`:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=gnfoundation

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
```

---

## API Endpoints Summary

### Public Endpoints
- `GET /api/awardees` - Get all award winners
- `POST /api/certificates/generate-html` - Generate certificate PDF

### Protected Admin Endpoints (requires auth)
- `POST /api/admin/upload-students` - Upload student Excel data
- `POST /api/admin/upload-background` - Upload certificate background
- `GET/POST /api/admin/visual-template` - Certificate template configuration
- `GET/POST /api/awardees` - CRUD operations on awardees

---

## Development Scripts

```bash
# Install dependencies
npm install

# Run development server (port 7000)
npx next dev -p 7000

# Type checking
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

---

## Key Technologies & Libraries

### Core Framework
- **Next.js 15.5.9** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5.x** - Type safety

### Database & Storage
- **MongoDB** - Document database
- **Mongoose** - MongoDB ODM
- **Cloudinary** - Image/file hosting

### PDF Generation
- **Puppeteer** - Headless Chrome for HTML→PDF
- **pdf-lib** - Direct PDF manipulation (legacy)

### UI/Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Radix UI** - Unstyled accessible components
- **Lucide React** - Icon library

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Utilities
- **date-fns** - Date manipulation
- **xlsx** - Excel file parsing
- **clsx** / **tailwind-merge** - Class name utilities

---

## Deployment

**Platform**: Vercel / Firebase App Hosting

**Build Output**: `.next/` (static + server)

**Environment**: Node.js 18+

See `DEPLOYMENT.md` for detailed deployment instructions.

---

## Recent Major Updates

### ✨ Visual Certificate Builder (Latest)
- Replaced manual coordinate entry with visual drag-and-drop interface
- Added portrait/landscape orientation support
- Implemented Cloudinary background upload
- Switched from pdf-lib to Puppeteer for PDF generation
- Mail merge system with field placeholders: `{studentName}`, `{admissionNumber}`, etc.

### 🔄 Database Migration
- Moved from placeholder data to MongoDB Atlas
- Removed Firebase dependency
- Implemented student data upload via Excel/CSV
- Made all fields optional except admission number

---

## Contributing Guidelines

1. **Code Style**: TypeScript strict mode, follow existing patterns
2. **Components**: Use shadcn/ui components when possible
3. **File Organization**: Keep components in `_components/` folders
4. **API Routes**: Follow REST conventions
5. **Type Safety**: Always define interfaces for data structures
6. **Error Handling**: Wrap async operations in try-catch blocks

---

## Support & Documentation

- **Quick Start**: See `QUICK_START.md`
- **Certificate Setup**: See `CERTIFICATE_SETUP_GUIDE.md`
- **Field Positioning**: See `FIELD_POSITIONING_GUIDE.md`
- **Mail Merge**: See `MAIL_MERGE_GUIDE.md`

---

**Last Updated**: 2025-12-30
**Version**: 1.0.0
**Maintainer**: GN Foundation Development Team

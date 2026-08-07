# KiyuHub — Project Brief & Client Onboarding Platform

An enterprise-grade, interactive **Project Genesis Data Collection & Brief Generator Platform** created for **KiyuHub Ghana** (*"Empowering Breakthroughs"*).

This application allows prospective clients to define technical requirements for Websites, Mobile Applications, and Custom Enterprise Software. It generates instant formatted PDF project briefs for clients while storing submissions in an integrated **Admin Portal** featuring live PDF branding controls, customizable theme accents, and team management.

---

## 🚀 Key Features

### 📋 Client Onboarding Experience
* **Dynamic Multi-Step Wizard**: 5-stage interactive intake process with progress tracking and smooth animations.
* **Tailored Project Decision Paths**:
  * 🌐 **Website Specification**: Category selection (E-commerce, Corporate, Portfolio, SaaS, Blog, Custom Portal), page counts, and key feature toggles (CMS, Payments, Multi-language, SEO, Auth, Live Chat, Booking).
  * 📱 **Mobile App Specification**: Platform target selection (iOS, Android, Cross-Platform React Native/Flutter), app classification, and core feature sets (Push Notifications, GPS/Location, Offline Mode, Camera/Media, Real-time Chat).
  * 💻 **Custom Software Specification**: Architecture scope (ERP, CRM, Workflow Automation, Business Intelligence, API Integration), operational goals, and legacy system constraints.
* **Commercials & Timelines**: Budget range selection (GHS/USD currencies), delivery timeline preferences, project urgency levels, and support SLA options.
* **Instant Brief Review & PDF Generation**: Summary review before submission, celebratory confetti feedback, local state persistence, and instant downloadable formatted PDF briefs.

### 🛡️ Secure Admin Portal (`#admin`)
* **Discreet / Secret Access**: The admin portal is hidden from standard client view. Access is triggered by:
  * Double-clicking the header title **KIYUHUB GHANA**
  * Clicking the discreet lock icon (`🔒`) in the top header or bottom footer
  * Navigating directly to `#admin` in the browser URL hash
* **Client Briefs Directory (`Dashboard.tsx`)**:
  * Real-time search, category filtering (Website / Mobile App / Custom Software), status tracking (*New*, *Under Review*, *Contacted*, *In Progress*, *Archived*).
  * Detailed modal viewer for inspecting full client submissions.
  * One-click PDF download for any submitted project brief.
  * CSV data export for external report generation.
* **Branding & PDF Customization (`BrandingAndPdfSettings.tsx`)**:
  * Upload official agency cover logos and admin portal symbols (PNG, JPG, SVG).
  * Preset palette templates (Kiyu Red, Electric Blue, Emerald Tech, Royal Purple, Slate Dark, Crimson Flame) and custom hex color pickers for PDF headings and accents.
  * Live interactive embedded PDF preview rendered via `pdfjs-dist`.
* **Admin Team & Access Control (`AdminManagement.tsx`)**:
  * Add authorized team admin accounts.
  * Primary admin protection: **Only the default primary admin (`blanc.69458@gmail.com`) is authorized to revoke or remove admin team accounts.**

---

## 🛠️ Tech Stack & Dependencies

* **Frontend Framework**: React 19 + TypeScript 5
* **Build Tooling**: Vite 7
* **Styling & UI**: Tailwind CSS v4, Lucide React icons, custom responsive tech patterns.
* **Form & Validation**: React Hook Form v7 + Zod v4 schemas.
* **PDF Export & Preview**:
  * `jspdf` v3: Dynamic client-side vector PDF document generation.
  * `pdfjs-dist` v6: Canvas rendering engine for embedded live PDF previews.
* **Animations**: Framer Motion v12, Canvas Confetti.

---

## 📁 Project Structure

```
kiyu-hub/
├── client/                     # React Single Page Application workspace
│   ├── src/
│   │   ├── components/
│   │   │   ├── steps/         # Multi-step intake form step views (1-5)
│   │   │   │   ├── Step1Foundation.tsx     # Client & contact details
│   │   │   │   ├── Step2Decision.tsx       # Category decision (Web/App/Software)
│   │   │   │   ├── Step3Website.tsx        # Website feature specifications
│   │   │   │   ├── Step3App.tsx            # Mobile app feature specifications
│   │   │   │   ├── Step3SoftwareSpec.tsx   # Custom enterprise software spec
│   │   │   │   ├── Step4Commercial.tsx     # Budget, currency & timeline
│   │   │   │   └── Step5Review.tsx         # Summary & final submission
│   │   │   ├── ui/            # Reusable buttons, cards, inputs
│   │   │   ├── AdminManagement.tsx       # Team management & access rules
│   │   │   ├── AdminPortal.tsx           # Admin layout, header & tab switching
│   │   │   ├── BrandingAndPdfSettings.tsx # Logo upload & color accent settings
│   │   │   ├── Dashboard.tsx             # Submissions briefs table & filters
│   │   │   ├── PdfPreview.tsx            # Live embedded PDF rendering
│   │   │   └── ProgressBar.tsx           # Visual multi-step progress indicator
│   │   ├── lib/
   │   │   ├── adminSettings.ts          # Branding & credentials state management
   │   │   ├── kiyuhubLogo.ts            # Default agency vector logos
   │   │   ├── pdfExporter.ts            # jsPDF layout builder & document engine
   │   │   ├── projectFeatures.ts        # Readable label mappings for specs
   │   │   ├── submissionStorage.ts      # Submissions storage & initial seeders
   │   │   └── utils.ts                  # Class merge utilities
   │   ├── types/
   │   │   └── schema.ts                 # Zod validation schemas & TypeScript types
   │   ├── App.tsx                       # Main application router & view switcher
   │   └── main.tsx                      # App entry point
   ├── package.json
   └── vite.config.ts
├── metadata.json                # Application metadata
├── package.json                 # Workspace root config & dependencies
└── README.md                    # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites
* **Node.js**: v18 or higher
* **npm**: v9 or higher

### Installation & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Lint Codebase**:
   ```bash
   npm run lint
   ```

---

## 🔑 Default Administrator Credentials

Default pre-configured administrator accounts (Password: `Smart@399`):
* **Primary Default Admin**: `blanc.69458@gmail.com`
* **Official Admin**: `kiyuhubofficial@gmail.com`
* **System Admin**: `admin@kiyuhub.com`

*(Note: Additional admin accounts can be created and managed inside the Admin Management tab. All added administrators are automatically synchronized and persisted in local storage with in-memory caching).*

---

## 📜 License & Copyright

© 2023–2026 **KiyuHub Ghana**. All rights reserved.  
Contact Engineering: `+233 54 417 4341` / `+233 24 126 9458` | `kiyuhubofficial@gmail.com`

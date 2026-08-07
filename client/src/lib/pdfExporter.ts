import { jsPDF } from 'jspdf';
import type { FormData } from '../types/schema';
import { getKiyuHubLogoDataUrl } from './kiyuhubLogo';
import { getStoredBrandingSettings } from './adminSettings';
import { getFeatureLabel, getFeatureDescription } from './projectFeatures';

function formatDate(date: Date): string {
  const day = date.getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  else if (day === 2 || day === 22) suffix = 'nd';
  else if (day === 3 || day === 23) suffix = 'rd';

  return `${day}${suffix} ${month}, ${year}`;
}

export interface PdfThemeOptions {
  primaryColorHex?: string;
  accentColorHex?: string;
  agencyLogoDataUrl?: string;
}

function hexToRgb(hex: string | undefined, defaultRgb: [number, number, number]): [number, number, number] {
  if (!hex || !hex.startsWith('#')) return defaultRgb;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r, g, b];
  }
  return defaultRgb;
}

function getProjectTypeLabel(type: string): string {
  switch (type) {
    case 'app': return 'Mobile Phone Application';
    case 'saas': return 'Business & Cloud SaaS Software';
    case 'ecommerce': return 'Online Store & Digital Marketplace';
    case 'ai_api': return 'Smart AI System & Automation Service';
    case 'fintech': return 'Financial Technology & Payment Platform';
    case 'management_systems': return 'School, Health & Enterprise Management System';
    default: return 'Website & Business Web Portal';
  }
}

function getPlatformLabel(platformKey: string): string {
  switch (platformKey) {
    case 'web_desktop': return 'Web (Desktop/Laptops)';
    case 'web_mobile': return 'Web (Mobile Browsers)';
    case 'ios_app': return 'iOS (iPhone & iPad)';
    case 'android_app': return 'Android (Phones & Tablets)';
    case 'desktop_native': return 'Native Desktop (Windows/Mac)';
    case 'api_microservice': return 'Background Microservices & APIs';
    default: return platformKey;
  }
}

function getCategoryObjectives(type: string) {
  switch (type) {
    case 'app':
      return [
        { title: "Native Mobile Performance", desc: "Deliver smooth 60fps mobile interfaces with instant touch feedback on iOS and Android devices." },
        { title: "High Engagement & Retention", desc: "Utilize push notifications, user account profiles, and tailored onboarding flows to maximize daily active use." },
        { title: "Mobile Money & Secure Payments", desc: "Provide seamless checkout options via MTN MoMo, Telecel Cash, AT Money, and card processing." },
        { title: "Offline Readiness & Reliability", desc: "Ensure persistent local caching so critical workflows remain accessible during connectivity drops." }
      ];
    case 'saas':
      return [
        { title: "Multi-Tenant Workspace Security", desc: "Isolate company workspaces with granular role-based access control (RBAC) for admins, managers, and staff." },
        { title: "Automated Workflows & Billing", desc: "Streamline operations with automated recurring subscriptions, PDF invoicing, and background cron processing." },
        { title: "Actionable Business Analytics", desc: "Provide real-time metric cards, interactive revenue charts, and exportable audit logs for executive decision-making." },
        { title: "API Microservice Connectivity", desc: "Build REST API endpoints and outbound webhooks to enable effortless ecosystem integration." }
      ];
    case 'ecommerce':
      return [
        { title: "High-Converting Storefront", desc: "Deliver lightning-fast product search, category filters, multi-variant catalogs, and express checkout." },
        { title: "Omnichannel Payment Acceptance", desc: "Accept Paystack, Flutterwave, Mobile Money, and card payments with instant digital order confirmation." },
        { title: "Automated Inventory & Orders", desc: "Automate stock tracking, low-inventory notifications, order fulfillment statuses, and courier delivery fee calculations." },
        { title: "Customer Retention & Growth", desc: "Drive repeat sales with promotional discount coupons, referral links, verified customer reviews, and abandoned cart alerts." }
      ];
    case 'ai_api':
      return [
        { title: "Contextual AI Precision", desc: "Deploy custom-trained AI models and RAG knowledge bases tailored specifically to your company knowledge base." },
        { title: "Low-Latency Workflow Automation", desc: "Automate document summarization, email drafting, speech synthesis, and image extraction with streaming responses." },
        { title: "Developer API Gateway", desc: "Provide secure API token key generation, rate-limiting, and detailed token consumption analytics dashboards." },
        { title: "Model Resilience & Fallbacks", desc: "Implement multi-model fallbacks (Gemini / Anthropic / OpenAI) to guarantee 99.9% uptime." }
      ];
    case 'fintech':
      return [
        { title: "Bank-Grade Financial Security", desc: "Implement Ghana Card KYC verification, encrypted wallet ledgers, and 2FA SMS OTP authentication." },
        { title: "Instant Mobile Money Settlement", desc: "Direct integration with MTN, Telecel, and AT MoMo APIs for instant transfers, cashouts, and QR payments." },
        { title: "Microfinance & Vault Engine", desc: "Manage savings vaults, automated interest calculations, loan scoring, and repayment schedules." },
        { title: "Automated Ledger Reconciliation", desc: "Continuous automated matching of wallet transactions against bank clearing logs with printable PDF statements." }
      ];
    case 'management_systems':
      return [
        { title: "Centralized Operational Database", desc: "Manage student, patient, or employee records, contact profiles, and historical logs in a unified cloud database." },
        { title: "Automated Attendance & Scheduling", desc: "Track daily attendance via QR codes or biometrics, alongside automated timetable and appointment scheduling." },
        { title: "Integrated Fee & Billing Engine", desc: "Automate tuition/medical billing, cashier receipts, financial reporting, and parent/patient self-service portals." },
        { title: "Multi-Branch & Audit Controls", desc: "Enable multi-campus oversight with automated daily backups and complete administrative security audit trails." }
      ];
    default:
      return [
        { title: "Polished Brand Presentation", desc: "Showcase business offerings with elegant display typography, high-converting hero layouts, and mobile responsiveness." },
        { title: "Direct Lead & Customer Capture", desc: "Capture client inquiries instantly via custom contact forms, WhatsApp quick chat, and newsletter subscriptions." },
        { title: "Content Management Capability", desc: "Empower team admins to easily publish blogs, news updates, portfolio items, and testimonials." },
        { title: "SEO & Search Engine Indexing", desc: "Optimize site speed, metadata, and sitemaps for high ranking on Google Search and social media sharing." }
      ];
  }
}

function getCategoryFlow(type: string) {
  switch (type) {
    case 'app':
      return [
        { step: "1", role: "App User", action: "Downloads mobile app from App Store/Google Play and signs up via Phone OTP or Social Auth." },
        { step: "2", role: "Mobile Platform", action: "Grants biometric/location permissions and initializes personal user profile and wallet." },
        { step: "3", role: "Primary User", action: "Performs core mobile actions (browses catalog, initiates MoMo payment, sends messages, or captures photo)." },
        { step: "4", role: "Backend System", action: "Processes request, dispatches instant push notification alerts, and syncs cloud database." },
        { step: "5", role: "Admin Portal", action: "Oversees active mobile sessions, reviews user submissions, and monitors app analytics." }
      ];
    case 'saas':
      return [
        { step: "1", role: "Workspace Admin", action: "Registers company account, chooses subscription plan, and configures organization settings." },
        { step: "2", role: "Team Leads", action: "Sends email invitations to onboard staff members with specific role permissions (RBAC)." },
        { step: "3", role: "Staff / Clients", action: "Logs into tenant portal, accesses interactive dashboards, and executes automated tasks." },
        { step: "4", role: "SaaS Engine", action: "Executes background cron processing, generates PDF/Excel reports, and triggers webhooks." },
        { step: "5", role: "Super Admin", action: "Monitors overall subscription ARR, system health metrics, and security audit logs." }
      ];
    case 'ecommerce':
      return [
        { step: "1", role: "Customer", action: "Browses store catalog, filters by category/price, and adds items to shopping cart." },
        { step: "2", role: "Buyer", action: "Proceeds to checkout, applies promo code, and pays via Mobile Money or Paystack card gateway." },
        { step: "3", role: "Store System", action: "Verifies payment, decrements product stock, and generates automated email/WhatsApp order receipt." },
        { step: "4", role: "Vendor / Logistics", action: "Receives order alert, prepares package, and updates live order delivery tracking status." },
        { step: "5", role: "Store Admin", action: "Reviews daily sales revenue dashboard, manages product inventory, and exports order lists." }
      ];
    case 'ai_api':
      return [
        { step: "1", role: "Client Developer", action: "Generates secure API key and configures model parameters in administrative console." },
        { step: "2", role: "System / User", action: "Submits text, document PDF, audio, or image payload to the AI endpoint." },
        { step: "3", role: "AI Pipeline", action: "Retrieves context from RAG knowledge base and executes Gemini model inference." },
        { step: "4", role: "API Gateway", action: "Streams structured response back, logs token consumption, and enforces rate limits." },
        { step: "5", role: "Platform Admin", action: "Reviews AI query accuracy metrics, token usage costs, and automated fallback logs." }
      ];
    case 'fintech':
      return [
        { step: "1", role: "Wallet Owner", action: "Onboards onto platform and completes Ghana Card KYC identity verification." },
        { step: "2", role: "User", action: "Deposits funds into digital wallet via MTN MoMo or links bank card." },
        { step: "3", role: "Account Holder", action: "Executes P2P money transfer, locks funds into savings vault, or pays merchant QR code." },
        { step: "4", role: "Fintech Core", action: "Validates 2FA SMS OTP, executes ledger debit/credit, and sends instant transaction receipt." },
        { step: "5", role: "Compliance Officer", action: "Reviews automated daily reconciliation logs, fraud risk flags, and official audit statements." }
      ];
    case 'management_systems':
      return [
        { step: "1", role: "System Admin", action: "Sets up academic/medical branch parameters, fee structures, and staff accounts." },
        { step: "2", role: "Staff / Cashier", action: "Enrolls student/patient profiles, marks daily QR attendance, and issues fee invoices." },
        { step: "3", role: "Parent / Patient", action: "Logs into self-service portal to review academic gradebooks, medical charts, or pay bills." },
        { step: "4", role: "System Engine", action: "Generates official report cards / lab certificates, sends SMS alerts, and logs cashier ledger." },
        { step: "5", role: "Management", action: "Analyzes multi-branch performance dashboards, inventory levels, and financial reports." }
      ];
    default:
      return [
        { step: "1", role: "Site Administrator", action: "Configures brand identity, updates service pages, and publishes company news." },
        { step: "2", role: "Website Visitor", action: "Arrives on homepage, explores brand offerings, portfolio items, and client reviews." },
        { step: "3", role: "Potential Client", action: "Fills out project inquiry form or initiates instant WhatsApp quick chat." },
        { step: "4", role: "KiyuHub Lead Engine", action: "Delivers immediate email notification to engineering and logs inquiry in database." },
        { step: "5", role: "Sales Team", action: "Reviews incoming client brief, schedules discovery call, and sends project proposal." }
      ];
  }
}

export function generateKiyuHubProjectBreakdownPDF(
  data: FormData, 
  _clientLogoDataUrl?: string,
  options?: PdfThemeOptions
): { doc: jsPDF; pdfBlob: Blob } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const branding = getStoredBrandingSettings();
  const primaryHex = options?.primaryColorHex || branding.primaryColorHex;
  const accentHex = options?.accentColorHex || branding.accentColorHex;
  const customAgencyLogo = options?.agencyLogoDataUrl || branding.agencyLogoDataUrl;

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174mm

  // Dynamic colors or defaults matching official KiyuHub PDF template
  const COLOR_NAVY = hexToRgb(primaryHex, [27, 42, 74]);      // #1b2a4a Primary
  const COLOR_GOLD = hexToRgb(accentHex, [184, 146, 82]);     // #b89252 Accent
  const COLOR_TEXT = [15, 23, 42];      // #0f172a Dark Slate
  const COLOR_MUTED = [71, 85, 105];    // #475569 Slate Muted

  const largeLogoUrl = customAgencyLogo || getKiyuHubLogoDataUrl(400, 160);

  // Utility to add header and footer on content pages
  const addHeaderAndFooter = (pageNum: number) => {
    // Header (skip on page 1 cover)
    if (pageNum > 1) {
      doc.setFont("times", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
      doc.text("KIYUHUB — Empowering Breakthroughs", margin, 14);

      // Subtle header separator line
      doc.setDrawColor(220, 225, 230);
      doc.setLineWidth(0.3);
      doc.line(margin, 17, pageWidth - margin, 17);
    }

    // Footer on every page
    doc.setFont("times", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 130, 140);
    doc.text("KIYUHUB — Empowering Breakthroughs", margin, pageHeight - 12);
  };

  let y = 0;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 22) {
      doc.addPage();
      y = 28; // Space below header
    }
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Center Main Agency Logo in the middle of cover page (positioned close above heading)
  if (largeLogoUrl) {
    doc.addImage(largeLogoUrl, 'PNG', (pageWidth - 110) / 2, 94, 110, 44);
  }

  // Big Project Title
  y = 146;
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  const titleText = (data.projectTitle || "SOFTWARE PROJECT").toUpperCase();
  const titleLines = doc.splitTextToSize(titleText, contentWidth - 10);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });

  y += titleLines.length * 9.5 + 2;

  // Subtitle
  doc.setFont("times", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(COLOR_GOLD[0], COLOR_GOLD[1], COLOR_GOLD[2]);
  doc.text("OFFICIAL PROJECT BREAKDOWN & SPECIFICATION", pageWidth / 2, y, { align: "center" });

  y += 12;

  // Gold Center Line
  doc.setDrawColor(COLOR_GOLD[0], COLOR_GOLD[1], COLOR_GOLD[2]);
  doc.setLineWidth(0.7);
  doc.line((pageWidth - 60) / 2, y, (pageWidth + 60) / 2, y);

  y += 12;

  // Prepared For & Date Info
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  const clientName = data.fullName ? data.fullName.toUpperCase() : "VALUED CLIENT";
  doc.text(`PREPARED FOR: ${clientName}`, pageWidth / 2, y, { align: "center" });

  y += 6;

  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text(`${getProjectTypeLabel(data.projectType)}  •  ${formatDate(new Date())}`, pageWidth / 2, y, { align: "center" });

  // Add Page 1 footer
  addHeaderAndFooter(1);

  // ==========================================
  // PAGE 2: PROJECT BREAKDOWN & DETAILS
  // ==========================================
  doc.addPage();
  y = 24;

  // Main Document Header Title
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.setTextColor(COLOR_GOLD[0], COLOR_GOLD[1], COLOR_GOLD[2]);
  doc.text("PROJECT BREAKDOWN", margin, y);
  y += 4;

  // Gold Divider Line
  doc.setDrawColor(COLOR_GOLD[0], COLOR_GOLD[1], COLOR_GOLD[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Metadata Block
  const addMetadataLine = (label: string, val: string) => {
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
    doc.text(label, margin, y);

    doc.setFont("times", "normal");
    doc.setTextColor(50, 60, 75);
    doc.text(val, margin + 35, y);
    y += 8;
  };

  const formattedCategory = (data.subCategory === 'other' ? data.subCategoryOther : data.subCategory) || data.projectType;
  addMetadataLine("Prepared For:", data.fullName || "Valued Client");
  addMetadataLine("Project:", `${data.projectTitle} - ${formattedCategory}`);
  addMetadataLine("Document:", "Project Breakdown");
  y += 4;

  // Section Helper
  const addSectionHeader = (numAndTitle: string) => {
    checkPageBreak(18);
    y += 2;
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
    doc.text(numAndTitle, margin, y);
    y += 3;

    doc.setDrawColor(COLOR_GOLD[0], COLOR_GOLD[1], COLOR_GOLD[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
  };

  // ==========================================
  // 1. EXECUTIVE OVERVIEW
  // ==========================================
  addSectionHeader("1. EXECUTIVE OVERVIEW");

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);

  const formattedProjectType = getProjectTypeLabel(data.projectType);
  const formattedSubCat = (data.subCategory === 'other' ? data.subCategoryOther : data.subCategory) || 'Custom Specification';
  const formattedPlatforms = data.targetPlatforms && data.targetPlatforms.length > 0 
    ? data.targetPlatforms.map(p => getPlatformLabel(p)).join(', ') 
    : 'Web & Mobile';
  
  const featureListText = data.selectedFeatures && data.selectedFeatures.length > 0
    ? data.selectedFeatures.map(f => getFeatureLabel(f, data.projectType)).join(', ')
    : 'Standard functional capabilities';

  const overviewPara1 = `${data.projectTitle} is a custom ${formattedProjectType} (${formattedSubCat}) engineered specifically for ${data.companyName ? `${data.companyName} (${data.fullName})` : data.fullName}. Architected for deployment across ${formattedPlatforms}, the solution addresses core operational objectives through modern software workflows.`;
  
  const overviewPara2 = `Project Vision & Scope: "${data.projectDescription}"`;

  const overviewPara3 = `To execute this brief, the solution incorporates ${data.selectedFeatures?.length || 0} core functional modules—including ${featureListText}. Development is targeted within the ${data.budget} ${data.currency} budget bracket with delivery scheduled for ${data.launchDate}.`;

  const lines1 = doc.splitTextToSize(overviewPara1, contentWidth);
  checkPageBreak(lines1.length * 5);
  doc.text(lines1, margin, y);
  y += lines1.length * 5 + 4;

  const lines2 = doc.splitTextToSize(overviewPara2, contentWidth);
  checkPageBreak(lines2.length * 5);
  doc.setFont("times", "italic");
  doc.text(lines2, margin, y);
  doc.setFont("times", "normal");
  y += lines2.length * 5 + 4;

  const lines3 = doc.splitTextToSize(overviewPara3, contentWidth);
  checkPageBreak(lines3.length * 5);
  doc.text(lines3, margin, y);
  y += lines3.length * 5 + 8;

  // ==========================================
  // 2. CORE OBJECTIVES
  // ==========================================
  addSectionHeader("2. CORE OBJECTIVES");

  const objectives = getCategoryObjectives(data.projectType);

  objectives.forEach(obj => {
    checkPageBreak(12);
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
    
    // Bullet point
    doc.text("•  " + obj.title + ":", margin, y);
    
    doc.setFont("times", "normal");
    doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);

    const descLines = doc.splitTextToSize(obj.desc, contentWidth - 6);
    doc.text(descLines, margin + 4, y + 4.5);
    y += descLines.length * 4.5 + 6;
  });

  // ==========================================
  // 3. KEY FEATURES & HOW IT WORKS
  // ==========================================
  addSectionHeader("3. KEY FEATURES & HOW IT WORKS");

  const addSubsectionTitle = (subTitle: string) => {
    checkPageBreak(10);
    doc.setFont("times", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(COLOR_GOLD[0], COLOR_GOLD[1], COLOR_GOLD[2]);
    doc.text(subTitle, margin, y);
    y += 6;
  };

  const addFeatureBullet = (boldTitle: string, description: string) => {
    checkPageBreak(12);
    doc.setFont("times", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
    doc.text(`•  ${boldTitle}: `, margin + 3, y);

    const labelWidth = doc.getTextWidth(`•  ${boldTitle}: `);
    doc.setFont("times", "normal");
    const descLines = doc.splitTextToSize(description, contentWidth - labelWidth - 3);
    
    if (descLines.length === 1) {
      doc.text(descLines[0], margin + 3 + labelWidth, y);
      y += 5.5;
    } else {
      doc.text(descLines, margin + 8, y + 4.5);
      y += descLines.length * 4.5 + 3;
    }
  };

  if (data.selectedFeatures && data.selectedFeatures.length > 0) {
    addSubsectionTitle("A. Selected Core Features");
    data.selectedFeatures.forEach(featId => {
      const label = getFeatureLabel(featId, data.projectType);
      const desc = getFeatureDescription(featId, data.projectType);
      addFeatureBullet(label, desc);
    });
  } else {
    addSubsectionTitle("A. Core System Features");
    addFeatureBullet("Custom Dashboard & Controls", "Centralized administrative interface tailored to client specifications.");
  }

  if (data.customFeatures && data.customFeatures.trim().length > 0) {
    addSubsectionTitle("B. Custom Requirements & Special Ideas");
    addFeatureBullet("Client Custom Specification", data.customFeatures);
  }

  addSubsectionTitle("C. Target Delivery Channels & Integrations");
  addFeatureBullet("Multi-Platform Availability", `Engineered for ${formattedPlatforms}.`);
  addFeatureBullet("Third-Party Integrations", data.thirdPartyIntegrations || "Integrated with Mobile Money (MTN, Telecel, AT), payment gateways, SMS/email services, and cloud storage.");

  // ==========================================
  // 4. STEP-BY-STEP FLOW
  // ==========================================
  addSectionHeader("4. STEP-BY-STEP FLOW");

  // Table setup
  checkPageBreak(45);
  const colWidths = [18, 42, 114];
  const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1]];

  // Table Header
  doc.setFillColor(COLOR_NAVY[0], COLOR_NAVY[1], COLOR_NAVY[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Step", colX[0] + 3, y + 5);
  doc.text("Role", colX[1] + 3, y + 5);
  doc.text("Action", colX[2] + 3, y + 5);

  y += 7;

  const flowSteps = getCategoryFlow(data.projectType);

  flowSteps.forEach((row, idx) => {
    const actionLines = doc.splitTextToSize(row.action, colWidths[2] - 6);
    const rowHeight = Math.max(7, actionLines.length * 4.5 + 3);

    checkPageBreak(rowHeight);

    // Zebra background
    if (idx % 2 === 1) {
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    doc.setFont("times", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);

    doc.text(row.step, colX[0] + 5, y + 4.5);
    doc.text(row.role, colX[1] + 3, y + 4.5);
    doc.text(actionLines, colX[2] + 3, y + 4.5);

    y += rowHeight;
  });

  y += 6;

  // ==========================================
  // 5. TECHNICAL OVERVIEW
  // ==========================================
  addSectionHeader("5. TECHNICAL OVERVIEW");

  const getFrontendTech = (type: string) => {
    if (type === 'app') return "Mobile App: React Native / Flutter cross-platform architecture with native iOS & Android build outputs.";
    return "Web Application: Modern React / Next.js with TypeScript, Tailwind CSS, and mobile-first responsive viewports.";
  };

  addFeatureBullet("Client Interface", getFrontendTech(data.projectType));
  addFeatureBullet("Backend & Database", `Serverless / Node.js cloud microservices with secure database storage (${data.databasePreference || 'PostgreSQL / Firestore'}) and cached session management.`);
  addFeatureBullet("APIs & Communication", "RESTful / GraphQL APIs with real-time webhooks for Mobile Money (MoMo), SMS broadcasting, and email alerts.");
  addFeatureBullet("Security & Compliance", "Role-based access control (RBAC), SSL data encryption in transit & at rest, and automated audit logs.");

  // ==========================================
  // 6. BUSINESS BENEFITS & COMMERCIALS
  // ==========================================
  addSectionHeader("6. BUSINESS BENEFITS & COMMERCIALS");

  addFeatureBullet("Target Budget Bracket", `${data.budget} ${data.currency} (Milestone-based delivery plan).`);
  addFeatureBullet("Target Launch Timeline", `${data.launchDate} (Fast-tracked engineering roadmap).`);
  addFeatureBullet("Design & Content Strategy", `${data.contentProvider}.`);
  addFeatureBullet("Maintenance SLA Warranty", `${data.maintenanceNeeded || 'Standard 30-Day Post-Launch Bug Warranty Included'}.`);
  if (data.additionalInfo) {
    addFeatureBullet("Additional Client Notes", data.additionalInfo);
  }

  // ==========================================
  // SIGN-OFF / SIGNATURE BLOCK
  // ==========================================
  checkPageBreak(35);
  y += 10;

  doc.setFont("times", "bolditalic");
  doc.setFontSize(10.5);
  doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
  doc.text("Prepared By: Kiyuhub Team", margin, y);
  y += 6;

  doc.setFont("times", "bolditalic");
  doc.text(`Date: ${formatDate(new Date())}`, margin, y);
  y += 10;

  doc.setFont("times", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(COLOR_MUTED[0], COLOR_MUTED[1], COLOR_MUTED[2]);
  doc.text("Email: kiyuhubofficial@gmail.com", margin, y);
  y += 5.5;
  doc.text("Phone: 054 417 4341 / 024 126 9458", margin, y);

  // Add header & footer to all generated pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderAndFooter(i);
  }

  const pdfBlob = doc.output('blob');
  return { doc, pdfBlob };
}

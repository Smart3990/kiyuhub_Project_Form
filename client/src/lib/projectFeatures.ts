export interface FeatureOption {
  id: string;
  label: string;
  description: string;
}

export const PROJECT_FEATURES: Record<string, FeatureOption[]> = {
  website: [
    { id: 'hero_showcase', label: 'High-Converting Hero & Brand Showcase', description: 'Visually striking homepage with clear call-to-actions, brand story, and business value proposition.' },
    { id: 'whatsapp_chat', label: 'WhatsApp Instant Chat & Quick Contact', description: 'Direct WhatsApp click-to-chat button allowing visitors to message engineering/sales instantly.' },
    { id: 'cms_blog', label: 'Admin Blog & News Management System', description: 'Easy admin control panel to publish company news, blogs, press releases, and articles.' },
    { id: 'seo_google', label: 'SEO Optimization & Google Search Setup', description: 'Search engine optimization, meta tags, sitemaps, and Google Search Console indexing.' },
    { id: 'portfolio_gallery', label: 'Portfolio & Media Photo Gallery', description: 'Interactive media grid showcasing past projects, products, images, and client case studies.' },
    { id: 'booking_appointments', label: 'Online Appointment & Consultation Booking', description: 'Interactive calendar widget for clients to schedule meetings, calls, or service appointments.' },
    { id: 'contact_lead_forms', label: 'Customer Lead Capture & Inquiry Forms', description: 'Custom inquiry forms with automated email notifications sent straight to your management inbox.' },
    { id: 'testimonials_reviews', label: 'Client Testimonials & Review Carousel', description: 'Social proof carousel displaying client feedback, ratings, and video/text testimonials.' },
    { id: 'google_maps', label: 'Interactive Office Locator & Directions', description: 'Embedded Google Maps showing office locations, branch addresses, and turn-by-turn directions.' },
    { id: 'newsletter_sub', label: 'Newsletter Signup & Subscriber List', description: 'Lead generation form to capture visitor emails into an organized mailing list database.' },
    { id: 'multi_lang', label: 'Multi-Language Translation Switcher', description: 'Language selector allowing visitors to switch site content between English, French, and local dialects.' },
    { id: 'social_feed', label: 'Instagram / Social Media Live Feed', description: 'Live automated feed displaying your latest Instagram photos and social media posts.' },
  ],
  app: [
    { id: 'user_auth', label: 'User Signup, Login & Social Auth', description: 'Secure account creation via email, phone OTP, Google, Apple ID, and social accounts.' },
    { id: 'push_notifications', label: 'Push Notifications & In-App Alerts', description: 'Instant push messages to re-engage users, announce updates, and deliver transactional alerts.' },
    { id: 'momo_payments', label: 'Mobile Money (MoMo) & In-App Payments', description: 'Integrated MTN MoMo, Telecel Cash, AT Money, and Visa/Mastercard payment checkout.' },
    { id: 'gps_tracking', label: 'GPS Navigation, Maps & Location Services', description: 'Real-time GPS tracking, geofencing, route mapping, and nearby place locator.' },
    { id: 'inapp_chat', label: 'In-App Live Chat & User Messaging', description: 'Real-time direct and group messaging with media attachments and read receipts.' },
    { id: 'camera_upload', label: 'Camera, Photo Gallery & Document Scanner', description: 'Native device camera integration for snapping photos, scanning documents, and uploading files.' },
    { id: 'offline_mode', label: 'Offline Data Storage & Auto-Syncing', description: 'Local database caching enabling app usability without internet, auto-syncing when back online.' },
    { id: 'biometric_login', label: 'Face ID & Fingerprint Biometric Login', description: 'Fast, bank-grade biometric authentication using device Face ID or Touch ID sensors.' },
    { id: 'dark_mode', label: 'Custom Themes & Dark Mode', description: 'Sleek dark mode toggle and theme customization for optimal low-light user comfort.' },
    { id: 'user_profiles', label: 'User Profiles & Account Customization', description: 'Personalized user profile pages, avatar uploads, preferences, and account settings.' },
    { id: 'audio_video', label: 'Audio / Video Media Streaming Player', description: 'Integrated media player for streaming video tutorials, music, podcasts, or live broadcasts.' },
    { id: 'ratings_reviews', label: 'In-App Rating & Customer Feedback', description: 'In-app review prompts and feedback modal to collect app store ratings and customer ideas.' },
  ],
  saas: [
    { id: 'tenant_accounts', label: 'Multi-Tenant Company Workspaces', description: 'Isolated company spaces allowing organizations to manage their own team members and data.' },
    { id: 'rbac_permissions', label: 'Role-Based Access Control (RBAC)', description: 'Granular permissions for Super Admin, Organization Admins, Managers, Staff, and Clients.' },
    { id: 'analytics_charts', label: 'Interactive Analytics Dashboard & Charts', description: 'Visual metric cards, revenue graphs, active user counts, and performance reports.' },
    { id: 'billing_subscriptions', label: 'Automated Subscriptions & Invoicing', description: 'Tiered subscription plans, automated monthly/yearly billing, and PDF invoice generation.' },
    { id: 'automation_workflows', label: 'Automated Business Workflows & Triggers', description: 'Custom event triggers, automated email follow-ups, and background task automation.' },
    { id: 'export_reports', label: 'PDF / Excel / CSV Data Export & Audit Logs', description: 'One-click data export into formatted PDF reports, Excel spreadsheets, and CSV logs.' },
    { id: 'api_webhooks', label: 'REST API Access & Webhook Integrations', description: 'Developer API endpoints and outbound webhooks to connect with third-party software.' },
    { id: 'team_invites', label: 'Team Member Invitations & Shared Folders', description: 'Email invitations allowing team leads to onboard staff with custom workspace roles.' },
    { id: 'file_versioning', label: 'Cloud Document Storage & File Uploads', description: 'Secure cloud storage bucket for storing documents, receipts, contracts, and media.' },
    { id: 'email_sms_alerts', label: 'Automated Email & SMS Alerts', description: 'Instant notification delivery via SMS and email when critical system events occur.' },
    { id: 'activity_logs', label: 'User Activity History & Security Audit Logs', description: 'Full history of user logins, edits, data changes, and system administrative actions.' },
    { id: 'client_portal', label: 'White-Label Client Portal Customization', description: 'Custom domain mapping, company logo uploads, and brand color theme selection.' },
  ],
  ecommerce: [
    { id: 'product_catalog', label: 'Product Catalog, Categories & Variants', description: 'Organized product listings with filterable categories, size/color variants, and search.' },
    { id: 'express_checkout', label: 'Shopping Cart & Express Mobile Checkout', description: 'Frictionless slide-out shopping cart with fast 1-click checkout for web and mobile.' },
    { id: 'payment_gateways', label: 'Paystack, Flutterwave & Mobile Money Checkout', description: 'Instant checkout supporting MTN MoMo, Telecel, AT Money, Visa, Mastercard, and Apple Pay.' },
    { id: 'order_tracking', label: 'Live Order Tracking & Delivery Statuses', description: 'Real-time order timeline (Processing, Dispatched, Out for Delivery, Delivered).' },
    { id: 'inventory_alerts', label: 'Inventory Management & Low-Stock Alerts', description: 'Automatic stock tracking with admin warnings when inventory drops below threshold.' },
    { id: 'coupons_discounts', label: 'Promo Coupons, Discount Codes & Referrals', description: 'Custom percentage/flat discount codes, seasonal sales, and customer referral links.' },
    { id: 'multi_currency', label: 'Multi-Currency Conversion (GHS, USD, NGN)', description: 'Real-time currency switcher allowing buyers to view prices and pay in their local currency.' },
    { id: 'product_reviews', label: 'Customer Reviews, Ratings & Photo Feedback', description: 'Verified buyer reviews with star ratings, text comments, and customer photo uploads.' },
    { id: 'wishlist_abandoned', label: 'Wishlists & Abandoned Cart Recovery', description: 'Saved favorite items list and automated email/WhatsApp reminders for abandoned carts.' },
    { id: 'vendor_marketplace', label: 'Multi-Seller / Vendor Portal', description: 'Vendor dashboard allowing independent sellers to list products and manage orders.' },
    { id: 'automated_receipts', label: 'Automated Email & WhatsApp Receipts', description: 'Instant order confirmation receipts delivered directly to buyer email and WhatsApp.' },
    { id: 'delivery_calc', label: 'Automated Shipping & Delivery Cost Calculator', description: 'Dynamic delivery fee calculation based on buyer region, city, or distance.' },
  ],
  ai_api: [
    { id: 'ai_chatbot', label: 'Intelligent AI Customer Support Chatbot', description: 'Context-aware AI conversational agent trained to handle customer questions 24/7.' },
    { id: 'doc_summarization', label: 'Document Summarization & Data Extractor', description: 'AI document reader that extracts key facts, summaries, and structured JSON from PDFs.' },
    { id: 'rag_knowledgebase', label: 'Custom AI Knowledge Base (RAG System)', description: 'Custom retrieval-augmented system trained on your business manuals, FAQs, and docs.' },
    { id: 'speech_voice', label: 'Voice / Speech-to-Text & Text-to-Speech', description: 'Audio processing engine converting spoken voice into text and generating natural speech.' },
    { id: 'smart_email', label: 'Automated Email Drafting & Response Agent', description: 'AI assistant that analyzes incoming customer emails and drafts contextually accurate replies.' },
    { id: 'ocr_vision', label: 'Computer Vision, OCR & Image Analysis', description: 'Image analysis model capable of reading Ghana Cards, receipts, labels, and photos.' },
    { id: 'api_developer_keys', label: 'API Gateway, Rate Limiting & Developer Keys', description: 'Developer portal to generate API keys, manage rate limits, and monitor endpoint calls.' },
    { id: 'scheduled_jobs', label: 'Background Scheduled Processing Jobs', description: 'Automated background cron processing for batch AI tasks, data syncs, and digests.' },
    { id: 'sentiment_classifier', label: 'Customer Feedback & Sentiment Classifier', description: 'Natural language classifier categorizing customer feedback into positive, neutral, or negative.' },
    { id: 'realtime_streaming', label: 'Real-Time Streaming AI Responses', description: 'Lightning-fast token-by-token streaming responses for conversational AI interfaces.' },
    { id: 'token_analytics', label: 'Token Usage & AI Analytics Dashboard', description: 'Dashboard tracking token consumption, model response times, and monthly AI cost breakdown.' },
    { id: 'multi_model', label: 'Multi-Model Fallback & AI Routing', description: 'Smart router choosing between Gemini, Claude, and OpenAI depending on query complexity.' },
  ],
  fintech: [
    { id: 'momo_integration', label: 'MTN, Telecel & AT Mobile Money Direct API', description: 'Direct API connection for initiating MoMo debits, payouts, and instant webhooks.' },
    { id: 'p2p_wallet', label: 'Peer-to-Peer (P2P) Money Transfers & Digital Wallet', description: 'Virtual wallet system enabling users to hold balances and transfer money instantly to peers.' },
    { id: 'savings_vaults', label: 'Automated Savings Vaults & Interest Calculator', description: 'Fixed and flexible savings goals with automated daily/weekly deposits and interest yield.' },
    { id: 'kyc_verification', label: 'Ghana Card & Biometric KYC Verification', description: 'Automated identity verification validating Ghana Card numbers and facial selfies.' },
    { id: 'transaction_history', label: 'Transaction History, Receipts & PDF Statements', description: 'Detailed account ledger with printable monthly PDF statements and transaction filters.' },
    { id: 'fraud_alerts', label: 'Fraud Detection & Suspicious Activity Alerts', description: 'Real-time rule engine detecting unusual transaction sizes, velocity, or unknown locations.' },
    { id: 'micro_loans', label: 'Micro-Loan Disbursement & Repayment Engine', description: 'Automated credit scoring, loan application approval, interest calculator, and repayment schedules.' },
    { id: 'multi_currency_wallet', label: 'Multi-Currency Wallet (GHS, USD, EUR, NGN)', description: 'Multi-currency account holding with instant foreign exchange rate calculations.' },
    { id: 'sms_otp', label: 'Instant SMS OTP & Two-Factor Authentication', description: 'Mandatory 2FA security sending 6-digit SMS OTP codes before approving financial transactions.' },
    { id: 'qr_merchant', label: 'Merchant QR Code & Custom Payment Links', description: 'Printable QR codes and shareable payment web links for merchants to collect customer payments.' },
    { id: 'auto_reconciliation', label: 'Automated Ledger Reconciliation & Bank Sync', description: 'Daily automatic matching of wallet balances with bank account statements and clearing logs.' },
    { id: 'card_tokenization', label: 'Card Tokenization & Recurring Auto-Debit', description: 'PCI-DSS compliant card saving for hassle-free 1-click purchases and auto-renewals.' },
  ],
  management_systems: [
    { id: 'records_database', label: 'Central Student / Patient / Staff Database', description: 'Centralized database holding profiles, contact information, emergency details, and histories.' },
    { id: 'attendance_schedules', label: 'Attendance Tracking, Timetables & Schedules', description: 'Daily attendance marking with biometric/QR support, timetables, and room schedules.' },
    { id: 'gradebook_emr', label: 'Student Gradebook / Electronic Medical Records', description: 'Comprehensive records management for academic grades, report cards, or patient clinical charts.' },
    { id: 'fee_billing', label: 'Automated Fee Invoicing, Billing & Cashier Receipts', description: 'Automated fee collection, printable cashier receipts, payment tracking, and ledger entries.' },
    { id: 'portal_selfservice', label: 'Parent / Patient / Staff Self-Service Portal', description: 'Dedicated logins for parents to check grades/bills, or patients to view appointment results.' },
    { id: 'sms_broadcast', label: 'Mass SMS & Email Announcements & Alerts', description: 'One-click mass broadcasting of school reopening, clinic reminders, or emergency alerts.' },
    { id: 'inventory_assets', label: 'Pharmacy / Equipment / Asset Inventory Tracking', description: 'Real-time tracking of medical drugs, school textbooks, office computers, and maintenance logs.' },
    { id: 'lab_certificates', label: 'Prescription, Result & Certificate Generator', description: 'Automated PDF generator for official report cards, lab test results, and graduation certificates.' },
    { id: 'payroll_leave', label: 'Staff Payroll, Leave Requests & HR Management', description: 'HR module for salary calculations, payslip generation, tax deductions, and leave approvals.' },
    { id: 'idcard_qr', label: 'Custom ID Card & Barcode / QR Code Scanner', description: 'ID card template designer with printable QR codes for gate access and attendance scanning.' },
    { id: 'multi_branch', label: 'Multi-Branch / Multi-Campus Dashboard', description: 'Centralized executive view allowing administrators to manage multiple school or clinic branches.' },
    { id: 'audit_backups', label: 'Automated Cloud Backups & Access Security Audit', description: 'Scheduled cloud database backups and security logs tracking every record modification.' },
  ],
};

export const DEFAULT_PLATFORMS_BY_TYPE: Record<string, string[]> = {
  website: ['web_desktop', 'web_mobile'],
  app: ['ios_app', 'android_app'],
  saas: ['web_desktop', 'web_mobile'],
  ecommerce: ['web_desktop', 'web_mobile'],
  ai_api: ['web_desktop', 'api_microservice'],
  fintech: ['web_mobile', 'ios_app', 'android_app'],
  management_systems: ['web_desktop', 'web_mobile'],
};

export function getFeaturesForProjectType(projectType: string): FeatureOption[] {
  return PROJECT_FEATURES[projectType] || PROJECT_FEATURES.website;
}

export function getFeatureLabel(featureId: string, projectType?: string): string {
  // Search in specified project type first
  if (projectType && PROJECT_FEATURES[projectType]) {
    const match = PROJECT_FEATURES[projectType].find(f => f.id === featureId);
    if (match) return match.label;
  }
  
  // Search all categories
  for (const cat of Object.keys(PROJECT_FEATURES)) {
    const match = PROJECT_FEATURES[cat].find(f => f.id === featureId);
    if (match) return match.label;
  }

  // Fallback: convert snake_case to Title Case
  return featureId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function getFeatureDescription(featureId: string, projectType?: string): string {
  if (projectType && PROJECT_FEATURES[projectType]) {
    const match = PROJECT_FEATURES[projectType].find(f => f.id === featureId);
    if (match) return match.description;
  }

  for (const cat of Object.keys(PROJECT_FEATURES)) {
    const match = PROJECT_FEATURES[cat].find(f => f.id === featureId);
    if (match) return match.description;
  }

  return 'Custom software feature engineered to meet specific operational requirements.';
}

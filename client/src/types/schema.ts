import { z } from 'zod';

export const step1Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(8, "Phone number is required"),
  whatsappNumber: z.string().min(8, "WhatsApp number is required"),
  companyName: z.string().optional(),
  roleOrTitle: z.string().optional(),
  projectTitle: z.string().min(2, "Project name is required"),
});

export const step2Schema = z.object({
  projectType: z.enum(['website', 'app', 'saas', 'ecommerce', 'ai_api', 'fintech', 'management_systems'] as const),
});

export const projectSpecSchema = z.object({
  subCategory: z.string().min(1, "Please select a category detail"),
  subCategoryOther: z.string().optional(),
  projectDescription: z.string().min(10, "Please describe the project vision and goals"),
  targetAudience: z.string().optional(),
  targetPlatforms: z.array(z.string()).min(1, "Select at least one target platform"),
  selectedFeatures: z.array(z.string()).optional(),
  customFeatures: z.string().optional(),
  databasePreference: z.string().optional(),
  thirdPartyIntegrations: z.string().optional(),
  inspirationLinks: z.string().optional(),
});

export const step4Schema = z.object({
  budget: z.string().min(1, "Please select an estimated budget range"),
  currency: z.string().default('GHS'),
  launchDate: z.string().min(1, "Please select target launch timeline"),
  contentProvider: z.string().min(1, "Please select asset & content availability"),
  maintenanceNeeded: z.string().optional(),
  logoFile: z.any().optional(),
  assetsFile: z.any().optional(),
  additionalInfo: z.string().optional(),
});

export const step5Schema = z.object({
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the brief submission terms"),
});

// Combined schema
const baseSchema = step1Schema
  .merge(step2Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(projectSpecSchema.partial());

export const formSchema = baseSchema.superRefine((data, ctx) => {
  if (!data.projectType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a project type",
      path: ['projectType'],
    });
    return;
  }

  if (data.projectDescription && data.projectDescription.length < 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Project description must be at least 10 characters long",
      path: ['projectDescription'],
    });
  }

  if (data.subCategory === 'other' && !data.subCategoryOther) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify your custom category",
      path: ['subCategoryOther'],
    });
  }
});

export type FormData = z.infer<typeof baseSchema>;




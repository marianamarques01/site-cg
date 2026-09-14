export type ContentStatus = "draft" | "pending" | "published" | "rejected";

export type DbMedia = {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export type DbPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  published_at: string | null;
  excerpt: string;
  tone: string;
  body: string[];
  cover_image_id: string | null;
  status: ContentStatus;
  created_at?: string;
  updated_at?: string;
};

export type DbProject = {
  id: string;
  slug: string;
  title: string;
  student: string;
  category: string;
  year: number;
  tone: string;
  aspect: string;
  description: string;
  cover_image_id: string | null;
  featured: boolean;
  featured_order: number | null;
  status: ContentStatus;
  student_email?: string | null;
  student_course?: string | null;
  external_url?: string | null;
  submitted_at?: string | null;
  rejection_reason?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type DbGame = {
  id: string;
  slug: string;
  title: string;
  team: string;
  genre: string;
  platform: string;
  year: number;
  tone: string;
  description: string;
  cover_image_id: string | null;
  status: ContentStatus;
  student_email?: string | null;
  student_course?: string | null;
  external_url?: string | null;
  submitted_at?: string | null;
  rejection_reason?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type DbCourse = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  modules: string[];
  faq: { question: string; answer: string }[];
  updated_at?: string;
};

export type DbFaqItem = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at?: string;
};

export type DbHeroCategory = {
  id: string;
  label: string;
  href: string;
  tone: string;
  aspect: string;
  image_url: string | null;
  sort_order: number;
  layout: Record<string, unknown>;
  updated_at?: string;
};

export type DbSiteSettings = {
  id: number;
  contact_email: string | null;
  contact_address: string | null;
  social_links: Record<string, string>;
  marquee_items: { label: string; href: string }[];
  cta_title: string | null;
  cta_description: string | null;
  updated_at?: string;
};

export type DbProfile = {
  id: string;
  email: string | null;
  role: "admin" | "editor";
};

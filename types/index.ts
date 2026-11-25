export type ProjectStatus =
  | 'Client project'
  | 'In development'
  | 'Live application'
  | 'Live demo'
  | 'Local application'
  | 'Prototype'
  | 'Design concept'
  | 'Educational project';

/** Filter groups used by the Selected Work gallery. A project can belong to several. */
export type ProjectFilter = 'client' | '3d' | 'fullstack-ai';

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  title: string;
  /** Alternative or native-language name, e.g. the Arabic wordmark. */
  aka?: string;
  slug: string;
  /** One-line hook used in the gallery. */
  tagline?: string;
  description: string;
  category: string;
  technologies: string[];
  image: string;
  behance_url?: string;
  /** The interactive demo or application. */
  live_url?: string;
  /** 'website' labels the live link “Open live website” instead of “Open live demo”. */
  live_kind?: 'demo' | 'website';
  /** A separate public marketing site, when it differs from the demo. */
  website_url?: string;
  /** Paid work for a real client (shown with a Client Work badge). */
  client?: boolean;
  github_url?: string;
  /** Shown instead of a repository button when the source is private. */
  source_note?: string;
  display_order: number;
  featured?: boolean;
  filters?: ProjectFilter[];
  /** Per-project tint used for small accents and the 3D filaments. */
  accent?: string;
  role?: string;
  status?: ProjectStatus;
  status_note?: string;
  purpose?: string;
  features?: string[];
  architecture?: string;
  challenges?: { title: string; solution: string }[];
  gallery?: ProjectImage[];
  image_note?: string;
}

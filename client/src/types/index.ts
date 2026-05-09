export interface BusinessFormData {
  businessName: string;
  category: string;
  location: string;
  description: string;
  targetAudience: string;
}

export interface Keywords {
  high_intent: string[];
  informational: string[];
}

export interface GenerationOutputs {
  keywords: Keywords;
  gmbPost: string;
  seoDescription: string;
}

export interface Project {
  id: number;
  businessName: string;
  category: string;
  location: string;
  description: string;
  targetAudience: string;
  createdAt: string;
  outputs: GenerationOutputs | null;
}

export interface GenerateResponse {
  success: boolean;
  project: Project;
  outputs: GenerationOutputs;
}

export interface HistoryResponse {
  success: boolean;
  data: Project[];
  count: number;
}

export type GenerationStep = 'idle' | 'keywords' | 'gmb' | 'description' | 'done' | 'error';

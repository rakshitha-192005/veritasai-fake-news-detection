export interface HighlightToken {
  token: string;
  score: number;
  type: 'real' | 'fake' | 'misleading' | 'neutral';
}

export interface FactCheckItem {
  claim: string;
  claimant?: string;
  rating: string;
  url: string;
  publisher: string;
  verified_date?: string;
}

export interface SimilarNews {
  title: string;
  source: string;
  url: string;
  verdict: string;
  similarity_score: number;
}

export interface EmotionScores {
  joy: number;
  anger: number;
  fear: number;
  sadness: number;
  surprise: number;
}

export interface PredictionResponse {
  id: string;
  title?: string;
  content_snippet: string;
  input_type: string;
  verdict: 'Real' | 'Fake' | 'Misleading' | 'Satire' | 'Clickbait' | 'Partially True';
  confidence_score: number;
  risk_score: number;
  credibility_grade: string;
  explanation: string;
  key_findings: string[];
  recommendations: string[];
  clickbait_score: number;
  hate_speech_score: number;
  propaganda_score: number;
  political_bias: string;
  political_bias_score: number;
  sentiment: string;
  emotions: EmotionScores;
  topics: string[];
  keywords: string[];
  entities: Array<{ text: string; label: string }>;
  lime_highlights: HighlightToken[];
  attention_weights: Array<{ index: number; token: string; attention_weight: number }>;
  class_probabilities: Record<string, number>;
  fact_checks: FactCheckItem[];
  similar_news: SimilarNews[];
  created_at: string;
  is_bookmarked?: boolean;
  language: string;
}

export interface AnalyticsData {
  total_analyzed: number;
  real_count: number;
  fake_count: number;
  misleading_count: number;
  clickbait_count: number;
  real_vs_fake_ratio: number;
  average_confidence: number;
  average_risk: number;
  most_common_topics: string[];
  country_wise_fake_news: Array<{ country: string; code: string; count: number; risk: string }>;
  weekly_trends: Array<{ day: string; real: number; fake: number; misleading: number }>;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: bool;
}

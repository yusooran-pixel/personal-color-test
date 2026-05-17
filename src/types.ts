export interface RecommendedColor {
  name: string;
  hex: string;
  reason: string;
}

export interface MakeupRecommendations {
  lip: string[];
  blush: string[];
  eyeshadow: string[];
}

export interface AnalysisData {
  disclaimer: string;
  summary: string;
  tone_direction: "warm" | "cool" | "neutral";
  season_type: string;
  sub_type: string;
  confidence: number;
  analysis: {
    skin_tone: string;
    brightness: string;
    saturation: string;
    contrast: string;
    overall_impression: string;
  };
  recommended_colors: RecommendedColor[];
  avoid_colors: RecommendedColor[];
  makeup_recommendations: MakeupRecommendations;
  hair_recommendations: string[];
  fashion_recommendations: string[];
  style_tip: string;
  photo_quality_note: string;
}

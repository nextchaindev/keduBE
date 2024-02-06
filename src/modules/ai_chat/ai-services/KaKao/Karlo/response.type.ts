export interface KarloResponse {
  id: string;
  model_version: string;
  images: Image[];
}

export interface Image {
  id: string;
  image: string;
  seed: number;
  nsfw_content_detected: null;
  nsfw_score: null;
}

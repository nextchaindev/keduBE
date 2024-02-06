export type SentimentAnalysisResponse = {
  document_score: {
    score: number;
    pos_score: number;
    neg_score: number;
  };
  sentence_score: {
    sentence: string;
    score: number;
  }[];
  target_score: {
    [key: string]: number;
  };
};

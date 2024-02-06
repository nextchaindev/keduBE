export type KeywordExtractionResponse = {
  sentences: {
    sentence: string;
    keywords: {
      word: string;
      freq: number;
    }[];
  }[];
};

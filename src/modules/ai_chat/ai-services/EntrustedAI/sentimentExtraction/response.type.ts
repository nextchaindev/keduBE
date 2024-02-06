export type SentimentExtractionResponse = {
  data: [
    {
      text: string;
      category: string;
      start_offset: number;
      end_offset: number;
    },
  ][];
};

export type ProfanityExtractionResponse = {
  data: [
    {
      text: string;
      category: string;
      start_offset: number;
      end_offset: number;
    },
  ][];
};

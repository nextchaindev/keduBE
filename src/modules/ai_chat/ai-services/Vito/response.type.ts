export type VitoResponse = {
  id: string;
  status: string;
  results: {
    utterances: {
      start_at: number;
      words: {
        start_at: number;
        duration: number;
        text: string;
      }[];
    }[];
    verified: boolean;
  };
};

export type VitoUploadResponse = {
  id: string;
};

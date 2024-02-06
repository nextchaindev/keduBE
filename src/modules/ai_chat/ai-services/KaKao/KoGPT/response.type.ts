type Generations = {
  text: string;
  tokens: number;
};

export type KoGPTResponse = {
  id: string;
  generations: Generations[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
    generated_tokens: number;
  };
};

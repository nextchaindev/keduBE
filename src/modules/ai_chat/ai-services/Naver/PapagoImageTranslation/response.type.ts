export interface PapagoImageToImage {
  data: Data;
}

export interface Data {
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  targetText: string;
  blocks: Block[];
  renderedImage: string;
}

export interface Block {
  sourceLang: string;
  sourceText: string;
  targetText: string;
  lines: Line[];
  LB: LB;
  LT: LB;
  RB: LB;
  RT: LB;
}

export interface LB {
  x: number;
  y: number;
}

export interface Line {
  LB: LB;
  LT: LB;
  RB: LB;
  RT: LB;
  words?: Line[];
  sourceText?: string;
}

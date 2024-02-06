export type ObjectDetectionResponse = {
  data: {
    class: string;
    confidence: string;
    x: string;
    y: string;
    width: string;
    height: string;
  }[];
};

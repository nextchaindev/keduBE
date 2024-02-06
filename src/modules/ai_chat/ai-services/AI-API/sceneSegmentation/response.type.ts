export type SceneSegmentStatusResponse = {
  result: {
    num: number;
    time: number[];
    frame: number[];
    code: number;
    msg: string;
  }[];
};

export type SceneSegmentUploadResponse = {
  request_id: string;
  result: number;
  return_type: string;
  return_object: {
    file_id: string;
  };
};

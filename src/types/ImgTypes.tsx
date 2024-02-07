export type ImgType = {
  img_id: number;
  img_url: string;
  thumbnail_url: string;
};

type newImgDefaultType = {
  imgStatus: "new";
  index: number;
};

type existingImgDefaultType = {
  imgStatus: "existing";
  img_id: number;
};

export type ImgDefaultType = newImgDefaultType | existingImgDefaultType;

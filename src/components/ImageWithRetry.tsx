import { useEffect, useState } from "react";

type ImageWithRetryType = {
  src: string;
  alt: string;
};

const MAX_IMAGE_RETRIES = 2;

function ImageWithRetry({ alt, src }: ImageWithRetryType) {
  const [fetchCounter, setFetchCounter] = useState(0);

  console.log(fetchCounter);

  return (
    <img
      className="h-full w-full object-cover"
      src={src}
      alt={alt}
      onError={() => {
        if (fetchCounter < MAX_IMAGE_RETRIES) {
          console.log("fails, retrying");
          setFetchCounter((prev) => prev + 1);
        }
      }}
    />
  );
}

export default ImageWithRetry;

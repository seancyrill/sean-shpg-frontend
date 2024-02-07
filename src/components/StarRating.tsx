import React from "react";
import { ReactSVG } from "react-svg";

type StarRatingType = {
  rating_score: number;
  setRating_score?: React.Dispatch<React.SetStateAction<number>>;
};

function StarRating({ rating_score, setRating_score }: StarRatingType) {
  const stars = [
    { score: 1 },
    { score: 2 },
    { score: 3 },
    { score: 4 },
    { score: 5 },
  ];

  function handleScoreDisplay(score: number) {
    if (setRating_score === undefined) return;

    setRating_score(score);
  }

  return (
    <div className="flex items-center">
      {stars.map(({ score }, i) => {
        return (
          <ReactSVG
            src={
              rating_score < score - 0.5
                ? "/svg/icon-star-empty.svg"
                : "/svg/icon-star-full.svg"
            }
            onClick={() => handleScoreDisplay(score)}
            className="-mx-[2px] cursor-pointer fill-Orange hover:brightness-150 hover:saturate-50"
            key={i}
          />
        );
      })}
    </div>
  );
}

export default StarRating;

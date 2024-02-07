import { useEffect, useState } from "react";
import { RatingType } from "../UserInfo/RatingForm";
import RatingBubble from "./RatingBubble";
import { ReactSVG } from "react-svg";
import LoadingSpinner from "../LoadingSpinner";
import { useAuthContext } from "../../context/AuthContext";
import { isAxiosError } from "axios";

type RatingsSectionType = {
  latestReviews: RatingType[] | null;
  ratingTally: number[] | null;
  item_id: number;
};

function RatingsSection({
  latestReviews,
  ratingTally,
  item_id,
}: RatingsSectionType) {
  const { basicReq, setFetchErrModal } = useAuthContext();
  const [filterBy, setFilterBy] = useState(0);
  const [reviews, setReviews] = useState(latestReviews);
  const total_count = ratingTally?.length || 0;
  const ratingSpread = [5, 4, 3, 2, 1];

  const [loading, setLoading] = useState(false);
  const [percentages, setPercentages] = useState(
    Array(ratingSpread.length).fill(0)
  );

  function backToLatestReviews() {
    setFilterBy(0);
    setReviews(latestReviews);
  }

  async function getItemSpecificRating(rating_score: number) {
    setLoading(true);
    try {
      const response = await basicReq.get(`/ratings`, {
        params: {
          item_id,
          rating_score,
        },
      });
      setFilterBy(rating_score);
      setReviews(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.config?.signal?.aborted) return;
        console.error(error.response?.data);
      } else {
        console.error(error);
      }
      setFetchErrModal(true);
    } finally {
      setLoading(false);
    }
  }

  // Calculate percentages initially
  useEffect(() => {
    const calculatePercentages = () => {
      if (!ratingTally) return;
      const newPercentages = ratingSpread.map((rating) => {
        const ratingCount =
          ratingTally.filter((num) => num === rating).length || 0;
        return (ratingCount / total_count) * 100 || 0;
      });
      setPercentages(newPercentages);
    };

    calculatePercentages();
  }, [ratingTally, total_count]);

  return (
    <section
      className="m-1 flex min-w-[320px] flex-col items-center overflow-hidden rounded-lg border bg-White shadow-lg md:m-2 md:items-stretch"
      id="ratingsSection"
    >
      <div className="flex flex-col justify-between gap-4 border-b-2 border-Very-dark-blue p-2 md:flex-row md:p-4">
        <div className="flex flex-1 flex-col justify-between">
          <h1 className="mx-auto text-2xl font-semibold md:mx-0">
            Product Reviews
          </h1>
          <div className="flex flex-col gap-2 md:flex-row">
            <h3 className="mx-auto w-fit bg-Green bg-opacity-20 px-4 py-2 text-Green md:mx-0">
              {`Showing ${filterBy ? `${filterBy} STAR` : "LATEST"} reviews`}
            </h3>
            <button
              className="secondary-button m-auto w-fit text-White md:m-0"
              onClick={(e) => (e.preventDefault(), backToLatestReviews())}
            >
              Reset
            </button>
          </div>
        </div>

        <ul>
          {
            //rating tally buttons
            ratingSpread.map((rating, i) => {
              return (
                <li
                  key={i}
                  className="smooth-animation hover:sclae-110 flex cursor-pointer items-center gap-2 text-Dark-grayish-blue hover:text-Orange hover:brightness-105"
                  onClick={() =>
                    percentages[i] !== 0 && getItemSpecificRating(rating)
                  }
                >
                  <p className="w-3 text-center">{rating}</p>
                  <ReactSVG
                    src="/svg/icon-star-full.svg"
                    className="fill-Orange"
                  />
                  <div className="flex h-3 w-[100px] overflow-hidden border bg-Light-grayish-blue">
                    <span
                      className={`h-full border-r bg-Orange`}
                      style={{ width: `${percentages[i]}%` }}
                    />
                  </div>
                  <p>{`${percentages[i].toFixed()}%`}</p>
                </li>
              );
            })
          }
        </ul>
      </div>

      <div className="grid-auto-lg mx-1 my-2 grid gap-1 border bg-Light-grayish-blue p-2 shadow-inner">
        {reviews && reviews.length ? (
          <>
            {reviews?.map((rating, i) => (
              <RatingBubble rating={rating} key={i} />
            ))}
          </>
        ) : (
          <div className="border bg-White p-6 text-center text-Grayish-blue">
            This item does not have reviews yet
          </div>
        )}
      </div>

      <LoadingSpinner loading={loading} />
    </section>
  );
}

export default RatingsSection;

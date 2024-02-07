import { useAuthContext } from "../../context/AuthContext";
import StarRating from "../StarRating";
import logo from "/images/icon-logo.png";
import { RatingType } from "../UserInfo/RatingForm";

type RatingBubbleType = {
  rating: RatingType;
};

function RatingBubble({ rating }: RatingBubbleType) {
  const { user_id } = useAuthContext();
  const {
    rating_score,
    rating_summary,
    rating_comment,
    user_id: rater_id,
    username: rater_name,
    thumbnail_url,
  } = rating;

  return (
    <div className="flex w-full min-w-[300px] flex-col items-center justify-center border bg-White shadow-sm">
      <div className="flex w-full items-center gap-4 p-4">
        <StarRating rating_score={rating_score} />
        {user_id === rater_id ? (
          <p className="text-sm text-Grayish-blue">This is your review</p>
        ) : (
          <div className="flex items-center gap-1 text-sm text-Grayish-blue">
            <p>{`by `}</p>
            <img src={thumbnail_url || logo} className="h-6 w-6 rounded-full" />
            <span className="font-bold text-Dark-grayish-blue">
              {rater_name}
            </span>
          </div>
        )}
      </div>

      <h1 className="w-full border-y px-3 py-1 font-bold">{rating_summary}</h1>
      <p className="w-full p-2">{rating_comment}</p>
    </div>
  );
}

export default RatingBubble;

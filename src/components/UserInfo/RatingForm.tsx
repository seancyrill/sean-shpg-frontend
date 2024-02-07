import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { isAxiosError } from "axios";
import LoadingSpinner from "../LoadingSpinner";
import useRefreshPage from "../../hooks/useRefreshPage";
import StarRating from "../StarRating";

export type RatingType = {
  rating_id: number;
  item_id: number;
  user_id: number;
  username: string;
  thumbnail_url: string | null;
  rating_score: number;
  rating_summary: string;
  rating_comment: string;
};

type RatingFormType = {
  item_id: number;
};

function RatingForm({ item_id }: RatingFormType) {
  const { setFetchErrModal, user_id, privateReq } = useAuthContext();
  const { refreshPage } = useRefreshPage();
  const [rating_score, setRating_score] = useState(0);
  const [rating_summary, setRating_summary] = useState("");
  const [rating_comment, setRating_comment] = useState("");
  const [loading, setLoading] = useState(false);

  const disableSubmit =
    !rating_score || !rating_summary.length || !rating_comment.length;

  async function handleSubmit() {
    const newRating = { rating_score, rating_summary, rating_comment };
    setLoading(true);
    let success = false;
    try {
      await privateReq.post(`/ratings`, {
        newRating,
        user_id,
        item_id,
      });
      success = true;
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
      success && refreshPage();
    }
  }

  return (
    <form
      onSubmit={(e) => (e.preventDefault(), handleSubmit())}
      className="flex w-full flex-col items-center justify-center gap-4 border bg-White p-4 shadow-sm md:h-full md:w-fit"
    >
      <StarRating
        rating_score={rating_score}
        setRating_score={setRating_score}
      />

      <input
        type="text"
        placeholder="Summary"
        className="input-field w-full"
        value={rating_summary}
        onChange={(e) => setRating_summary(e.target.value.slice(0, 29))}
      />
      <textarea
        maxLength={250}
        placeholder="Comment"
        className="input-field h-32 w-full"
        value={rating_comment}
        onChange={(e) => setRating_comment(e.target.value)}
      />

      <button
        type="submit"
        disabled={disableSubmit}
        className="primary-button w-full disabled:blur disabled:saturate-0"
      >
        Submit
      </button>

      <LoadingSpinner loading={loading} />
    </form>
  );
}

export default RatingForm;

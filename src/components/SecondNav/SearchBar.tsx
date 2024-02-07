import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";

function SearchBar() {
  const [searchParams, setSearchParams] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    navigate(`/search/${searchParams}`);
    setSearchParams("");
  }

  return (
    <form className="input-field flex flex-1 items-center justify-between overflow-hidden rounded-lg p-0">
      <input
        type="text"
        className="flex-1 px-2 py-1"
        placeholder="Search in Shopping"
        value={searchParams}
        onChange={(e) => setSearchParams(e.target.value)}
      />
      <button
        type="submit"
        className="smooth-animation bg-Very-dark-blue px-2 py-1 hover:bg-Orange"
        disabled={!searchParams.length}
        onClick={(e) => (e.preventDefault(), handleSearch())}
      >
        <ReactSVG
          src="/svg/icon-search.svg"
          className="smooth-animation fill-Grayish-blue hover:fill-Black"
        />
      </button>
    </form>
  );
}

export default SearchBar;

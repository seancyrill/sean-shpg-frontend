import { useParams } from "react-router-dom";
import Browsing from "../components/Browsing";
import { useEffect, useState } from "react";

function SearchPage() {
  const { searchQuery } = useParams();
  const [filter, setFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    setFilter(searchQuery);
  }, [searchQuery]);

  return (
    <>
      {filter && (
        <section className="m-2 flex flex-1 flex-col rounded-lg border bg-White">
          <div className="flex gap-2 border-b px-4 py-2">
            <p className="text-Dark-grayish-blue">Showing results for:</p>
            <p className="text-bold font-bold uppercase text-Orange">
              {filter}
            </p>
          </div>

          <div className="m-2 border shadow-inner">
            <Browsing filter={filter} />
          </div>
        </section>
      )}
    </>
  );
}

export default SearchPage;

import { Link } from "react-router-dom";

type ItemTagsType = {
  item_tags: string[];
};

function ItemTags({ item_tags }: ItemTagsType) {
  return (
    <div className="flex items-center gap-2 text-Grayish-blue">
      <h1>In </h1>
      <div className="flex flex-wrap gap-2">
        {item_tags.map((tag, i) => (
          <Link
            to={`/search/${tag}`}
            key={i}
            className="soomth-animation w-fit border border-Grayish-blue px-2 py-1 hover:border-Orange hover:text-Orange"
          >
            <p>{tag}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ItemTags;

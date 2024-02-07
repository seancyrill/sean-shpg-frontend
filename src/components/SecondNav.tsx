import CartButton from "./SecondNav/CartButton";
import SearchBar from "./SecondNav/SearchBar";

function SecondNav() {
  return (
    <aside className="sticky top-[100px] z-[998] flex items-center justify-between gap-6 bg-White px-3 py-2 shadow-sm">
      <SearchBar />
      <CartButton />
    </aside>
  );
}

export default SecondNav;

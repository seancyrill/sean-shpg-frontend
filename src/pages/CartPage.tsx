import CartCheckOutBtn from "../components/Cart/CartCheckOutBtn";
import CartTable from "../components/Cart/CartTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { useShoppingCart } from "../context/ShoppingCartContext";

function CartPage() {
  const { cart, cartLoading } = useShoppingCart();

  return (
    <>
      <LoadingSpinner loading={cartLoading} />
      <section className="rounded-sm bg-White shadow-md">
        <div className="flex items-center justify-between border-b p-2  md:flex-row md:p-6">
          <h1 className="px-2 text-2xl font-bold">Cart</h1>
          <CartCheckOutBtn />
        </div>

        <CartTable items={cart} />
      </section>
    </>
  );
}

export default CartPage;

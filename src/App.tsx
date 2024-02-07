import { Route, Routes } from "react-router-dom";
import PageLayout from "./layouts/PageLayout";
import ItemPage from "./pages/ItemPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import NewShop from "./pages/UserControls/NewShop";
import Home from "./pages/Home";
import UserControls from "./pages/UserControls";
import UserInfo from "./pages/UserControls/UserInfo";
import CartPage from "./pages/CartPage";
import NewItem from "./pages/UserControls/UserShop/NewItem";
import ShopPage from "./pages/ShopPage";
import CheckOut from "./pages/CheckOut";
import EditItem from "./pages/UserControls/UserShop/EditItem";
import UserShop from "./pages/UserControls/UserShop";
import Error404 from "./pages/Error404";
import ShopDetails from "./pages/UserControls/UserShop/ShopDetails";
import Profile from "./pages/UserControls/UserInfo/Profile";
import ChangePassword from "./pages/UserControls/UserInfo/ChangePassword";
import Addresses from "./pages/UserControls/UserInfo/Addresses";
import Orders from "./pages/UserControls/UserInfo/Orders";
import RegistrarLayout from "./layouts/RegistrarLayout";
import ItemPromo from "./pages/UserControls/UserShop/ItemPromo";
import ShopSettings from "./pages/UserControls/UserShop/ShopSettings";
import SearchPage from "./pages/SearchPage";
import Ratings from "./pages/UserControls/UserInfo/Ratings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="/controls" element={<UserControls />}>
          <Route path="/controls/user" element={<UserInfo />}>
            <Route index element={<Profile />} />
            <Route path="/controls/user/address" element={<Addresses />} />
            <Route path="/controls/user/orders" element={<Orders />} />
            <Route
              path="/controls/user/ratings/:order_id"
              element={<Ratings />}
            />
            <Route path="/controls/user/change" element={<ChangePassword />} />
          </Route>
          <Route path="/controls/shop" element={<UserShop />}>
            <Route index element={<ShopDetails />} />
            <Route path="/controls/shop/settings" element={<ShopSettings />} />
            <Route path="/controls/shop/newitem" element={<NewItem />} />
            <Route path="/controls/shop/edititem/:id" element={<EditItem />} />
            <Route path="/controls/shop/newpromo/:id" element={<ItemPromo />} />
          </Route>
          <Route path="/controls/newshop" element={<NewShop />} />
        </Route>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search/:searchQuery" element={<SearchPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/shop/:id" element={<ShopPage />} />
        <Route path="/About" element={<About />} />
      </Route>
      <Route path="/registrar" element={<RegistrarLayout />}>
        <Route path="/registrar/checkout" element={<CheckOut />} />
        <Route path="/registrar/login" element={<Login />} />
        <Route path="/registrar/register" element={<Signup />} />
      </Route>
      <Route path="/*" element={<Error404 />} />
    </Routes>
  );
}

export default App;

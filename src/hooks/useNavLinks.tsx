import { useAuthContext } from "../context/AuthContext";

export type linksType = {
  linkHeader: "Pages" | "Categories" | "Your Account" | "Your Shop";
  links: {
    name: string;
    to: string;
  }[];
}[];

function useNavLinks() {
  const { token, shop_id } = useAuthContext();

  const baseLinks: linksType = [
    {
      linkHeader: "Pages",
      links: [
        {
          name: "Home",
          to: "/",
        },
        {
          name: token ? "Account settings" : "Sign up",
          to: token ? "/controls/user" : "registrar/register",
        },
        {
          name: shop_id ? "Shop settings" : "Start selling",
          to: shop_id ? "/controls/shop" : "/controls/newshop",
        },
        {
          name: "Cart",
          to: "/cart",
        },
      ],
    },
    {
      linkHeader: "Categories",
      links: [
        {
          name: "Men",
          to: "/search/men",
        },
        {
          name: "Women",
          to: "/search/women",
        },
      ],
    },
  ];

  const accountLinks: linksType = token
    ? [
        {
          linkHeader: "Your Account",
          links: [
            {
              name: "Profile",
              to: "/controls/user",
            },
            {
              name: "Address",
              to: "/controls/user/address",
            },
            {
              name: "Orders",
              to: "/controls/user/orders",
            },
            {
              name: "Change Password",
              to: "/controls/user/change",
            },
          ],
        },
      ]
    : [];

  const shopLinks: linksType = shop_id
    ? [
        {
          linkHeader: "Your Shop",
          links: [
            {
              name: "Manage Shop",
              to: "/controls/shop",
            },
            {
              name: "Public Shop Profile",
              to: `/shop/${shop_id}`,
            },
            {
              name: "Add new item",
              to: "/controls/shop/newitem",
            },
          ],
        },
      ]
    : [];

  const links = [...baseLinks, ...accountLinks, ...shopLinks];

  return { links };
}

export default useNavLinks;

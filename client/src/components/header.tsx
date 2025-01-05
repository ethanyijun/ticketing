import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Header = ({ currentUser }: any) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  console.log(cartItems.length);
  const links = [
    !currentUser && { label: "Sign Up", link: "/auth/signup" },
    !currentUser && { label: "Sign In", link: "/auth/signin" },
    currentUser && { label: "Sell tickets", link: "/tickets/new" },
    currentUser && { label: "My orders", link: "/orders" },
    currentUser && { label: "Sign Out", link: "/auth/signout" },
  ]
    .filter((item) => item)
    .map((item, key) => (
      <div key={key}>
        <Link className="navbar-brand text-white" href={item.link}>
          {item.label}
        </Link>
      </div>
    ));
  const cartLink = (
    <div>
      <Link className="navbar-brand text-white" href="/cart">
        Cart{" "}
        <span className="inline-flex items-center justify-center w-6 h-6 bg-white text-blue-500 rounded-full font-bold text-sm">
          {cartItems.length}
        </span>
      </Link>
    </div>
  );
  links.push(cartLink);

  return (
    <nav className="bg-blue-500 p-4">
      <div className="flex flex-row justify-between">
        <Link className="text-white font-semibold text-xl" href="/">
          Ticketing
        </Link>
        <div className="flex flex-row space-x-4">{links}</div>
      </div>
    </nav>
  );
};

export default Header;

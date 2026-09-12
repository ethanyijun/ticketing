"use client";

import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface HeaderProps {
  currentUser?: { email?: string; role?: string } | null;
}

interface NavLink {
  label: string;
  link: string;
}

const Header = ({ currentUser }: HeaderProps) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const links: NavLink[] = [
    !currentUser && { label: "Sign Up", link: "/auth/signup" },
    !currentUser && { label: "Sign In", link: "/auth/signin" },
    currentUser && { label: "Sell tickets", link: "/tickets/new" },
    currentUser && { label: "My orders", link: "/orders" },
    currentUser && { label: "Sign Out", link: "/auth/signout" },
  ].filter((item): item is NavLink => Boolean(item)); // 👈 key type guard

  const cartLink: NavLink = {
    label: "Cart",
    link: "/cart",
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="flex flex-row justify-between items-center">
        <Link className="text-white font-semibold text-xl" href="/">
          Ticketing
        </Link>
        <div className="flex flex-row space-x-4">
          {links.map((item) => (
            <div key={item.link}>
              <Link className="navbar-brand text-white" href={item.link}>
                {item.label}
              </Link>
            </div>
          ))}

          {/* Cart */}
          <div key="cart">
            <Link className="navbar-brand text-white" href={cartLink.link}>
              {cartLink.label}
              <span className="inline-flex items-center justify-center w-6 h-6 bg-white text-blue-500 rounded-full font-bold text-sm ml-1">
                {cartItems.length}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

import Link from "next/link";
import React from "react";

const Header = ({ currentUser }: any) => {
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

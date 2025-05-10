import React from "react";
import { useUser } from "../context/UserContext";
import SellerNavbar from "./SellerNavbar";
import AdminNavbar from "./AdminNavbar";
import CustomerNavbar from "./CustomerNavbar";

const Navbar = () => {
  const { user } = useUser();

  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminNavbar />;
    case "seller":
      return <SellerNavbar />;
    case "customer":
      return <CustomerNavbar />;
    default:
      return null;
  }
};

export default Navbar;

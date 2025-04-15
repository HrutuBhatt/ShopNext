import React from 'react';
import { Link } from 'react-router-dom';
// import './navbar.css'; // Optional: Add your CSS file for styling

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">ShopNext</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/contact">Login</Link>
                </li>
                <li>
                    <Link to="/contact">Signup</Link>
                </li>
                <li>
                    <Link to="/products">Products</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
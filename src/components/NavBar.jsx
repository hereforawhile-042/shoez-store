import { NavLink } from "react-router";
import { useState } from "react";
import { RxHeart, RxPerson, RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { IoCartOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { CartContext } from "@/context/Contexts";
import { AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";

import { motion } from "framer-motion";

const BorderedButton = ({ children, onClick, className }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`relative transition-all duration-250 cursor-pointer p-2 h-11 w-11 flex items-center justify-center rounded-full border-white bg-neutral-800 ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, setIsCartOpen } = useContext(CartContext);

  const handleNavClick = (path) => {
    setOpen(false);
    navigate(path);
  };

  const closeMobileMenu = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="flex items-center p-2 justify-center bg-black">
        <span className="text-white text-xs tracking-widest">
          Flagship sales at 50% discount{" "}
          <span className="text-transparent bg-gradient-to-tr from-neutral-100 via-neutral-50 to-neutral-400 bg-clip-text border-b-1 underline pb-1">
            SignUp Now
          </span>
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="relative p-4 md:p-6 md:px-12 flex items-center justify-between bg-white shadow-sm z-40">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl md:text-3xl font-extrabold uppercase text-black z-50"
        >
          Shoez<span className="text-red-600">.</span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-12">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-black relative font-medium transition-colors ${
                isActive
                  ? "before:w-full before:bg-black before:h-[1.5px] before:-bottom-1 before:absolute"
                  : "hover:text-blue-600"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `text-black relative font-medium transition-colors ${
                isActive
                  ? "before:w-full before:bg-black before:h-[1.5px] before:-bottom-1 before:absolute"
                  : "hover:text-blue-600"
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-black relative font-medium transition-colors ${
                isActive
                  ? "before:w-full before:bg-black before:h-[1.5px] before:-bottom-1 before:absolute"
                  : "hover:text-blue-600"
              }`
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `text-black relative font-medium transition-colors ${
                isActive
                  ? "before:w-full before:bg-black before:h-[1.5px] before:-bottom-1 before:absolute"
                  : "hover:text-blue-600"
              }`
            }
          >
            SignUp
          </NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <SearchBar />

          <section className="flex gap-4">
            <BorderedButton onClick={() => navigate("/favourite")}>
              <RxHeart className="text-white h-5 w-6 hover:text-red-600 hover:fill-red-600" />
            </BorderedButton>
            <BorderedButton
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <AnimatePresence mode="popLayout">
                {cart && cart.length > 0 && (
                  <motion.span
                    key={cart.length}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute flex items-center justify-center p-2.5 text-xs bg-red-500 text-white h-4 w-4 rounded-full -top-0.5 -right-1.5 shadow shadow-black z-50"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </AnimatePresence>
              <IoCartOutline className="text-white h-5 w-6" />
            </BorderedButton>
            <BorderedButton onClick={() => navigate("/profile")}>
              <RxPerson className="text-white h-5 w-6" />
            </BorderedButton>
          </section>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          <SearchBar />

          {/* Mobile Menu Toggle */}
          <Button
            className="relative z-50 bg-black hover:bg-gray-800"
            onClick={() => setOpen(!open)}
            size="icon"
          >
            {open ? <RxCross2 size={20} /> : <RxHamburgerMenu size={20} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <RxCross2 size={20} />
                    </button>
                  </div>

                  {/* Cart Badge */}
                  {cart && cart.length > 0 && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
                      🛒 {cart.length} {cart.length === 1 ? "item" : "items"} in
                      cart
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="flex-1 py-4">
                  <NavLink
                    to="/"
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-6 py-4 text-lg font-medium transition-colors ${
                        isActive
                          ? "bg-gray-100 text-black border-l-4 border-black"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/products"
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-6 py-4 text-lg font-medium transition-colors ${
                        isActive
                          ? "bg-gray-100 text-black border-l-4 border-black"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    Products
                  </NavLink>
                  <NavLink
                    to="/contact"
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-6 py-4 text-lg font-medium transition-colors ${
                        isActive
                          ? "bg-gray-100 text-black border-l-4 border-black"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    Contact
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-6 py-4 text-lg font-medium transition-colors ${
                        isActive
                          ? "bg-gray-100 text-black border-l-4 border-black"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    SignUp
                  </NavLink>
                </div>

                {/* Mobile Action Buttons */}
                <div className="p-6 border-t border-gray-200 space-y-3">
                  <button
                    onClick={() => handleNavClick("/favourite")}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <RxHeart className="h-5 w-5" />
                    <span className="font-medium">Wishlist</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-black text-white hover:bg-gray-800 rounded-xl transition-colors relative"
                  >
                    <IoCartOutline className="h-5 w-5" />
                    <span className="font-medium">Cart</span>
                    {cart && cart.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleNavClick("/profile")}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <RxPerson className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;

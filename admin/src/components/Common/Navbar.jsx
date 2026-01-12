import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Popover, Transition } from "@headlessui/react";
import { navigation } from "../../data/navigationData";
import {
  HiBars3BottomRight,
  HiOutlineShoppingBag,
  HiOutlineUser,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [drawerOpen,setDrawerOpen] = useState(false);
    const toggleCartDrawer = () =>{
        setDrawerOpen(!drawerOpen);
    };
  return (
    <>
      {/* <nav className="relative bg-white"> */}
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-medium">
          Helwa
        </Link>

        {/* DESKTOP NAV */}
        <Popover.Group className="hidden md:flex space-x-6">
          {navigation.categories.map((category) => (
            <Popover key={category.name} className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open
                        ? "text-black border-b-2 border-black "
                        : "text-gray-700 hover:text-black cursor-pointer",
                      "text-sm font-medium uppercase"
                    )}
                  >
                    {category.name}
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Panel className="absolute left-1/2 top-full mt-4 w-[95vw] max-w-7xl -translate-x-1/2 rounded-2xl bg-white shadow-2xl">
                      <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-1 lg:grid-cols-3">
                        {/* LEFT: TEXT SECTIONS */}
                        <div className="lg:col-span-3 grid grid-cols-3 gap-12 lg:grid-cols-3">
                          {category.sections.map((section) => (
                            <div key={section.name}>
                              <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-900">
                                {section.name}
                              </p>
                              <ul className="space-y-3 text-sm">
                                {section.items.map((item) => (
                                  <li key={item.name}>
                                    <Link
                                      to={item.href}
                                      className="text-gray-600 hover:text-black transition"
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* RIGHT: FEATURED IMAGES (FULL VIEW) */}
                        <div className="gap-8 flex flex-row col-span-3">
                          {category.featured.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="group overflow-hidden rounded-2xl border border-gray-200 hover:shadow-xl transition"
                            >
                              {/* IMAGE */}
                              <div className="relative h-64 w-full">
                                <img
                                  src={item.imageSrc}
                                  alt={item.imageAlt}
                                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                                />

                                {/* GRADIENT */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                              </div>

                              {/* TEXT */}
                              <div className="p-5">
                                <p className="text-sm font-semibold text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Shop now →
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          ))}
        </Popover.Group>

        {/* RIGHT ICONS */}
        <div className="flex items-center space-x-4">
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700 " />
          </Link>

          <button onClick={toggleCartDrawer} className="relative hover:text-black cursor-pointer">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 " />
            <span className="absolute -top-1 bg-[#4F3AF6] text-white text-xs rounded-full px-2 py-0.5">
              0
            </span>
          </button>

          <div className="overflow-hidden">
          <SearchBar/>
          </div>

          <button className="md:hidden">
            <HiBars3BottomRight className="w-6 h-6 text-gray-700" />
          </button>

        </div>
      </nav>
        <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>
       {/* </nav> */}
      </>
  );
};

export default Navbar;

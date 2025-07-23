//navbar.js

import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

//import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"
import HighlightText from "../core/HomePage/HighlightText"

// const subLinks = [
//   {
//     title: "Python",
//     link: "/catalog/python",
//   },
//   {
//     title: "javascript",
//     link: "/catalog/javascript",
//   },
//   {
//     title: "web-development",
//     link: "/catalog/web-development",
//   },
//   {
//     title: "Android Development",
//     link: "/catalog/Android Development",
//   },
// ];

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        //console.log("API RESPONSE only res:", res);
        //console.log("API RESPONSE res.data:", res.data);
        setSubLinks(res?.data?.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  console.log("sub links", subLinks)
  console.log("sub links length", subLinks.length)
  console.log("Api calling", categories.CATEGORIES_API)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`sticky top-0 z-[999] flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
    location.pathname !== "/" ? "bg-black" : "bg-richblack-900"
  } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl">
          <HighlightText text={"Civica"} fontSize />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg border-2 border-b-pink-200 bg-black p-4 text-white opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-black"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks?.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50 hover:text-black "
                                key={i}
                              >
                                <p>{subLink.name}</p>
                              </Link>
                            ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-black text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mr-4 md:hidden"
        >
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-14 z-[998] w-full bg-richblack-900 p-4 text-white md:hidden">
            <ul className="flex flex-col gap-4">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <>
                      <button
                        onClick={() => setIsCatalogOpen((prev) => !prev)}
                        className="flex w-full items-center justify-between px-2 py-1 font-semibold"
                      >
                        Catalog
                        <span>{isCatalogOpen ? "▲" : "▼"}</span>
                      </button>

                      {/*  Animated Dropdown Wrapper */}
                      <div
                        className={`ml-4 mt-2 overflow-hidden transition-all duration-500 ease-in-out ${
                          isCatalogOpen
                            ? "max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <ul className="flex flex-col rounded-md border border-richblack-600 bg-richblack-800 p-2">
                          {loading ? (
                            <li className="px-2 py-1 text-sm font-medium">
                              Loading...
                            </li>
                          ) : subLinks.length ? (
                            subLinks.map((subLink, i) => (
                              <li key={i}>
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="block border-b border-yellow-25 px-3 py-4 text-base font-semibold transition-colors duration-200 last:border-b-0 hover:bg-richblack-700 hover:text-yellow-100"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subLink.name}
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li className="px-2 py-2 text-base font-medium">
                              No Courses
                            </li>
                          )}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-1 hover:text-yellow-100"
                    >
                      {link.title}
                    </Link>
                  )}
                </li>
              ))}
              {token === null ? (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-1"
                    >
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-1"
                    >
                      Sign up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/dashboard/my-profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-2 py-1 hover:text-yellow-100"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/logout" // optional: if you handle logout via route or handler
                      onClick={() => {
                        // Add logout handler if needed here
                        setIsMobileMenuOpen(false)
                      }}
                      className="block px-2 py-1 hover:text-pink-100"
                    >
                      Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar

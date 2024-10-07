import { MoonIcon, SunIcon, MenuIcon, XIcon } from "lucide-react"; // Adjust icon imports as needed
import { Button } from "../ui/button"; // Replace with your button component
import { useTheme } from "../ThemeProvider";
import { useState } from "react";
import { Link } from "react-router-dom";

// Props to pass currentPage
const NavBar = ({ currentPage }: { currentPage: string }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Active link styles based on currentPage prop
  const getLinkClass = (page: string) => {
    const baseClass =
      "px-4 py-2 rounded-md transition-all text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium";
    return currentPage === page
      ? `${baseClass} text-indigo-600 dark:text-indigo-400`
      : baseClass;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg mb-8 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Name */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-bold">
                <span className="text-indigo-600 dark:text-indigo-400">
                  {"Next"}
                </span>
                {"Bus"}
              </h1>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:flex space-x-4">
            <Link to="/nextbus" className={getLinkClass("next-bus")}>
              When is my next bus?
            </Link>
            <Link to="/stats" className={getLinkClass("stats")}>
              Insights
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="mr-4 rounded-full"
            >
              {theme === "light" ? (
                <MoonIcon className="h-[1.4rem] w-[1.4rem]" />
              ) : (
                <SunIcon className="h-[1.4rem] w-[1.4rem]" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMenu}
              className="rounded-full"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              ) : (
                <MenuIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
              )}
            </Button>
          </div>

          {/* Theme Switch Button */}
          <div className="hidden sm:flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="mr-4 rounded-full"
            >
              {theme === "light" ? (
                <MoonIcon className="h-[1.4rem] w-[1.4rem]" />
              ) : (
                <SunIcon className="h-[1.4rem] w-[1.4rem]" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Links with Animation */}
      {isMenuOpen && (
        <div className="sm:hidden animate-slide-in-down bg-white dark:bg-gray-800 py-4 px-4">
          <Link
            to="/nextbus"
            className={getLinkClass("next-bus") + " block mb-2"}
          >
            When is my next bus?
          </Link>
          <Link to="/stats" className={getLinkClass("stats") + " block mb-2"}>
            Insights
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

import React from "react";
import { useEffect, useState } from "react";
import { Moon, SunMedium } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

type Theme = "dark" | "light";

const Navbar: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") as Theme | null;
    if (currentTheme) {
      document.documentElement.classList.add(currentTheme);
      setTheme(currentTheme);
    } else {
      localStorage.setItem("theme", "light");
    }

    const applyTheme = (newTheme: Theme) => {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newTheme);
    };

    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <nav className="flex h-14 pl-4 pr-4 w-[98vw] dark:border-b-gray-600 rounded-2xl justify-between items-center f top-2 dark:text-white">
      <Link to={"/"}>
        <div className="flex items-center">
          <span className="h-8 w-8 rounded-b-full bg-black dark:bg-white  text-sm flex justify-center items-center font-semibold text-white dark:text-black ">
            M{"\u266D"}
          </span>

          <h1 className="text-sm dark:text-white  ml-2">M*fia Be@tz</h1>
        </div>
      </Link>

      <div className="flex items-center">
        <div onClick={toggleTheme}>
          {theme === "light" ? <Moon /> : <SunMedium />}
        </div>

        <NavLink to="/Contact" className="flex items-center ml-4">
          contact
        </NavLink>
        {/* <Settings size={24} /> */}
        {/* <h1 className="text-sm ml-2 dark:text-white">Settings</h1> */}
      </div>
    </nav>
  );
};

export default Navbar;

import { useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const DarkMode = () => {
    // Dark Theme == true => Moon Icon
    // const [darkTheme, setDarkTheme] = useState(localStorage.getItem("darkTheme") === "true" ? true : false);
    // const handleTheme = () => {
    //     if (darkTheme == false) {
    //         setDarkTheme(true);
    //     }
    //     else {
    //         setDarkTheme(false);
    //     }
    // };
    // useEffect(() => {
    //     if (darkTheme === true) {
    //         document.documentElement.classList.add('dark');
    //         setDarkTheme(true);
    //         localStorage.setItem('darkTheme', true);
    //     }
    //     else {
    //         document.documentElement.classList.remove('dark');
    //         setDarkTheme(false);
    //         localStorage.setItem('darkTheme', false);
    //     }
    //     console.log("Dark Theme Storage", Boolean(localStorage.getItem("darkTheme")));
    // }, [darkTheme]);

    // return (
    //     <div className="text-black dark:text-white">
    //         <DarkModeSwitch
    //             checked={darkTheme}
    //             sunColor="#f1c40f" moonColor="#4b74fa" size={26} speed={1} className="flex items-center justify-center mt-1 mr-1 cursor-pointer"
    //             onClick={handleTheme}
    //         />
    //     </div>
    // );
};

DarkMode.propTypes = {

};

export default DarkMode;
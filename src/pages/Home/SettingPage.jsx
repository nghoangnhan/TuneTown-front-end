import { useEffect, useState } from 'react';

const SettingPage = () => {
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem("darkTheme") === "true" ? true : false);
    const [volume, setVolume] = useState('medium');

    const handleChange = (event) => {
        setVolume(event.target.value);
    };

    useEffect(() => {
        if (darkTheme === true) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkTheme', true);
        }
        else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkTheme', false);
        }
    }, [darkTheme]);
    return (
        <div className='flex flex-col items-center min-h-screen h-fit bg-backgroundPrimary dark:bg-backgroundDarkPrimary'>
            <h1 className='text-4xl font-bold text-primary dark:text-primaryDarkmode'>
                Setting Page
            </h1>
            {/* Dark Mode  */}
            <div className='flex flex-row items-center gap-6 mt-10'>
                <h2 className="my-3 text-2xl font-bold text-primaryText2 dark:text-primaryTextDark2 ">Dark Mode</h2>
                <div className="flex text-primaryText2 dark:text-primaryTextDark2">
                    <label className="flex items-center gap-2 mr-4">
                        <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={!darkTheme}
                            onChange={() => setDarkTheme(false)}
                            className=""
                        />
                        Light Mode
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={darkTheme}
                            onChange={() => setDarkTheme(true)}
                            className=""
                        />
                        Dark Mode
                    </label>
                </div>
            </div>

            {/* Volume Control */}
            <div className="flex flex-row items-center gap-6 mt-4">
                <h2 className="my-3 text-2xl font-bold text-primaryText2 dark:text-primaryTextDark2 ">Volume Control</h2>
                <div className="">
                    <select
                        value={volume}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                    </select>
                </div>
            </div>

            {/* Language Setting */}
            <div className="flex flex-row items-center gap-6 mt-4">
                <h2 className="my-3 text-2xl font-bold text-primaryText2 dark:text-primaryTextDark2 ">Language Setting</h2>
                <div className="">
                    <select
                        value={volume}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="en">English</option>
                        <option value="vn">Vietnamese</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

SettingPage.propTypes = {

};

export default SettingPage;
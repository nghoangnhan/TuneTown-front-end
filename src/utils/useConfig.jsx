import { io } from "socket.io-client";
import UseCookie from "../hooks/useCookie";
import { useMediaQuery } from 'react-responsive';
import Base_Ava from "../assets/img/logo/logo.png";
import { useEffect, useState } from "react";

const useConfig = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
    const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
    const isLaptop = useMediaQuery({ query: "(max-width: 1024px)" });
    const is24Inch = useMediaQuery({ query: "(max-width: 1920px)" });
    const is27Inch = useMediaQuery({ query: "(max-width: 2560px)" });
    const is30Inch = useMediaQuery({ query: "(max-width: 3840px)" });

    const { getToken } = UseCookie();
    // Link to the backend server
    const Base_URL = "https://tunetown-production.up.railway.app";
    const Base_URL_FE = "http://localhost:5173";
    // const Base_URL = "http://localhost:8080";
    const Base_AVA = Base_Ava
    const default_Img = Base_AVA;
    // token return an object {access_token, refress_Token}

    // Client ID lấy từ google console API (đăng ký project và tạo client ID)
    const cliendId =
        "295516651084-5baqm2houfs6u6voha4a8s66j8ga6fru.apps.googleusercontent.com";

    // Socket.io
    const [socket, setSocket] = useState(null);
    // const socket = io("https://socketserver-v6lc.onrender.com");

    useEffect(() => {
        // const newSocket = io.connect("ws://localhost:3000", {
        const newSocket = io.connect("wss://socketserver-v6lc.onrender.com", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1500, // thời gian chờ trước lần thử kết nối lại đầu tiên
            reconnectionDelayMax: 9000, // thời gian chờ tối đa giữa các lần thử
            randomizationFactor: 0.5,   // thời gian chờ ngẫu nhiên (reconnectionDelay * randomizationFactor) giữa các lần thử
        });
        // const newSocket = io.connect("https://socketserver-v6lc.onrender.com");

        setSocket(newSocket);
        // Clean up the connection when the component unmounts
        return () => newSocket.disconnect();
    }, []);

    // Get token from cookie
    const token = getToken();
    const auth = {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
    };

    return {
        isMobile,
        Base_URL,
        Base_AVA, default_Img,
        cliendId,
        socket,
        auth, Base_URL_FE,
        is24Inch, is27Inch, is30Inch, isLaptop, isTablet
    };
};
export default useConfig;
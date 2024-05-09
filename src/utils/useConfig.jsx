import { io } from "socket.io-client";
import UseCookie from "../hooks/useCookie";
import { useMediaQuery } from 'react-responsive';
import Base_Ava from "../assets/img/logo/logo.png";
import { useEffect, useState } from "react";

const useConfig = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
    const { getToken } = UseCookie();
    // Link to the backend server 
    // export const Base_URL = "https://tunetown-production.up.railway.app";
    const Base_URL_FE = "http://localhost:5173";
    const Base_URL = "http://localhost:8080";
    const Base_AVA = Base_Ava
    const default_Img = Base_AVA;
    // token return an object {access_token, refress_Token}

    // Client ID lấy từ google console API (đăng ký project và tạo client ID)
    const cliendId =
        "295516651084-5baqm2houfs6u6voha4a8s66j8ga6fru.apps.googleusercontent.com";

    // Socket.io
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io.connect("ws://localhost:3000");
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
        auth, Base_URL_FE
    };
};
export default useConfig;
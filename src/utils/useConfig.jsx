import { io } from "socket.io-client";
import UseCookie from "../hooks/useCookie";
import { useMediaQuery } from 'react-responsive';

const useConfig = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
    const { getToken } = UseCookie();
    // Link to the backend server 
    // export const Base_URL = "https://tunetown-production.up.railway.app";
    const Base_URL = "http://localhost:8080";
    const Base_Ava =
        "https://i.pinimg.com/564x/08/e4/58/08e458a736a3c0365612771772fa4904.jpg";
    // token return an object {access_token, refress_Token}

    // Client ID lấy từ google console API (đăng ký project và tạo client ID)
    const cliendId =
        "295516651084-5baqm2houfs6u6voha4a8s66j8ga6fru.apps.googleusercontent.com";

    // Socket.io
    // export const socket = io.connect("ws://localhost:3000");
    const socket = io.connect("https://socketserver-v6lc.onrender.com");

    // Get token from cookie
    const token = getToken();
    const auth = {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
    };
    return {
        isMobile,
        Base_URL,
        Base_Ava,
        cliendId,
        socket,
        auth,
    };
};
export default useConfig;
import { Outlet } from "react-router-dom";
import AuthorizationModal from "../AuthorizationModal";
import { useEffect } from "react";

const EmptyLayout = () => {
    const userRole = localStorage.getItem("userRole");
    useEffect(() => {
        if (userRole == "ADMIN") {
            window.location.href = "/cms";
        }
    }, [userRole]);
    return (
        <>
            <Outlet></Outlet>
            <AuthorizationModal isAdmin={false}></AuthorizationModal>
        </>
    );
};

export default EmptyLayout;
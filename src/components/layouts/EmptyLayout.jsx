import { Outlet } from "react-router-dom";
import AuthorizationModal from "../AuthorizationModal";

const EmptyLayout = () => {
    return (
        <>
            <Outlet></Outlet>
            <AuthorizationModal></AuthorizationModal>
        </>
    );
};

export default EmptyLayout;
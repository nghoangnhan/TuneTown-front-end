import { useNavigate } from "react-router-dom";
import defaultAva from "../assets/img/logo/logo.png";

const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div
                className="flex flex-row items-center justify-center gap-5 pt-6 text-lg font-bold text-center uppercase cursor-pointer"
                onClick={() => navigate("/home")}
            >
                <div>
                    <img src={defaultAva} className="h-12 rounded-lg" alt="" />
                </div>
                <div className="text-[#2E3271]">TuneTown</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-5 mt-10">
                <div className="text-4xl font-bold text-[#2E3271]">404</div>
                <div className="text-xl font-bold text-[#2E3271]">Page not found</div>
                <div className="text-lg text-[#3d419783]">The page you are looking for does not exist</div>
            </div>
        </div>
    );
};

export default ErrorPage;
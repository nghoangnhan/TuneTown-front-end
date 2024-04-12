import { faCaretLeft, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const useIconUtils = () => {
    const BackButton = () => {
        return (
            <button
                className="bg-[#59c26d] text-white font-bold shadow-md py-2 px-4 mt-5 rounded-lg"
                onClick={() => window.history.back()}
            >
                <FontAwesomeIcon
                    icon={faCaretLeft}
                ></FontAwesomeIcon> Back
            </button>
        );
    };
    const BackIcon = () => {
        return (
            <button
                className="px-3 py-1 text-2xl font-bold text-primary hover:opacity-60"
                onClick={() => window.history.back()}
            >
                <FontAwesomeIcon
                    icon={faCaretLeft}
                ></FontAwesomeIcon>
            </button>
        );
    };
    const ThumbsUpSolid = (props) => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill={props.liked ? "#49ad5b" : "#3a3a3d"}
            >
                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
            </svg>
        );
    };


    const ThumbsUpRegular = () => {
        return (
            <FontAwesomeIcon icon="fa-regular fa-thumbs-up" />
        );
    };

    const VerifyAccount = () => {
        return (
            <span className="">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18"
                    viewBox="0 -960 960 960"
                    width="18"
                    fill="#40cf62"
                >
                    <path d="m436-350 233-234-47-47-183 183-101-101-49 49 147 150Zm44.063 291Q331.105-96.81 234.552-230.909 138-365.007 138-522.837v-252.601L480-903l343 127.595v252.242q0 157.953-96.989 292.153Q629.021-96.81 480.063-59Z" />
                </svg>
            </span>)
    }
    return { BackButton, ThumbsUpSolid, ThumbsUpRegular, BackIcon, VerifyAccount };
};

export default useIconUtils;
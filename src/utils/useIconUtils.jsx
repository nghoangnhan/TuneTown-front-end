import { faArrowTrendUp, faCaretLeft, faCheckCircle, faHeadphones, faPauseCircle, faPlayCircle, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useIconUtils = () => {
    const BackButton = () => {
        return (
            <button
                className="bg-[#59c26d] text-white font-bold shadow-md py-2 px-4 rounded-lg"
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
                // eslint-disable-next-line react/prop-types
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

    const PlayButton = () => {
        return (
            <FontAwesomeIcon className='text-xl' icon={faPlayCircle} />
        );
    };

    const PauseButton = () => {
        return (
            <FontAwesomeIcon className='text-xl' icon={faPauseCircle} />
        );
    };

    const CheckSeen = () => {
        return (
            <FontAwesomeIcon className='text-gray-600' icon={faCheckCircle}></FontAwesomeIcon>
        );
    }

    const Check = () => {
        return (
            <FontAwesomeIcon className='text-gray-600' icon={faCheckCircle}></FontAwesomeIcon>
        );
    }

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

    const UserCheck = () => {
        return (
            <FontAwesomeIcon className='text-primary' icon={faUserCheck}></FontAwesomeIcon>
        )
    }

    const OptionsIcon = () => {
        return (
            <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                    fill="currentColor"
                >
                    <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                </svg>
            </div>)
    }

    const ListenIcon = () => {
        return (
            <FontAwesomeIcon icon={faHeadphones}></FontAwesomeIcon>
        )
    }

    const TrendingIcon = () => {
        return (
            <FontAwesomeIcon icon={faArrowTrendUp}></FontAwesomeIcon>
        )
    }

    const RepostIcon = () => {
        return (<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
        </svg>)
    }

    const DownloadButton = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
            </svg>
        )
    }

    const ShareButton = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
            </svg>
        )
    }
    return {
        BackButton, ThumbsUpSolid, CheckSeen, Check, ThumbsUpRegular,
        BackIcon, VerifyAccount, UserCheck, OptionsIcon, PlayButton,
        PauseButton, ListenIcon, TrendingIcon,
        RepostIcon, DownloadButton, ShareButton
    };
};

export default useIconUtils;
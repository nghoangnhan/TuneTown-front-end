import { faComments } from '@fortawesome/free-regular-svg-icons';
import {
    faArrowTrendUp, faBackwardStep, faCaretLeft, faCheckCircle, faEarthAmerica, faForwardStep, faHeadphones, faHouse, faList
    , faListOl, faMoon, faPause, faPauseCircle, faPlay, faPlayCircle, faPlus, faRepeat, faSearch, faShuffle, faSun, faUserCheck,
    faVolumeHigh,
    faVolumeLow
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

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

    // Nav  Icon 
    const HomeIcon = () => {
        return <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>
    }

    const SearchIcon = () => {
        return <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
    }

    const EarthIcon = () => {
        return <FontAwesomeIcon icon={faEarthAmerica}></FontAwesomeIcon>
    }
    const PlaylistIcon = () => {
        return <FontAwesomeIcon icon={faList}></FontAwesomeIcon>
    }



    const ThumbsUpSolid = (props) => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                className={`${props.liked ? 'fill-primary dark:fill-primaryDarkmode' : 'fill-iconText dark:fill-iconTextDark'} transition-colors duration-200`}
            >
                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
            </svg>
        );
    };
    ThumbsUpSolid.propTypes = {
        liked: PropTypes.bool.isRequired,
    };

    const ThumbsUpRegular = () => {
        return (
            <FontAwesomeIcon icon="fa-regular fa-thumbs-up" />
        );
    };

    const PlayButton = ({ size }) => {
        size = size || 2;
        return (
            <FontAwesomeIcon className={`text-${size}xl text-primary`} icon={faPlayCircle} />
        );
    };
    PlayButton.propTypes = {
        size: PropTypes.number,
    };

    const PauseButton = () => {
        return (
            <FontAwesomeIcon className='text-xl text-primary' icon={faPauseCircle} />
        );
    };

    const CheckSeen = () => {
        return (
            <FontAwesomeIcon className='text-primary' icon={faCheckCircle}></FontAwesomeIcon>
        );
    }

    const Check = () => {
        return (
            <FontAwesomeIcon className='text-primary' icon={faCheckCircle}></FontAwesomeIcon>
        );
    }

    const LoadingLogo = ({ loading }) => {
        return loading && (
            <div className="overlay">
                <img src="/src/assets/img/logo/logo.png" alt="Loading..." width={100} height={100} className="zoom-in-out" />
            </div>
        )
    }
    LoadingLogo.propTypes = {
        loading: PropTypes.bool.isRequired,
    };

    const VerifyAccount = () => {
        return (
            <span className="">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18"
                    viewBox="0 -960 960 960"
                    width="18"
                    className='fill-[#40cf62]'
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

    const RepostButton = ({ handleRepostSong }) => {
        return (<button
            className="p-1 hover:opacity-60 rounded-2xl text-primary"
            onClick={handleRepostSong}
        >
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
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
            </svg>
        </button>)
    }
    RepostButton.propTypes = {
        handleRepostSong: PropTypes.func.isRequired,
    };

    const DownloadButton = ({ handleDownloadSong }) => {
        return (
            <button
                className="p-1 hover:opacity-60 rounded-2xl text-primary"
                onClick={handleDownloadSong}
            >
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
            </button>
        )
    }
    DownloadButton.propTypes = {
        handleDownloadSong: PropTypes.func.isRequired,
    };

    const ShareButton = ({ handleShareSong }) => {
        return (
            <button
                className="p-1 hover:opacity-60 rounded-2xl text-primary"
                onClick={handleShareSong}
            >
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
            </button>
        )
    }
    ShareButton.propTypes = {
        handleShareSong: PropTypes.func.isRequired,
    }

    const MusicIcon = () => {
        return <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className=""
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
            />
        </svg>
    }

    const PlusIcon = () => {
        return <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
    }
    // MusicControlBar Icon 
    const ShuffleIcon = () => {
        return <FontAwesomeIcon icon={faShuffle}></FontAwesomeIcon>
    }
    const RepeatIcon = () => {
        return <FontAwesomeIcon icon={faRepeat}></FontAwesomeIcon>
    }
    const VolumeLowIcon = () => {
        return <FontAwesomeIcon icon={faVolumeLow}></FontAwesomeIcon>
    }
    const VolumeHighIcon = () => {
        return <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
    }
    const PlayIcon = () => {
        return <FontAwesomeIcon icon={faPlay}></FontAwesomeIcon>
    }
    const PauseIcon = () => {
        return <FontAwesomeIcon icon={faPause}></FontAwesomeIcon>
    }
    const SkipNextIcon = () => {
        return <FontAwesomeIcon icon={faForwardStep}></FontAwesomeIcon>
    }
    const SkipPreviousIcon = () => {
        return <FontAwesomeIcon icon={faBackwardStep}></FontAwesomeIcon>
    }
    const LyricIcon = () => {
        return <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            fill="currentColor"
        >
            <path d="M171.539-318.077v-484.038V-318.077Zm-55.96 184.766v-656.496q0-28.257 20.006-48.263 20.006-20.006 48.263-20.006h419.421q28.257 0 48.263 20.006 20.006 20.006 20.006 48.263v17.577q-16.231 7.692-30.172 18.215-13.942 10.524-25.788 23.437v-59.229q0-5.192-3.462-8.75t-8.847-3.558H183.848q-5.385 0-8.847 3.558-3.462 3.558-3.462 8.75v471.73h431.73q5.385 0 8.847-3.462 3.462-3.462 3.462-8.847v-139.229q11.846 12.988 25.788 23.571 13.941 10.582 30.172 18.082v97.576q0 28.438-20.006 48.353-20.006 19.916-48.263 19.916H244.385L115.579-133.311Zm149.999-278.805h135.961v-55.96H265.578v55.96Zm486.734-80q-44.966 0-76.427-31.513-31.462-31.514-31.462-76.423 0-44.909 31.426-76.467 31.426-31.557 76.21-31.557 15.172 0 27.46 3.827 12.289 3.827 24.904 12.443v-216.27h135.96v55.96h-80V-600q0 44.888-31.553 76.386-31.553 31.498-76.518 31.498Zm-486.734-40h255.961v-55.96H265.578v55.96Zm0-120h255.961v-55.96H265.578v55.96Z" />
        </svg>
    }
    const QueueIcon = () => {
        return <FontAwesomeIcon icon={faListOl}></FontAwesomeIcon>
    }

    const ChatButton = () => {
        return <FontAwesomeIcon icon={faComments}></FontAwesomeIcon>
    }

    const LightTheme = () => {
        return <FontAwesomeIcon icon={faSun}></FontAwesomeIcon>
    }
    const DarkTheme = () => {
        return <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
    }

    const CreatePlaylistButton = ({ CreateNewPlaylist }) => {
        return <button
            onClick={() => CreateNewPlaylist()}
            className="mt-3 mb-5 ml-3 bg-white border border-solid rounded-md border-primary text-primary hover:opacity-60"
        >
            <div className="px-2 py-2 font-bold">+ Create New Playlist</div>
        </button>
    }
    CreatePlaylistButton.propTypes = {
        CreateNewPlaylist: PropTypes.func.isRequired,
    }

    return {
        BackButton, ThumbsUpSolid, CheckSeen, Check, ThumbsUpRegular,
        BackIcon, VerifyAccount, UserCheck, OptionsIcon, PlayButton,
        PauseButton, ListenIcon, TrendingIcon, MusicIcon,
        RepostButton, DownloadButton, ShareButton,
        ChatButton, PlusIcon, LoadingLogo,
        LightTheme, DarkTheme,
        HomeIcon, SearchIcon, EarthIcon, PlaylistIcon,
        ShuffleIcon, RepeatIcon, PlayIcon, PauseIcon, SkipNextIcon, SkipPreviousIcon,
        VolumeLowIcon, VolumeHighIcon, LyricIcon, QueueIcon, CreatePlaylistButton
    };
};

export default useIconUtils;
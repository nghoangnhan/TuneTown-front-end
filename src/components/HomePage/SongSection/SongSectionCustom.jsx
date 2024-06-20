import "../../../assets/CSS/ReactContexify.css";
import { useEffect, useState } from "react";
import SongItem from "../../Song/SongItem";
import { useMusicAPIUtils } from "../../../utils/useMusicAPIUtils";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
const SongSectionCustom = ({ titleSong, tryNew, listenAgain }) => {
    const { getListSongListenAgain, getListSongTryNew } = useMusicAPIUtils();
    const { t } = useTranslation();
    const [songList, setSongList] = useState([]);
    // const [hasMoreSongs, setHasMoreSongs] = useState(false);

    useEffect(() => {
        if (listenAgain == true) {
            getListSongListenAgain().then((response) => {
                setSongList(response?.songs);
                // console.log("songListAgain", songList);
            });
        }
        else if (tryNew == true) {
            getListSongTryNew().then((response) => {
                setSongList(response?.songs);
                // console.log("songListTryNew", songList);
            })
        }
    }, []);
    if (!songList) return null;

    return (
        <div className="px-3 py-3 m-auto mx-1 mt-4 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-2xl xl:h-fit xl:mx-5 xl:mt-8 xl:py-5 xl:px-5">
            <h1 className="mb-2 text-3xl font-bold text-center text-primary dark:text-primaryDarkmode">{titleSong}</h1>
            <div className="flex flex-col gap-2 mt-2 overflow-auto xl:w-full max-h-96">
                {songList &&
                    songList.map((songItem, index) => (
                        <div key={index}>
                            <SongItem song={songItem} songOrder={index + 1} />
                        </div>
                    ))}
                {songList.length === 0 && <div className="my-4 text-xl font-bold text-center text-primary dark:text-primaryDarkmode">{t("home.updating")}</div>}
            </div>
        </div>
    );
};

export default SongSectionCustom;

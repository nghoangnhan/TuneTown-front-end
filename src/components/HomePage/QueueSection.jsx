import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SongItemQueue from "../Song/SongItemQueue";
import useIconUtils from "../../utils/useIconUtils";
import { useTranslation } from "react-i18next";

const QueueSection = () => {
  const [songQueue, setSongQueue] = useState([]);
  const { BackButton } = useIconUtils();
  const songQueueStore = useSelector((state) => state.music.songQueue);
  const playingSong = useSelector((state) => state.music.currentSong);
  const { t } = useTranslation()
  // console.log("QueueSection || playingSong", playingSong);

  useEffect(() => {
    if (songQueueStore != null) {
      setSongQueue(songQueueStore);
    }
    // console.log("QueueSection || songQueueStore", songQueueStore);
  }, [songQueueStore]);

  return (
    <div
      className={`min-h-screen h-fit xl:p-6 bg-backgroundPrimary dark:bg-backgroundDarkPrimary pb-10`}
    >
      <BackButton></BackButton>
      <div className="my-4 text-4xl font-bold text-primary dark:text-primaryDarkmode text-start">
        {t("queue.yourQueue")}
      </div>

      <div className="p-2 mt-6 rounded-md shadow-lg">
        <div className="mb-5 text-2xl font-bold text-primary dark:text-primaryDarkmode text-start">
          {t("queue.nowPlaying")}
        </div>
        <SongItemQueue song={playingSong} isPlaying={true}></SongItemQueue>
      </div>
      <div className="p-2 mt-5 rounded-md shadow-lg">
        <div className="mt-5 mb-5 text-2xl font-bold text-primary dark:text-primaryDarkmode text-start">
          {t("queue.nextUp")}
        </div>
        <div className="flex flex-col gap-1">
          {songQueue != null &&
            songQueue.map((song, index) => (
              <SongItemQueue
                key={song.id}
                order={index + 1}
                song={song}
                isPlaying={false}
              ></SongItemQueue>
            ))}
          {songQueue != null && songQueue.length === 0 && (
            <div className="mt-5 mb-5 text-2xl font-bold text-center text-primary dark:text-primaryDarkmode">
              {t("queue.noSongInQueue")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueSection;

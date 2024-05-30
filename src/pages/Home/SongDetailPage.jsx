import { useParams } from "react-router-dom";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";
import { useEffect, useState } from "react";
import useSongUtils from "../../utils/useSongUtils";
import LyricSection from "../../components/HomePage/LyricSection";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import SongItem from "../../components/Song/SongItem";
import { useDispatch } from "react-redux";
import { setCurrentSong } from "../../redux/slice/music";
import { Modal } from "antd";
import Repost from "../../components/Forum/Repost";

const SongDetailPage = () => {
  const { songId } = useParams();
  const { Base_AVA } = useConfig();
  const dispatch = useDispatch();
  const { BackButton, PlayButton, RepostButton, DownloadButton, ShareButton } = useIconUtils();
  const { getPosterColor, handleDownloadSong, handleShareSong } = useSongUtils();
  const { getSongById, combineData } = useMusicAPIUtils();
  const [colorBG, setColorBG] = useState("");
  const [loading, setLoading] = useState(true);
  const [songDetail, setSongDetail] = useState();
  const [modalRepost, setModalRepost] = useState(false);

  const getSongDetailById = async () => {
    const response = await getSongById(parseInt(songId));
    setSongDetail(response);
  };

  const handleRepostSong = () => {
    setModalRepost(true);
  }


  useEffect(() => {
    getSongDetailById();
  }, [songId]);

  useEffect(() => {
    if (!songDetail || !songDetail.poster) {
      setLoading(false);
      return;
    }
    getPosterColor(songDetail.poster, colorBG, setColorBG, setLoading);
  }, [songDetail]);

  if (loading) {
    return (
      <div className="text-4xl font-bold text-center text-primary dark:text-primaryDarkmode ">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`${songId ? "h-full" : "h-fit"
        } min-h-screen w-full p-2 bg-backgroundPrimary dark:bg-backgroundDarkPrimary`}
    >

      <div
        className={`flex flex-col items-start p-5 shadow-md rounded-xl`}
        style={{
          background: `linear-gradient(to top right , transparent, ${colorBG} 98%)`,
        }}
      >
        <div className="mb-4">
          <BackButton></BackButton>
        </div>
        <div className="flex flex-row items-center gap-4">
          <img
            src={songDetail?.poster ? songDetail.poster : Base_AVA}
            alt="song-poster"
            className="w-20 h-20 bg-white rounded-full xl:w-56 xl:h-56"
          />
          <div className="flex flex-col items-start gap-5">
            <div className="font-bold text-center text-7xl text-primaryDarkmode dark:text-primaryDarkmode">
              {songDetail?.songName}
            </div>
            <div className="flex flex-row items-center gap-2 text-primaryDarkmode dark:text-primaryDarkmode">
              {songDetail?.artists?.map((artist) => {
                return (
                  <div
                    className="flex flex-row items-center gap-2"
                    key={artist.id}
                  >
                    <img
                      src={artist.avatar ? artist.avatar : Base_AVA}
                      alt="artist-avatar"
                      className="w-10 h-10 rounded-md"
                    />
                    <div className="text-lg font-bold">{artist.userName}</div>
                  </div>
                );
              })}
              {
                songDetail?.artists.lenght === 0 &&
                <div
                  className="flex flex-row items-center gap-2">
                  <img
                    src={Base_AVA}
                    alt="artist-avatar"
                    className="w-10 h-10 rounded-md"
                  />
                  <div className="text-lg font-bold">Unknown Artist</div>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 mt-4">
          <div onClick={() => dispatch(setCurrentSong(
            {
              id: songDetail?.id,
              songName: songDetail?.songName,
              artists: songDetail?.artists,
              songCover: songDetail?.poster,
              songData: songDetail?.audio,
              lyric: songDetail?.lyric,
            }
          ))} className="cursor-pointer">

            <PlayButton color={true} size={3}></PlayButton>
          </div>

          {/* Repost Song  */}
          <RepostButton handleRepostSong={handleRepostSong}></RepostButton>
          {/* Download Song */}
          <DownloadButton handleDownloadSong={() => handleDownloadSong(songDetail, setLoading, combineData)}></DownloadButton>
          {/* Share Song */}
          <ShareButton handleShareSong={() => handleShareSong(songDetail)}></ShareButton>

        </div>
      </div>

      <LyricSection lyric={songDetail?.lyric}></LyricSection>
      {/* Modal Repost  */}
      <Modal
        title="Repost"
        open={modalRepost}
        onCancel={() => {
          setModalRepost(false);
        }}
        footer={null}
        centered
        className="modalStyle"
      >
        <Repost song={songDetail} closeModal={() => setModalRepost(false)} />
      </Modal>
    </div>
  );
};

SongDetailPage.propTypes = {};

export default SongDetailPage;

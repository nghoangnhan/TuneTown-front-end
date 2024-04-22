import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongPlaylist from "./SongSectionPlaylist";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import useIconUtils from "../../utils/useIconUtils";
import useConfig from "../../utils/useConfig";

const DetailPlaylist = () => {
  //http://localhost:8080/playlists/getPlaylistSongs?playlistId=102
  const { playlistId } = useParams();
  const { BackButton } = useIconUtils();
  const { default_Img } = useConfig();
  const { getListSongPlaylist, getPlaylistByPlaylistId } = useMusicAPIUtils();
  const [songPlaylistList, setSongPlaylistList] = useState();
  const [playlistDetail, setPlaylistDetail] = useState({});

  const fetchDataPlaylistInfor = async (playlistId) => {
    const detailData = await getPlaylistByPlaylistId(playlistId);
    if (detailData) {
      setPlaylistDetail(detailData);
    }
    const data = await getListSongPlaylist(playlistId);
    if (data) {
      setSongPlaylistList(data);
      console.log("data", data);
    }
  };
  useEffect(() => {
    fetchDataPlaylistInfor(playlistId);
  }, [playlistId]);

  return (
    <div
      className={`${songPlaylistList != null && songPlaylistList.length > 0
        ? "min-h-screen h-full"
        : "min-h-screen"
        } xl:p-5 bg-backgroundPrimary dark:bg-backgroundDarkPrimary mb-20`}
    >
      <div className="my-4">
        <BackButton></BackButton>
      </div>
      <div className="flex flex-row items-start gap-4 mb-5 font-bold text-center text-7xl text-primary dark:text-primaryDarkmode">
        <div className="relative flex flex-row items-start">
          <img
            className="w-20 h-20 rounded-md xl:w-56 xl:h-56"
            src={
              playlistDetail.coverArt
                ? playlistDetail.coverArt
                : default_Img
            }
            alt="artist-avatar"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-row items-center justify-center gap-4">
            {playlistDetail.playlistName} <span className="text-5xl">#{playlistId}</span>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <div className="text-2xl text-primary dark:text-primaryDarkmode">Made by {" "}{playlistDetail?.user?.userName}</div>
            <div className="text-base text-primaryText2 dark:text-primaryTextDark">{playlistDetail.playlistType}{" "}playlist</div>
          </div>
        </div>
      </div>

      <SongPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></SongPlaylist>
    </div>
  );
};

export default DetailPlaylist;

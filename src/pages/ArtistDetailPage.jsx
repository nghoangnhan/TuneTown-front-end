import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultAva from "../assets/img/logo/logo.png";
import SongItem from "../components/Song/SongItem";
import { setChatChosen } from "../redux/slice/social";
import { useDispatch } from "react-redux";
import useUserUtils from "../utils/useUserUtils";

const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const { getArtistByArtistId } = useUserUtils();
  const dispatch = useDispatch();
  const [artistDetail, setArtistDetail] = useState({});
  const [songListArtist, setSongListArtist] = useState([]);
  const [follow, setFollow] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    dispatch(
      setChatChosen({
        chatId: path,
        name: artistDetail.name,
        avatar: artistDetail.avatar,
      })
    );
    navigate(`/chat/${path}`);
  };

  const handleFollow = () => {
    setFollow(!follow);
  };

  const handleGetArtistDetail = async (artistId) => {
    await getArtistByArtistId(artistId).then((result) => {
      if (result == null) return;
      setArtistDetail(result);
      setSongListArtist(result.songs);
      console.log("SetArtistDetail", result);
      console.log("SetSongListArtist", songListArtist);
    });
  };
  useEffect(() => {
    handleGetArtistDetail(artistId);
  }, [artistId]);
  if (songListArtist == null) return null;

  return (
    <div
      className={`${
        artistId ? "min-h-screen h-full" : "min-h-screen h-fit"
      } xl:p-4 p-2 bg-[#ecf2fd] mb-20`}
    >
      <div className="flex flex-row items-center justify-start gap-4">
        <div className="relative flex flex-row items-start mt-5 mb-5">
          <img
            className="w-20 h-20 rounded-md xl:w-56 xl:h-56"
            src={artistDetail.avatar ? artistDetail.avatar : defaultAva}
            alt="artist-avatar"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-[50px] text-[#4b4848] font-bold text-center mb-5">
            <div className="flex flex-row items-center justify-center gap-2">
              {artistDetail.name ? artistDetail.name : "Unknown Artist"}
              <span className="text-gray-500">#{artistDetail.id}</span>
              {artistDetail.role == "ARTIST" ||
                (artistDetail.role == "ADMIN" && (
                  <span className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="36"
                      viewBox="0 -960 960 960"
                      width="36"
                      fill="#40cf62"
                    >
                      <path d="m436-350 233-234-47-47-183 183-101-101-49 49 147 150Zm44.063 291Q331.105-96.81 234.552-230.909 138-365.007 138-522.837v-252.601L480-903l343 127.595v252.242q0 157.953-96.989 292.153Q629.021-96.81 480.063-59Z" />
                    </svg>
                  </span>
                ))}
            </div>
          </div>
          {
            <div className="flex flex-row gap-4">
              <button
                onClick={() => handleFollow()}
                className="bg-[#2f9948bc] hover:bg-[#40cf62] rounded-md mb-5"
              >
                <div className="px-2 py-1 font-bold text-white">
                  {follow == true ? "Unfollow" : "Follow"}
                </div>
              </button>
              <button
                className="bg-[#2f9948bc] hover:bg-[#40cf62] rounded-md mb-5 px-2 py-1 font-bold text-white"
                onClick={() => handleNavigate(artistDetail.id)}
              >
                Join the artist community
              </button>
            </div>
          }
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
        >
          <div className="px-2 py-1 font-bold text-white">{"<"} Back</div>
        </button>
      </div>

      {/* <SongSectionPlaylist songData={artistDetail.songs}></SongSectionPlaylist> */}
      {artistDetail.songs && (
        <div className="bg-[#FFFFFFCC] rounded-xl m-auto ml-2 mr-2 mt-2 pt-2 pl-5 pr-5 pb-5">
          <div className="flex flex-row justify-between items-center mt-5 mb-5 text-[#4b4848]">
            <div className="flex flex-row gap-8 ml-8">
              <div className="font-bold text-center ">ID</div>
              <div className="font-bold text-center ">Song Details</div>
            </div>
            <div>
              <div className="font-bold text-center ">Duration</div>
            </div>
          </div>
          {artistDetail.songs.map((songItem, index) => (
            <SongItem
              key={songItem.id || index}
              songOrder={index}
              song={songItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistDetailPage;

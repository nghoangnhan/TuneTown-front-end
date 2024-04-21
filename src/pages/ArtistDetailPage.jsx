import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultAva from "../assets/img/logo/logo.png";
import SongItem from "../components/Song/SongItem";
import { setChatChosen } from "../redux/slice/social";
import { useDispatch } from "react-redux";
import useUserUtils from "../utils/useUserUtils";
import useIconUtils from "../utils/useIconUtils";

const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const { getArtistByArtistId } = useUserUtils();
  const dispatch = useDispatch();
  const { UserCheck, BackButton } = useIconUtils();
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
    });
  };
  useEffect(() => {
    handleGetArtistDetail(artistId);
  }, [artistId]);
  if (songListArtist == null) return null;

  return (
    <div
      className={`${artistId ? "min-h-screen h-full" : "min-h-screen h-fit"
        } xl:p-8 p-2 bg-backgroundPrimary mb-20`}
    >

      <div className="flex flex-row mb-2">
        <BackButton></BackButton>
      </div>
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
              <span className="text-lg text-gray-500">#{artistDetail.id}</span>
              <span className="text-4xl"><UserCheck></UserCheck></span>
              {/* {artistDetail.role == "ARTIST" ||
                (artistDetail.role == "ADMIN" && (
                  <VerifyAccount></VerifyAccount>
                ))} */}
            </div>
          </div>
          {
            <div className="flex flex-row gap-4">
              <button
                onClick={() => handleFollow()}
                className="mb-5 rounded-md bg-primary hover:bg-primaryHoverOn"
              >
                <div className="px-2 py-1 font-bold text-white">
                  {follow == true ? "Unfollow" : "Follow"}
                </div>
              </button>
              <button
                className="px-2 py-1 mb-5 font-bold text-white rounded-md bg-primary hover:bg-primaryHoverOn"
                onClick={() => handleNavigate(artistDetail.id)}
              >
                Join the artist community
              </button>
            </div>
          }
        </div>
      </div>


      {/* <SongSectionPlaylist songData={artistDetail.songs}></SongSectionPlaylist> */}
      {artistDetail?.songs && (
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
          {artistDetail?.songs.map((songItem, index) => (
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

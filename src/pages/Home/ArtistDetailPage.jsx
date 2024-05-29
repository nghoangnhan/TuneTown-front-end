import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SongItem from "../../components/Song/SongItem";
import { setChatChosen } from "../../redux/slice/social";
import { useDispatch } from "react-redux";
import useUserUtils from "../../utils/useUserUtils";
import useIconUtils from "../../utils/useIconUtils";
import useChatUtils from "../../utils/useChatUtils";
import useConfig from "../../utils/useConfig";
import useSongUtils from "../../utils/useSongUtils";
import { use } from "i18next";

const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const { Base_AVA } = useConfig();
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const { followArtist, getArtistByArtistId, getAllSongArtist, CheckCommunityExist } = useUserUtils();
  const { UserCheck, BackButton, LoadingLogo } = useIconUtils();
  const navigate = useNavigate();
  const { getCommunityByHostId, joinRequest } = useChatUtils();
  const { getPosterColor } = useSongUtils();
  const [colorBG, setColorBG] = useState();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [artistDetail, setArtistDetail] = useState({});
  const [topSongListArtist, setTopSongListArtist] = useState([]);
  const [songListArtist, setSongListArtist] = useState([]);
  const [page, setPage] = useState(1);
  const [follow, setFollow] = useState(false);
  const [request, setRequest] = useState();
  const [join, setJoin] = useState();
  const [communityExist, setCommunityExist] = useState(false);

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

  const handleGetArtistDetail = async (artistId) => {
    await getArtistByArtistId(artistId).then((result) => {
      if (result == null) return;
      setArtistDetail(result);
      setTopSongListArtist(result.songs);
      setRefresh(false)
      console.log("SetArtistDetail", result);
    });
  };
  const handleFollowArtist = async () => {
    await followArtist(artistId).then(() => {
      setRefresh(true);
      setFollow(!follow);
    });
  };

  const handleGetCommunity = async (artistId) => {
    const response = await getCommunityByHostId(artistId);
    return response;
  };

  const handleJoinCommunity = async () => {
    const response = await handleGetCommunity(artistId);
    const communityId = response.id;
    // Approve request
    if (!join) {
      const updatedRequest = await joinRequest(userId, communityId);
      setRequest(updatedRequest);
    } else {
      // Navigate to joined community
      handleNavigate("community/" + communityId);
    }
  };

  const fetchDataCommunity = async () => {
    try {
      const communityData = await handleGetCommunity(artistId);
      // console.log("Community Data:", communityData);
      for (const userRequest of communityData.approveRequests) {
        if (userRequest.id == userId) {
          setRequest(true);
          return;
        }
      }
      for (const userJoin of communityData.joinUsers) {
        if (userJoin.id == userId) {
          setJoin(true);
          return;
        }
      }
      setJoin(false);
    } catch (error) {
      console.error("Error fetching community data:", error);
    }
  };

  const CheckArtistCommunityExist = async (artistId) => {
    try {
      const check = await CheckCommunityExist(artistId);
      if (check == 1) {
        setCommunityExist(true);
      }
    } catch (error) {
      console.error("Error checking artist community existence: ", error);
    }
  }

  useEffect(() => {
    if (!artistDetail || !artistDetail.avatar) {
      setFollow(artistDetail.isFollowed);
      // console.log(artistDetail.isFollowed);
      setLoading(false);
      return;
    }
    getPosterColor(artistDetail.avatar, colorBG, setColorBG, setLoading);
  }, [artistDetail]);

  useEffect(() => {
    fetchDataCommunity();
  }, [request, join, artistId]);

  useEffect(() => {
    handleGetArtistDetail(artistId);
  }, [artistId]);
  if (songListArtist == null) return null;

  useEffect(() => {
    CheckArtistCommunityExist(artistId);
  }, [artistId]);

  return (
    <div
      className={`${artistId ? " h-full" : "h-fit"
        } min-h-screen p-2 bg-backgroundPrimary dark:bg-backgroundDarkPrimary pb-3`}
    >

      <div
        className={`flex flex-col items-start p-5 shadow-md rounded-xl`}
        style={{
          background: `linear-gradient(to top right , transparent, ${colorBG} 100%)`,
        }}
      >
        <div className="flex flex-row mb-2">
          <BackButton></BackButton>
        </div>
        <div className="flex flex-row items-center justify-start gap-4">
          <div className="relative flex flex-row items-start mt-5 mb-5">
            <img
              className="w-20 h-20 rounded-full xl:w-52 xl:h-52 dark:bg-white"
              src={artistDetail.avatar ? artistDetail.avatar : Base_AVA}
              alt="artist-avatar"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-[50px] text-textNormal dark:text-textNormalDark font-bold text-center mb-5">
              <div className="flex flex-row items-center justify-center gap-3">
                {artistDetail.name ? artistDetail.name : "Unknown Artist"}
                {/* <span className="text-lg text-primaryText dark:text-textNormalDark opacity-80">
                  #{artistDetail.id}
                </span> */}
                <span className="text-4xl text-primary dark:text-primaryDarkmode">
                  <UserCheck></UserCheck>
                </span>
              </div>
            </div>
            {artistDetail.artists?.userBio && (
              <div className="text-base xl:text-lg text-primaryText dark:text-textNormalDark opacity-80">
                <span>Bio:</span> {artistDetail.artists?.userBio}
              </div>
            )}
            <div className="flex flex-row gap-2 my-2">
              <div className="text-primaryText dark:text-primaryTextDark2 opacity-80">
                <span>Followers:</span> {artistDetail.followers}
              </div>
              <div className="text-primaryText dark:text-primaryTextDark2 opacity-80">
                <span>Following:</span> {artistDetail.following}
              </div>
            </div>
            {
              <div className="flex flex-row gap-4">
                <button
                  onClick={() => handleFollowArtist(artistDetail.id)}
                  className="px-2 py-1 mb-5 font-bold text-white rounded-md bg-primary dark:bg-primaryDarkmode hover:opacity-70"
                >
                  {follow == true ? "Following" : "Follow"}
                </button>
                {communityExist &&
                  <button
                    className="px-2 py-1 mb-5 font-bold text-white rounded-md bg-primary dark:bg-primaryDarkmode hover:opacity-70"
                    onClick={() => handleJoinCommunity()}
                  >
                    {request
                      ? "Request sent"
                      : join
                        ? "Community joined"
                        : "Join the artist community"}
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </div>

      {/* <SongSectionPlaylist songData={artistDetail.songs}></SongSectionPlaylist> */}
      {artistDetail?.songs && (
        <div className="px-5 pt-2 pb-5 m-auto mx-2 mt-2 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-xl">
          <div className="mt-2 text-2xl font-bold text-center text-primary dark:text-primaryDarkmode">
            Top Songs of {artistDetail.name}
          </div>
          <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary dark:text-primaryDarkmode">
            <div className="flex flex-row gap-8 ml-10">
              <div className="font-bold text-center ">#</div>
              <div className="font-bold text-center ">Song Details</div>
            </div>
            <div>
              <div className="font-bold text-center ">Duration</div>
            </div>
          </div>
          {artistDetail?.songs.slice(0, 5).map((songItem, index) => (
            <SongItem
              key={index}
              songOrder={index + 1}
              song={songItem}
            />
          ))}
        </div>
      )}

      {songListArtist && (
        <div className="px-5 pt-2 pb-5 m-auto mx-2 my-10 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-xl">
          <div className="mt-2 text-2xl font-bold text-center text-primary dark:text-primaryDarkmode">
            More from {songListArtist.name}
          </div>
          <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary dark:text-primaryDarkmode">
            <div className="flex flex-row gap-8 ml-10">
              <div className="font-bold text-center ">#</div>
              <div className="font-bold text-center ">Song Details</div>
            </div>
            <div>
              <div className="font-bold text-center ">Duration</div>
            </div>
          </div>
          {songListArtist?.map((songItem, index) => (
            <SongItem
              key={index}
              songOrder={index + 1}
              song={songItem}
            />
          ))}
          {/* Load More  */}
          {<div className="flex flex-row items-center justify-center gap-4 mt-5">
            <button
              onClick={() => {
                setPage(page + 1);
              }}
              className="px-3 py-2 border rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode hover:opacity-70">
              Load More
            </button>
          </div>}
        </div>
      )}

      <LoadingLogo loading={loading}></LoadingLogo>
    </div>
  );
};

export default ArtistDetailPage;

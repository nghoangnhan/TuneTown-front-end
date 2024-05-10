import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SongItem from "../../components/Song/SongItem";
import { setChatChosen } from "../../redux/slice/social";
import { useDispatch } from "react-redux";
import useUserUtils from "../../utils/useUserUtils";
import useIconUtils from "../../utils/useIconUtils";
import TheHeader from "../../components/Header/TheHeader";
import useChatUtils from "../../utils/useChatUtils";
import useConfig from "../../utils/useConfig";

const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const { Base_AVA } = useConfig();
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const { followArtist, unfollowArtist, getArtistByArtistId } = useUserUtils();
  const { UserCheck, BackButton } = useIconUtils();
  const [artistDetail, setArtistDetail] = useState({});
  const [songListArtist, setSongListArtist] = useState([]);
  const [follow, setFollow] = useState(false);
  const navigate = useNavigate();
  const { getCommunityByHostId, joinRequest, outCommunity } = useChatUtils();
  const [request, setRequest] = useState();
  const [join, setJoin] = useState();

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
  const handleFollowArtist = async () => {
    await followArtist(userId, artistId).then((result) => {
      console.log("Follow Artist", result);
    }
    );
  }
  const handleUnfollowArtist = async () => {
    await unfollowArtist(userId, artistId).then((result) => {
      console.log("Unfollow Artist", result);
    }
    );
  }

  const handleGetCommunity = async (artistId) => {
    const response = await getCommunityByHostId(artistId);
    return response;
  }

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
  }

  const fetchData = async () => {
    try {
      const communityData = await handleGetCommunity(artistId);
      console.log("Community Data:", communityData);
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

  useEffect(() => {
    console.log("ISREQUEST ", request);
    fetchData();
  }, [request, join, artistId]);

  useEffect(() => {
    handleGetArtistDetail(artistId);
  }, [artistId]);
  if (songListArtist == null) return null;

  return (
    <div
      className={`${artistId ? " h-full" : "h-fit"
        } min-h-screen p-2 bg-backgroundPrimary dark:bg-backgroundDarkPrimary pb-3`}
    >
      <div className="mb-4">
        <TheHeader></TheHeader>
      </div>
      <div className="flex flex-row mb-2">
        <BackButton></BackButton>
      </div>
      <div className="flex flex-row items-center justify-start gap-4">
        <div className="relative flex flex-row items-start mt-5 mb-5">
          <img
            className="w-20 h-20 rounded-md xl:w-56 xl:h-56"
            src={artistDetail.avatar ? artistDetail.avatar : Base_AVA}
            alt="artist-avatar"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-[50px] text-textNormal dark:text-textNormalDark font-bold text-center mb-5">
            <div className="flex flex-row items-center justify-center gap-2">
              {artistDetail.name ? artistDetail.name : "Unknown Artist"}
              <span className="text-lg text-primaryText dark:text-textNormalDark opacity-80">#{artistDetail.id}</span>
              <span className="text-4xl text-primary dark:text-primaryDarkmode"><UserCheck></UserCheck></span>
            </div>
          </div>
          {
            <div className="flex flex-row gap-4">
              <button
                onClick={() => handleFollow()}
                className="px-2 py-1 mb-5 font-bold text-white rounded-md bg-primary dark:bg-primaryDarkmode hover:opacity-70"
              >
                {follow == true ? "Unfollow" : "Follow"}
              </button>
              <button
                className="px-2 py-1 mb-5 font-bold text-white rounded-md bg-primary dark:bg-primaryDarkmode hover:opacity-70"
                onClick={() => handleJoinCommunity()}
              >
                {request ? 'Request sent' : (join ? 'Community joined' : 'Join the artist community')}
              </button>
            </div>
          }
        </div>
      </div>


      {/* <SongSectionPlaylist songData={artistDetail.songs}></SongSectionPlaylist> */}
      {artistDetail?.songs && (
        <div className="pt-2 pb-5 pl-5 pr-5 m-auto mt-2 ml-2 mr-2 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-xl">
          <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary dark:text-primaryDarkmode">
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
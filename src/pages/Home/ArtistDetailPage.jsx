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
import PostSection from "../../components/Forum/PostSection";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";

const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const { Base_AVA, isMobile } = useConfig();
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const {
    followArtist,
    getArtistByArtistId,
    getAllSongArtist,
    CheckCommunityExist,
    getUserPost,
    getArtistFollower,
    getArtistFollowing,
  } = useUserUtils();
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
  const [postList, setPostList] = useState();
  const [communityExist, setCommunityExist] = useState(false);
  const [showModalFollow, setShowModalFollow] = useState(false);
  const [follower, setFollower] = useState();
  const [listFollower, setListFollower] = useState([]);
  const [listFollowing, setListFollowing] = useState([]);
  const { t } = useTranslation();

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
      setRefresh(false);
      // console.log("SetArtistDetail", result);
    });
  };
  const handleFollowArtist = async (artistId) => {
    await followArtist(artistId).then((res) => {
      if (res == null) return;
      setFollow(res == "Followed" ? true : false);
      setRefresh(true);
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
  };

  const handleNavigateFollow = (userId) => {
    setShowModalFollow(false);
    userId.role == "ARTIST"
      ? navigate(`/artist/${userId.id}`)
      : navigate(`/user/${userId.id}`);
  };

  useEffect(() => {
    if (!artistDetail || !artistDetail.avatar) {
      setFollow(artistDetail.isFollowed);
      // console.log(artistDetail.isFollowed);
      setLoading(false);
      return;
    }
    getPosterColor(artistDetail.avatar, colorBG, setColorBG, setLoading);
  }, [artistDetail, follow]);

  useEffect(() => {
    fetchDataCommunity();
  }, [request, join, artistId]);

  useEffect(() => {
    handleGetArtistDetail(artistId);
    getUserPost(artistId).then((res) => {
      setPostList(res.postList);
    });
  }, [artistId, refresh]);

  useEffect(() => {
    if (page == 0) return;
    getAllSongArtist(artistId, page).then((result) => {
      setSongListArtist([...songListArtist, ...result.songList]);
    });
  }, [page]);

  useEffect(() => {
    CheckArtistCommunityExist(artistId);
  }, [artistId]);

  useEffect(() => {
    getArtistFollower(artistId).then((res) => {
      setListFollower(res?.followers);
    });
    getArtistFollowing(artistId).then((res) => {
      setListFollowing(res?.following);
    });
  }, [artistId, follow, follower]);

  if (songListArtist == null) return null;

  return (
    <div
      className={`${
        artistId ? " h-full" : "h-fit"
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
                {artistDetail.artists?.userBio}
              </div>
            )}
            <div className="flex flex-row gap-2 my-2">
              <div
                className="cursor-pointer text-primaryText dark:text-primaryTextDark2 opacity-80 hover:underline"
                onClick={() => {
                  setShowModalFollow(true);
                  setFollower(true);
                }}
              >
                <span>{t("artistPage.follower")}:</span>{" "}
                {artistDetail.followers}
              </div>
              <div
                className="cursor-pointer text-primaryText dark:text-primaryTextDark2 opacity-80 hover:underline"
                onClick={() => {
                  setShowModalFollow(true);
                  setFollower(false);
                }}
              >
                <span>{t("artistPage.following")}:</span>{" "}
                {artistDetail.following}
              </div>
            </div>
            {
              <div className="flex flex-row gap-4">
                <button
                  onClick={() => handleFollowArtist(artistDetail.id)}
                  className="px-2 py-1 mb-5 font-bold border rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode hover:opacity-70"
                >
                  {follow == true
                    ? t("artistPage.following")
                    : t("artistPage.follow")}
                </button>
                {communityExist && (
                  <button
                    className="px-2 py-1 mb-5 font-bold border rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode hover:opacity-70"
                    onClick={() => handleJoinCommunity()}
                  >
                    {request
                      ? t("artistPage.requestSent")
                      : join
                      ? t("artistPage.communityJoined")
                      : t("artistPage.joinArtistCommunity")}
                  </button>
                )}
              </div>
            }
          </div>
        </div>
      </div>
      <div>
        <div
          className={`${
            isMobile ? "flex-col" : "flex-row"
          } flex gap-2 justify-center`}
        >
          {/* <SongSectionPlaylist songData={artistDetail.songs}></SongSectionPlaylist> */}
          {topSongListArtist && (
            <div className="px-5 pt-2 pb-5 m-auto mx-2 mt-5 min-w-[600px] bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-xl">
              <div className="mt-2 text-2xl font-bold text-center text-primary dark:text-primaryDarkmode">
                {t("artistPage.topTracks")}
              </div>
              <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary dark:text-primaryDarkmode">
                <div className="flex flex-row gap-8 ml-10">
                  <div className="font-bold text-center ">#</div>
                  <div className="font-bold text-center ">
                    {t("song.title")}
                  </div>
                </div>
              </div>
              {topSongListArtist?.slice(0, 5).map((songItem, index) => (
                <SongItem key={index} songOrder={index + 1} song={songItem} />
              ))}
            </div>
          )}

          <div className="overflow-auto my-5 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary min-w-[600px] px-1 xl:px-4  mx-2 rounded-2xl max-h-96 xl:max-h-[635px]">
            {/* <div className="px-1 py-1 text-4xl font-bold text-center text-primary dark:text-primaryDarkmode rounded-2xl xl:h-fit xl:py-4 xl:mt-3">
            Post List
          </div> */}
            {postList && (
              <div>
                <PostSection postList={postList}></PostSection>
                {/* {postList.length > 3 && <div className="flex justify-center w-full">
              <button
                onClick={() => {

                }}
                className="px-2 py-2 my-5 border rounded-md hover:opacity-70 border-primary dark:border-primaryDarkmode text-primary dark:text-primaryDarkmode"
              >
                {t("common.loadMore")}
              </button>
            </div>} */}
              </div>
            )}
            {postList?.length === 0 && (
              <div className="px-1 py-1 text-4xl font-bold text-center text-primary dark:text-primaryDarkmode rounded-xl xl:h-fit xl:py-4 xl:mt-3">
                No posts yet!
              </div>
            )}
          </div>
        </div>
      </div>

      {songListArtist && (
        <div className="px-5 pt-2 pb-5 m-auto mx-2 my-4 bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-xl">
          <div className="mt-2 text-2xl font-bold text-center text-primary dark:text-primaryDarkmode">
            {t("artistPage.allTracks")}
          </div>
          <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary dark:text-primaryDarkmode">
            <div className="flex flex-row gap-8 ml-10">
              <div className="font-bold text-center ">#</div>
              <div className="font-bold text-center ">{t("song.title")}</div>
            </div>
          </div>
          {songListArtist?.map((songItem, index) => (
            <SongItem key={index} songOrder={index + 1} song={songItem} />
          ))}
          {/* Load More  */}
          {
            <div className="flex flex-row items-center justify-center gap-4 mt-5">
              <button
                onClick={() => {
                  setPage(page + 1);
                }}
                className="px-3 py-2 border rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode hover:opacity-70"
              >
                Load More
              </button>
            </div>
          }
        </div>
      )}
      <Modal
        footer={null}
        open={showModalFollow}
        centered
        title={follower ? "Followers" : "Following"}
        className="modalStyle"
        onCancel={() => setShowModalFollow(false)}
      >
        <div className="flex flex-col gap-2">
          {follower
            ? listFollower?.map((follower) => (
                <div
                  key={follower.follower.id}
                  className="flex flex-row items-center gap-2 overflow-auto cursor-pointer max-h-56 "
                  onClick={() => handleNavigateFollow(follower.follower)}
                >
                  <img
                    src={
                      follower.follower.avatar
                        ? follower.follower.avatar
                        : Base_AVA
                    }
                    alt="follower-avatar"
                    className="w-12 h-12 rounded-full dark:bg-white"
                  />
                  <span className="text-xl font-bold text-primary dark:text-primaryDarkmode ">
                    {follower.follower.userName}
                  </span>
                </div>
              ))
            : listFollowing?.map((following) => (
                <div
                  key={following.subject.id}
                  className="flex flex-row items-center gap-2 overflow-auto cursor-pointer max-h-56"
                  onClick={() => handleNavigateFollow(following.subject)}
                >
                  <img
                    src={
                      following.subject.avatar
                        ? following.subject.avatar
                        : Base_AVA
                    }
                    alt="following-avatar"
                    className="w-12 h-12 rounded-full dark:bg-white"
                  />
                  <span className="text-xl font-bold text-primary dark:text-primaryDarkmode">
                    {following.subject.userName}
                  </span>
                </div>
              ))}
        </div>
      </Modal>
      <LoadingLogo loading={loading}></LoadingLogo>
    </div>
  );
};

export default ArtistDetailPage;

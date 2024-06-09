import PropTypes from "prop-types";
import useIconUtils from "../../utils/useIconUtils";
import useConfig from "../../utils/useConfig";
import useUserUtils from "../../utils/useUserUtils";
import { useEffect, useState } from "react";
import PostSection from "../../components/Forum/PostSection";
import useChatUtils from "../../utils/useChatUtils";
import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { setChatChosen } from "../../redux/slice/social";
import { useDispatch, useSelector } from "react-redux";
import EditUserForm from "../../components/Users/EditUserForm";
import EditGenreForm from "../../components/Users/EditGenreForm";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import { setMyPLaylistList } from "../../redux/slice/playlist";
import useSongUtils from "../../utils/useSongUtils";
import { useTranslation } from "react-i18next";
import HistoryPage from "./HistoryPage";

// eslint-disable-next-line no-unused-vars
const UserDetailPage = ({ owned }) => {
  // const { userId } = useParams();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const { BackButton, UserCheck, LoadingLogo } = useIconUtils();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const refreshAccount = useSelector((state) => state.account.refreshAccount);
  const { Base_AVA, isMobile } = useConfig();
  const { getUserPlaylist } = useMusicAPIUtils();
  const { getUserInfor, getUserPost } = useUserUtils();
  const { createCommunity, getCommunityByArtist } = useChatUtils();
  const { getPosterColor } = useSongUtils();
  const [loading, setLoading] = useState(true);
  const [colorBG, setColorBG] = useState("");
  const [userInfor, setUserInfor] = useState({});
  const [postList, setPostList] = useState([]);
  const [isCreated, setIsCreated] = useState(false);
  const [community, setCommunity] = useState();
  const [openModalEditUser, setOpenModalEditUser] = useState(false);
  const [openModalGenres, setOpenModalGenres] = useState(false);
  const [playlistList, setPlaylistList] = useState([]);
  const { t } = useTranslation();

  const handleNavigate = (path) => {
    console.log("COMMUNITY ", community);
    navigate(`/chat/community/${path}`);
  };

  const handleCreateCommunity = async () => {
    try {
      console.log("Community", community);
      if (!isCreated) {
        await createCommunity(userId, userName);
        setIsCreated(true);
        message.success(t("message.createCommunitySuccess"));
      } else {
        dispatch(
          setChatChosen({
            // chatId: "community/" + community.id,
            chatId: community.id,
            userName: community.communityName,
            avatar: community.communityAvatar,
            communityId: community.communityId,
            communityName: community.communityName,
            hosts: community.hosts,
            joinUsers: community.joinUsers,
            approveRequests: community.approveRequests
          })
        );
        handleNavigate(community.id);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getCommunity = async () => {
    const response = await getCommunityByArtist(userId);
    if (response) {
      setIsCreated(true);
      setCommunity(response);
    }
  };

  useEffect(() => {
    getCommunity();
  }, [isCreated]);

  useEffect(() => {
    if (!userInfor || !userInfor.avatar) {
      setLoading(false);
      return;
    }
    getPosterColor(userInfor.avatar, colorBG, setColorBG, setLoading);
  }, [userInfor]);

  useEffect(() => {
    if (refreshAccount === true) {
      getUserInfor(userId).then((res) => {
        setUserInfor(res.user);
      });
      getUserPost(userId).then((res) => {
        setPostList(res.postList);
        console.log("PostList", postList);
      });
      getUserPlaylist(userId).then((data) => {
        setPlaylistList(data);
        dispatch(setMyPLaylistList(playlistList));
      });
    }
  }, [refreshAccount]);

  useEffect(() => {
    if (userId === null) {
      navigate("/login");
    }
    getUserInfor(userId).then((res) => {
      setUserInfor(res.user);
    });
    getUserPost(userId).then((res) => {
      setPostList(res.postList);
    });
    getUserPlaylist(userId).then((data) => {
      setPlaylistList(data);
      dispatch(setMyPLaylistList(playlistList));
    });
  }, [userId]);

  return (
    <div
      className={`${userId ? " h-full" : "h-fit"
        } min-h-screen p-2 bg-backgroundPrimary dark:bg-backgroundDarkPrimary pb-3`}
    >
      <div
        className={`flex flex-col items-start p-5 shadow-md rounded-xl my-3`}
        style={{
          background: `linear-gradient(to top right , transparent, ${colorBG} 300%)`,
        }}
      >
        <div className="flex flex-row mb-2">
          <BackButton></BackButton>
        </div>
        <div className="flex flex-row items-center justify-start gap-4">
          <div className="relative flex flex-row items-start mt-5 mb-5">
            <img
              src={userInfor.avatar ? userInfor.avatar : Base_AVA}
              alt="Avatar"
              className="object-cover w-20 h-20 rounded-full xl:w-56 xl:h-56"
            />
          </div>
          <div className="flex flex-col items-start gap-4 mb-5 font-bold text-center text-textNormal dark:text-textNormalDark">
            <div className="flex flex-row items-center gap-2">
              <div className="text-xl xl:text-7xl text-primary dark:text-primaryDarkmode">
                {userInfor.userName}
              </div>
              {userInfor.role == "ARTIST" && (
                <span className="text-4xl text-primary dark:text-primaryDarkmode">
                  <UserCheck></UserCheck>
                </span>
              )}
            </div>
            {userInfor.userBio && <div className="text-base xl:text-lg text-primaryText dark:text-textNormalDark opacity-80">
              {userInfor.userBio}
            </div>}
            <div className="flex flex-row items-center justify-center gap-3">
              <button
                className="h-10 px-3 text-xs transition-colors duration-150 border rounded-lg xl:text-base border-primary dark:border-primaryDarkmode w-fit text-primary dark:text-primaryDarkmode focus:shadow-outline hover:opacity-70"
                onClick={() => setOpenModalEditUser(true)}
              >
                {t("profile.editProfile")}
              </button>
              <button
                className="h-10 px-3 text-xs transition-colors duration-150 border rounded-lg xl:text-base border-primary dark:border-primaryDarkmode w-fit text-primary dark:text-primaryDarkmode focus:shadow-outline hover:opacity-70"
                onClick={() => setOpenModalGenres(true)}
              >
                {t("profile.editFavouriteGenres")}
              </button>
              {userInfor.role == "ARTIST" && (
                <button
                  onClick={handleCreateCommunity}
                  className="h-10 px-3 text-xs transition-colors duration-150 border rounded-lg xl:text-base border-primary dark:border-primaryDarkmode w-fit text-primary dark:text-primaryDarkmode focus:shadow-outline hover:opacity-70"
                >
                  {!isCreated ? t("button.createCommunity") : t("button.yourCommunity")}
                </button>
              )}
            </div>
            {userInfor.genres?.length > 0 && <div className="flex items-center justify-center gap-2">
              {t("profile.favouriteGenres")}:{" "}
              {userInfor.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="text-primary dark:text-primaryDarkmode"
                >
                  {genre.genreName}{" "}
                </span>
              ))}
            </div>}
          </div>
        </div>
      </div>
      <div className={`${isMobile ? "flex-col" : "flex-row"} gap-2 flex items-start justify-evenly w-full`}>
        <div className="xl:min-w-[600px] min-w-[400px] w-full bg-backgroundComponentPrimary dark:bg-backgroundSongItemHoverDark  dark:text-primaryTextDark2 text-primaryText2 rounded-2xl p-2 shadow-lg">
          <HistoryPage></HistoryPage>
        </div>

        <div className="w-full px-1 py-4 h-fit bg-backgroundComponentPrimary dark:bg-backgroundSongItemHoverDark xl:px-4 rounded-2xl">
          <div className="w-full h-full overflow-auto max-h-80 rounded-lg xl:max-h-[602px]">
            {postList && <div>
              <PostSection postList={postList}></PostSection>
            </div>}
            {postList?.length === 0 && (
              <div className="px-1 py-1 text-2xl font-bold text-center text-primary dark:text-primaryDarkmode rounded-xl xl:h-fit xl:py-4 xl:mt-3">
                {t("forum.noPost")}
              </div>
            )}
          </div>
        </div>

      </div>

      <Modal
        className="modalStyle"
        open={openModalEditUser}
        onCancel={() => setOpenModalEditUser(false)}
        footer={null}
        centered
      >
        <EditUserForm
          setOpenModalEditUser={setOpenModalEditUser}
          isModal={true}
        ></EditUserForm>
      </Modal>
      <Modal
        className="modalStyle"
        open={openModalGenres}
        onCancel={() => setOpenModalGenres(false)}
        footer={null}
        centered
      >
        <EditGenreForm
          genreFavourite={userInfor.genres}
          setOpenModalEditGenre={setOpenModalGenres}
        ></EditGenreForm>
      </Modal>

      <LoadingLogo loading={loading}></LoadingLogo>
    </div>
  );
};

UserDetailPage.propTypes = {
  owned: PropTypes.bool,
};

export default UserDetailPage;

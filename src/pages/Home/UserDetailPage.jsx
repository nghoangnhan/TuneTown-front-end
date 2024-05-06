import PropTypes from 'prop-types';
import useIconUtils from '../../utils/useIconUtils';
import useConfig from '../../utils/useConfig';
import useUserUtils from '../../utils/useUserUtils';
import { useEffect, useState } from 'react';
import PostSection from '../../components/Forum/PostSection';
import useChatUtils from '../../utils/useChatUtils';
import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { setChatChosen } from "../../redux/slice/social";
import { useDispatch, useSelector } from "react-redux";
import EditUserForm from '../../components/Users/EditUserForm';
import EditGenreForm from '../../components/Users/EditGenreForm';

// eslint-disable-next-line no-unused-vars
const UserDetailPage = ({ owned }) => {
    // const { userId } = useParams();
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const { BackButton, UserCheck } = useIconUtils();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refreshAccount = useSelector((state) => state.account.refreshAccount);
    const { defaultAva } = useConfig();
    const { getUserInfor, getUserPost } = useUserUtils();
    const [userInfor, setUserInfor] = useState({});
    const [postList, setPostList] = useState([]);
    const { createCommunity, getCommunityByArtist } = useChatUtils();
    const [isCreated, setIsCreated] = useState(false);
    const [community, setCommunity] = useState();
    const [openModalEditUser, setOpenModalEditUser] = useState(false);
    const [openModalGenres, setOpenModalGenres] = useState(false);

    const handleNavigate = (path) => {
        dispatch(
            setChatChosen({
                chatId: path,
                name: community.communityName,
                avatar: community.communityAvatar,
                communityId: community.communityId,
            })
        );
        console.log("COMMUNITY ", community);
        navigate(`/chat/${path}`);
    };

    const handleCreateCommunity = async () => {
        try {
            console.log("Community", community);
            if (!isCreated) {
                await createCommunity(userId, userName);
                setIsCreated(true);
                message.success("Community Created!");
            }
            else {
                dispatch(setChatChosen({
                    chatId: "community/" + community.id,
                    userName: community.communityName,
                    avatar: community.communityAvatar,
                    communityId: community.communityId
                })
                );
                handleNavigate("community/" + community.communityId);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }

    const getCommunity = async () => {
        const response = await getCommunityByArtist(userId);
        if (response) {
            setIsCreated(true);
            setCommunity(response);
        }
    }

    useEffect(() => {
        getCommunity();
    }, [isCreated]);

    useEffect(() => {
        if (refreshAccount === true) {
            getUserInfor(userId).then((res) => {
                setUserInfor(res.user);
            });
            getUserPost(userId).then((res) => {
                setPostList(res.postList)
            });
        }
    }, [refreshAccount]);

    useEffect(() => {
        if (userId === null) {
            navigate("/login");
        }
        getUserInfor(userId).then((res) => {
            console.log("USER INFOR", res);
            setUserInfor(res.user)
        });
        getUserPost(userId).then((res) => {
            setPostList(res.postList)
        });
    }, [userId]);

    return (
        <div className={`${userId ? " h-full" : "h-fit"} min-h-screen p-2 bg-backgroundPrimary dark:bg-backgroundDarkPrimary pb-3`}>
            <div className="flex flex-row mb-2">
                <BackButton></BackButton>
            </div>
            <div className="flex flex-row items-center justify-start gap-4">
                <div className="relative flex flex-row items-start mt-5 mb-5">
                    <img src={userInfor.avatar ? userInfor.avatar : defaultAva}
                        alt="Avatar"
                        className="w-20 h-20 rounded-md xl:w-56 xl:h-56"
                    />
                </div>
                <div className="flex flex-col items-start gap-4 mb-5 font-bold text-center text-textNormal dark:text-textNormalDark">
                    <div className='flex flex-row items-center gap-2'>
                        <div className="text-7xl text-primary dark:text-primaryDarkmode">{userInfor.userName}</div>
                        {userInfor.role == "ARTIST" && <span className="text-4xl text-primary dark:text-primaryDarkmode"><UserCheck></UserCheck></span>}
                    </div>
                    <div className="text-lg text-primaryText dark:text-textNormalDark opacity-80">
                        <span>Bio:</span>{" "}{userInfor.userBio}
                    </div>
                    <div className='flex flex-row items-center justify-center gap-3'>
                        <button className='h-10 px-3 text-base transition-colors duration-150 border rounded-lg border-primary dark:border-primaryDarkmode w-fit text-primary dark:text-primaryDarkmode focus:shadow-outline hover:opacity-70' onClick={() => setOpenModalEditUser(true)}>
                            Edit User Profile
                        </button>
                        <button className='h-10 px-3 text-base transition-colors duration-150 border rounded-lg border-primary dark:border-primaryDarkmode w-fit text-primary dark:text-primaryDarkmode focus:shadow-outline hover:opacity-70' onClick={() => setOpenModalGenres(true)}>
                            Change Favourite Genres
                        </button>
                        {userInfor.role == "ARTIST" &&
                            <button onClick={handleCreateCommunity} className='h-10 px-3 text-base transition-colors duration-150 border rounded-lg border-primary dark:border-primaryDarkmode w-fit text-primary dark:text-primaryDarkmode focus:shadow-outline hover:opacity-70'>
                                {!isCreated ? 'Create Community' : 'Your community'}
                            </button>
                        }
                    </div>
                    <div>
                        Favourite Genres: {userInfor.genres?.map((genre, index) => (
                            <span key={index} className='text-primary dark:text-primaryDarkmode'>{genre.genreName} </span>
                        ))}

                    </div>
                </div>
            </div>
            <div className='flex flex-row items-start justify-center w-full'>
                <div className='min-w-[500px] bg-backgroundPlaylist min-h-screen rounded-2xl p-2 shadow-lg mt-4'>
                    aaaaa
                </div>
                <div>
                    <PostSection postList={postList}></PostSection>
                </div>
            </div>
            <Modal className='bg-backgroundPrimary dark:bg-backgroundDarkPrimary' onCancel={() => setOpenModalEditUser(false)} footer={null} open={openModalEditUser}>
                <EditUserForm setOpenModalEditUser={() => setOpenModalEditUser(false)} isModal={true}></EditUserForm>
            </Modal>
            <Modal className='bg-backgroundPrimary dark:bg-backgroundDarkPrimary' open={openModalGenres} onCancel={() => setOpenModalGenres(false)} footer={null}>
                <EditGenreForm setOpenModalEditGenre={() => setOpenModalGenres(false)}></EditGenreForm>
            </Modal>
        </div>
    );
};

UserDetailPage.propTypes = {
    owned: PropTypes.bool,
};

export default UserDetailPage;
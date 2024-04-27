import PropTypes from 'prop-types';
import useIconUtils from '../utils/useIconUtils';
import useConfig from '../utils/useConfig';
import useUserUtils from '../utils/useUserUtils';
import { useEffect, useState } from 'react';
import PostSection from '../components/Forum/PostSection';
import useChatUtils from '../utils/useChatUtils';
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { setChatChosen } from "../redux/slice/social";
import { useDispatch } from "react-redux";

// eslint-disable-next-line no-unused-vars
const UserDetailPage = ({ owned }) => {
    // const { userId } = useParams();
    const userId = localStorage.getItem("userId")
    const { BackButton, UserCheck } = useIconUtils();
    const { defaultAva } = useConfig();
    const { getUserInfor, getUserPost } = useUserUtils();
    const [userInfor, setUserInfor] = useState({});
    const [postList, setPostList] = useState([]);
    const { createCommunity, getCommunityByArtist } = useChatUtils();
    const [isCreated, setIsCreated] = useState(false);
    const [community, setCommunity] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNavigate = (path) => {
        dispatch(
            setChatChosen({
                chatId: path,
                name: community.communityName,
                avatar: community.communityAvatar,
            })
        );
        console.log("COMMUNITY ", community);
        navigate(`/chat/${path}`);
    };

    const handleCreateCommunity = async () => {
        try{
            if(!isCreated){
                await createCommunity(userId);
                setIsCreated(true);
                message.success("Community Created!");    
            }
            else{
                handleNavigate("community/" + community.id);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    }    

    useEffect(() => {
        const getCommunity = async() => {
            const response = await getCommunityByArtist(userId);
            if(response){
                setIsCreated(true);
                setCommunity(response);
            }
        }
        getCommunity();
    }, [isCreated]);

    useEffect(() => {
        getUserInfor(userId).then((res) => {
            setUserInfor(res.user)
            console.log("UserDetailPage || UserInfor", userInfor);
        });
        getUserPost(userId).then((res) => {
            setPostList(res.postList)
            console.log("UserDetailPage || UserPost", postList);
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
                <div className="flex flex-col items-start gap-2 mb-5 font-bold text-center text-textNormal dark:text-textNormalDark">
                    <div className='flex flex-row items-center gap-2'>
                        <div className="text-7xl text-primary dark:text-primaryDarkmode">{userInfor.userName}</div>
                        {
                            userInfor.role == "ARTIST" && <span className="text-4xl text-primary dark:text-primaryDarkmode"><UserCheck></UserCheck></span>
                        }
                    </div>
                    <div className="text-lg text-primaryText dark:text-textNormalDark opacity-80">
                        <span>Bio:</span>{" "}{userInfor.userBio}
                    </div>
                    {userInfor.role == "ARTIST" &&
                        <div className=''>
                            <button 
                                onClick={handleCreateCommunity}
                                className='h-10 px-3 text-base transition-colors duration-150 border rounded-lg border-primary dark:border-primaryDarkmode w-fit text-primary dark:text-primaryDarkmode focus:shadow-outline hover:opacity-70'>
                                {!isCreated ? 'Create Community' : 'Your community'}
                            </button>
                        </div>
                    }
                </div>
            </div>
            <div className='flex flex-row items-start justify-center w-full'>
                <div>
                    <PostSection postList={postList}></PostSection>
                </div>
                <div>
                    <PostSection postList={postList}></PostSection>
                </div>
            </div>
        </div>
    );
};

UserDetailPage.propTypes = {
    owned: PropTypes.bool,
};

export default UserDetailPage;
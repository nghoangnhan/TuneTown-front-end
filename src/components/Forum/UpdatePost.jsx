import { Form, message } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import useConfig from "../../utils/useConfig";
import DOMPurify from 'dompurify';
import Parser from 'html-react-parser';
import UseCookie from "../../hooks/useCookie";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import ModalPlaylistPost from "./Modal/ModalPlaylistPost";
import Proptypes from "prop-types";
import { useDispatch } from "react-redux";
import { setRefreshPost } from "../../redux/slice/social";
import ModalChoseSong from "./Modal/ModalChoseSong";


const UpdatePost = ({ postContent, setOpenModalUpdate }) => {
    const [form] = Form.useForm();
    const userId = localStorage.getItem("userId");
    const dispatch = useDispatch();
    const { getToken } = UseCookie();
    const { access_token } = getToken();
    // const { LoadingLogo } = useIconUtils();
    // const { handleUploadFileMP3, handleUploadFileIMG } = useDataUtils();
    const { getPublicPlaylist } = useMusicAPIUtils();
    // const { Check } = useIconUtils();
    const { Base_URL } = useConfig();
    const [editorValue, setEditorValue] = useState(postContent.content);
    // const [fileMP3, setFileMP3] = useState(postContent.mp3Link);
    // const [fileIMG, setFileIMG] = useState(postContent.poster);
    // const [uploadedFile, setUploadedFile] = useState();
    // const [loading, setLoading] = useState(false);
    const [playlistRs, setPlaylistRs] = useState([]);
    const [openModalChosePlaylist, setOpenModalChosePlaylist] = useState(false);
    const [playlistChosen, setPlaylistChosen] = useState();
    const [openModalChoseSong, setOpenModalChoseSong] = useState(false);
    const [songChosen, setSongChosen] = useState();

    const onFinish = (values) => {
        try {
            const sanitizedContent = DOMPurify.sanitize(values.content); // XSS (Cross-site scripting) 
            const contentParser = Parser(sanitizedContent).props.children;
            const response = axios.put(`${Base_URL}/post`, {
                id: postContent.id,
                author: {
                    id: postContent.author.id
                },
                content: contentParser,
                song: postContent.song?.id ? { id: postContent.song.id } : null,
                playlist: playlistChosen?.id ? { id: playlistChosen.id } : null,
                mp3Link: null
            }, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                }
            });
            dispatch(setRefreshPost(true));
            message.success("Post Updated Successfully", 2);
            setOpenModalUpdate(false);
            return response;
        } catch (error) {
            message.error("Error Updating Post", 2);
            console.log("Error:", error);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const handleAddPlaylist = async () => {
        try {
            const listPlaylist = await getPublicPlaylist(userId);
            setPlaylistRs(listPlaylist);
            setOpenModalChosePlaylist(true);
            console.log("PLAYLISTRS", playlistRs);
        } catch (error) {
            console.error("Error adding playlist:", error);
        }
    }

    const handleSongItemClick = (song) => {
        try {
            console.log("Song Chosen", song);
            setSongChosen(song);
            setOpenModalChoseSong(false);
        } catch (error) {
            console.error("Error choosing song:", error);
        }
    }

    const handlePlaylistItemClick = (playlist) => {
        try {
            setPlaylistChosen(playlist);
            console.log("Playlist Chosen", playlistChosen);
            setOpenModalChosePlaylist(false);
        } catch (error) {
            console.error("Error choosing playlist:", error);
        }
    }

    useEffect(() => {
        if (postContent) {
            setPlaylistChosen(postContent.playlist);
            setSongChosen(postContent.song);
            form.setFieldsValue({
                content: postContent.content,
                songCoverArt: postContent?.poster,
                songData: postContent.mp3Link,
            });
        }
    }, [postContent]);

    return (
        <div className=" bg-backgroundPlaylist dark:bg-backgroundPlaylistDark">
            <Form
                form={form}
                layout="vertical"
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="mx-auto bg-backgroundPlaylist dark:bg-backgroundPlaylistDark formStyle"
            >
                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: "Please input your content!" }]}
                >
                    <ReactQuill
                        modules={{
                            toolbar: false
                        }}
                        theme="snow"
                        value={Parser(editorValue)}
                        onChange={setEditorValue}
                        placeholder="Your thoughts..."
                        className="bg-white dark:bg-backgroundDarkPrimary h-36 dark:text-white"
                    />
                </Form.Item>

                {/* Song */}
                <Form.Item>
                    <div className="flex flex-row items-center gap-2">
                        <button
                            onClick={() => setOpenModalChoseSong(true)}
                            type="button"
                            className="px-2 py-2 transition-colors duration-150 border rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode"
                        >
                            Add Song
                        </button>
                        {songChosen && <div className="text-primary">Song Chosen: {songChosen.songName}{" "}#{songChosen.id}</div>}
                    </div>
                </Form.Item>

                {/* Playlist */}
                <Form.Item>
                    <div className="flex flex-row items-center gap-2">
                        <button
                            onClick={handleAddPlaylist}
                            type="button"
                            className="px-2 py-2 text-center bg-transparent border rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode"
                        >
                            Add Playlist
                        </button>
                        {playlistChosen && <div className="text-primary dark:text-primaryDarkmode">Playlist Chosen: {playlistChosen.playlistName}{" "}#{playlistChosen.id}</div>}
                    </div>
                </Form.Item>
                <Form.Item>
                    <button
                        type="submit"
                        className="w-full h-10 px-2 py-2 text-base text-center bg-transparent border rounded-lg text-primary dark:text-primaryDarkmode hover:opacity-70 border-primary dark:border-primaryDarkmode "
                    >
                        Update Post
                    </button>
                </Form.Item>
                {/* <LoadingLogo loading={loading}></LoadingLogo> */}
            </Form>

            <ModalChoseSong openModal={openModalChoseSong} handleSongItemClick={handleSongItemClick}
                setOpenModalChoseSong={setOpenModalChoseSong}  >
            </ModalChoseSong>
            <ModalPlaylistPost handlePlaylistItemClick={handlePlaylistItemClick} openModal={openModalChosePlaylist}
                playlistRs={playlistRs} setOpenModalChosePlaylist={setOpenModalChosePlaylist}>
            </ModalPlaylistPost>
        </div>
    );
};

UpdatePost.propTypes = {
    postContent: Proptypes.object.isRequired,
    setOpenModalUpdate: Proptypes.func.isRequired,
}
export default UpdatePost;

import { Form, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useForumUtils } from "../../../utils/useChatUtils";
import useConfig from "../../../utils/useConfig";
import UpdatePost from "../../Forum/UpdatePost";
import CreatePost from "../../Forum/CreatePost";

const PostManagement = () => {
    const { Base_AVA } = useConfig();
    const [postList, setPostlist] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalCreatePost, setModalCreatePost] = useState(false)
    const [postUpdate, setPostUpdate] = useState({});
    const { getAllPostAdmin, deletePost } = useForumUtils();

    const handSearch = (e) => {
        console.log("value", e.target.value);
        setSearchValue(e.target.value);
    };

    const columnPost = [
        {
            title: "ID",
            dataIndex: "key",
            key: "key",
            align: "center",
        },
        {
            title: "Author",
            dataIndex: "author",
            key: "author",
            align: "center",
            render: (author) => (
                <div className="flex flex-row items-center">
                    {author.avatar && <img
                        src={author.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                    />}
                    <div className="ml-2">{author.userName}</div>
                </div>
            ),
        },
        {
            title: "Content",
            dataIndex: "postContent",
            key: "postContent",
            align: "center",
        }
        ,
        {
            title: "Song  ",
            dataIndex: "song",
            key: "song",
            align: "center",
            render: (song) => (
                <div className="flex flex-col items-center justify-center gap-1">
                    {song?.poster && <img
                        src={song?.poster}
                        alt="avatar"
                        className="w-10 h-10 bg-white dark:rounded-full"
                    />}
                    {song?.songName ? song.songName : "No Song"
                    }

                </div>
            ),
        },
        // {
        //     title: "Artist",
        //     dataIndex: "artist",
        //     key: "artist",
        //     align: "center",
        // },
        {
            title: "Playlist",
            dataIndex: "playlist",
            key: "playlist",
            align: "center",
            render: (playlist) => (
                <div className="flex flex-col items-center justify-center gap-1">
                    {playlist?.coverArt && <img
                        src={playlist?.coverArt}
                        alt="avatar"
                        className="w-10 h-10 bg-white dark:rounded-full"
                    />}
                    <div className="ml-2">{playlist?.playlistName ? playlist.playlistName : "No playlist"}</div>
                </div>
            ),
        },
        {
            title: "Likes",
            dataIndex: "likes",
            key: "likes", align: "center",
        },
        {
            title: "Date",
            dataIndex: "postTime",
            key: "postTime", align: "center",
            render(dateee) {
                const date = new Date(dateee);
                return (
                    <div>
                        {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                    </div>
                );
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action", align: "center",
            render: (text, record) => (
                <div className="flex flex-row justify-center gap-2">
                    <button
                        className="w-16 px-2 py-1 border rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode hover:opacity-60"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </button>
                    <button
                        className="w-16 px-2 py-1 text-red-600 border border-red-600 rounded-md dark:text-red-600 dark:border-red-600 hover:opacity-60"
                        onClick={() => handleDelete(record)}
                    >
                        Delete
                    </button>
                </div>
            )
        },
    ];

    const handleDelete = (record) => {
        console.log("Delete", record);
        deletePost(record.key).then((res) => {
            console.log("res", res);
            setRefresh(true);
        });
    };

    const handleEdit = (record) => {
        console.log("Edit", record);
        setOpenModalUpdate(true);
        const postContent = {
            id: record.key,
            author: record.author,
            playlist: record.playlist,
            song: record.song,
            content: record.postContent,
            mp3Link: record.mp3Link,
        }
        setPostUpdate(postContent);
    };

    const dataPosts = postList.length > 0 && postList.map((postItem) => ({
        // ID, Avatar, Name, Content, Song.poster, song.avatar,playlist.coverart, playlist.playlistName, Action.detail
        key: postItem.id,
        author: postItem.author,
        postContent: postItem.content,
        songName: postItem.song?.songName,
        artist: postItem.song?.artists.map((artist) => artist.userName).join(" "),
        playlist: postItem.playlist,
        song: postItem.song,
        listens: postItem.song?.listens,
        likes: postItem.likes.length,
        postTime: postItem?.postTime,
    }));
    console.log("dataPosts", dataPosts);

    useEffect(() => {
        getAllPostAdmin().then((res) => {
            console.log("res", res);
            setPostlist(res.postList);
        });
    }, []);

    useEffect(() => {
        if (refresh === true)
            getAllPostAdmin().then((res) => {
                setRefresh(false);
                setPostlist(res.postList);
            });
    }, [refresh]);

    if (!postList) return null;
    return (
        <div className="h-full min-h-screen">
            <div className="text-2xl font-bold text-primary dark:text-primaryDarkmode">Post Management</div>
            <div className="flex flex-row justify-between mt-5 mb-5 ">
                <div className="">
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        layout="inline"
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                    >
                        <Form.Item label="" name="author">
                            <Input placeholder="Search..." onChange={handSearch} className="text-primaryText2 dark:text-primaryTextDark2" />
                        </Form.Item>
                    </Form>
                </div>
                {/* <div>
                    <button
                        className="px-4 py-2 text-white rounded-md bg-primary dark:bg-primaryDarkmode hover:opacity-70"
                        onClick={() => setModalCreatePost(true)}
                    >
                        Create New Post
                    </button>
                </div> */}
            </div>
            <Table
                columns={columnPost}
                dataSource={
                    searchValue
                        ? dataPosts.filter((post) =>
                            post?.author.userName.toLowerCase().includes(searchValue.toLowerCase())) : dataPosts}
                pagination={{ pageSize: 8 }}
            />
            <Modal
                title="Update Post"
                // onOk={handleOk}
                onCancel={() => {
                    setOpenModalUpdate(false);
                }}
                open={openModalUpdate}
                footer={null}
                centered
                className="modalStyle"
            >
                <UpdatePost
                    postContent={postUpdate}
                    setPostContent={setPostUpdate}
                ></UpdatePost>
            </Modal>
            <Modal
                title="Update Post"
                // onOk={handleOk}
                onCancel={() => {
                    setModalCreatePost(false);
                    setPostUpdate({});
                }}
                open={openModalCreatePost}
                footer={null}
                centered
                className="modalStyle"
            >
                <CreatePost></CreatePost>
            </Modal>
        </div>
    );
};

PostManagement.propTypes = {

};

export default PostManagement;
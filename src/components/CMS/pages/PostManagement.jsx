import { Form, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useForumUtils } from "../../../utils/useChatUtils";
import useConfig from "../../../utils/useConfig";
import UpdatePost from "../../Forum/UpdatePost";

const PostManagement = () => {
    const { Base_AVA } = useConfig();
    const [postList, setPostlist] = useState([
        {
            "id": 1,
            "author": {
                "id": 202,
                "userName": "Nhat Nam Nguyen",
                "email": "nguyennam2002pro@gmail.com",
                "password": "$2a$10$w7YPO7I3A3ZynqnNfsgwOu5XqMewGSZj9nBrRmM9hY7kdOow353ES",
                "role": "USER",
                "birthDate": null,
                "userBio": null,
                "avatar": "https://lh3.googleusercontent.com/a/ACg8ocKgX_DfeFyEuTT--dwPLbWUbxn260uA_F3p0ZrZ4Y9N=s96-c",
                "method": "GOOGLE",
                "genres": []
            },
            "content": "Test post",
            "song": {
                "id": 602,
                "songName": "Test 7",
                "poster": "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Fstarboy.jpg?alt=media&token=d11360ab-a94e-4445-8539-609d7514e398",
                "artists": [
                    {
                        "id": 1202,
                        "userName": "The Weeknd",
                        "email": "theweeknd@gmail.com",
                        "password": "$2a$10$dngXenLKAEkkf7Ory.OiqeTdhGZyC6VVshcUTWy/jeGiKHLB1W8Ce",
                        "role": "ARTIST",
                        "birthDate": "2001-01-01",
                        "userBio": "I am an artist",
                        "avatar": "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Fstarboy.jpg?alt=media&token=3e23a99b-473d-4c0e-9b21-8847bc7ca0ba",
                        "method": null,
                        "genres": [
                            {
                                "id": 8,
                                "genreName": "Indie"
                            },
                            {
                                "id": 1,
                                "genreName": "Pop"
                            },
                            {
                                "id": 6,
                                "genreName": "Classic"
                            },
                            {
                                "id": 5,
                                "genreName": "Country"
                            }
                        ]
                    }
                ],
                "genres": [],
                "songData": "https://storage.googleapis.com/tunetown-6b63a.appspot.com/audios/BlindingLight/BlindingLight_",
                "likes": 0,
                "listens": 1,
                "status": 1,
                "lyric": null
            },
            "mp3Link": null,
            "playlist": {
                "id": 452,
                "playlistName": "New playlist",
                "user": {
                    "id": 1202,
                    "userName": "The Weeknd",
                    "email": "theweeknd@gmail.com",
                    "password": "$2a$10$dngXenLKAEkkf7Ory.OiqeTdhGZyC6VVshcUTWy/jeGiKHLB1W8Ce",
                    "role": "ARTIST",
                    "birthDate": "2001-01-01",
                    "userBio": "I am an artist",
                    "avatar": "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Fstarboy.jpg?alt=media&token=3e23a99b-473d-4c0e-9b21-8847bc7ca0ba",
                    "method": null,
                    "genres": [
                        {
                            "id": 8,
                            "genreName": "Indie"
                        },
                        {
                            "id": 1,
                            "genreName": "Pop"
                        },
                        {
                            "id": 6,
                            "genreName": "Classic"
                        },
                        {
                            "id": 5,
                            "genreName": "Country"
                        }
                    ]
                },
                "playlistType": "Private",
                "coverArt": "https://firebasestorage.googleapis.com/v0/b/tunetown-6b63a.appspot.com/o/images%2Fdontoliver.jpg?alt=media&token=a15c7c74-84e7-4be0-a020-fb879bb6428c",
                "playlistSongsList": null
            },
            "likes": [],
            "comments": [],
            "postTime": null
        },
    ]);
    const [refresh, setRefresh] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [postUpdate, setPostUpdate] = useState({});
    const { getAllPost, deletePost } = useForumUtils();

    const handSearch = (e) => {
        console.log("value", e.target.value);
        setSearchValue(e.target.value);
    };

    const columnPost = [
        // ID, Avatar, Name, Content, Song.poster, song.avatar,playlist.coverart, playlist.playlistName, Action.detail
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
                    <img
                        src={author.avatar ? author.avatar : Base_AVA}
                        alt="avatar"
                        className="w-6 h-6 rounded-full"
                    />
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
            title: "Song Name",
            dataIndex: "songName",
            key: "songName",
            align: "center",
        },
        {
            title: "Artist",
            dataIndex: "artist",
            key: "artist",
            align: "center",
        },
        {
            title: "Playlist",
            dataIndex: "playlist",
            key: "playlist",
            align: "center",
            render: (playlist) => (
                <div className="flex flex-col items-center justify-center gap-1">
                    <img
                        src={playlist?.coverArt ? playlist.coverArt : Base_AVA}
                        alt="avatar"
                        className="w-10 h-10 rounded-md"
                    />
                    <div className="ml-2">{playlist?.playlistName ? playlist.playlistName : "No name playlist"}</div>
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
            ),

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
            content: record.postContent,
            playlist: record.playlist,
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
        listens: postItem.song?.listens,
        likes: postItem.likes.length,
        postTime: postItem?.postTime,
    }));
    console.log("dataPosts", dataPosts);

    useEffect(() => {
        getAllPost().then((res) => {
            console.log("res", res);
            setPostlist(res.postList);
        });
    }, []);

    useEffect(() => {
        if (refresh === true)
            getAllPost().then((res) => {
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
                            <Input placeholder="Search..." onChange={handSearch} />
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    <button
                        className="px-4 py-2 text-white rounded-md bg-primary dark:bg-primaryDarkmode hover:opacity-70"
                    // onClick={showModal}
                    >
                        Create New Post
                    </button>
                </div>
            </div>
            <Table
                columns={columnPost}
                dataSource={
                    searchValue
                        ? dataPosts.filter((post) =>
                            post.author.toLowerCase().includes(searchValue.toLowerCase())) : dataPosts}
                pagination={{ pageSize: 8 }}
            />
            <Modal
                title="Update Post"
                visible={false}
                // onOk={handleOk}
                onCancel={() => {
                    setOpenModalUpdate(false);
                }}
                open={openModalUpdate}
                footer={null}
            >
                <UpdatePost
                    postContent={postUpdate}
                    setPostContent={setPostUpdate}
                ></UpdatePost>
            </Modal>
        </div>
    );
};

PostManagement.propTypes = {

};

export default PostManagement;
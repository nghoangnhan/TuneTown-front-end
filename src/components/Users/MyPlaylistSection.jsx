import { useEffect, useState } from "react";
import { Base_URL } from "../../api/config";
import UseCookie from "../../hooks/useCookie";
import axios from "axios";
import { useMusicAPI } from "../../utils/songUtils";
import { useDispatch } from "react-redux";
import { setMyPLaylistList } from "../../redux/slice/playlist";
import MyPlaylistItem from "./MyPlaylistItem";

const MyPlaylistSection = () => {
  const { getToken } = UseCookie();
  const { getUserPlaylist } = useMusicAPI();
  const { access_token } = getToken();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const [playlistList, setPlaylistList] = useState();
  const [refresh, setRefresh] = useState(false);

  // Call this function when you want to refresh the playlist
  const refreshPlaylist = () => {
    setRefresh(!refresh);
  };

  // Create a new playlist
  const CreateNewPlaylist = async () => {
    try {
      const response = await axios.post(
        `${Base_URL}/playlists?userId=${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status == 200) {
        console.log("Create new playlist successfully");
        alert("Create new playlist successfully");
        refreshPlaylist();
        // setRefresh(!refresh);
      }
      return response.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      if (
        confirm(
          `Are you sure you want to delete this playlist? id: ${playlistId}`
        ) == true
      ) {
        const response = await axios.delete(
          `${Base_URL}/playlists?playlistId=${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log("songList Response", response.data);
        // Refresh the component
        refreshPlaylist();
        return response.data;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getUserPlaylist(userId).then((data) => {
      setPlaylistList(data);
      console.log("playlistttt", playlistList);
      dispatch(setMyPLaylistList(playlistList));
    });
  }, [refresh]);

  // dispatch(setPlaylistList(playlistList));
  // if (!playlistList) return null;
  // console.log("playlistttt", playlistList);

  if (!playlistList)
    return (
      <div className="playlist-section xl:w-full xl:py-2">
        <button
          onClick={CreateNewPlaylist}
          className=" border-solid border border-[#54f466] text-[#3ecd4f] hover:text-white  bg-[#ffffff71] hover:bg-[#40cf62] rounded-md mb-5 mt-3 ml-3"
        >
          <div className="font-bold px-2 py-2">+ Create New Playlist</div>
        </button>
        <div className="text-center font-bold text-3xl text-[#339e3f]">
          Create your new playlist!
        </div>
      </div>
    );
  return (
    <div className="playlist-section xl:w-full xl:py-2">
      <button
        onClick={CreateNewPlaylist}
        className=" border-solid border border-[#54f466] text-[#3ecd4f] hover:text-white  bg-[#ffffff71] hover:bg-[#40cf62] rounded-md mb-5 mt-3 ml-3"
      >
        <div className="font-bold px-2 py-2">+ Create New Playlist</div>
      </button>

      <div className="grid xl:grid-cols-4 gap-y-1 grid-cols-1 xl:px-5">
        {playlistList &&
          playlistList.map((playlistItem) => (
            <div
              className="flex justify-center xl:w-full xl:h-full mt-10"
              key={playlistItem.id}
              onContextMenu={(event) => {
                event.preventDefault();
                deletePlaylist(playlistItem.id);
              }}
            >
              <MyPlaylistItem
                key={playlistItem.id}
                id={playlistItem.id}
                playlistName={playlistItem.playlistName}
                playlistType={playlistItem.playlistType}
                users={playlistItem.users}
                coverArt={playlistItem.coverArt}
              ></MyPlaylistItem>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyPlaylistSection;

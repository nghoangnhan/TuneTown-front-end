import { useEffect, useState } from "react";
import UseCookie from "../../hooks/useCookie";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setMyPLaylistList } from "../../redux/slice/playlist";
import MyPlaylistItem from "./MyPlaylistItem";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";
import { useTranslation } from "react-i18next";

const MyPlaylistSection = () => {
  const { getToken } = UseCookie();
  const { Base_URL } = useConfig();
  const { CreatePlaylistButton } = useIconUtils();
  const { getUserPlaylist } = useMusicAPIUtils();
  const { access_token } = getToken();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const [playlistList, setPlaylistList] = useState();
  const [refresh, setRefresh] = useState(false);
  const { t } = useTranslation();

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
      dispatch(setMyPLaylistList(playlistList));
    });
  }, [refresh]);

  if (!playlistList)
    return (
      <div className="playlist-section xl:w-full xl:py-2">
        <CreatePlaylistButton
          CreateNewPlaylist={CreateNewPlaylist}
        ></CreatePlaylistButton>
        <div className="text-3xl font-bold text-center text-primary dark:text-primaryDarkmode">
          {t("playlist.createYourNewPlaylist")}!
        </div>
      </div>
    );
  return (
    <div className="playlist-section xl:w-full xl:py-2">
      <CreatePlaylistButton
        CreateNewPlaylist={CreateNewPlaylist}
      ></CreatePlaylistButton>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-y-1 xl:px-5">
        {playlistList &&
          playlistList.map((playlistItem) => (
            <div
              className="flex justify-center mt-10 xl:w-full xl:h-full"
              key={playlistItem.id}
              onContextMenu={(event) => {
                event.preventDefault();
                deletePlaylist(playlistItem.id);
              }}
            >
              <MyPlaylistItem
                key={playlistItem.id}
                id={playlistItem.id}
                playlistInfo={playlistItem}
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

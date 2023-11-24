import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types, no-unused-vars
const PlaylistItem = ({ id, playlistName, playlistType }) => {
  const navigate = useNavigate();

  // const showPopconfirm = () => {
  //   setOpen(true);
  // };
  // const deletePlaylist = async (playlistId) => {
  //   try {
  //     confirm(`Are you sure you want to delete this playlist?`);
  //     if (confirm) {
  //       console.log("auth", access_token);
  //       const response = await axios.delete(
  //         `${Base_URL}/playlists?playlistId=${playlistId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${access_token}`,
  //           },
  //         }
  //       );
  //       console.log("songList Response", response.data);
  //       setRefresh(true);
  //       return response.data;
  //     }
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };

  return (
    <div
      className="w-fit border-[1px] rounded-xl border-solid border-[#4cd658] bg-white hover:bg-slate-200 cursor-pointer"
      onClick={() => navigate(`/detail/${id}`)}
    >
      <div className="xl:w-fit xl:h-fit pb-3 w-fit h-fit rounded-[12px] bg-transparent">
        <img
          className="ml-[13px] xl:ml-[15px] mt-[15px] mr-[15px] xl:w-[128px] xl:h-[121px] w-[102px] h-[90px] rounded-lg object-cover"
          alt="Album cover"
          src="https://i.pinimg.com/550x/f8/87/a6/f887a654bf5d47425c7aa5240239dca6.jpg"
        />
        <div className="ml-[13px] xl:ml-[15px] mt-[12px] text-[#2E3271] font-bold text-lg">
          {playlistName}
        </div>
        <div className="ml-[13px] xl:ml-[15px] mt-1 text-[#6d7da1bf]">
          {playlistType} <span className="text-[#b1bfe0bf]">#{id}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;

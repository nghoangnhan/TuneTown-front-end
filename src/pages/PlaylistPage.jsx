import { useEffect } from "react";
import PlaylistSection from "../components/HomePage/PlaylistSection";

const PlaylistPage = () => {
  // const [playlistList, setPlaylistList] = useState();
  // const userId = useSelector((state) => state.account.usersInfor.id);

  useEffect(() => {}, []);
  return (
    <div className="bg-[#ecf2fd] h-full mb-20 pt-16 px-1 xl:px-5 py-5">
      <h1 className="text-[#2E3271]  text-2xl font-bold mb-5">Playlist Page</h1>
      {/* Button back to history */}
      <button
        onClick={() => window.history.back()}
        className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
      >
        <div className="text-white font-bold px-2 py-2">{"<"} TuneTown</div>
      </button>
      {/* 
      <button
        onClick={CreateNewPlaylist}
        className=" border-solid border border-[#54f466] text-[#3ecd4f] hover:text-white  bg-[#ffffff71] hover:bg-[#40cf62] rounded-md mb-5 ml-3"
      >
        <div className="font-bold px-2 py-2">+ Create New Playlist</div>
      </button> */}
      <div className="bg-[#FFFFFFCC] p-5 rounded-md">
        <h1 className="text-[#2E3271]  text-2xl font-bold mb-2">My Playlist</h1>
        <PlaylistSection></PlaylistSection>
      </div>
    </div>
  );
};

export default PlaylistPage;

import { useEffect } from "react";
import MyPlaylistSection from "../components/Users/MyPlaylistSection";
import useIconUtils from "../utils/useIconUtils";

const PlaylistPage = () => {
  // const [playlistList, setPlaylistList] = useState();
  // const userId = useSelector((state) => state.account.usersInfor.id);
  const { BackButton } = useIconUtils();

  useEffect(() => { }, []);
  return (
    <div className="bg-backgroundPrimary dark:bg-backgroundDarkPrimary h-full mb-20 pt-16 px-1 xl:px-5 py-5">
      {/* <h1 className="text-headingText dark:text-headingTextDark  text-2xl font-bold mb-5">Playlist Page</h1> */}
      {/* Button back to history */}
      <BackButton></BackButton>
      <div className="bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary p-5 mt-5 rounded-md shadow-md">
        <h1 className="text-headingText dark:text-headingTextDark text-center text-3xl font-bold mb-2">
          My Playlist
        </h1>
        <MyPlaylistSection></MyPlaylistSection>
      </div>
    </div>
  );
};

export default PlaylistPage;

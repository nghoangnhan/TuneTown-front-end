import { useEffect } from "react";
import MyPlaylistSection from "../../components/Users/MyPlaylistSection";
import useIconUtils from "../../utils/useIconUtils";
import { useTranslation } from "react-i18next";

const PlaylistPage = () => {
  // const [playlistList, setPlaylistList] = useState();
  // const userId = useSelector((state) => state.account.usersInfor.id);
  const { BackButton } = useIconUtils();
  const { t } = useTranslation();

  useEffect(() => {}, []);
  return (
    <div className="h-full px-1 py-5 pt-16 pb-20 bg-backgroundPrimary dark:bg-backgroundDarkPrimary xl:px-5">
      {/* <h1 className="mb-5 text-2xl font-bold text-headingText dark:text-headingTextDark">Playlist Page</h1> */}
      {/* Button back to history */}
      <BackButton></BackButton>
      <div className="p-5 mt-5 rounded-md shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary">
        <h1 className="mb-2 text-4xl font-bold text-center text-primary dark:text-primaryDarkmode">
          {t("playlist.myPlaylist")}
        </h1>
        <MyPlaylistSection></MyPlaylistSection>
      </div>
    </div>
  );
};

export default PlaylistPage;

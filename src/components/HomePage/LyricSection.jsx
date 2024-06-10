import { useSelector } from "react-redux";
import useSongUtils from "../../utils/useSongUtils";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useConfig from "../../utils/useConfig";
import { useTranslation } from "react-i18next";

const LyricSection = ({ lyric }) => {
  const { showArtistV2 } = useSongUtils();
  const { default_Img } = useConfig();
  const songInfor = useSelector((state) => state.music.currentSong);
  const [lyrical, SetLyrical] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    if (lyric != null) {
      SetLyrical(lyric);
    } else if (lyric == null) {
      SetLyrical(songInfor.lyric);
    }
  }, [lyric]);

  if (!lyrical || lyrical === "") {
    return (
      <div className="max-h-screen xl:h-screen">
        <div className="h-full px-4 pt-8 mt-5 mb-5 text-2xl font-bold text-center bg-backgroundPrimary dark:bg-backgroundDarkPrimary text-primary dark:text-primaryDarkmode">
          {t("lyrics.noLyrics")}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen gap-4 px-4 pt-10 pb-4 h-fit xl:pb-10 bg-backgroundPrimary dark:bg-backgroundDarkPrimary xl:flex-row">
      {/* <div className="px-2 xl:px-4">
        <img
          src={songInfor.songCover ? songInfor.songCover : default_Img}
          className="h-auto rounded-md max-w-64"
          alt="Song Cover"
        />
        <h2 className="text-4xl font-bold text-primary dark:text-primaryDarkmode">
          {songInfor.songName}
        </h2>
        <div className="text-primaryText2 dark:text-primaryTextDark">
          {showArtistV2(songInfor?.artists)}
        </div>
      </div> */}
      <div className="flex items-center gap-4 flex-col w-full xl:h-[700px] bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary shadow-xl rounded-md p-5 overflow-y-auto pb-3">
        <div className="mb-2 text-5xl font-bold text-primary dark:text-primaryDarkmode">
          {t("lyrics.lyrics")}
        </div>
        <div className="mt-2 text-xl font-bold text-center whitespace-pre-line text-primaryText2 dark:text-primaryTextDark2"
          dangerouslySetInnerHTML={{ __html: lyrical }}
        >
        </div>
      </div>
    </div>
  );
};

LyricSection.propTypes = {
  lyric: PropTypes.string,
};

export default LyricSection;

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

  if (!lyrical) {
    return (
      <div className="max-h-screen xl:h-screen">
        <div className="h-full text-center text-2xl pt-8 px-4 bg-backgroundComponentPrimary dark:bg-backgroundDarkMusicControl text-[#5d5c5c] font-bold mt-5 mb-5">
          This song has no lyric!
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 px-4 pt-8 pb-4 rounded-lg h-fit xl:pb-10 bg-backgroundComponentPrimary dark:bg-backgroundDarkMusicControl xl:flex-row">
      <div className="px-2 xl:px-4">
        <img
          src={songInfor.songCover ? songInfor.songCover : default_Img}
          className="h-auto rounded-md max-w-64"
          alt="Song Cover"
        />
        <h2 className="text-xl font-bold text-primary dark:text-primaryDarkmode">
          {songInfor.songName}
        </h2>
        <div className="text-primaryText2 dark:text-primaryTextDark">
          {showArtistV2(songInfor?.artists)}
        </div>
      </div>
      <div className="w-full xl:h-[550px] bg-backgroundPrimary dark:bg-backgroundDarkPrimary shadow-xl rounded-md p-5 overflow-y-auto pb-3">
        <div className="mb-2 text-2xl font-bold text-primary dark:text-primaryDarkmode">
          {t("lyrics.lyrics")}
        </div>
        <div className="text-[#7C8DB5] text-sm whitespace-pre-line">
          {lyrical}
        </div>
      </div>
    </div>
  );
};

LyricSection.propTypes = {
  lyric: PropTypes.string,
};

export default LyricSection;

import { useParams } from "react-router-dom";
import AudioWaveSurfer from "../../components/Forum/AudioWaveSurfer";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";
import ColorThief from "colorthief";
import { useEffect, useState } from "react";
import useSongUtils from "../../utils/useSongUtils";
import LyricSection from "../../components/HomePage/LyricSection";
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";
import TheHeader from "../../components/Header/TheHeader";

const SongDetailPage = () => {
  const { songId } = useParams();
  const { Base_AVA } = useConfig();
  const { BackButton, PlayButton } = useIconUtils();
  const { rgbToHex } = useSongUtils();
  const { getSongById } = useMusicAPIUtils();
  const [colorBG, setColorBG] = useState("");
  const [loading, setLoading] = useState(true);
  const [songDetail, setSongDetail] = useState();

  const getSongDetailById = async () => {
    const response = await getSongById(parseInt(songId));
    setSongDetail(response);
  };
  const getPosterColor = async (poster) => {
    return new Promise((resolve, reject) => {
      const colorThief = new ColorThief();
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        const color = colorThief.getColor(img);
        const hexColor = rgbToHex(color[0], color[1], color[2]);
        setColorBG(hexColor);
        console.log("Color", colorBG);
        setLoading(false);
      };

      img.onerror = (error) => {
        reject(error); // Reject the promise if there's an error loading the image
      };
      img.src = poster;
    });
  };

  useEffect(() => {
    getSongDetailById();
  }, [songId]);

  useEffect(() => {
    if (!songDetail || !songDetail.poster) {
      setLoading(false);
      return;
    }
    getPosterColor(songDetail.poster);
  }, [songDetail]);

  if (loading) {
    return (
      <div className="text-4xl font-bold text-center text-primary dark:text-primaryDarkmode ">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`${
        songId ? "h-full" : "h-fit"
      } min-h-screen p-2 bg-backgroundPrimary dark:bg-backgroundDarkPrimary`}
    >
      <div className="mb-4">
        <TheHeader></TheHeader>
      </div>
      <div
        className={`flex flex-col items-start p-5 shadow-md rounded-xl`}
        style={{
          background: `linear-gradient(to top right , transparent, ${colorBG} 98%)`,
        }}
      >
        <div className="mb-4">
          <BackButton></BackButton>
        </div>
        <div className="flex flex-row items-center gap-4">
          <img
            src={songDetail?.poster ? songDetail.poster : Base_AVA}
            alt="song-poster"
            className="w-20 h-20 rounded-md xl:w-56 xl:h-56"
          />
          <div className="flex flex-col items-start gap-5">
            <div className="font-bold text-center text-7xl text-primaryDarkmode dark:text-primaryDarkmode">
              {songDetail?.songName}
            </div>
            <div className="flex flex-row items-center gap-2 text-primaryDarkmode dark:text-primaryDarkmode">
              {songDetail?.artists?.map((artist) => {
                return (
                  <div
                    className="flex flex-row items-center gap-2"
                    key={artist.id}
                  >
                    <img
                      src={artist.avatar ? artist.avatar : Base_AVA}
                      alt="artist-avatar"
                      className="w-10 h-10 rounded-md"
                    />
                    <div className="text-lg font-bold">{artist.userName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 mt-4">
          <PlayButton size={3}></PlayButton>

          <button className="px-2 py-2 font-bold text-white rounded-md bg-primary hover:opacity-70 dark:bg-primaryDarkmode">
            Add to Playlist
          </button>
        </div>
      </div>

      <div className="flex flex-row items-start mt-10">
        <div className="w-full">
          <AudioWaveSurfer song={songDetail}></AudioWaveSurfer>
        </div>
        <div>
          <LyricSection lyric={songDetail?.lyric}></LyricSection>
        </div>
      </div>
    </div>
  );
};

SongDetailPage.propTypes = {};

export default SongDetailPage;

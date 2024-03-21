import { useSelector } from "react-redux";
import useSongDuration from "../../utils/songUtils";

const LyricSection = () => {
  const songInfor = useSelector((state) => state.music.currentSong);
  const { showArtistV2 } = useSongDuration();
  if (!songInfor.lyric) {
    return (
      <div className=" xl:h-screen max-h-screen">
        <div className="h-full text-center text-2xl pt-8 px-4 font-bold bg-[#ecf2fd] text-[#5d5c5c] font-boldmt-5 mb-5">
          This song has no lyric!
        </div>
      </div>
    );
  }
  return (
    <div className="h-fit pb-4 xl:pb-10 pt-8 px-4 bg-[#ecf2fd] flex xl:flex-row flex-col gap-4">
      <div className="xl:px-4 px-2">
        <img
          src={
            songInfor.songCover
              ? songInfor.songCover
              : "https://i.pinimg.com/originals/3e/8e/3d/3e8e3d3f7d0d5d3e2b5c6d9e5e9d7f3b.jpg"
          }
          className="max-w-64 h-auto rounded-md"
          alt="Song Cover"
        />
        <h2 className="text-xl text-[#2E3271] font-bold">
          {songInfor.songName}
        </h2>
        <div className="text-[#7C8DB5]">{showArtistV2(songInfor.artists)}</div>
      </div>
      <div className="w-full xl:h-[550px] bg-[#ecf2fd] shadow-xl rounded-md p-5 overflow-y-auto pb-3">
        <div className="text-[#2E3271] font-bold text-2xl mb-2">Lyrics</div>
        <div className="text-[#7C8DB5] text-sm whitespace-pre-line">
          {songInfor.lyric}
        </div>
      </div>
    </div>
  );
};

export default LyricSection;

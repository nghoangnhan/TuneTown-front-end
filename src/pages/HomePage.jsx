import BannerSection from "../components/HomePage/BannerSection";
import PlaylistSection from "../components/HomePage/PlaylistSection";
import SongChart from "../components/HomePage/SongChart";
import SongSection from "../components/HomePage/SongSection";

const HomePage = () => {
  const userName = localStorage.getItem("userName");
  return (
    <div className="h-auto min-h-screen text-[#2E3271] bg-[#ecf2fd] pt-5 pb-24 px-1">
      <div className="p-5">
        <div className="text-4xl font-bold mb-2">Home</div>
        <div className="text-xl font-bold">
          Good{" "}
          {new Date().getHours() < 12
            ? "Morning"
            : new Date().getHours() < 18
            ? "Afternoon"
            : "Evening"}
          , {userName}!
        </div>
      </div>
      <div>
        <BannerSection></BannerSection>
      </div>

      <div>
        <PlaylistSection playlistTitle="Christmas is coming"></PlaylistSection>
        <PlaylistSection playlistTitle="Happy New Year"></PlaylistSection>
      </div>
      <div className="flex xl:flex-row flex-col">
        <div className="flex-auto">
          <SongSection titleSong="Made for you"></SongSection>
        </div>
        <div>
          <SongChart></SongChart>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

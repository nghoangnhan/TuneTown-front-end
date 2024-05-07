import BannerSection from "../../components/HomePage/BannerSection";
import PlaylistSection from "../../components/HomePage/PlaylistSection";
import SongChart from "../../components/HomePage/SongChart";
import SongSection from "../../components/HomePage/SongSection";

const HomePage = () => {
  const userName = localStorage.getItem("userName");
  return (
    <div className="h-auto min-h-screen px-1 pt-5 pb-24 text-primary bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      <div className="p-5">
        <div className="mb-2 text-4xl font-bold">Home</div>
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
      <BannerSection></BannerSection>
      <div className="flex flex-col xl:flex-row">
        <div className="flex-auto">
          <SongSection titleSong="Made for you"></SongSection>
        </div>
        <div className="flex-auto">
          <SongChart></SongChart>
        </div>
      </div>
      <div>
        <PlaylistSection playlistTitle="Happy New Year"></PlaylistSection>
        <PlaylistSection playlistTitle=""></PlaylistSection>
      </div>
    </div>
  );
};

export default HomePage;

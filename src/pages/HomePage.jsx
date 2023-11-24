import PlaylistSection from "../components/HomePage/PlaylistSection";
import SongSection from "../components/HomePage/SongSection";

const HomePage = () => {
  return (
    <div className="text-[#2E3271] bg-[#ecf2fd] h-auto pt-5 pb-20 px-1">
      <div>
        <PlaylistSection playlistTitle="Chart: Top 50"></PlaylistSection>
        <PlaylistSection playlistTitle="Christmas is coming"></PlaylistSection>
      </div>
      <div>
        <SongSection titleSong="Made for you"></SongSection>
        <SongSection titleSong="For you soul"></SongSection>
      </div>
    </div>
  );
};

export default HomePage;

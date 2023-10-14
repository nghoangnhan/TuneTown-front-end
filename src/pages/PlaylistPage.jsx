import PlaylistSection from "../components/HomePage/PlaylistSection";

const PlaylistPage = () => {
  return (
    <div className="text-white bg-[#B9C0DE] h-screen pt-16 p-5">
      <h1 className="text-[#2E3271]  text-2xl font-bold mb-5">Playlist Page</h1>
      <div className="bg-[#FFFFFFCC] p-5 rounded-md">
        <h1 className="text-[#2E3271]  text-2xl font-bold mb-2">
          Top 5 Playlist
        </h1>
        <PlaylistSection></PlaylistSection>
      </div>
      <div className="bg-[#FFFFFFCC] p-5 rounded-md mt-5">
        <h1 className="text-[#2E3271]  text-2xl font-bold mb-2">
          Top 10 Playlist
        </h1>
        <PlaylistSection></PlaylistSection>
      </div>
    </div>
  );
};

export default PlaylistPage;

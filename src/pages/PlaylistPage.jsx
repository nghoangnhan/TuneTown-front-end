import PlaylistSection from "../components/HomePage/PlaylistSection";

const PlaylistPage = () => {
  return (
    <div className="text-white bg-[#B9C0DE] h-full mb-20 pt-16 px-1 xl:px-5 py-5">
      <h1 className="text-[#2E3271]  text-2xl font-bold mb-5">Playlist Page</h1>
      {/* Button back to history */}
      <button
        onClick={() => window.history.back()}
        className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
      >
        <div className="text-white font-bold px-2 py-2">{"<"} TuneTown</div>
      </button>
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

import PlaylistSection from "../components/HomePage/PlaylistSection";
import SongSection from "../components/HomePage/SongSection";

const HomePage = () => {
  return (
    <div className="text-[#2E3271] bg-[#ecf2fd] h-auto pt-5 pb-20 px-1">
      <div className="bg-[#FFFFFFCC] rounded-2xl max-xl:w-full m-auto xl:h-fit xl:ml-5 xl:mr-5 xl:mt-5 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
        <h1 className="text-[#2E3271] text-xl font-bold">Chart: Top 50</h1>
        <PlaylistSection></PlaylistSection>
      </div>
      <div className="bg-[#FFFFFFCC] rounded-2xl max-xl:w-full m-auto xl:h-fit xl:ml-5 xl:mr-5 xl:mt-8 mt-4 pt-3 xl:pt-5 pl-3 xl:pl-5 pr-3 xl:pr-5 pb-3 xl:pb-5">
        <h1 className="text-[#2E3271] text-xl font-bold">Recommend Song</h1>
        <SongSection></SongSection>
      </div>
    </div>
  );
};

export default HomePage;

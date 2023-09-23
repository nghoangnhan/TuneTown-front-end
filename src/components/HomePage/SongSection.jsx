import SongItem from "./SongItem";

const SongSection = () => {
  return (
    <div className="xl:w-full">
      <h1 className="text-[#2E3271] text-xl font-bold">Recommend Song</h1>
      <div className="mt-5 flex flex-col gap-4">
        <SongItem></SongItem>
        <SongItem></SongItem>
        <SongItem></SongItem>
        <SongItem></SongItem>
        <SongItem></SongItem>
        <SongItem></SongItem>
      </div>
    </div>
  );
};

export default SongSection;

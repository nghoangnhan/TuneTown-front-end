import SongItem from "./SongItem";

const SongSection = () => {
  return (
    <div className="xl:w-full">
      <div className="mt-5 flex flex-col gap-2">
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

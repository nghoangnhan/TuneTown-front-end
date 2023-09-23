const PlaylistItem = () => {
  return (
    <div className="w-fit border-[1px] rounded-xl border-solid border-[#4cd658] bg-white hover:bg-slate-200">
      <div className="w-[159px] h-[204px] rounded-[12px] bg-transparent">
        <img
          className="ml-[15px] mt-[15px] mr-[15px] w-[128px] h-[121px] rounded-lg object-cover"
          alt="Album cover"
          src="https://source.unsplash.com/random"
        />
        <div className="ml-[15px] mt-[12px] text-[#2E3271] font-semibold text-lg">
          Country
        </div>
        <div className="ml-[15px] mt-2 text-[#7C8DB5BF]">Top 50</div>
      </div>
    </div>
  );
};

export default PlaylistItem;

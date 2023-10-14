const SongItem = () => {
  return (
    <div>
      <div className="flex flex-row relative hover:bg-slate-200 bg-white items-center rounded-xl text-sm xl:text-base">
        <img
          className="ml-[15px] mt-[15px] mr-[15px] mb-[15px] w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] rounded-lg object-cover"
          alt="Album cover"
          src="https://source.unsplash.com/random"
        />
        <div className="text-[#2E3271] xl:text-base font-semibold">
          <h2 className="">What make you beautiful</h2>
          <h2 className="text-sm text-[#7C8DB5B8] mt-1">Maroon V</h2>
        </div>
        <div className="absolute right-4 flex flex-row items-center gap-1 xl:gap-10">
          <button className="hover:bg-slate-300 rounded-2xl p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div>3:48</div>
        </div>
      </div>
    </div>
  );
};

export default SongItem;

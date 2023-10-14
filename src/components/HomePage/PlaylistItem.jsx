import { useNavigate } from "react-router-dom";

const PlaylistItem = () => {
  const navigate = useNavigate();
  return (
    <div
      className="w-fit border-[1px] rounded-xl border-solid border-[#4cd658] bg-white hover:bg-slate-200 cursor-pointer"
      onClick={() => navigate("/detail/1")}
    >
      <div className="xl:w-[159px] xl:h-[204px] w-[130px] h-[170px] rounded-[12px] bg-transparent">
        <img
          className="ml-[13px] xl:ml-[15px] mt-[15px] mr-[15px] xl:w-[128px] xl:h-[121px] w-[102px] h-[90px] rounded-lg object-cover"
          alt="Album cover"
          src="https://source.unsplash.com/random"
        />
        <div className="ml-[13px] xl:ml-[15px] mt-[12px] text-[#2E3271] font-semibold text-lg">
          Country
        </div>
        <div className="ml-[13px] xl:ml-[15px] mt-2 text-[#7C8DB5BF]">
          Top 50
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;

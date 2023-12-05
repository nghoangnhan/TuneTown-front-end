import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ArtistDetail = () => {
  const { artistId } = useParams();
  const [songPlaylistList, setSongPlaylistList] = useState([]);
  const [follow, setFollow] = useState(false);
  const handleFollow = () => {
    setFollow(!follow);
  };
  const artistDetail = {
    artistName: "One Direction",
    artistAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/e/e1/One_Direction_2015.jpg",
  };

  useEffect(() => {
    setSongPlaylistList([
      {
        id: 1,
        songName: "What make you beautiful",
        artists: [
          {
            userName: "One Direction",
          },
          {
            userName: "Two Direction",
          },
          {
            userName: "Three Direction",
          },
        ],
        songDuration: 214,
        songCover:
          "https://media.npr.org/assets/music/news/2010/09/maroon-e9cb8c5b25b4d1f3e68aa26e6a0ce51cf2ae59d8-s1100-c50.jpg",
        songLink: "MakeUBeauti",
      },
      {
        id: 2,
        songName: "Happy New Year",
        artists: [
          {
            userName: "ABBA",
          },
        ],
        songDuration: 214,
        songCover:
          "https://img.freepik.com/free-vector/happy-new-year-2020-lettering-greeting-inscription-vector-illustration-eps10_87521-3994.jpg?size=626&ext=jpg&ga=GA1.1.1803636316.1701561600&semt=ais",
        songLink: "HappyNewYear",
      },
      {
        id: 3,
        songName: "Bliding Lights",
        artists: [
          {
            userName: "The Weeknd",
          },
        ],
        songDuration: 214,
        songCover:
          "https://i.pinimg.com/originals/9c/4b/3c/9c4b3c9f0f5b0f2f1a3a5a1c2d7d2c0b.jpg",
        songLink: "BlidingLights",
      },
      {
        id: 4,
        songName: "What make you beautiful",
        artists: [
          {
            userName: "One Direction",
          },
          {
            userName: "Two Direction",
          },
          {
            userName: "Three Direction",
          },
        ],
        songDuration: 214,
        songCover:
          "https://media.npr.org/assets/music/news/2010/09/maroon-e9cb8c5b25b4d1f3e68aa26e6a0ce51cf2ae59d8-s1100-c50.jpg",
        songLink: "MakeUBeauti",
      },
    ]);
  }, []);
  return (
    <div
      className={`${
        songPlaylistList != null && songPlaylistList.length > 0
          ? "min-h-screen h-full"
          : "min-h-screen"
      } xl:p-5 bg-[#ecf2fd] mb-20`}
    >
      <div className="flex flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-start mt-5 mb-5 relative">
          <img
            className="w-20 h-20 xl:w-56 xl:h-56 rounded-md"
            src={artistDetail.artistAvatar}
            alt="artist-avatar"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-[50px] text-[#4b4848] font-bold text-center mb-5">
            {artistDetail.artistName}{" "}
            <span className="text-gray-500">#{artistId}</span>
          </div>
          {
            <div className="flex flex-row gap-4">
              <button
                onClick={() => handleFollow()}
                className="bg-[#2f9948bc] hover:bg-[#40cf62] rounded-md mb-5"
              >
                <div className="text-white font-bold px-2 py-1">
                  {follow == true ? "Unfollow" : "Follow"}
                </div>
              </button>
            </div>
          }
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="bg-[#2f9948] hover:bg-[#40cf62] rounded-md mb-5"
        >
          <div className="text-white font-bold px-2 py-1">{"<"} Back</div>
        </button>
      </div>
      <div className="flex flex-row justify-between items-center mt-5 mb-5 text-[#4b4848]">
        <div className="flex flex-row gap-8 ml-8">
          <div className=" text-center font-bold">ID</div>
          <div className=" text-center font-bold">Song Details</div>
        </div>
        <div>
          <div className=" text-center font-bold">Duration</div>
        </div>
      </div>
      {/* <SongPlaylist
        playlistId={playlistId}
        songData={songPlaylistList}
      ></SongPlaylist> */}
    </div>
  );
};

export default ArtistDetail;

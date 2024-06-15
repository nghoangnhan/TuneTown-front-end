import axios from "axios";
import "../../assets/CSS/ReactContexify.css";
import { useEffect, useState } from "react";
import UseCookie from "../../hooks/useCookie";
import useConfig from "../../utils/useConfig";
import useIconUtils from "../../utils/useIconUtils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ArtistChart = ({ titleArtist, StartTime, EndTime, inForum }) => {
    const { getToken } = UseCookie();
    const { access_token } = getToken();
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const { Base_URL, Base_AVA } = useConfig();
    const { t } = useTranslation();
    const { ListenIcon, RankingStar } = useIconUtils();
    const [artistList, setArtistList] = useState([]);

    const titleArtistChart = titleArtist
        ? titleArtist
        : `${t("home.top10artists")} ${new Date().getMonth() < 3
            ? t("home.spring")
            : new Date().getMonth() < 6
                ? t("home.summer")
                : new Date().getMonth() < 9
                    ? t("home.autumn")
                    : t("home.winter")
        }`;


    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Adding 1 to get the correct month

    const startTime =
        StartTime ||
        `${currentYear}-${currentMonth - 1 < 10 ? `0${currentMonth - 1}` : currentMonth - 1
        }-01`;
    const endTime =
        EndTime ||
        `${currentYear}-${currentMonth < 10 ? `0${currentMonth}` : currentMonth
        }-30`;

    const getListArtistPeriod = async () => {
        try {
            const response = await axios.get(
                `${Base_URL}/users/createArtistsChart?startTime=${startTime}&endTime=${endTime}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            // console.log("artist Period", response.data);
            return response.data;
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        // console.log("Time Detail", startTime, endTime);
        getListArtistPeriod().then((response) => {
            setArtistList(response.artistsChart);
            // console.log(artistList)
        });
    }, []);

    if (!artistList) {
        return (
            <div className="px-3 py-3 m-auto mx-1 mt-4 shadow-md bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-2xl xl:h-fit xl:mx-5 xl:mt-8 xl:py-5 xl:px-5">
                <h1 className="text-xl font-bold text-primary">
                    {t("home.artistChartUpdating")}
                </h1>
            </div>
        );
    }

    return (
        <div
            className={`bg-backgroundComponentPrimary dark:bg-backgroundComponentDarkPrimary rounded-2xl shadow-md mt-4 py-3 xl:py-5 px-2 xl:h-fit xl:mx-2 xl:mt-8  ${inForum ? "min-w-[500px]" : "min-w-[250px]"
                }`}
        >
            <div className="flex flex-row items-center justify-center gap-3">
                <h1 className="text-3xl font-bold text-center text-primary dark:text-primaryDarkmode">{titleArtistChart}</h1>
                <RankingStar></RankingStar>
            </div>
            <div className="xl:w-full">
                <div className="flex flex-row items-center justify-between mt-5 mb-5 text-primary dark:text-primaryDarkmode">
                    <div className="flex flex-row gap-8 ml-8">
                        <div className="font-bold text-center ">#</div>
                        <div className="font-bold text-center ">{t("artist.title")}</div>
                    </div>

                    <div className="flex flex-row items-center justify-center ">
                        <div className="mr-16">
                            <ListenIcon></ListenIcon>
                        </div>
                        {/* <div className="font-bold text-center ">Duration</div> */}
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 overflow-auto max-h-[470px] p-2">
                    {artistList.length > 0 && Array.isArray(artistList) &&
                        artistList.slice(0, 10).map((artistItem, index) => (
                            <div key={index}
                                onClick={() => navigate(
                                    artistItem.user.id === userId ? "/my-profile" : `/artist/${artistItem.user.id}`
                                )}
                                className="flex flex-row items-center justify-between p-3 my-1 rounded-lg cursor-pointer bg-backgroundSongItem hover:bg-backgroundSongItemHover dark:bg-backgroundSongItemDark hover:dark:bg-backgroundSongItemHoverDark">
                                <div className="flex flex-row items-center gap-4 justify-evenly">
                                    <div className="ml-4 mr-2">
                                        {index + 1}
                                    </div>
                                    <img
                                        className="object-cover w-12 h-12 mr-3 rounded-lg xl:w-14 xl:h-14 dark:bg-white"
                                        alt="Album cover"
                                        src={artistItem?.user.avatar ? artistItem.user.avatar : Base_AVA}
                                    />
                                    <div className="text-xl font-bold">
                                        {artistItem.user.userName}
                                    </div>
                                </div>

                                <div className="flex flex-row items-center gap-1 mr-4 text-primaryText2 dark:text-primaryTextDark2">
                                    <ListenIcon></ListenIcon>
                                    {artistItem.totalListens}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ArtistChart;

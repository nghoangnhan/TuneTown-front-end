import { useTranslation } from "react-i18next";
import BannerSection from "../../components/HomePage/BannerSection";
import SongChart from "../../components/HomePage/SongChart";
import SongSection from "../../components/HomePage/SongSection/SongSection";
import SongSectionCustom from "../../components/HomePage/SongSection/SongSectionCustom";

const HomePage = () => {
  const userName = localStorage.getItem("userName");
  const { t } = useTranslation();
  return (
    <div className="h-auto min-h-screen px-1 pt-5 pb-24 text-primary bg-backgroundPrimary dark:bg-backgroundDarkPrimary">
      <div className="p-5">
        <div className="mb-2 text-4xl font-bold">{t("nav.home")}</div>
        <div className="text-xl font-bold">
          {t("common.good")}{" "}
          {new Date().getHours() < 12
            ? t("common.morning")
            : new Date().getHours() < 18
              ? t("common.afternoon")
              : t("common.evening")}
          , {userName}!
        </div>
      </div>
      <BannerSection></BannerSection>
      <div className="flex flex-col xl:flex-row">
        <div className="flex-auto">
          <SongSection titleSong={t("home.madeForYou")}></SongSection>
        </div>
        <div className="flex-auto">
          <SongChart></SongChart>
        </div>
      </div>
      <div>
        <SongSectionCustom tryNew={true} titleSong={t("home.maybeYouShouldTry")} ></SongSectionCustom>
        <SongSectionCustom listenAgain={true} titleSong={t("home.maybeWantListenAgain")}></SongSectionCustom>
      </div>
    </div>
  );
};

export default HomePage;

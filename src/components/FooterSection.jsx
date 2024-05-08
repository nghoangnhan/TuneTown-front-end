import useConfig from "../utils/useConfig";

const FooterSection = () => {
  const { Base_AVA } = useConfig();
  return (
    <div
      className="w-full h-full min-h-[100px] text-center  bg-backgroundPrimary dark:bg-backgroundDarkPrimary text-primaryText2 dark:text-primaryTextDark2">
      <div
        className="flex flex-row items-center justify-center gap-5 font-bold text-center uppercase cursor-pointer">
        <div>
          <img src={Base_AVA} className="h-12 bg-white rounded-full" alt="Logo TuneTown" />
        </div>
        <div className="text-primary dark:text-primaryDarkmode">TuneTown @2024</div>
      </div>
    </div>
  );
};

export default FooterSection;

import "swiper/scss";
import "react-contexify/dist/ReactContexify.css";
import "./assets/CSS/ReactContexify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import UseCookie from "./hooks/useCookie";

function App() {
  const { getCookiesLanguage } = UseCookie();
  const { i18n } = useTranslation();
  const lng = getCookiesLanguage();
  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  useEffect(() => {
    const darkTheme =
      localStorage.getItem("darkTheme") === "true" ? true : false;
    if (darkTheme === true) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkTheme", true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkTheme", false);
    }
  }, []);
  return (
    // <Fragment>
    //   <BrowserRouter>
    //     <Routes>
    //       <Route path="/login" element={<LoginPage />}></Route>
    //       <Route path="/signup" element={<SignUpPage />}></Route>
    //       <Route path="/" element={<PageFull />}>
    //         <Route path="/" element={<HomePage />}></Route>
    //         <Route path="/search" element={<SearchPage />}></Route>
    //         <Route path="/playlist" element={<PlaylistPage />}></Route>
    //       </Route>
    //     </Routes>
    //   </BrowserRouter>
    // </Fragment>
    <div>
      <Helmet>
        <meta httpEquiv="X-Frame-Options" content="DENY" />
      </Helmet>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

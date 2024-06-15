import "swiper/scss";
import "react-contexify/dist/ReactContexify.css";
import "./assets/CSS/ReactContexify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import UseCookie from "./hooks/useCookie";

function App() {
  const { getCookiesLanguage, getCookiesTheme } = UseCookie();
  const { i18n } = useTranslation();
  const lng = getCookiesLanguage();
  const [darkTheme, setDarkTheme] = useState(getCookiesTheme() === "true" ? true : false);

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  useEffect(() => {
    // console.log("darkTheme", darkTheme)
    if (darkTheme === true) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkTheme]);
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

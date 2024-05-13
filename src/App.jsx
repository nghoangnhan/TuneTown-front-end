import "swiper/scss";
import "react-contexify/dist/ReactContexify.css";
import "./assets/CSS/ReactContexify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import { Helmet } from "react-helmet";

function App() {
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
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-ancestors 'self'; form-action http://localhost:4173"
        />
      </Helmet>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

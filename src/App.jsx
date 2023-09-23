import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "swiper/scss";
import PageFull from "./pages/PageFull";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PlaylistPage from "./pages/PlaylistPage";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageFull />}>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/search" element={<SearchPage />}></Route>
            <Route path="/playlist" element={<PlaylistPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;

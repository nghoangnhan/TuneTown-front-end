import DetailPlaylist from "../pages/DetailPlaylist";
import HomePage from "../pages/HomePage";
import PageFull from "../pages/PageFull";
import PlaylistPage from "../pages/PlaylistPage";
import SearchPage from "../pages/SearchPage";

// Xem cấu trúc routes ở https://reactrouter.com/en/main/routers/create-browser-router#routes
export default function init(routes) {
  const route = {
    path: "/",
    element: <PageFull />,
    // Element là AuthenLayout, các children muốn hiển thị được trong AuthenLayout thì trong Layout phải có outlet mới hiển thị được
    // outlet đóng vai trò tương tự children
    // Xem thêm ở https://reactrouter.com/en/main/components/outlet
    // <Route path="/" element={<PageFull />}>
    //         <Route path="/" element={<HomePage />}></Route>
    //         <Route path="/search" element={<SearchPage />}></Route>
    //         <Route path="/playlist" element={<PlaylistPage />}></Route>
    //       </Route>
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "playlist",
        element: <PlaylistPage />,
      },
      {
        path: "detail/:id",
        element: <DetailPlaylist />,
      },
    ],
  };
  // push route
  routes.push(route);
}

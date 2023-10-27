import DetailPlaylist from "../components/Playlist/DetailPlaylist";
import HomePage from "../pages/HomePage";
import PageFull from "../pages/PageFull";
import PlaylistPage from "../pages/PlaylistPage";
import SearchPage from "../pages/SearchPage";
import UploadSong from "../components/UploadSong/UploadSong";
import EditUserForm from "../components/Users/EditUserForm";

// Xem cấu trúc routes ở https://reactrouter.com/en/main/routers/create-browser-router#routes
export default function init(routes) {
  const route = {
    path: "/",
    element: <PageFull />,

    // Element là AuthenLayout, các children muốn hiển thị được trong AuthenLayout thì trong Layout phải có outlet mới hiển thị được
    // outlet đóng vai trò tương tự children
    // Xem thêm ở https://reactrouter.com/en/main/components/outlet

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
        path: "detail/:playlistId",
        element: <DetailPlaylist />,
      },
    ],
  };
  // Add the new route
  const uploadRoute = {
    path: "upload",
    element: <UploadSong />,
  };

  // Add the new route
  const editUserRoute = {
    path: "editUser",
    element: <EditUserForm />,
  };
  // push route
  routes.push(route);
  // Push the new route
  routes.push(uploadRoute);
  // Push the new route
  routes.push(editUserRoute);
}

import DetailPlaylist from "../components/Playlist/DetailPlaylist";
import HomePage from "../pages/HomePage";
import PageFull from "../pages/PageFull";
import PlaylistPage from "../pages/PlaylistPage";
import SearchPage from "../pages/SearchPage";
import UploadSong from "../components/UploadSong/UploadSong";
import CMSPage from "../pages/CMSPage";
import EditUserForm from "../components/Users/EditUserForm";
import EditInforCMS from "../components/CMS/pages/EditInforCMS";
import SongManagement from "../components/CMS/pages/SongManagement";
import UserManagement from "../components/CMS/pages/UserManagement";
import HistoryPage from "../pages/HistoryPage";
import MyDetailPlaylist from "../components/Users/MyDetailPlaylist";

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
      {
        path: "mydetail/:playlistId",
        element: <MyDetailPlaylist />,
      },
      {
        path: "upload",
        element: <UploadSong />,
      },
      {
        path: "editUser",
        element: <EditUserForm />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
    ],
  };

  // Add the new route
  const cmsRoute = {
    path: "cms/",
    element: <CMSPage />,
    children: [
      {
        index: true,
        path: "profile",
        element: <EditInforCMS />,
      },
      {
        path: "usermanagement",
        element: <UserManagement />,
      },
      {
        path: "songmanagement",
        element: <SongManagement />,
      },
    ],
  };

  // push route
  routes.push(route);
  // Push the new route
  routes.push(cmsRoute);
}

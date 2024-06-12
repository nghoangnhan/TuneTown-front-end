import DetailPlaylist from "../components/Playlist/DetailPlaylist";
import HomePage from "../pages/Home/HomePage";
import MainPageLayout from "../components/layouts/MainPageLayout";
import PlaylistPage from "../pages/Home/PlaylistPage";
import SearchPage from "../pages/Home/SearchPage";
import CMSPage from "../pages/CMS/CMSPage";
import EditUserForm from "../components/Users/EditUserForm";
import EditInforCMS from "../components/CMS/pages/EditInforCMS";
import SongManagement from "../components/CMS/pages/SongManagement";
import UserManagement from "../components/CMS/pages/UserManagement";
import HistoryPage from "../pages/Home/HistoryPage";
import MyDetailPlaylist from "../components/Users/MyDetailPlaylist";
import ArtistDetailPage from "../pages/Home/ArtistDetailPage";
import QueueSection from "../components/HomePage/QueueSection";
import PlaylistManagement from "../components/CMS/pages/PlaylistManagement";
import UploadSongPage from "../pages/Home/UploadSongPage";
import CMSArtist from "../pages/CMS/CMSArtist";
import ChattingPage from "../pages/Home/ChattingPage";
import ChatArea from "../components/Chat/ChatArea";
import LyricSection from "../components/HomePage/LyricSection";
import ForumPage from "../pages/Home/ForumPage";
import PostItemDetail from "../components/Forum/PostItemDetail";
import ErrorPage from "../pages/ErrorPage";
import SongDetailPage from "../pages/Home/SongDetailPage";
import UserDetailPage from "../pages/Home/UserDetailPage";
import EmptyLayout from "../components/layouts/EmptyLayout";
import PostManagement from "../components/CMS/pages/PostManagement";
import SettingPage from "../pages/Home/SettingPage";

// Xem cấu trúc routes ở https://reactrouter.com/en/main/routers/create-browser-router#routes
export default function init(routes) {
  const userRole = localStorage.getItem("userRole");
  const route = {
    path: "/",
    element: <MainPageLayout />,

    // Element là AuthenLayout, các children muốn hiển thị được trong AuthenLayout thì trong Layout phải có outlet mới hiển thị được
    // outlet đóng vai trò tương tự children
    // Xem thêm ở https://reactrouter.com/en/main/components/outlet
    children: [
      {
        path: "",
        index: true,
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
        path: "detail-playlist/:playlistId",
        element: <DetailPlaylist />,
      },
      {
        path: "my-detail-playlist/:playlistId",
        element: <MyDetailPlaylist />,
      },
      {
        path: "forum/my-detail-playlist/:playlistId",
        element: <MyDetailPlaylist />,
      },
      {
        path: "upload",
        element: <UploadSongPage />,
      },
      {
        path: "edit-user",
        element: <EditUserForm />,
      },
      {
        path: "my-profile",
        element: <UserDetailPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
      // Artist Page Route
      {
        path: "artistCMS",
        element: <CMSArtist />,
      },

      {
        path: "artist/:artistId",
        element: <ArtistDetailPage />,
      },
      {
        path: "user/:artistId",
        element: <ArtistDetailPage />,
      },
      {
        path: "song/:songId",
        element: <SongDetailPage />
      },

      {
        path: "queue",
        element: <QueueSection />,
      },
      {
        path: "lyric",
        element: <LyricSection />,
      },

      // Forum 
      {
        path: "forum",
        element: <ForumPage />,
      },
      {
        path: "forum/:postId",
        element: <PostItemDetail />,
      },

      // Settings
      {
        path: "settings",
        element: <SettingPage />,
      },
    ],
  };

  const singleRoute = {
    path: "/",
    element: <EmptyLayout />,
    children: [

    ],
  };

  // Error Page Route
  const errorRoute = {
    path: "*",
    element: <ErrorPage />,
  };

  // Chat Route
  const chatRoute = {
    path: "/chat",
    element: <ChattingPage />,
    children: [
      {
        path: ":chatId",
        element: <ChatArea />,
      },
      {
        path: "community/:chatId",
        element: <ChatArea />,
      },
    ],
  };

  // Add the new route
  const cmsRoute = {
    path: "/cms",
    element: <CMSPage />,
    children: [
      {
        index: true,
        path: "profile",
        element: <EditInforCMS />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "song-management",
        element: <SongManagement />,
      },
      {
        path: "playlist-management",
        element: <PlaylistManagement />,
      },
      {
        path: "post-management",
        element: <PostManagement />,
      },
      {
        path: "setting",
        element: <SettingPage />,
      },
    ],
  };

  // Push route
  routes.push(route)
  routes.push(singleRoute)
  routes.push(chatRoute)
  routes.push(cmsRoute)
  routes.push(errorRoute)
}

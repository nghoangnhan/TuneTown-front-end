import DetailPlaylist from "../components/Playlist/DetailPlaylist";
import HomePage from "../pages/HomePage";
import MainPageLayout from "../components/layouts/MainPageLayout";
import PlaylistPage from "../pages/PlaylistPage";
import SearchPage from "../pages/SearchPage";
import CMSPage from "../pages/CMSPage";
import EditUserForm from "../components/Users/EditUserForm";
import EditInforCMS from "../components/CMS/pages/EditInforCMS";
import SongManagement from "../components/CMS/pages/SongManagement";
import UserManagement from "../components/CMS/pages/UserManagement";
import HistoryPage from "../pages/HistoryPage";
import MyDetailPlaylist from "../components/Users/MyDetailPlaylist";
import ArtistDetailPage from "../pages/ArtistDetailPage";
import QueueSection from "../components/HomePage/QueueSection";
import PlaylistManagement from "../components/CMS/pages/PlaylistManagement";
import UploadSongPage from "../pages/UploadSongPage";
import CMSArtist from "../pages/CMSArtist";
import ChattingPage from "../pages/ChattingPage";
import ChatArea from "../components/Chat/ChatArea";
import LyricSection from "../components/HomePage/LyricSection";
import ForumPage from "../pages/ForumPage";
import PostItemDetail from "../components/Forum/PostItemDetail";
import ErrorPage from "../pages/ErrorPage";
import SongDetailPage from "../pages/SongDetailPage";
import UserDetailPage from "../pages/UserDetailPage";

// Xem cấu trúc routes ở https://reactrouter.com/en/main/routers/create-browser-router#routes
export default function init(routes) {
  const route = {
    path: "/",
    element: <MainPageLayout />,

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
    ],
  };

  const artistRoute = {
    path: "/:sectionId?",
    children: [
      {
        path: "artist/:artistId",
        element: <ArtistDetailPage />,
      },
    ],
  };

  const songRoute = {
    path: "/:sectionId?",
    children: [
      {
        path: "song/:songId",
        element: <SongDetailPage />
      },
    ],
  };

  // Error Page
  const errorRoute = {
    path: "*",
    element: <ErrorPage />,
  };

  // Chat Route
  const chatRoute = {
    path: "chat/",
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
      {
        path: "playlistmanagement",
        element: <PlaylistManagement />,
      },
    ],
  };

  // Push route
  routes.push(route);
  routes.push(cmsRoute);
  routes.push(artistRoute);
  routes.push(songRoute);
  routes.push(chatRoute);
  routes.push(errorRoute);
}

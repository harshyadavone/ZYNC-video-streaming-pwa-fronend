import { Route, Routes, useNavigate } from "react-router-dom";
import AppContainer from "./components/AppContainer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import { setNavigate } from "./lib/navigation";
import Home from "./pages/Home";
import Auth from "./pages/auth";
import OtherSettings from "./components/OtherSettings";
import Account from "./components/Account";
import Notification from "./components/Notification";
import Sessions from "./components/Session";
import Settings from "./pages/Settings";
import VideoDetailspage from "./components/videoDetail";
import TrendingVideos from "./components/TrendingVideos";
import SearchResults from "./components/SearchResults";
import UploadPage from "./components/UploadPage";
import MyChannel from "./pages/MyChannel";
import ChannelPage from "./pages/ChannelPage";
import WatchHistory from "./pages/WatchHistory";
import PlaylistsPage from "./pages/PlaylistsPage";
import Playlistpage from "./pages/Playlistpage";
import ChannelPlaylistPage from "./components/playlists/ChannelPlaylist";
import BookmarkPage from "./pages/BookmarkPage";
import MySubscriptionsPage from "./pages/MySubscriptionsPage";
import OfflinePage from "./pages/OfflinePage";
import NetworkStatus from "./pages/NetworkStatus";
import NotFound from "./pages/NotFound";
import WhatsNewAndBugReport from "./pages/WhatsNewAndBugReport";

function App() {
  // set the navigate function on our API client for use in the axios error interceptor
  // this allows us to redirect to the login page when an auth error occurs
  const navigate = useNavigate();
  //@ts-ignore
  setNavigate(navigate);
  return (
    <>
      <NetworkStatus />
      <Routes>
        <Route path="/" element={<AppContainer />}>
          <Route index element={<Home />} />
          <Route path="/video/:videoId" Component={VideoDetailspage} />
          <Route path="/trending" Component={TrendingVideos} />
          <Route path="/my-channel" Component={MyChannel} />
          <Route path="/channel/:channelId" element={<ChannelPage />} />
          <Route
            path="/channel/:channelId/playlists/:playlistId"
            Component={ChannelPlaylistPage}
          />

          <Route path="/history" Component={WatchHistory} />
          <Route path="/bookmark" element={<BookmarkPage />} />
          <Route path="/playlists" Component={PlaylistsPage} />
          <Route path="/playlist/:playlistId" Component={Playlistpage} />
          <Route path="/my-channel/:channelId/upload" Component={UploadPage} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/subscriptions" element={<MySubscriptionsPage />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<OtherSettings />} />
            <Route path="/settings/account" element={<Account />} />
            <Route path="/settings/notificatin" element={<Notification />} />
            <Route path="/settings/sessions" element={<Sessions />} />
          </Route>
        </Route>
        <Route path="/" element={<Auth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/email/verify/:code" element={<VerifyEmail />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset" element={<ResetPassword />} />
        <Route path="/offline" element={<OfflinePage />} />
        <Route path="/whats-new" element={<WhatsNewAndBugReport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

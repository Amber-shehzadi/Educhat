import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutPage from "./components/layout/Layout";
import Homepage from "./pages/Homepage";
import Login from "./pages/auth/LoginPage";
import SignUp from "./pages/auth/SignupPage";
import NotfoundPage from "./pages/NotfoundPage";
import Loader from "./components/Loader";
import ProfilePage from "./pages/auth/ProfilePage";
import Calendar from "./pages/Calendar";
import ChatPage2 from "./pages/ChatPage2";
import Classes from "./pages/classes/Classes";
import Todos from "./pages/Todos";
import Users from "./pages/users";
import FeedBack from "./pages/feedback";
import Announcements from "./pages/announcements";
import VideoCall from "./components/Video-call";

function App() {
  const { user, loading } = useSelector((state: any) => state.auth);
  console.log(user, "user");
  const isFacultyOrAdmin = user?.role === "coordinator" || user?.role === "admin";

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route element={user ? <LayoutPage user={user} /> : null}>
        <Route
          path="/"
          element={user ? <Homepage /> : <Navigate to="/login" />}
        />

        <Route
          path="/classes"
          element={
            user ? (
              isFacultyOrAdmin ? (
                <Classes />
              ) : (
                <Homepage />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/users"
          element={
            user ? (
              isFacultyOrAdmin ? (
                <Users />
              ) : (
                <Homepage />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/feedback"
          element={
            user ? (
              user?.role === "student" ? (
                <FeedBack />
              ) : (
                <Homepage />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/chat"
          element={user ? <ChatPage2 /> : <Navigate to="/login" />}
        />
        <Route
          path="/announcement"
          element={user ? <Announcements /> : <Navigate to="/login" />}
        />

        <Route
          path="/todos"
          element={user ? <Todos /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={
            user ? <ProfilePage user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/calendar"
          element={user ? <Calendar /> : <Navigate to="/login" />}
        />
      </Route>
      <Route
        path="/video-room"
        element={
          user ? (
            user?.rol !== "student" ? (
              <VideoCall />
            ) : (
              <Homepage />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
      <Route path="*" element={<NotfoundPage />} />
    </Routes>
  );
}

export default App;

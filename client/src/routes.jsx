import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import SignUp from "./pages/SignUp";
import CreatorsList from "./pages/CreatorsList";
import Support from "./pages/Support";
import ProfileEdit from "./components/ProfileEdit";


const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile-setup",
    element: <ProfileSetup />,
  },
  {
    path: "/creators",
    element: <CreatorsList />,
  },
  {
    path: "/support/:creatorId",
    element: <Support />,
  },
  {
    path: "/profile/edit",
    element: <ProfileEdit />,
  },
];

export default routes;

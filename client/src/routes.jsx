// routes.js
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import SignUp from "./pages/SignUp";
import CreatorsList from "./pages/CreatorsList";
import Support from "./pages/Support";

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
    path: "/dashboard",
    element: <Dashboard />,
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
];

export default routes;

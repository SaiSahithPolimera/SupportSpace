import { Link } from "react-router-dom";

export function ArcticonsBetterhelp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2em"
      height="2em"
      viewBox="0 0 48 48"
    >
      <path
        fill="none"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.27 17.7s-3.977-3.536-9.79-3.536S6.174 18.563 3.5 22.21c1.437 1.79 6.918 5.393 11.648 5.393s6.962-2.807 9.88-5.99c2.917-3.183 5.901-5.79 9.15-5.79s5.084.021 10.322 3.47c-3.094 7.293-9.902 10.454-12.841 10.454c-2.1 0-3.908-.123-6.83-1.57c0 0-3.25 1.724-3.47 5.658c-.442-3.315.377-7.13 4.553-7.713c2.214-.31 3.964.508 3.964.508"
      ></path>
      <path
        fill="none"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M32.565 18.63s-1.685.524-3.05 1.922c-1.389 1.422-4.289 1.017-6.004 2.718m11.235-3.754c-2.608.818-4.207 2.104-4.207 2.104m5.628-1.086c-2.004 1.223-4.6 2.002-4.6 2.002m4.821-.149c-1.989 1.17-3.764 1.016-5.592 1.945s-1.608 2.01-.92 2.298c.766.32 2.195.825 2.784 1.488M25.283 17.72c-.703.442-1.574.722-2.642.776c-2.233.113-3.904-.856-3.904-.856m-3.943 7.42s2.23.19 3.713-1.082c1.509-1.294 4.917-1.099 6.776-2.642M12.96 23.624c2.67-.584 4.675-1.052 4.675-1.052m-5.935-.208c2.104-1.042 4.354-.972 4.354-.972"
      ></path>
      <path
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.921 20.42c2.085-.992 3.757-.177 5.696-.571c2.008-.408 1.78-1.861 1.12-2.209c-.735-.387-1.69-1.015-2.219-1.728"
      ></path>
    </svg>
  );
}

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-to-teal-400">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">
          <div className="flex flex-col items-center">
            Welcome to Support Space
            <ArcticonsBetterhelp />
          </div>
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join our platform to support your favorite creators and discover
          amazing content!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="w-1/2 py-2 bg-purple-600 text-center text-white font-semibold rounded-md hover:bg-purple-500 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/sign-up"
            className="w-1/2 py-2 bg-indigo-500 text-center text-white font-semibold rounded-md hover:bg-indigo-400 transition duration-200"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

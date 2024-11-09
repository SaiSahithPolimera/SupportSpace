import { useEffect, useState } from "react";
import { FaCoins, FaUserEdit, FaHeart } from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/creator-details/${username}`
        );
        const data = await response.json();
        if (response.ok) {
          setCreator(data);
        } else {
          console.error("Failed to fetch creator data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching creator data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchCreator();
  }, [username]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
          <p className="text-2xl text-white">Loading Dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-10 text-white">
      <div className="max-w-3xl mx-auto bg-white text-gray-800 rounded-lg p-8 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold">
            {creator?.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              {creator?.username || "Creator Name"}
            </h1>
            <p className="text-indigo-600 text-sm mt-1">@{creator?.username}</p>
            <p className="text-gray-600 mt-2">
              {creator?.bio || "No bio provided"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-yellow-400 to-pink-500 p-6 rounded-lg shadow-lg text-center">
            <FaCoins className="text-3xl mx-auto text-white mb-2" />
            <h3 className="text-xl font-semibold text-white">
              Total Donations
            </h3>
            <p className="text-white text-lg mt-2">
              $ {creator?.totalDonations || 0}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg shadow-lg text-center">
            <FaUserEdit className="text-3xl mx-auto text-white mb-2" />
            <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
            <button
              className="mt-2 bg-white text-indigo-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
              onClick={() => navigate("/profile/edit", { state: { username } })}
            >
              Update Bio &amp; Details
            </button>
          </div>

          <div className="bg-gradient-to-r from-red-400 to-purple-500 p-6 rounded-lg shadow-lg text-center">
            <FaHeart className="text-3xl mx-auto text-white mb-2" />
            <h3 className="text-xl font-semibold text-white">Supporters</h3>
            <p className="text-white text-lg mt-2">
              {creator?.supportersCount || 0}
            </p>
          </div>
        </div>

        <div className="mt-10 text-center flex flex-col items-center gap-4">
          <button
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
            disabled={loading}
          >
            View Supporters
          </button>
          <Link
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
            to="/creators"
          >
            <button className="explore-button">Explore Creators</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

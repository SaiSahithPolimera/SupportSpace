import { useEffect, useState } from "react";
import { FaCoins, FaUserEdit, FaHeart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/creator-details/profile/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("data");
          console.log(data);
          setCreator(data);
        } else {
          console.error("Failed to fetch creator data");
        }
      } catch (error) {
        console.error("Error fetching creator data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchCreator();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
          <p className="text-2xl text-white">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-10">
        <div className="flex items-center gap-6 border-b pb-8">
          <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-mono font-bold">
            {creator?.user.fullName[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              {creator?.user.fullName || "Creator Name"}
            </h1>
            <p className="text-gray-500">@{creator?.user.username}</p>
            <p className="text-gray-600 mt-1">
              {creator?.bio || "No bio provided"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-center">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-lg shadow-lg text-center">
            <FaCoins className="text-4xl mx-auto text-white mb-2" />
            <h3 className="text-xl font-semibold text-white">
              Total Donations
            </h3>
            <p className="text-white text-2xl mt-2">
              ${creator?.totalDonations || 0}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-lg shadow-lg text-center">
            <FaUserEdit className="text-4xl mx-auto text-white mb-2" />
            <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
            <button
              className="mt-3 bg-white text-teal-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
              onClick={() => navigate("/profile/edit", { state: { username } })}
            >
              Update Details
            </button>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-red-400 p-6 rounded-lg shadow-lg text-center">
            <FaHeart className="text-4xl mx-auto text-white mb-2" />
            <h3 className="text-xl font-semibold text-white">Supporters</h3>
            <p className="text-white text-2xl mt-2">
              {creator?.supporterCount || 0}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center text-center space-y-4">
          <button
            className="bg-indigo-600 font-semibold text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            onClick={() => {
              console.log("Navigating to creators list");
              console.log(username);
              navigate("/creators", { state: { username } });
            }}
          >
            Explore Other Creators
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
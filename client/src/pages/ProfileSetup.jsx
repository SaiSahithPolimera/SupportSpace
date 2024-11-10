import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProfileSetup = () => {
  const [bio, setBio] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("Tech");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  const handleProfileSetup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/profile-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bio,
          websiteLink,
          paymentMethod,
          category,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.userType === "CREATOR") {
          navigate(`/profile`, { state: { username } });
        } else {
          navigate("/login");
        }
      } else {
        setError(
          data.error || "An error occurred while setting up the profile."
        );
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 px-6 py-8">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
          Complete Your Profile
        </h2>
        <form onSubmit={handleProfileSetup} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-600">About You</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Website Link</label>
            <input
              type="url"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
              placeholder="Your website (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Payment Method</label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="e.g., PayPal, Venmo"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-600">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Tech">Tech</option>
              <option value="Art">Art</option>
              <option value="Fitness">Fitness</option>
              <option value="Music">Music</option>
              <option value="Gaming">Gaming</option>
              <option value="Food">Food</option>
              <option value="Education">Education</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Complete Setup
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ProfileSetup;

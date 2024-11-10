import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const [bio, setBio] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/creator-update/${username}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bio, websiteLink, paymentMethod, category }),
        }
      );

      if (response.ok) {
        navigate("/profile", { state: { username } });
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-10 text-white">
      <div className="max-w-lg mx-auto bg-white text-gray-800 rounded-lg p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <input
          type="text"
          value={websiteLink}
          onChange={(e) => setWebsiteLink(e.target.value)}
          placeholder="Website Link"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <input
          type="text"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          placeholder="Payment Method"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a Category</option>
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
          onClick={handleSave}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;

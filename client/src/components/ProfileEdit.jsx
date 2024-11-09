import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const [creatorDetails, setCreatorDetails] = useState({
    bio: "",
    websiteLink: "",
    paymentMethod: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatorDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/creator-details/${username}`
        );
        const data = await response.json();
        if (response.ok) {
          setCreatorDetails(data);
        } else {
          console.error("Failed to fetch creator details:", data.error);
        }
      } catch (error) {
        console.error("Error fetching creator details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchCreatorDetails();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreatorDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/creator-update/${creatorDetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(creatorDetails),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
        navigate("/dashboard", { state: { username } });
      } else {
        alert("Error updating profile: " + data.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-10 text-white">
      <div className="max-w-3xl mx-auto bg-white text-gray-800 rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-gray-800">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label className="block text-gray-700" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={creatorDetails.bio}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="websiteLink">
              Website Link
            </label>
            <input
              type="url"
              id="websiteLink"
              name="websiteLink"
              value={creatorDetails.websiteLink}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="paymentMethod">
              Payment Method
            </label>
            <input
              type="text"
              id="paymentMethod"
              name="paymentMethod"
              value={creatorDetails.paymentMethod}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border-gray-300"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="category">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={creatorDetails.category}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
            disabled={loading}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;

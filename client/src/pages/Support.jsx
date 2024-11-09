import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import AllFunds from "../components/AllFunds";
import { LoadingIcon } from "../components/LoadingIcon";

const Support = () => {
  const { creatorId } = useParams();
  const [creator, setCreator] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDonate, setLoadingDonate] = useState(false);
  const { state } = useLocation();
  const [fundsUpdated, setFundsUpdated] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoadingDonate(true);
    try {
      const response = await fetch("http://localhost:5000/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId,
          supporterName: state?.username,
          amount: parseFloat(amount),
        }),
      });
      const data = await response.json();

      if (data.success) {
        setAmount("");
        setFundsUpdated(true);
      }
    } catch (error) {
      console.error("Error donating:", error);
    } finally {
      setLoadingDonate(false);
    }
  };

  useEffect(() => {
    const fetchCreator = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/creator-details/${creatorId}`
        );
        const data = await response.json();
        setCreator(data);
      } catch (error) {
        console.error("Error fetching creator details:", error);
      }
      setLoading(false);
    };

    fetchCreator();
  }, [creatorId]);

  return loading ? (
    <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
      Loading...
    </div>
  ) : creator ? (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-md shadow-md p-6 flex flex-col justify-between min-h-full">
        <form onSubmit={handleDonate} className="space-y-4">
          <div className="flex items-center mb-3">
            <FaUser className="text-gray-600 mr-3" />
            <label className="text-gray-700 text-lg font-semibold">
              {creator.user.fullName}
            </label>
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Bio</label>
            <p className="border border-gray-300 rounded-md px-3 py-2 text-gray-700">
              {creator.bio}
            </p>
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Website</label>
            <a
              href={creator.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-300 rounded-md px-3 py-2 text-blue-600 hover:text-blue-800"
            >
              {creator.websiteLink}
            </a>
          </div>

          <div>
            <label className="block text-gray-600 font-medium">
              Payment Method
            </label>
            <p className="border border-gray-300 rounded-md px-3 py-2 text-gray-700">
              {creator.paymentMethod || "Not specified"}
            </p>
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Category</label>
            <p className="border border-gray-300 rounded-md px-3 py-2 text-gray-700">
              {creator.category || "Not specified"}
            </p>
          </div>

          <div>
            <label className="block text-green-600 font-semibold text-lg">
              Support {creator.user.fullName}
            </label>
            <div className="flex gap-3 mt-2">
              <input
                type="number"
                min="1"
                max="10000"
                placeholder="Enter amount"
                className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loadingDonate}
                className="flex items-center justify-center px-5 py-2 bg-indigo-600 text-white rounded-md"
              >
                {loadingDonate ? <LoadingIcon /> : "Donate"}
              </button>
            </div>
          </div>
        </form>

        <div className="flex justify-between mt-6">
          <AllFunds creatorId={creatorId} fundsUpdated={fundsUpdated} />
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center">Creator not found.</div>
  );
};

export default Support;

import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
    <div className="flex flex-col min-h-screen bg-gray-100 px-4 md:px-8 lg:px-16 py-8 justify-center">
      <div className="w-full bg-white rounded-lg shadow-lg p-8 space-y-8">
        {/* Header */}
        <header className="flex items-center space-x-4">
          <FaUser className="text-3xl text-gray-500" />
          <h2 className="text-2xl font-semibold text-gray-800">Support {creator.user?.fullName || "Creator"}</h2>
        </header>

        {/* Creator Details */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Bio</h3>
            <p className="text-gray-600 mt-2">{creator.bio || "Not specified"}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Website</h3>
            <a
              href={creator.websiteLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 mt-2 block"
            >
              {creator.websiteLink || "Not specified"}
            </a>
          </div>
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Payment Method</h3>
            <p className="text-gray-600 mt-2">{creator.paymentMethod || "Not specified"}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">Category</h3>
            <p className="text-gray-600 mt-2">{creator.category || "Not specified"}</p>
          </div>
        </section>

        <form onSubmit={handleDonate} className="mt-6 space-y-4">
          <label className="block text-lg font-semibold text-gray-700">
            Enter the amount to support
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="10000"
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loadingDonate}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center justify-center"
            >
              {loadingDonate ? <LoadingIcon /> : "Donate"}
            </button>
          </div>
        </form>

        {/* Funds Section */}
        <section className="mt-8">
          <AllFunds creatorId={creatorId} fundsUpdated={fundsUpdated} />
        </section>
      </div>
    </div>
  ) : (
    <div className="text-center text-gray-700 text-lg">Creator not found.</div>
  );
};

export default Support;

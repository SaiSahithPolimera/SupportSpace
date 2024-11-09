import { useEffect, useState } from "react";
import { LoadingIcon } from "../components/LoadingIcon";

const AllFunds = ({ creatorId, fundsUpdated }) => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunds = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/creator-funds/${creatorId}`
        );
        const data = await response.json();
        setFunds(data.funds || []);
      } catch (error) {
        console.error("Error fetching funds:", error);
      }
      setLoading(false);
    };

    fetchFunds();
  }, [creatorId, fundsUpdated]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">All Funds Received</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <LoadingIcon />
        </div>
      ) : (
        funds.map((fund) => (
          <div key={fund.id} className="fund-card p-4 border rounded-lg mb-4">
            <p>
              <strong>Amount:</strong> ${fund.amount.toFixed(2)}
            </p>
            <p>
              <strong>Supporter:</strong> {fund.supporter.user.fullName}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(fund.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllFunds;

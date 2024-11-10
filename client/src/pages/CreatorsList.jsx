import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const CreatorsList = () => {
  const [creators, setCreators] = useState([]);
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const username = state?.username || Link.state;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/getCreators");
        const data = await response.json();
        const uniqueCategories = [
          ...new Set(data.creators.map((c) => c.category)),
        ];
        console.log("cat");
        console.log(categories);
        setCategories(["All", ...uniqueCategories]);
        setCreators(data.creators);
        setFilteredCreators(data.creators);
      } catch (error) {
        console.error("Error fetching creators:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = creators.filter((creator) => {
      const matchesCategory =
        category === "All" || creator.category === category;
      const matchesSearch =
        creator.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        creator.bio?.toLowerCase().includes(search.toLowerCase()) ||
        creator.websiteLink?.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
    setFilteredCreators(filtered);
  }, [search, category, creators]);

  const handleSupport = (creatorId) => {
    if (username) {
      navigate(`/support/${creatorId}`, { state: { username } });
    } else {
      alert("Please log in to support creators.");
    }
  };

  return (
    <div className="w-full px-6 py-12 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
          </div>
          <div className="w-full md:w-1/3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-gray-600 mb-4">
          Found {filteredCreators.length} creator
          {filteredCreators.length !== 1 ? "s" : ""}
          {category !== "All" && ` in ${category}`}
          {search && ` matching "${search}"`}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="w-full text-center text-xl text-gray-500 animate-pulse">
            Loading creators...
          </div>
        ) : (
          filteredCreators?.map((creator) => (
            <div
              key={creator.id}
              className="creator-card p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl hover:border-blue-400 transition duration-300 ease-in-out"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {creator.user.fullName}
                  </h2>
                  <p className="text-sm text-gray-500">{creator.bio}</p>
                </div>
              </div>
              <div className="space-y-4">
                <a
                  href={creator.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  Visit Website
                </a>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleSupport(creator.id)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition duration-300 shadow"
                  >
                    Support via {creator.paymentMethod}
                  </button>
                  <span className="text-xs text-gray-500 bg-slate-100 p-3 rounded-xl">
                    {creator.category}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreatorsList;

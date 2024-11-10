import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        setError("");
        data.userType === "SUPPORTER"? navigate("/creators", { state: { username } }) : navigate(`/profile`, { state: { username } });
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-slate-100">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-96"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <motion.input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full border-4 border-t-4 border-indigo-400 w-6 h-6"></div>
                <span>Logging In...</span>
              </div>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </motion.div>
    </div>
  );
};

export default Login;

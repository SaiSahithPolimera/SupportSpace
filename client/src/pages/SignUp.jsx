import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password, userType }),
      });

      const data = await response.json();
      if (response.ok) {
        setError("");
        userType == "SUPPORTER"
        ? navigate("/login")
          : navigate("/profile-setup", { state: { username } });
      } else {
        setError(`Signup failed. ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-white">
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-4">
          Sign Up
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Join our community today!
        </p>
        <form onSubmit={handleSignUp} className="space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Full Name"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Username"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                Select User Type
              </option>
              <option value="CREATOR">Creator</option>
              <option value="SUPPORTER">Supporter</option>
            </select>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <motion.div
                className="flex justify-center items-center space-x-2"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <div className="animate-spin rounded-full border-4 border-t-4 border-indigo-500 w-6 h-6"></div>
                <span>Signing Up...</span>
              </motion.div>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </motion.div>
    </div>
  );
};

export default SignUp;

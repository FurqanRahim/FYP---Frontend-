import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import WelcomeV from "./WelcomeV";
import { Link } from "react-router-dom";

const ViewResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/all-results");
        if (response.data.status === "success") {
          setResults(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleDelete = async (resultId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:8080/api/results/${resultId}`);
      toast.success(response.data.message || 'Result deleted successfully!');
      setResults((prevResults) => prevResults.filter((result) => result._id !== resultId));
    } catch (error) {
      console.error('Error deleting result:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete result.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <motion.div
          className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        ></motion.div>
      </div>
    );
  }

  const calculateTotal = (result) => {
    return result.mid + result.session + result.Final;
  };

  const calculateGrade = (total) => {
    if (total >= 24) return "Pass";
    return "Fail";
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="mb-4 sm:mb-0">
        <WelcomeV />
      </div>

      <motion.div
        className="relative mt-12 w-full overflow-x-auto shadow-lg sm:rounded-lg bg-gray-50 dark:bg-gray-800"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden sm:rounded-lg">
          <div className="flex flex-col space-y-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white">Results</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage all student results or add new results
              </p>
            </div>
            <motion.button
              type="button"
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-700 dark:hover:bg-indigo-800 dark:focus:ring-indigo-900 transition-all duration-300"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              <Link to="/create-result">Add New Result</Link>
            </motion.button>
          </div>
        </div>

        <motion.table
          className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2 sm:px-6">REG_No</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Student Name</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Course Code</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Course Name</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Teacher</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Mid (18)</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Session (6)</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Final (36)</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Total (60)</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Grade</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Class</th>
              <th scope="col" className="px-4 py-2 sm:px-6">Section</th>
              <th scope="col" className="px-4 py-2 sm:px-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td
                  colSpan="13"
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No Results available
                </td>
              </tr>
            ) : (
              results.map((result, index) => {
                const total = calculateTotal(result);
                return (
                  <motion.tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <td className="px-4 py-2 sm:px-6">{result.student.reg_No}</td>
                    <td className="px-4 py-2 sm:px-6">{result.student.name}</td>
                    <td className="px-4 py-2 sm:px-6">{result.course.courseCode}</td>
                    <td className="px-4 py-2 sm:px-6">{result.course.courseName}</td>
                    <td className="px-4 py-2 sm:px-6">{result.teacher.name}</td>
                    <td className="px-4 py-2 sm:px-6">{result.mid}</td>
                    <td className="px-4 py-2 sm:px-6">{result.session}</td>
                    <td className="px-4 py-2 sm:px-6">{result.Final}</td>
                    <td className="px-4 py-2 sm:px-6 font-semibold">{total}</td>
                    <td className={`px-4 py-2 sm:px-6 font-semibold ${
                      calculateGrade(total) === "Pass" ? "text-green-600" : "text-red-600"
                    }`}>
                      {calculateGrade(total)}
                    </td>
                    <td className="px-4 py-2 sm:px-6">{result.class.className}</td>
                    <td className="px-4 py-2 sm:px-6">{result.class.section}</td>
                    <td className="px-4 py-2 text-right sm:px-6">
                      <motion.div className="flex space-x-4 justify-end">
                        <motion.a
                          href="#"
                          className="text-blue-600 dark:text-blue-500 hover:underline"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaEdit size={18} />
                        </motion.a>
                        <motion.a
                          href="#"
                          onClick={() => handleDelete(result._id)}
                          className="text-red-600 dark:text-red-500 hover:underline"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrashAlt size={18} />
                        </motion.a>
                      </motion.div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </motion.table>
      </motion.div>
    </>
  );
};

export default ViewResult;
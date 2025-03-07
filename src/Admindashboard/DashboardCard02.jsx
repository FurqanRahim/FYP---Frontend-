import React, { useEffect, useState } from "react";
import moment from "moment";
import { motion } from "framer-motion"; // Import motion from framer-motion
import axios from "axios";

function DashboardCard02() {
   const [admin, setAdmin] = useState(null);

   useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/admin");
        console.log(response.data.admin[0])
        setAdmin(response.data.admin[0]);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      }
    };

    
      fetchAdminData();
    
  },[]);

  return (
    <>
      {/* Adding a hover animation to the card */}
      <motion.div
        className="w-lg relative top-2"
        initial={{ opacity: 0, y: 20 }}  // Start with a slight vertical shift and hidden
        animate={{ opacity: 1, y: 0 }}   // Fade in and move into position
        transition={{ duration: 1.2 }}    // Smooth transition for fade-in
        whileHover={{ scale: 1.05 }}     // Slight scale-up on hover for interaction
        whileTap={{ scale: 0.98 }}       // Scale down on tap for visual feedback
      >
        <footer className="bg-gray rounded-lg bg-white p-4 sm:p-6 xl:p-8 dark:bg-gray-800 antialiased">
          {/* Flexbox container */}
          <div className="inline-flex flex-col items-center justify-between">
            {/* Greeting Section */}
            <motion.div
              className="text-2xl text-indigo-600 font-bold"
              initial={{ opacity: 0, x: -50 }}  // Start from the left, invisible
              animate={{ opacity: 1, x: 0 }}    // Fade in and slide to position
              transition={{
                duration: 1,                 // Smooth transition
                delay: 0.2,                  // Delay to give a nice staggered effect
                type: "spring",              // Spring animation for bounce
                stiffness: 80,               // Adjust bounce strength
              }}
            >
              Good morning! {admin ? admin.name : 'Loading...'}
            </motion.div>

            {/* Date Section */}
            <motion.div
              className="text-sm text-black dark:text-white"
              initial={{ opacity: 0, y: 50 }}   // Start below and invisible
              animate={{ opacity: 1, y: 0 }}    // Fade in and slide to position
              transition={{
                duration: 1.2,                // Slightly longer to give smooth effect
                delay: 0.5,                   // Delay to stagger after greeting
                type: "spring",               // Spring animation for smoothness
                stiffness: 120,               // Increase stiffness for a stronger bounce
              }}
            >
              {moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}
            </motion.div>
          </div>
        </footer>
      </motion.div>
    </>
  );
}

export default DashboardCard02;

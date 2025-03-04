import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
  AreaChart, Area,
  ResponsiveContainer
} from "recharts";

const StatisticsDashboard = () => {
  const [data, setData] = useState({ classes: null, courses: null, students: null, teachers: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, courseRes, studentRes, teacherRes] = await Promise.all([
          axios.get("http://localhost:8080/api/class"),
          axios.get("http://localhost:8080/api/courses"),
          axios.get("http://localhost:8080/api/auth/students"),
          axios.get("http://localhost:8080/api/auth/teachers"),
        ]);
        setData({
          classes: classRes.data.totalClasses,
          courses: courseRes.data.totalCourses,
          students: studentRes.data.totalStudents,
          teachers: teacherRes.data.totalTeachers,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>;

  const chartData = [
    { name: "Classes", value: data.classes },
    { name: "Courses", value: data.courses },
    { name: "Students", value: data.students },
    { name: "Teachers", value: data.teachers },
  ];

  const colors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"]; // Indigo, Green, Yellow, Red

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      
      {/* Bar Chart */}
      {/* <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Bar Chart</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={colors[0]} />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* Pie Chart */}
      {/* <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Pie Chart</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} fill={colors[0]} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div> */}

      {/* Line Chart */}
      {/* <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Line Chart</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={colors[1]} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div> */}

      {/* Area Chart */}
      {/* <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Area Chart</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke={colors[0]} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div> */}

<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Bar Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Pie Chart */}
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Pie Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`pie-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Line Chart */}
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Line Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke={colors[1]} strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Area Chart */}
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Area Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            {chartData.map((entry, index) => (
              <linearGradient key={`grad-${index}`} id={`colorValue${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[index]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[index]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip />
          <Legend />
          {chartData.map((entry, index) => (
            <Area 
              key={`area-${index}`} 
              type="monotone" 
              dataKey="value" 
              stroke={colors[index]} 
              fillOpacity={1} 
              fill={`url(#colorValue${index})`} 
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>

    </div>
  );
};

export default StatisticsDashboard;

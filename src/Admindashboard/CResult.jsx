import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import WelcomeC from "./WelcomeC";

const CResult = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [marks, setMarks] = useState({
    mid: 0,
    session: 0,
    Final: 0
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const notify = () => toast.success("Welcome to Create New Result!");
    notify();

    const fetchData = async () => {
      try {
        const [coursesRes, classesRes, teachersRes, studentsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/courses"),
          axios.get("http://localhost:8080/api/class"),
          axios.get("http://localhost:8080/api/auth/teachers"),
          axios.get("http://localhost:8080/api/auth/students")
        ]);

        setCourses(coursesRes.data.courses);
        setClasses(classesRes.data.classes);
        setTeachers(teachersRes.data.teachers);
        // Sort students by registration number for easier finding
        const sortedStudents = studentsRes.data.students.sort((a, b) => 
          a.reg_No.localeCompare(b.reg_No)
        );
        setStudents(sortedStudents);
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to fetch required data");
      }
    };

    fetchData();
  }, []);

  const handleMarksChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, Math.min(parseInt(value) || 0, getMaxMarks(name)));
    setMarks(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const getMaxMarks = (type) => {
    switch(type) {
      case 'mid': return 18;
      case 'session': return 6;
      case 'Final': return 32;
      default: return 0;
    }
  };

  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    
    // Find selected student to get their registration number
    const student = students.find(s => s._id === studentId);
    if (student) {
      // You might want to do something with the selected student's data
      console.log("Selected student reg_No:", student.reg_No);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !selectedClass || !selectedCourse || !selectedTeacher) {
      setMessage("Please fill in all required fields.");
      return;
    }

    // Find selected student to get their registration number
    const selectedStudentData = students.find(s => s._id === selectedStudent);
    if (!selectedStudentData) {
      setMessage("Invalid student selection.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/add-result",
        {
          registrationNumber: selectedStudentData.reg_No, // Using the actual registration number
          classId: selectedClass,
          courseId: selectedCourse,
          teacherId: selectedTeacher,
          ...marks
        }
      );

      if (response.data.message) {
        toast.success("Result added successfully");
        setMessage("");
        // Reset form
        setSelectedStudent("");
        setSelectedClass("");
        setSelectedCourse("");
        setSelectedTeacher("");
        setMarks({ mid: 0, session: 0, Final: 0 });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred while adding result.");
      toast.error(error.response?.data?.message || "Failed to add result");
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.7 }}
        className="mb-4 sm:mb-0"
      >
        <div>
          <WelcomeC />
        </div>
        <motion.form
          className="max-w-sm mx-auto mt-14"
          onSubmit={handleSubmit}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
              Select Student
            </label>
            <motion.select
              value={selectedStudent}
              onChange={handleStudentSelect}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
              whileHover={{ scale: 1.02 }}
            >
              <option value=""> Select a Student </option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.reg_No})
                </option>
              ))}
            </motion.select>
          </motion.div>

          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
              Select Class
            </label>
            <motion.select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
              whileHover={{ scale: 1.02 }}
            >
              <option value=""> Select a Class </option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className} {cls.classCode} {cls.shift} {cls.section}
                </option>
              ))}
            </motion.select>
          </motion.div>

          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
              Select Course
            </label>
            <motion.select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
              whileHover={{ scale: 1.02 }}
            >
              <option value=""> Select a Course </option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName} ({course.courseCode})
                </option>
              ))}
            </motion.select>
          </motion.div>

          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
              Select Teacher
            </label>
            <motion.select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
              whileHover={{ scale: 1.02 }}
            >
              <option value=""> Select a Teacher </option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </motion.select>
          </motion.div>

          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white ml-2">
              Marks
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mid (0-18)
                </label>
                <motion.input
                  type="number"
                  name="mid"
                 
                  onChange={handleMarksChange}
                  min="0"
                  max="18"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  whileFocus={{ scale: 1.05 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Session (0-6)
                </label>
                <motion.input
                  type="number"
                  name="session"
                  
                  onChange={handleMarksChange}
                  min="0"
                  max="6"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  whileFocus={{ scale: 1.05 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Final (0-36)
                </label>
                <motion.input
                  type="number"
                  name="Final"
                  
                  onChange={handleMarksChange}
                  min="0"
                  max="36"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  whileFocus={{ scale: 1.05 }}
                />
              </div>
            </div>
          </motion.div>

          {message && (
            <motion.p
              className="text-red-500 text-sm mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {message}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="text-white text-sm ml-2 mt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            Add Result
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
};

export default CResult;
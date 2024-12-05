import { useEffect, useState } from "react";
import HeroSection from "./Navbar/HeroSection";

const Home = () => {
  // Get the user's name from localStorage, or set it to null if not available
  const [name, setName] = useState(null);

  useEffect(() => {
    // Fetch the name from localStorage (if it was stored during login)
    const storedName = localStorage.getItem("name");
    setName(storedName);
  }, []);

  console.log(name); // Log the name in the console

  return (
    <div className="border-red-700 my-4">
      <h2 className="text-2xl font-bold">
        What is Online Examination System Management ?
      </h2>
      <br />
      Examination System is a technology-driven way to simplify examination
      activities like defining exam patterns with question banks, defining exam
      timers, objective/subjective question sections, and conducting exams using
      a computer or mobile devices in a paperless manner.
      <br />
      <br />
      Online Examination System is a cost-effective, scalable way to convert
      traditional pen and paper-based exams to online and paperless mode.
      Candidates can appear for the exam using any desktop, laptop, or mobile
      device with a browser. Exam results can be generated instantly for the
      objective type of questions.
      <br />
      <br />
      It can simplify overall examination management and result generation
      activity.
      <div></div>
      <div className=" border-red-700 justify-center items-center mb-8 mt-10">
        <HeroSection></HeroSection>
      </div>
    </div>
  );
};

export default Home;

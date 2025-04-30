import React from "react";

const HeroSection1= () => {
    const backgroundImage = "../../../public/exam-1.jpg"; // Replace with your image URL

    const heroStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        color: "white",
    };

    const overlayStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    };

    const contentStyle = {
        position: "relative",
        textAlign: "center",
        zIndex: 1,
    };

    const buttonStyle = {
        backgroundColor: "#007BFF",
        color: "white",
        // padding: "10px 20px",
        fontSize: "1rem",
        fontWeight: "bold",
        borderRadius: "5px",
        textDecoration: "none",
        transition: "background-color 0.3s ease",
        cursor: "pointer",
    };

    const handleButtonHover = (event, isHover) => {
        event.target.style.backgroundColor = isHover ? "#0056b3" : "#007BFF";
    };

    return (
        <div style={heroStyle}>
            {/* Overlay */}
            <div style={overlayStyle}></div>
            {/* Content */}
            <div style={contentStyle}>
                <h2 className="text-xl font-bold">WELCOME TO THE EXAMS OFFICE</h2>
                <h1 className="text-xl font-bold">SUPPORTING EXAMS OFFICERS</h1>
                
            </div>
        </div>
    );
};

export default HeroSection1;

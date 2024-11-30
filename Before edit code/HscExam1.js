
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import HscQuiz from './HscQuiz';

const QuestionSelector = ({ onSelect }) => {
    const [selectedDepartment, setSelectedDepartment] = useState(''); // Default is empty
    const departments = ['science', 'arts', 'commerce']; // Departments list

    const handleProceed = () => {
        if (selectedDepartment) {
            localStorage.setItem('department', selectedDepartment);
            if (onSelect) {
                onSelect(selectedDepartment); // Pass the selected department to the parent
            } else {
                console.error('onSelect function is not provided!');
            }
            Swal.fire({
                position: 'center',
                title: 'Your Exam is started',
                showConfirmButton: false,
                timer: 500,
            });
        } else {
            Swal.fire('Please select a department before proceeding');
        }
    };

    return (
        <div className="container mx-auto my-4 px-10 py-10 bg-white shadow-lg rounded-lg w-3/5">
            <h2 className="text-4xl text-center font-bold text-gray-800 mb-4">Select a Department</h2>
            <div className="mt-4">
                <label htmlFor="departmentType" className="text-xl font-semibold text-gray-700">
                    Choose a department:
                </label>
                <select
                    id="departmentType"
                    className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                    <option value="" disabled>
                        Select a Department
                    </option>
                    {departments.map((department) => (
                        <option key={department} value={department}>
                            {department}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mt-10 flex justify-center">
                <button
                    className="bg-green-500 border mx-auto w-full border-green-500 text-white px-4 py-2 text-lg rounded-lg transition-colors hover:bg-green-600"
                    onClick={handleProceed}
                    disabled={!selectedDepartment}
                >
                    Start Exam
                </button>
            </div>
        </div>
    );
};

const QuizContainer = () => {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const handleSelectDepartment = (department) => {
        setSelectedDepartment(department);
        setIsQuizStarted(true); // Start quiz as soon as a department is selected
    };

    return (
        <div>
            {!isQuizStarted ? (
                <QuestionSelector onSelect={handleSelectDepartment} />
            ) : (
                <HscQuiz department={selectedDepartment} />
            )}
        </div>
    );
};

export default QuizContainer;

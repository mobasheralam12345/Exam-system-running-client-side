import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Quiz from './Quiz';

const QuestionSelector = ({ onSelect }) => {
    const [selectedYear, setSelectedYear] = useState(''); // Default is empty
    const years = Array.from({ length: 15 }, (_, i) => 31 + i); // Generate years 31-45

    const handleProceed = () => {
        if (selectedYear) {
            localStorage.setItem('bcsYear', selectedYear);
            if (onSelect) {
                onSelect(selectedYear); // Pass the selected year to the parent
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
            Swal.fire('Please select a question year before proceeding');
        }
    };

    return (
        <div className="container mx-auto my-4 px-10 py-10 bg-white shadow-lg rounded-lg w-3/5">
            <h2 className="text-6xl text-center font-bold text-gray-800 mb-4">Select a Year</h2>
            <div className="mt-4">
                <label htmlFor="questionType" className="text-xl font-semibold text-gray-700">
                    Choose a question year:
                </label>
                <select
                    id="questionType"
                    className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="" disabled>
                        Select a Year
                    </option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}th Question
                        </option>
                    ))}
                </select>
            </div>
            <div className="mt-10 flex justify-center">
                <button
                    className="bg-green-500 border mx-auto w-full border-green-500 text-white px-4 py-2 text-lg rounded-lg transition-colors hover:bg-green-600"
                    onClick={handleProceed}
                    disabled={!selectedYear}
                >
                    Start Exam
                </button>
            </div>
        </div>
    );
};

const QuizContainer = () => {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');

    const handleSelectYear = (year) => {
        setSelectedYear(year);
        setIsQuizStarted(true); // Start quiz as soon as a year is selected
    };

    return (
        <div>
            {!isQuizStarted ? (
                <QuestionSelector onSelect={handleSelectYear} />
            ) : (
                <Quiz year={selectedYear} />
            )}
        </div>
    );
};

export default QuizContainer;

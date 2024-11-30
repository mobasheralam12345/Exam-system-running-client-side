import React, { useState } from 'react';
import Swal from 'sweetalert2';
import SubjectWiseQuiz from './SubjectWise-Quiz';

const QuestionSelector = ({ onSelect }) => {
    const [selectedSubject, setSelectedSubject] = useState(''); // Default subject
    const [totalQuestions, setTotalQuestions] = useState(); // Default question count

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleQuestionsChange = (e) => {
        setTotalQuestions(e.target.value);
    };

    const handleProceed = () => {
        if (selectedSubject && totalQuestions > 0) {
            localStorage.setItem('bcsSubject', selectedSubject);
            localStorage.setItem('totalQuestions', totalQuestions);
            onSelect(selectedSubject, totalQuestions);
            Swal.fire({
                position: "center",
                title: "Your Exam is started",
                showConfirmButton: false,
                timer: 500
            });
        } else {
            Swal.fire('Please select a subject and enter a valid number of questions before proceeding');
        }
    };

    return (
        <div className="container mx-auto my-4 px-10 py-10 bg-white shadow-lg rounded-lg w-3/5">
            <h2 className="text-3xl text-center font-bold text-gray-800 mb-4">Start Exam</h2>
            <div className="mt-4">
                <label htmlFor="subject" className="text-xl font-semibold text-gray-700">Choose a Subject:</label>
                <select
                    id="subject"
                    className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                >
                    <option value="">Select Subject</option>
                    <option value="বাংলা">বাংলা</option>
                    <option value="English">English</option>
                    <option value="Math">Math</option>
                    <option value="বাংলাদেশ বিষয়াবলী">বাংলাদেশ বিষয়াবলী</option>
                    <option value="বিশ্ব বিষয়াবলী">বিশ্ব বিষয়াবলী</option>
                    <option value="মানসিক দক্ষতা">মানসিক দক্ষতা</option>
                    <option value="ICT">ICT</option>
                </select>
            </div>
            <div className="mt-4">
                <label htmlFor="totalQuestions" className="text-xl font-semibold text-gray-700">Total Questions:</label>
                <input
                    type="number"
                    id="totalQuestions"
                    className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
                    value={totalQuestions}
                    onChange={handleQuestionsChange}
                    min="1"
                />
            </div>
            <div className="mt-4 flex justify-center">
                <button
                    className="bg-green-500 border mx-auto w-full border-green-500 text-white px-4 py-2 text-lg rounded-lg transition-colors hover:bg-green-600"
                    onClick={handleProceed}
                >
                    Start Exam
                </button>
            </div>
        </div>
    );
};

const QuizContainer = () => {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [totalQuestions, setTotalQuestions] = useState(0);

    const handleSelect = (subject, questions) => {
        setSelectedSubject(subject);
        setTotalQuestions(questions);
        setIsQuizStarted(true);
    };

    return (
        <div>
            {!isQuizStarted ? (
                <QuestionSelector onSelect={handleSelect} />
            ) : (
                <SubjectWiseQuiz subject={selectedSubject} totalQuestions={totalQuestions} />
            )}
        </div>
    );
};

export default QuizContainer;

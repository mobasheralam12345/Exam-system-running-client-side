import axios from 'axios';
import { useEffect, useState } from 'react';

const SubjectWise = ({ subject, totalQuestions }) => {
    const [questionsData, setQuestionsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answerStatus, setAnswerStatus] = useState([]);
    const [timeLeft, setTimeLeft] = useState(totalQuestions * 60);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [SkippedAnswers, setSkippedAnswers] = useState(0);
    const [IncorrectAnswers, setIncorrectAnswers] = useState(0);

    const questionsPerPage = 10;

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/admin/questions/get-questions/${subject}/${totalQuestions}`);
                if (response.data && Array.isArray(response.data.questions) && response.data.questions.length > 0) {
                    const filteredQuestions = response.data.questions.slice(0, totalQuestions);
                    setQuestionsData(filteredQuestions);
                    setSelectedOptions(Array(filteredQuestions.length).fill(null));
                } else {
                    setError('No questions available for this subject.');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Failed to load questions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [subject, totalQuestions]);

    useEffect(() => {
        if (timeLeft > 0 && !showResult) {
            const timer = setInterval(() => setTimeLeft(prevTime => prevTime - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, showResult]);

    const handleOptionSelect = (questionIndex, optionIndex) => {
        if (!showResult) {
            const updatedOptions = [...selectedOptions];
            updatedOptions[questionIndex] = optionIndex;
            setSelectedOptions(updatedOptions);
        }
    };

    const calculateScore = () => {
        let calculatedScore = 0;
        let incorrectCount = 0;
        let skippedCount = 0;
        const statusArray = [];

        questionsData.forEach((question, questionIndex) => {
            const selected = selectedOptions[questionIndex];
            if (selected === null) {
                skippedCount++;
            } else {
                const selectedText = question.options[selected].toLowerCase().trim();
                const correctAnswerText = question.answer.toLowerCase().trim();

                if (selectedText === correctAnswerText) {
                    calculatedScore += 1;
                    statusArray.push({ questionIndex: questionIndex + 1, correct: true, selectedAnswer: question.options[selected], correctAnswer: question.answer });
                } else {
                    incorrectCount++;
                    statusArray.push({ questionIndex: questionIndex + 1, correct: false, selectedAnswer: question.options[selected], correctAnswer: question.answer });
                }
            }
        });

        setAnswerStatus(statusArray);

        // Return all calculated values
        return { calculatedScore, incorrectCount, skippedCount };
    };

const handleSubmit = async () => {
    const { calculatedScore, incorrectCount, skippedCount } = calculateScore();

    // Update the state values based on the calculation
    setScore(calculatedScore);
    setIncorrectAnswers(incorrectCount);
    setSkippedAnswers(skippedCount);

    const email = localStorage.getItem('userEmail');
    const bcsSubject = localStorage.getItem('bcsSubject');

    // Use calculated values directly instead of relying on state
    const dataToSend = {
        history: [
            {
                email,
                bcsSubject,
                totalMarks: questionsData.length,
                correctAnswers: calculatedScore,
                incorrectAnswers: incorrectCount,
                skippedAnswers: skippedCount,
            }
        ]
    };

    try {
        await axios.post('http://localhost:5000/admin/save-subject-wise-history', dataToSend);
        console.log("Result saved successfully!", dataToSend);
    } catch (error) {
        console.error("Error saving result:", error);
    }

    setShowResult(true);
};

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * questionsPerPage < questionsData.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading) return <div className="text-center text-lg text-red-500">Loading...</div>;
    if (error) return <div className="text-center text-lg text-red-500">{error}</div>;

    const totalQuestionsCount = questionsData.length;
    const currentQuestions = questionsData.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
    const isLastPage = (currentPage + 1) * questionsPerPage >= totalQuestionsCount;

    return (
        <div className="max-w-2xl mx-auto p-6 border">
            {showResult ? (
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-green-500 mb-4">Quiz Completed</h1>
                    <p className="text-xl mb-4">Your Marks: {score}/{totalQuestionsCount}</p>

                    {/* Add Correct Answers First */}
                    <p className="text-lg mb-2">Correct Answers: {totalQuestionsCount - IncorrectAnswers - SkippedAnswers}</p>

                    {/* Display Incorrect Answers */}
                    <p className="text-lg mb-2">Incorrect Answers: {IncorrectAnswers}</p>

                    <p className="text-lg mb-2">Skipped Questions: {SkippedAnswers}</p>
                    <div className="mt-8">
                        {answerStatus.map((status, index) => (
                            <div key={index} className="text-center p-2 border-b">
                                <p className="font-bold text-left">
                                    {status.questionIndex}. {questionsData[status.questionIndex - 1].question}
                                </p>
                                <ul className="mt-4 space-y-2 flex flex-col items-center">
                                    {questionsData[status.questionIndex - 1].options.map((option, optionIndex) => {
                                        const isSelected = status.selectedAnswer === option;
                                        const isCorrect = status.correct && isSelected;

                                        return (
                                            <li key={optionIndex} className="flex items-center space-x-2">
                                                <label
                                                    className={`text-lg font-normal ${isSelected ? (isCorrect ? 'text-green-500' : 'text-red-500') : ''} text-center`}
                                                >
                                                    {option}
                                                    {isSelected && (
                                                        <span className={isCorrect ? "text-green-500" : "text-red-500"}>
                                                            {isCorrect ? " ✔" : " ❌"}
                                                        </span>
                                                    )}
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <p className="text-md text-gray-700 text-center">
                                    Your Answer: <span className="text-red-500">{status.selectedAnswer}</span><br />
                                    Correct Answer: <span className="text-green-500">{status.correctAnswer}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        View Result Details
                    </button>
                </div>
            ) : (
                <div className="text-left">
                    <div className="flex justify-between text-lg font-bold mb-4">
                        <div>Time: {formatTime(timeLeft)}</div>
                        <div>Total Marks: {totalQuestionsCount}</div>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">Subject: {subject}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {currentQuestions.map((question, questionIndex) => (
                            <div key={questionIndex} className="p-4 border rounded-lg bg-gray-100">
                                <h1 className="font-bold text-md text-left">
                                    {currentPage * questionsPerPage + questionIndex + 1}. {question.question}
                                </h1>
                                <ul className="mt-4 space-y-2">
                                    {question.options.map((option, optionIndex) => (
                                        <li key={optionIndex} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                checked={selectedOptions[currentPage * questionsPerPage + questionIndex] === optionIndex}
                                                onChange={() => handleOptionSelect(currentPage * questionsPerPage + questionIndex, optionIndex)}
                                                disabled={showResult}
                                            />
                                            <label
                                                className="text-md font-normal"
                                                htmlFor={`question-${questionIndex}-option-${optionIndex}`}
                                            >
                                                {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={handlePrevPage}
                            disabled={currentPage === 0} // Disable if on the first page
                        >
                            Previous
                        </button>
                        <button
                            className={`bg-${isLastPage ? 'green' : 'blue'}-600 text-white px-4 py-2 rounded`}
                            onClick={isLastPage ? handleSubmit : handleNextPage}
                        >
                            {isLastPage ? 'Submit' : 'Next'}
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default SubjectWise;
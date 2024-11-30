import axios from "axios";
import { useEffect, useState } from "react";

const Quiz = ({ year }) => {
    const [questionsData, setQuestionsData] = useState([]);
    const [subjectNames, setSubjectNames] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [skippedAnswers, setSkippedAnswers] = useState(0);
    const [answerStatus, setAnswerStatus] = useState([]);
    const [timeLeft, setTimeLeft] = useState(3000);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const questionsPerPage = 10;

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:5000/questions/get-questions/${year}`
                );
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const allQuestions = response.data;
                    setQuestionsData(allQuestions);
                    setSubjectNames(allQuestions.map((subject) => subject.subject_name));
                    setSelectedOptions(
                        allQuestions.flatMap((subject) => Array(subject.questions.length).fill(null))
                    );
                } else {
                    setError("No questions available for this year.");
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
                setError("Failed to load questions. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [year]);

    useEffect(() => {
        if (timeLeft > 0 && !showResult) {
            const timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, showResult]);

    const handleOptionSelect = (globalIndex, optionIndex) => {
        if (!showResult) {
            const updatedOptions = [...selectedOptions];
            updatedOptions[globalIndex] = optionIndex;
            setSelectedOptions(updatedOptions);
        }
    };

    const calculateScore = () => {
        let calculatedScore = 0;
        let incorrectCount = 0;
        let skippedCount = 0;
        const statusArray = [];

        questionsData.forEach((subject) => {
            subject.questions.forEach((question, questionIndex) => {
                const globalIndex =
                    questionsData
                        .slice(0, questionsData.indexOf(subject))
                        .reduce((acc, subj) => acc + subj.questions.length, 0) + questionIndex;

                const selected = selectedOptions[globalIndex];
                if (selected !== null) {
                    const selectedText = question.options[selected].toLowerCase().trim();
                    const correctAnswerText = question.answer.toLowerCase().trim();

                    if (selectedText === correctAnswerText) {
                        calculatedScore += 1;
                        statusArray.push({
                            questionIndex: globalIndex + 1,
                            correct: true,
                            selectedAnswer: question.options[selected],
                            correctAnswer: question.answer,
                        });
                    } else {
                        incorrectCount += 1;
                        statusArray.push({
                            questionIndex: globalIndex + 1,
                            correct: false,
                            selectedAnswer: question.options[selected],
                            correctAnswer: question.answer,
                        });
                    }
                } else {
                    skippedCount += 1;
                }
            });
        });

        setAnswerStatus(statusArray);

        return { calculatedScore, incorrectCount, skippedCount };
    };

    const handleSubmit = async () => {
        const { calculatedScore, incorrectCount, skippedCount } = calculateScore();

        setScore(calculatedScore);
        setIncorrectAnswers(incorrectCount);
        setSkippedAnswers(skippedCount);

        const email = localStorage.getItem("userEmail");
        const bcsYear = localStorage.getItem("bcsYear");

        const dataToSend = {
            history: [
                {
                    email,
                    bcsYear,
                    totalMarks: selectedOptions.length,
                    correctAnswers: calculatedScore,
                    incorrectAnswers: incorrectCount,
                    skippedAnswers: skippedCount,
                },
            ],
        };

        try {
            await axios.post("http://localhost:5000/admin/save-result", dataToSend);
            console.log("Result saved successfully!", dataToSend);
        } catch (error) {
            console.error("Error saving result:", error);
        }

        setShowResult(true);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    const handleNextPage = () => {
        const totalQuestionsInCurrentSubject =
            questionsData[currentSubjectIndex].questions.length;

        if ((currentPage + 1) * questionsPerPage < totalQuestionsInCurrentSubject) {
            setCurrentPage(currentPage + 1);
        } else if (currentSubjectIndex + 1 < questionsData.length) {
            setCurrentSubjectIndex(currentSubjectIndex + 1);
            setCurrentPage(0);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else if (currentSubjectIndex > 0) {
            setCurrentSubjectIndex(currentSubjectIndex - 1);
            setCurrentPage(
                Math.ceil(
                    questionsData[currentSubjectIndex - 1].questions.length / questionsPerPage
                ) - 1
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center text-lg text-red-500">
                Loading Questions for {subjectNames[0] || "Unknown Subject"}...
            </div>
        );
    }
    if (error) {
        return <div className="text-center text-lg text-red-500">{error}</div>;
    }

    const totalQuestions = selectedOptions.length;
    const currentSubject = questionsData[currentSubjectIndex];
    const currentQuestions = currentSubject.questions.slice(
        currentPage * questionsPerPage,
        (currentPage + 1) * questionsPerPage
    );

    return (
        <div className="max-w-2xl mx-auto p-6 border">
            {showResult ? (
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-green-500 mb-4">Quiz Completed</h1>
                    <p className="text-xl mb-4">Your Marks: {score}/{totalQuestions}</p>
                </div>
            ) : (
                <div className="text-left">
                    <div className="flex justify-between text-lg font-bold mb-4">
                        <div>Time: {formatTime(timeLeft)}</div>
                        <div>Total Marks: {totalQuestions}</div>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">
                        Subject: {currentSubject.subject_name}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {currentQuestions.map((question, questionIndex) => {
                            const globalIndex =
                                questionsData
                                    .slice(0, currentSubjectIndex)
                                    .reduce((acc, subj) => acc + subj.questions.length, 0) +
                                currentPage * questionsPerPage +
                                questionIndex;
                            return (
                                <div
                                    key={globalIndex}
                                    className="p-4 border rounded-lg bg-gray-100"
                                >
                                    <h1 className="font-bold text-md text-left">
                                        {globalIndex + 1}. {question.question}
                                    </h1>
                                    <ul className="mt-4 space-y-2">
                                        {question.options.map((option, optionIndex) => (
                                            <li
                                                key={optionIndex}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={
                                                        selectedOptions[globalIndex] === optionIndex
                                                    }
                                                    onChange={() =>
                                                        handleOptionSelect(globalIndex, optionIndex)
                                                    }
                                                    disabled={showResult}
                                                    className="mr-2"
                                                />
                                                <label className="text-sm font-normal">
                                                    {option}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0 && currentSubjectIndex === 0}
                            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
                        >
                            Previous
                        </button>

                        {(currentPage + 1) * questionsPerPage >=
                        currentSubject.questions.length &&
                        currentSubjectIndex === questionsData.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={handleNextPage}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;

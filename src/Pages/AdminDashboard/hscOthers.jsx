import { useState } from "react";

const initialQuestion = {
  questionText: "",
  options: { A: "", B: "", C: "", D: "" },
  correctAnswer: "A",
  explanation: "",
};

const AddHSCOthers = () => {
  const [form, setForm] = useState(initialQuestion);
  const [questions, setQuestions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["A", "B", "C", "D"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addQuestion = () => {
    if (
      !form.questionText ||
      !form.options.A ||
      !form.options.B ||
      !form.options.C ||
      !form.options.D
    ) {
      alert("Please fill all fields.");
      return;
    }
    setQuestions([...questions, form]);
    setForm(initialQuestion);
  };

  const submitQuestions = async () => {
    if (questions.length === 0)
      return alert("Add at least one question first!");

    try {
      const res = await fetch(
        "http://localhost:5000/hsc-questions/saveOthersQuestions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(questions),
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert("Questions submitted successfully!");
        setQuestions([]);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Error submitting questions.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-indigo-800 text-center mb-6">
        Add HSC Others Question
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <textarea
          name="questionText"
          placeholder="Enter question"
          value={form.questionText}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {["A", "B", "C", "D"].map((opt) => (
          <input
            key={opt}
            type="text"
            name={opt}
            placeholder={`Option ${opt}`}
            value={form.options[opt]}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}

        <div className="flex items-center space-x-4">
          <label className="text-lg font-medium text-gray-700">
            Correct Answer:
          </label>
          <select
            name="correctAnswer"
            value={form.correctAnswer}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {["A", "B", "C", "D"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="explanation"
          placeholder="Explanation (optional)"
          value={form.explanation}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={addQuestion}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          ➕ Add Question
        </button>
      </div>

      {questions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Questions to Submit:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            {questions.map((q, idx) => (
              <li key={idx} className="text-gray-800">
                {q.questionText}
              </li>
            ))}
          </ul>

          <button
            onClick={submitQuestions}
            className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ✅ Finish & Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddHSCOthers;

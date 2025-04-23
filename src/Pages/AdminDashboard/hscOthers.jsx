import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const initialQuestion = {
  questionText: "",
  options: { A: "", B: "", C: "", D: "" },
  correctAnswer: "A",
  explanation: "",
};

const AddHSCOthers = () => {
  const [form, setForm] = useState(initialQuestion);
  const [questions, setQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

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
    if (!form.questionText || !form.options.A || !form.options.B || !form.options.C || !form.options.D) {
      alert("Please fill all fields.");
      return;
    }

    if (editIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = form;
      setQuestions(updatedQuestions);
      setEditIndex(null);
    } else {
      setQuestions([...questions, form]);
    }

    setForm(initialQuestion);
  };

  const editQuestion = (index) => {
    setForm(questions[index]);
    setEditIndex(index);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(updatedQuestions);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Question", "A", "B", "C", "D", "Correct", "Explanation"]],
      body: questions.map((q) => [
        q.questionText,
        q.options.A,
        q.options.B,
        q.options.C,
        q.options.D,
        q.correctAnswer,
        q.explanation,
      ]),
    });
    doc.save("questions.pdf");
  };

  const exportCSV = () => {
    const csv = [
      ["Question", "A", "B", "C", "D", "Correct Answer", "Explanation"],
      ...questions.map((q) => [
        q.questionText,
        q.options.A,
        q.options.B,
        q.options.C,
        q.options.D,
        q.correctAnswer,
        q.explanation,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "questions.csv";
    link.click();
  };

  const submitQuestions = async () => {
    if (questions.length === 0) return alert("Add at least one question first!");

    try {
      const res = await fetch("http://localhost:5000/hsc-questions/saveOthersQuestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questions),
      });

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
          {editIndex !== null ? "✏️ Update Question" : "➕ Add Question"}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Questions to Submit:</h3>
            <div className="flex gap-2">
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Export PDF
              </button>
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Export CSV
              </button>
            </div>
          </div>

          <ul className="space-y-4">
            {questions.map((q, idx) => (
              <li
                key={idx}
                className="p-4 border border-gray-300 rounded-md bg-white shadow-sm"
              >
                <div className="text-center font-semibold text-lg text-indigo-800 mb-4">
                  {idx + 1}. {q.questionText}
                </div>

                <div className="flex justify-between gap-6">
                  <div className="w-1/2">
                    <h4 className="font-semibold mb-2 text-gray-700">Options:</h4>
                    <ul className="space-y-1">
                      {Object.entries(q.options).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-1/2">
                    <p className="text-green-700 font-semibold mb-2">
                      ✅ Correct Answer: {q.correctAnswer}
                    </p>
                    {q.explanation && (
                      <p className="text-sm text-gray-600">
                        💬 <span className="font-medium">Explanation:</span> {q.explanation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => editQuestion(idx)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteQuestion(idx)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
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

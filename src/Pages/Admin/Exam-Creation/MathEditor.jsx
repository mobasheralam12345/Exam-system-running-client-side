import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MathEditor = ({ value, onChange, placeholder, className = "" }) => {
  const quillRef = useRef(null);
  const [showMathPanel, setShowMathPanel] = useState(false);

  // Force left alignment and proper cursor positioning
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      // Force left alignment on initialization
      quill.format("align", false);
      quill.format("direction", "ltr");

      // Set default paragraph alignment
      const Delta = quill.constructor.import("delta");
      quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        const ops = [];
        delta.ops.forEach((op) => {
          if (op.insert && typeof op.insert === "string") {
            ops.push({
              insert: op.insert,
              attributes: { ...op.attributes, align: false },
            });
          } else {
            ops.push(op);
          }
        });
        return new Delta(ops);
      });

      // Force cursor to start at beginning for empty content
      if (!value || value === "<p><br></p>" || value.trim() === "") {
        setTimeout(() => {
          quill.setSelection(0, 0);
          quill.format("align", false);
        }, 100);
      }

      // Override any formatting that might center text
      quill.on("text-change", () => {
        const range = quill.getSelection();
        if (range) {
          const format = quill.getFormat(range);
          if (format.align === "center" || format.align === "right") {
            quill.format("align", false);
          }
        }
      });
    }
  }, [value]);

  // Mathematical symbols organized by category
  const mathSymbols = {
    basic: [
      { symbol: "±", name: "Plus-minus" },
      { symbol: "∓", name: "Minus-plus" },
      { symbol: "×", name: "Multiplication" },
      { symbol: "÷", name: "Division" },
      { symbol: "√", name: "Square root" },
      { symbol: "∛", name: "Cube root" },
      { symbol: "∞", name: "Infinity" },
      { symbol: "≈", name: "Approximately" },
    ],
    fractions: [
      { symbol: "½", name: "One half" },
      { symbol: "⅓", name: "One third" },
      { symbol: "¼", name: "One quarter" },
      { symbol: "¾", name: "Three quarters" },
      { symbol: "⅕", name: "One fifth" },
      { symbol: "⅖", name: "Two fifths" },
      { symbol: "⅗", name: "Three fifths" },
      { symbol: "⅘", name: "Four fifths" },
    ],
    powers: [
      { symbol: "²", name: "Superscript 2" },
      { symbol: "³", name: "Superscript 3" },
      { symbol: "⁴", name: "Superscript 4" },
      { symbol: "⁵", name: "Superscript 5" },
      { symbol: "₁", name: "Subscript 1" },
      { symbol: "₂", name: "Subscript 2" },
      { symbol: "₃", name: "Subscript 3" },
      { symbol: "₄", name: "Subscript 4" },
    ],
    greek: [
      { symbol: "α", name: "Alpha" },
      { symbol: "β", name: "Beta" },
      { symbol: "γ", name: "Gamma" },
      { symbol: "δ", name: "Delta" },
      { symbol: "ε", name: "Epsilon" },
      { symbol: "θ", name: "Theta" },
      { symbol: "λ", name: "Lambda" },
      { symbol: "μ", name: "Mu" },
      { symbol: "π", name: "Pi" },
      { symbol: "σ", name: "Sigma" },
      { symbol: "φ", name: "Phi" },
      { symbol: "ω", name: "Omega" },
    ],
    calculus: [
      { symbol: "∫", name: "Integral" },
      { symbol: "∬", name: "Double integral" },
      { symbol: "∭", name: "Triple integral" },
      { symbol: "∮", name: "Contour integral" },
      { symbol: "∂", name: "Partial derivative" },
      { symbol: "∇", name: "Nabla" },
      { symbol: "∆", name: "Delta" },
      { symbol: "∑", name: "Summation" },
    ],
    relations: [
      { symbol: "=", name: "Equal" },
      { symbol: "≠", name: "Not equal" },
      { symbol: "≈", name: "Approximately" },
      { symbol: "≡", name: "Equivalent" },
      { symbol: "<", name: "Less than" },
      { symbol: ">", name: "Greater than" },
      { symbol: "≤", name: "Less than or equal" },
      { symbol: "≥", name: "Greater than or equal" },
      { symbol: "∝", name: "Proportional" },
      { symbol: "∼", name: "Similar" },
    ],
    sets: [
      { symbol: "∈", name: "Element of" },
      { symbol: "∉", name: "Not element of" },
      { symbol: "⊂", name: "Subset" },
      { symbol: "⊃", name: "Superset" },
      { symbol: "⊆", name: "Subset or equal" },
      { symbol: "⊇", name: "Superset or equal" },
      { symbol: "∪", name: "Union" },
      { symbol: "∩", name: "Intersection" },
      { symbol: "∅", name: "Empty set" },
      { symbol: "ℕ", name: "Natural numbers" },
      { symbol: "ℤ", name: "Integers" },
      { symbol: "ℝ", name: "Real numbers" },
    ],
    geometry: [
      { symbol: "°", name: "Degree" },
      { symbol: "∠", name: "Angle" },
      { symbol: "⊥", name: "Perpendicular" },
      { symbol: "∥", name: "Parallel" },
      { symbol: "△", name: "Triangle" },
      { symbol: "□", name: "Square" },
      { symbol: "○", name: "Circle" },
      { symbol: "⌒", name: "Arc" },
    ],
  };

  const insertSymbol = (symbol) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection() || { index: 0, length: 0 };
      quill.insertText(range.index, symbol);
      quill.setSelection(range.index + symbol.length);
      // Ensure left alignment after inserting symbol
      quill.format("align", false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "list",
    "bullet",
    "indent",
    "image",
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Math Symbol Toggle Button */}
      <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-t-lg">
        <button
          type="button"
          onClick={() => setShowMathPanel(!showMathPanel)}
          className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
            showMathPanel
              ? "bg-blue-600 text-white border-blue-700 shadow-md"
              : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
          }`}
        >
          {showMathPanel ? "🔽 Hide Math Symbols" : "🔼 Show Math Symbols"}
        </button>
        {showMathPanel && (
          <p className="text-xs text-blue-600 mt-2">
            Click any symbol below to insert it into your text
          </p>
        )}
      </div>

      {/* Math Symbol Panel */}
      {showMathPanel && (
        <div className="mb-4 bg-white border-2 border-blue-300 rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto">
          <div className="space-y-4">
            {Object.entries(mathSymbols).map(([category, symbols]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 capitalize bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-2 rounded-md border">
                  {category} Symbols
                </h4>
                <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-2">
                  {symbols.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => insertSymbol(item.symbol)}
                      className="p-3 text-lg font-mono border-2 border-gray-200 rounded-md hover:bg-blue-100 hover:border-blue-400 transition-all duration-150 active:scale-95"
                      title={item.name}
                    >
                      {item.symbol}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ReactQuill Editor with Fixed Styles */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
            // Force left alignment on every change
            setTimeout(() => {
              const quill = quillRef.current?.getEditor();
              if (quill) {
                const range = quill.getSelection();
                if (range) {
                  quill.formatText(0, quill.getLength(), "align", false);
                }
              }
            }, 10);
          }}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="left-aligned-editor"
          theme="snow"
        />
      </div>

      {/* Enhanced Custom Styles for Left Alignment and Scrollable Dropdowns */}
      <style jsx global>{`
        /* Force left alignment for all text */
        .left-aligned-editor .ql-editor {
          text-align: left !important;
          direction: ltr !important;
        }

        .left-aligned-editor .ql-editor p,
        .left-aligned-editor .ql-editor h1,
        .left-aligned-editor .ql-editor h2,
        .left-aligned-editor .ql-editor h3,
        .left-aligned-editor .ql-editor h4,
        .left-aligned-editor .ql-editor h5,
        .left-aligned-editor .ql-editor h6,
        .left-aligned-editor .ql-editor div,
        .left-aligned-editor .ql-editor span {
          text-align: left !important;
          direction: ltr !important;
        }

        /* Toolbar Styling */
        .left-aligned-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #f8fafc !important;
          padding: 12px !important;
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
          position: relative !important;
          overflow: visible !important;
        }

        .left-aligned-editor .ql-toolbar .ql-formats {
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
        }

        /* Fix dropdown positioning and scrolling */
        .left-aligned-editor .ql-toolbar .ql-picker {
          position: relative !important;
          color: #374151 !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-label {
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
          padding: 6px 12px !important;
          background: white !important;
          cursor: pointer !important;
          min-width: 80px !important;
          text-align: left !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-label:hover {
          background-color: #f3f4f6 !important;
          border-color: #9ca3af !important;
        }

        .left-aligned-editor
          .ql-toolbar
          .ql-picker.ql-expanded
          .ql-picker-label {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }

        /* Enhanced dropdown options with proper scrolling */
        .left-aligned-editor .ql-toolbar .ql-picker-options {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
          background: white !important;
          border: 2px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          min-width: 150px !important;
          margin-top: 4px !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-item {
          padding: 12px 16px !important;
          border-bottom: 1px solid #f3f4f6 !important;
          cursor: pointer !important;
          transition: background-color 0.15s ease !important;
          text-align: left !important;
          font-size: 14px !important;
          color: #374151 !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-item:last-child {
          border-bottom: none !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-item:hover {
          background-color: #f3f4f6 !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-item.ql-selected {
          background-color: #dbeafe !important;
          color: #1d4ed8 !important;
          font-weight: 500 !important;
        }

        /* Header options styling */
        .left-aligned-editor .ql-toolbar .ql-picker-item[data-value="1"] {
          font-size: 18px !important; /* Reduced from 24px so it fits */
          font-weight: bold !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-item[data-value="2"] {
          font-size: 16px !important; /* Reduced from 20px */
          font-weight: bold !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-item[data-value="3"] {
          font-size: 15px !important; /* Reduced from 18px */
          font-weight: bold !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-item[data-value="4"] {
          font-size: 16px !important;
          font-weight: bold !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-item[data-value="5"] {
          font-size: 14px !important;
          font-weight: bold !important;
        }

        .left-aligned-editor .ql-toolbar .ql-picker-item[data-value="6"] {
          font-size: 12px !important;
          font-weight: bold !important;
        }

        /* Container and Editor Styling */
        .left-aligned-editor .ql-container {
          border: none !important;
          font-size: 16px !important;
        }

        .left-aligned-editor .ql-editor {
          min-height: 120px !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          padding: 16px !important;
          text-align: left !important;
          direction: ltr !important;
        }

        .left-aligned-editor .ql-editor p {
          margin-bottom: 8px !important;
          text-align: left !important;
        }

        .left-aligned-editor .ql-editor.ql-blank::before {
          font-style: italic !important;
          color: #9ca3af !important;
          font-size: 16px !important;
          left: 16px !important;
          text-align: left !important;
        }

        /* Ensure tooltips and other elements have proper z-index */
        .left-aligned-editor .ql-snow .ql-tooltip {
          z-index: 10000 !important;
        }

        /* Override any center alignment */
        .left-aligned-editor .ql-align-center,
        .left-aligned-editor .ql-align-right,
        .left-aligned-editor .ql-align-justify {
          text-align: left !important;
        }

        /* Scrollbar styling for dropdown */
        .left-aligned-editor .ql-picker-options::-webkit-scrollbar {
          width: 6px !important;
        }

        .left-aligned-editor .ql-picker-options::-webkit-scrollbar-track {
          background: #f1f5f9 !important;
          border-radius: 3px !important;
        }

        .left-aligned-editor .ql-picker-options::-webkit-scrollbar-thumb {
          background: #cbd5e1 !important;
          border-radius: 3px !important;
        }

        .left-aligned-editor .ql-picker-options::-webkit-scrollbar-thumb:hover {
          background: #94a3b8 !important;
        }
      `}</style>
    </div>
  );
};

export default MathEditor;

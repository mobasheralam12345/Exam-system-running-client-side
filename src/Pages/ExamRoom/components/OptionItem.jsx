const OptionItem = ({ option, index, isSelected, onSelect }) => {
  return (
    <label
      className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <input
        type="radio"
        checked={isSelected}
        onChange={onSelect}
        className="mt-1 w-4 h-4"
      />
      <div className="flex-1">
        <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-200 rounded-full text-sm font-bold mr-3">
          {String.fromCharCode(65 + index)}
        </span>
        <span dangerouslySetInnerHTML={{ __html: option }} />
      </div>
    </label>
  );
};

export default OptionItem;

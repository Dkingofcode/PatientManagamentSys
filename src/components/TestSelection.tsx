import { useState } from "react";

function TestSelection({ onSelect }: any) {
  const [selectedTests, setSelectedTests] = useState([] as string[]);



  const handleTestChange = (test: string) => {
    const updatedTests = selectedTests.includes(test)
      ? selectedTests.filter((t) => t !== test)
      : [...selectedTests, test];
    setSelectedTests(updatedTests);
    if (onSelect) onSelect(updatedTests);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Select Tests</h3>
      {selectedTests.map((test) => (
        <div key={test} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={test}
            checked={selectedTests.includes(test)}
            onChange={() => handleTestChange(test)}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={test} className="text-sm text-gray-700">
            {test}
          </label>
        </div>
      ))}
    </div>
  );
}

export default TestSelection;
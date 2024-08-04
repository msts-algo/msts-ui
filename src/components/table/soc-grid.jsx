

import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const SocGrid = ({ headers, data }) => {
  const [editState, setEditState] = useState({
    rowIndex: null,
    colIndex: null,
    value: '',
  });

  const handleDoubleClick = (rowIndex, colIndex, value) => {
    setEditState({ rowIndex, colIndex, value });
  };

  const handleChange = (e) => {
    setEditState((prevState) => ({
      ...prevState,
      value: e.target.value,
    }));
  };

  const handleSave = () => {
    data[editState.rowIndex][headers[editState.colIndex].toLowerCase()] = editState.value;
    setEditState({ rowIndex: null, colIndex: null, value: '' });
  };

  const handleCancel = () => {
    setEditState({ rowIndex: null, colIndex: null, value: '' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-yellow-100">
              {Object.keys(item).map((key, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  onDoubleClick={() => handleDoubleClick(rowIndex, colIndex, item[key])}
                >
                  {editState.rowIndex === rowIndex && editState.colIndex === colIndex ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editState.value}
                        onChange={handleChange}
                        className="border px-2 py-1 mr-2"
                      />
                      <button onClick={handleSave} className="text-green-500 mr-2">
                        <FaCheck />
                      </button>
                      <button onClick={handleCancel} className="text-red-500">
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    item[key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SocGrid;
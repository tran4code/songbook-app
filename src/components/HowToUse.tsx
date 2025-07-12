import React from 'react';
import './HowToUse.css';

const HowToUse: React.FC = () => {
  return (
    <div className="how-to-use">
      <h2>How to use:</h2>
      <p>
        Click on any highlighted text to see alternatives. Try clicking "field", "trees", 
        "slowly", or "heart" below to see the dropdown menu in action.
      </p>
    </div>
  );
};

export default HowToUse;
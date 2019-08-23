import React from 'react';

const Cell = ({ value, columnIndex, play }) => {
    let color = 'white';
    if (value === 1) {
      color = 'red';
    } else if (value === 2) {
      color = 'yellow';
    }
      
    return (
      <td>
        <div className="cell" 
            onClick={() => {
              play(columnIndex);
              }}>
          <div className={color}></div>
        </div>
      </td>
    );
  };


export default Cell;
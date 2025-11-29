import React from "react";
import './Search.css'

export const Search = ({showSearch, setShowSearch}) => {
  return (
    <>
      {/* SEARCH POPUP */}
      {showSearch && (
        <div className="popup-overlay" onClick={() => setShowSearch(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Search</h2>

            <input
              type="text"
              placeholder="Search for products..."
              className="search-input"
            />

            <button onClick={() => setShowSearch(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

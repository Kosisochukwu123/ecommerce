import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div>
        <h1>Overview</h1>
      </div>

      <div className="dashboard-top">
        <div className="dashboard-top-box">
          <h2>20k</h2>
          <span>1</span>
          <p>orders</p>
        </div>

        <div className="dashboard-top-box">
          <h2>220k</h2>
          <span>1</span>
          <p>orders</p>
        </div>

        <div className="dashboard-top-box">
          <h2>11k</h2>
          <span>1</span>
          <p>orders</p>
        </div>

        <div className="dashboard-top-box">
          <h2>10k</h2>
          <span>1</span>
          <p>orders</p>
        </div>
      </div>

      <div className="dashboard-products">

        <div className="dashboard-products-top">
          <h1>products</h1>
          <button>s</button>
        </div>

        <div>
             
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

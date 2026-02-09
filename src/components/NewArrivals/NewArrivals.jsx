import React from "react";

const NewArrivals = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.item}>Item 1</div>
      <div style={styles.item}>Item 2</div>
      <div style={styles.item}>Item 3</div>
      <div style={styles.item}>Item 4</div>
      <div style={styles.item}>Item 5</div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    gap: "16px",
    width: "100%",
    overflowX: "hidden", // 👈 hides overflow
    border: "2px solid black",
    padding: "10px",
  },
  item: {
    minWidth: "120px", // forces overflow
    height: "100px",
    background: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
};

export default NewArrivals;

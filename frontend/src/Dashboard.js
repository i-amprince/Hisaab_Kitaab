import React from "react";

function Dashboard() {
    const naam = localStorage.getItem("emaill");
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to your Dashboard! {naam}</h1>
      <p>This is the page you see after login.</p>
      <p>You can put anything you want here — user info, stats, links, etc.</p>
    </div>
  );
}

export default Dashboard;

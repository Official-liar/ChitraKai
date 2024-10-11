import React, { useEffect, useState } from "react";
import Bus from "./Utils/bus";
import "./index.css";

function FlashScreen({otherStyle}) {
  const [visibility, setVisibility] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    Bus.addListener("flash", ({ message, type }) => {
      setVisibility(true);
      setMessage(message);
      setType(type);
      setTimeout(() => {
        setVisibility(false);
      }, 4000);
    });
  }, []);
  useEffect(() => {
    if (document.querySelector(".close") !== null) {
      document
        .querySelector(".close")
        .addEventListener("click", () => setVisibility(false));
    }
  });

  return (
    visibility && (
      <div className={`alert alert-${type} ${otherStyle}`}>
        <span className="close">
          <strong className="text-black">X</strong>
        </span>
        <p>{message}</p>
      </div>
    )
  );
}

export default FlashScreen;

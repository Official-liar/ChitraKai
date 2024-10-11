import React, { useRef } from "react";

let inputRef;
function Input({ setUsername, username }) {
  inputRef = useRef(null);
  return (
    <input
      required
      ref={inputRef}
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="text-rose-700 autofill:hidden placeholder:text-rose-500 placeholder:text-lg w-full border-b border-rose-500 bg-transparent hover:placeholder:text-base caret-rose-600 hover:placeholder:text-rose-600 hover:border-rose-600 placeholder:transition-all focus:text-rose-600 focus:placeholder:text-rose-600 focus:border-hidden transition-colors duration-200 focus:outline-none peer"
      placeholder="eg:joes"
      type="text"
    />
  );
}

export { Input, inputRef };

import React, { useEffect, useRef, useState } from "react";
import {
  emitGuess,
  onGuessResult,
  socket,
} from "../../../Connection/connection";
import { RiSendPlane2Fill } from "react-icons/ri";
import Bus from "../FlashScreen/Utils/bus";

function Chat({ guess, setGuess, setUsers, canChat, isGameStarted ,correctGuess , setCorrectGuess}) {

  const chatsRef = useRef(null);
  const inputRef = useRef(null);

  const submitGuess = (e) => {
    e.preventDefault();
    if(!correctGuess){
      emitGuess({ word :guess , isGameStarted});
    }else{
      emitGuess({ word :guess , isGameStarted: false});
    }
    inputRef.current.value = "";
  };

  //Run only when the page is Mounted and sets onGuessResult Listener
  useEffect(() => {
    onGuessResult((result) => {
      // When Guess is Correct
      if (result.type) {
        const li = document.createElement("li");
        li.textContent = "Correct Guess: "
        li.classList.add("text-green-500", "text-sm", "font-medium");
        chatsRef.current.appendChild(li);
        Bus.emit("flash", {
          message: `correct guess ${result.user}`,
          type: "success", // Type: 'success', 'error', 'warning'
        });
        setCorrectGuess(true)
        setUsers((prev) => {
          console.log("prev", prev);
          return prev.map((user) =>
            user.Id === result.Id ? { ...user, score: result.score } : user
          );
        });
      } else {
        const li = document.createElement("li");
        li.textContent = result.word;
        if (socket.Id === result.Id) {
          li.classList.add(
            "text-green-500",
            "text-sm",
            "font-medium",
            "text-right",
            "px-10"
          );
        } else {
          li.classList.add("text-gray-400", "text-sm");
        }
        chatsRef.current.appendChild(li);
      }
    });
    // Clean the listner as soon as page unmounts
    return () => {
      socket.off("guessResult");
    };
  }, []);

  return (
    <>
      <hr className="w-2/5" />
      <div className="flex flex-col h-1/2 gap-1 w-full">
        <section className="h-full w-1/2">
          <ul ref={chatsRef}></ul>
        </section>
        <section className="h-full w-1/2 flex items-end ">
          <form
            onSubmit={
              submitGuess
            }
            className="relative"
          >
            {canChat ? (
              <>
                <input
                  ref={inputRef}
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="chat"
                  className="bg-transparent w-full border-b outline-none placeholder:px-1"
                />
                <button className="cursor-pointer absolute right-0 bottom-1 mr-2">
                  <RiSendPlane2Fill className=""></RiSendPlane2Fill>{" "}
                </button>
              </>
            ) : (
              ""
            )}
          </form>
        </section>
      </div>
    </>
  );
}

export default Chat;

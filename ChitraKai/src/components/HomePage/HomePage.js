import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import {Input , inputRef} from "./Input";
import {createRoom } from '../../Connection/connection'

function HomePage() {
  const [username, setUsername] = useState("");
  const [room , setRoom] = useState("");
  const [name, setName] = useState(true);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if(name){
      setName(false)
      inputRef.current.value = ""
      console.log(username);
    }
    else{
      console.log("GOOOOO");
      inputRef.current.value = ""
      navigate(`/${room}?username=${encodeURIComponent(username)}`);
    }
  };

  const onCreatebtn = async()=>{
    console.log("haha");
    createRoom(username  , (roomCr)=>{
      // Only navigate after receiving the room ID
      console.log(`Navigating to room ${roomCr}`);
      navigate(`/${roomCr}?username=${encodeURIComponent(username)}`);
    })
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-rose-700">
      <form
        onSubmit={submit}
        className="flex gap-2 -mb-16"
      >
        {name === true ? (
          <div className="py-16 px-12 flex flex-col gap-2">
            <label className="text-lg font-semibold">Enter Username</label>
            <Input setUsername={setUsername} username={username} />
            <Button name={"Next"} />
          </div>
        ) : (
          <div className="py-16 px-12 flex flex-col gap-2">
            <label className="text-lg font-semibold">Enter Room Id/Name</label>
            <Input setUsername={setRoom} username={room} />
            <Button id = "1" style={true} name={"Let's Go"} /> 
          </div>
        )}
      </form>
      {!name && <Button color="blue" name={"Create Room"} onClick ={onCreatebtn} />}
    </div>
  );
}

export default HomePage;

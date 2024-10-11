import React , {useState} from 'react'
import UserList from './UserList'
import Chat from './Chat'

function UserPanel({guess ,setGuess , canChat,isGameStarted , correctGuess , setCorrectGuess}) {
  const [users,setUsers] = useState([])
  return (
    <div className='text-white h-full rounded-md px-1 py-20 gap-2 flex flex-col justify-between w-[50%]'>
      <UserList setUsers={setUsers} users={users}/>
      <Chat guess={guess} setGuess={setGuess} setUsers={setUsers} canChat={canChat} isGameStarted={isGameStarted} correctGuess={correctGuess} setCorrectGuess={setCorrectGuess}/>
    </div>
  )
}

export default UserPanel

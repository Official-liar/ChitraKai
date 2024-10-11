import React ,{useEffect, useState} from 'react'
import {onUserList, socket} from '../../../Connection/connection'

function UserList({ users , setUsers}) {
  
  let myID = socket.id
  useEffect(()=>{
    onUserList((userList)=>{
      if(userList.length!==0){
        setUsers([...userList])
      }
    })
    
    return ()=>{
      socket.off('userList')
    }
  },[])
  useEffect(()=>{
    console.log(users);
    
  }, [users])
  
  
  return (
    <div className='text-white h-1/2 flex items-end'>
      <ul>
        {
          users.length > 0 ? users.map((user , index)=>(
            (myID === user.Id)? <li key={index} className=' font-bold text-rose-700'>{user.name} {user.score}</li> : <li key={index} className='text-white'>{user.name} {user.score}</li>
          )): (<li>Waiting</li>)
        }
      </ul>
    </div>
  )
}

export default UserList

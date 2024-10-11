import React from 'react'

function Button({name , color , style , onClick }) {
  const bgColorClass = `bg-${typeof color != "undefined"? color : "rose"}-700`;
  const hoverBgColorClass = `hover:bg-${typeof color != "undefined"? color : "rose"}-900`;
  console.log(hoverBgColorClass);
  const handleClick = ()=>{
    if(onClick){
      onClick()
    }
  }
  return (
    <div>
      <button
            type="submit"
            onClick={handleClick}
            className={`text-white mt-2 text-base w-full ${bgColorClass} py-[1px] px-4 block ${hoverBgColorClass} ${style && "hover:text-sm hover:py-1 hover:px-5 transition-all duration-400"}`}
          >{name}</button>
    </div>
  )
}

export default Button

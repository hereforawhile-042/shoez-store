import { useState } from "react";
import { RxPlus, RxMinus } from "react-icons/rx"

const Stepper =({Increment, Decrement, min, value})=>{
    
    return(
        <div className="flex justify-between items-center px-6 py-2 h-full w-full bg-gray-300 rounded-4xl">
            <button className="cursor-pointer" onClick={Decrement}><RxMinus/></button>
            <span>{value}</span>
            <span className="cursor-pointer" onClick={Increment}><RxPlus/></span>
        </div>
    )
}

export default Stepper;
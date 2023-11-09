import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    

    const navigate = useNavigate();

    const handleSignup = () => {
       if(!name || !email || !password){
            alert("Please fill all fields");
            return;
       }

        fetch("http://localhost:8000/user/signup",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name:name, email:email, password:password})
        }).then((response)=>{
            return response.json();
        }).then((response)=>{
            console.log(response)
            alert(response.message);
        }).catch((err)=>{
            console.log(err);
        })
    }

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gray-200 flex justify-center items-center'>
        <div className='w-[400px] bg-blue-400 flex flex-col items-center py-6 shadow-md rounded-md'>
            <h1 className='text-3xl text-center py-4'>Sign up your account</h1>
            <div className='w-[300px] flex justify-between items-center mt-4 font-bold'>
                <label htmlFor="name">Name:</label>
                <input type="text" name='name' value={name} onChange={(e)=> setName(e.target.value)} className='p-1 rounded outline-none'/>
            </div>
            <div className='w-[300px] flex justify-between items-center mt-4 font-bold'>
                <label htmlFor="email">Email:</label>
                <input type="email" name='email' value={email} onChange={(e)=>setEmail(e.target.value)} className='p-1 rounded outline-none'/>
            </div>
            <div className='w-[300px] flex justify-between items-center mt-4 font-bold'>
                <label htmlFor="password">Password:</label>
                <input type="password" name='password' value={password} onChange={(e)=> setPassword(e.target.value)} className='p-1 rounded outline-none'/>
            </div>

            <div className='flex justify-end w-[300px] my-6'>
                <button className='bg-white px-4 py-1 rounded shadow-md' onClick={handleSignup}>Sign up</button>
            </div>
            <p>Already have an account? <span className='text-gray-100 cursor-pointer underline' onClick={()=> navigate("/signin")}>Signin</span></p>
        </div>
    </div>
  )
}

export default SignUp
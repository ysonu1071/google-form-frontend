import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setIsLogedIn, setUserEmail } from '../redux/slices/formSlice';

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignIn = () => {
        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        fetch("http://localhost:8000/user/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.status === "success") {
                console.log(response.message);
                localStorage.setItem("userData", JSON.stringify({token:response.token, email: response.email}));
                dispatch(setUserEmail(response.email))
                dispatch(setIsLogedIn(true));
                navigate("/");
            }else{
                console.log(response.message);
                alert(response.message);
            }
        }).catch((error) => {
            console.log(error.message);
            alert(error.message);
        })
    }


    return (
        <div className='w-[100vw] min-h-[100vh] bg-gray-200 flex justify-center items-center'>
            <div className='w-[400px] bg-blue-400 flex flex-col items-center py-6 shadow-md rounded-md'>
                <h1 className='text-3xl text-center py-4'>Sign In to your account</h1>
                <div className='w-[300px] flex justify-between items-center mt-4 font-bold'>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name='email' className='p-1 rounded outline-none' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='w-[300px] flex justify-between items-center mt-4 font-bold'>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name='password' className='p-1 rounded outline-none' onChange={(e) => setPassword(e.target.value)} />
                </div>
                <p className='w-[300px] text-right text-sm cursor-pointer underline'>Forget password?</p>
                <div className='flex justify-end w-[300px] my-6'>
                    <button className='bg-white px-4 py-1 rounded shadow-md' onClick={handleSignIn}>Sign in</button>
                </div>
                <p>Don't have an account? <span className='text-gray-100 cursor-pointer underline' onClick={() => navigate("/signup")}>Signup</span></p>
            </div>
        </div>
    )
}

export default SignIn
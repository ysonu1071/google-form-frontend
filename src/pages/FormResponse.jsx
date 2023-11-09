import React, { useEffect } from 'react'
import { FaFileAlt } from "react-icons/fa"
import { TbLogout } from "react-icons/tb"
import { useDispatch, useSelector } from 'react-redux'
import { setQuestionPage, setIsLogedIn, setResponseData } from '../redux/slices/formSlice';
import { useNavigate } from 'react-router-dom';

function FormResponse() {
    const { isQuestionPageActive, userEmail, currentFormId, responseData } = useSelector((state) => state.form);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleQuestionPage = () => {
        dispatch(setQuestionPage(true))
        navigate(`/form/preview/${currentFormId}`)

    }

    const handleResponsePage = () => {
        dispatch(setQuestionPage(false));
        navigate(`/form/response/${currentFormId}`)
    }


    const handleLogout = () => {
        localStorage.removeItem("userData");
        dispatch(setIsLogedIn(false));
        navigate("/signin");
    }

    const fetchResponseData = () => {
        fetch("http://localhost:8000/form/get-form-response", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ formId: currentFormId})
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.status === "success") {
                console.log(response.responseData);
                dispatch(setResponseData(response.responseData[0]));
                
            } else {
                console.log(response.message)
                alert(response.message);
            }
        }).catch((err) => {
            console.log(err.message);
            alert(err.message);
        })
    }

    useEffect(()=>{
        fetchResponseData()
    },[])
    return (
        <div>
            <nav className='w-full flex flex-col justify-between items-center px-[100px] shadow-md'>
                <div className='w-full h-[80px] flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                        <FaFileAlt className='text-4xl text-blue-800' />
                        <p className='text-3xl'>Forms</p>
                    </div>
                    <div className='flex items-center gap-8'>
                        <p className='px-3 py-2 rounded-full bg-blue-800 text-white'>{(userEmail !== "" ? userEmail.slice(0,2).toUpperCase() : "")}</p>
                        <TbLogout className='text-xl cursor-pointer' onClick={handleLogout}/>
                    </div>
                </div>
                <div className='w-full flex justify-center gap-4'>
                    <p className={(isQuestionPageActive ? 'border-b-4 border-blue-800 text-blue-800' : "") + ' px-2 py-1 '} onClick={handleQuestionPage}>Form</p>
                    <p className={(!isQuestionPageActive ? 'border-b-4 border-blue-800 text-blue-800' : "") + ' px-2 py-1'} onClick={handleResponsePage}>Response</p>
                </div>
            </nav>

            <main>
                {responseData?.responseData?.map((response)=> <div className='w-full flex justify-center'>
                    <div className='w-[60%] bg-gray-300 p-4 mt-4 rounded-md'>
                        {response?.map((obj) => <div>
                            {obj.type != "checkbox" ? <div className='flex justify-start gap-4'>
                                <span>{obj.question}:</span>
                                <span>{obj.answer}</span>
                            </div>: ""}

                            {obj.type == "checkbox" ? <div className='flex justify-start gap-4
                            '>
                                <span>{obj.question}:</span>
                                {obj.answer.map((ans)=> <span>{ans},</span>)}
                                 </div>  :"" }
                        </div>)}
                    </div>
                </div>)}
            </main>
        </div>
    )
}

export default FormResponse
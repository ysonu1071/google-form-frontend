import React, { useEffect } from 'react'
import { AiOutlinePlus } from "react-icons/ai"
import { FaFileAlt } from "react-icons/fa"
import Navbar from '../components/Navbar'
import { json, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentFormId, setFormList, setIsLogedIn, setUserEmail } from '../redux/slices/formSlice'

function Home() {

    const { userEmail, formList } = useSelector((state) => state.form)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchFormList = () => {
        let token = ''
        if (localStorage.getItem("userData")) {
            let obj = JSON.parse(localStorage.getItem("userData"));
            token = obj.token;
        }

        fetch("http://localhost:8000/form/form-list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.status === "success") {
                dispatch(setFormList(response.formList));
            } else {
                console.log(response.message)
                alert(response.message);
            }
        }).catch((err) => {
            console.log(err.message);
            alert(err.message);
        })

    }

    const handleRecentForm = (formId) => {
        dispatch(setCurrentFormId(formId));
        navigate(`/form/preview/${formId}`);
    }

    useEffect(() => {
        if (!localStorage.getItem("userData")) {
            navigate("/signin");
        } else {
            let userData = JSON.parse(localStorage.getItem("userData"));
            dispatch(setUserEmail(userData.email));
            dispatch(setIsLogedIn(true));
            fetchFormList();
        }
    }, [])
    return (
        <div className='min-h-screen'>

            <Navbar />
            <main className='w-full'>
                <div className='w-full min-h-[250px] px-[200px] py-4 bg-gray-200' >
                    <p className='py-4 px-2 text-gray-700'>Start a new form</p>
                    <div className='flex'>
                        <div className='w-[150px] h-[150px] bg-white flex justify-center items-center rounded-md border border-gray-400 cursor-pointer hover:border-2 hover:border-blue-800' onClick={() => navigate("/form/question")}>
                            <AiOutlinePlus className='text-5xl text-blue-800' />
                        </div>
                    </div>
                </div>

                <div className='w-full min-h-[250px] px-[200px] py-4'>
                    <p className='py-4 px-2 text-gray-700'>Recent forms</p>
                    <div className='flex gap-4'>
                        {formList?.map((form) => <div key={form._id} className='border border-r-gray-300 bg-blue-800 text-white rounded-md hover:border-2 hover:border-blue-800 cursor-pointer' onClick={ ()=> handleRecentForm(form._id)}>
                            <div className='w-[150px] h-[150px] flex justify-center items-center text-5xl'>
                                <FaFileAlt />
                            </div>
                            <div className='w-[150px] h-[40px] border-t border-gray-300 flex justify-center items-center'>
                                <p>{form.title}</p>
                            </div>
                        </div>)}
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Home
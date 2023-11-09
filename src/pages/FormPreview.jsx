import React, { useEffect, useState } from 'react'
import { FaFileAlt } from "react-icons/fa"
import { TbLogout } from "react-icons/tb"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { setCurentForm, setResponseData, setQuestionPage, setIsLogedIn } from '../redux/slices/formSlice';

function FormPreview() {
    const [submited, setSubmited] = useState(false);
    const [fieldsAnswer, setFieldsAnswer] = useState([]);
    // const [currentForm, setCurentForms] = useState({});

    const { currentForm,currentFormId, isLogedIn, userEmail, isQuestionPageActive } = useSelector((state) => state.form);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const setFieldsAnswerStructure = () => {
        if(!currentForm.fieldsInfo){
            return;
        }
        let temp = [];
        for (let obj of currentForm?.fieldsInfo?.fields) {
            if (obj.type === "text" || obj.type === "email" || obj.type === "number" || obj.type === "radio") {
                let newObj = {}
                newObj.id = obj.id;
                newObj.type = obj.type;
                newObj.question = obj.question;
                newObj.answer = ""

                temp.push(newObj);
            } else if (obj.type === 'checkbox') {
                let newObj = {}
                newObj.id = obj.id;
                newObj.type = obj.type;
                newObj.question = obj.question;
                newObj.answer = []

                temp.push(newObj);
            }
        }

        console.log("structure: ", temp);

        setFieldsAnswer(temp);

    }

    const fetchCurrentForm = (formId) => {

        fetch("http://localhost:8000/form/fetchdata-for-preview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ formId: formId })
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.status === "success") {

                dispatch(setCurentForm({ formInfo: response.formInfo[0], fieldsInfo: response.fieldsInfo[0] }))


                console.log(response)



            } else {
                console.log(response.message)
                // alert(response.message);
            }
        }).catch((err) => {
            console.log(err.message);
            console.log("its err")
            // alert(err.message);
        })
    }

    const handleFieldAnswer = (value, id) => {
        let temp = [];
        console.log('fields ans is: ', fieldsAnswer);
        for (let obj of fieldsAnswer) {
            if (obj.id === id) {

                if (obj.type === "checkbox") {
                    obj.answer.push(value);
                } else {
                    obj.answer = value;
                }
            }
            temp.push(obj);
        }
        console.log("ans is: ", temp);

        setFieldsAnswer(temp);


    }

    const handleSubmitResponse = () => {
       
        fetch("http://localhost:8000/form/save-form-response", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ formId: params.id, fieldsAnswer: fieldsAnswer })
        }).then((response) => {
            return response.json();
        }).then((response) => {
            if (response.status === "success") {
                dispatch(setResponseData(response.responseData[0]));
                setSubmited(true);
            } else {
                console.log(response.message)
                alert(response.message);
            }
        }).catch((err) => {
            console.log(err.message);
            alert(err.message);
        })
    }

    const handleQuestionPage = () => {
        dispatch(setQuestionPage(true))
        navigate(`/form/preview/${params.id}`)

    }

    const handleResponsePage = () => {
        dispatch(setQuestionPage(false));
        navigate(`/form/response/${params.id}`)
    }

    const handleLogout = () => {
        localStorage.removeItem("userData");
        dispatch(setIsLogedIn(false));
        navigate("/signin");
    }
    console.log(currentForm)

    useEffect(() => {
        fetchCurrentForm(params.id);

    }, [])

    useEffect(()=>{
        setFieldsAnswerStructure();

    },[currentForm])
    return (
        <div>
            {isLogedIn ? <nav className='w-full flex flex-col justify-between items-center px-[100px] shadow-md'>
                <div className='w-full h-[80px] flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                        <FaFileAlt className='text-4xl text-blue-800' />
                        <p className='text-3xl'>Forms</p>
                    </div>
                    <div className='flex items-center gap-8'>
                        <p className='px-3 py-2 rounded-full bg-blue-800 text-white'>{(userEmail !== "" ? userEmail.slice(0, 2).toUpperCase() : "")}</p>
                        <TbLogout className='text-xl cursor-pointer' onClick={handleLogout} />
                    </div>
                </div>
                <div className='w-full flex justify-center gap-4'>
                    <p className={(isQuestionPageActive ? 'border-b-4 border-blue-800 text-blue-800' : "") + ' px-2 py-1 cursor-pointer'} onClick={handleQuestionPage}>Form</p>
                    <p className={(!isQuestionPageActive ? 'border-b-4 border-blue-800 text-blue-800' : "") + ' px-2 py-1 cursor-pointer'} onClick={handleResponsePage}>Response</p>
                </div>
            </nav> : ""}

            {!submited ? <main className='w-full min-h-[600px] flex flex-col items-center py-4 bg-gray-200'>
                {isLogedIn ? <div className='w-[700px] bg-white p-4 mb-4'>
                    <p className='text-center'>Using this link you can send this form</p>
                    <p className='text-center'>{window.location.href}</p>
                </div> : ""}

                <div className='w-[700px] h-[150px] flex flex-col bg-white rounded-md border-t-8 border-blue-800 px-10 relative'>
                    <p type="text" className='w-full text-3xl py-3 px-1 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' >{currentForm?.formInfo?.title} </p>
                    <p type="text" value="description" className='w-full mt-4 px-1 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' > {currentForm?.formInfo?.description}</p>

                </div>



                {currentForm?.fieldsInfo?.fields?.map((obj) => <div key={obj.id} className='w-[700px] bg-white mt-4 rounded-md px-10 py-3'>
                    <div className='flex'>
                        <p type="text" className='w-[70%] px-1 text-xl'>{obj.question}: </p>
                    </div>

                    {obj.type == "text" ? <div className='w-full px-10px mt-4'>
                        <input type="text" className='w-full px-1 py-2 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' placeholder="" onChange={(e) => handleFieldAnswer(e.target.value, obj.id)} />
                    </div> : ""}

                    {obj.type == "number" ? <div className='w-full px-10px mt-4'>
                        <input type="number" className='w-full px-1 py-2 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' placeholder="answers" onChange={(e) => handleFieldAnswer(e.target.value, obj.id)} />
                    </div> : ""}

                    {obj.type == "email" ? <div className='w-full px-10px mt-4'>
                        <input type="email" className='w-full px-1 py-2 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' placeholder="answers" onChange={(e) => handleFieldAnswer(e.target.value, obj.id)} />
                    </div> : ""}

                    {obj.type == "radio" ? <div className='w-full px-10px mt-4'>
                        {obj.options?.map((option) => <div className='flex gap-4 mt-3'>
                            <input type="radio" name={obj.question} value={option.value} onChange={(e) => handleFieldAnswer(e.target.value, obj.id)} />
                            <p className=''> {option.value}</p>

                        </div>)}

                    </div> : ""}

                    {obj.type == "checkbox" ? <div className='w-full px-10px mt-4'>
                        {obj.options?.map((option) => <div key={option.id} className='flex gap-4 mt-3'>
                            <input type="checkbox" name="" value={option.value} onChange={(e) => handleFieldAnswer(e.target.value, obj.id)} />
                            <p className='' >{option.value}</p>

                        </div>)}

                    </div> : ""}
                </div>)}


                {/* save button */}
                <div className=''>
                    <button className='px-3 py-2 bg-blue-800 rounded-md text-white cursor-pointer mt-8' onClick={handleSubmitResponse}>Submit</button>
                </div>
            </main> : ""}

            {
                submited ? <div className='w-full flex justify-center mt-4'>
                    <div className='w-[700px] h-[100px] bg-gray-300 border-t-4 border-blue-800 flex justify-center items-center'>
                        <p className='text-center'>Form submited successfully</p>

                    </div>
                </div> : ""
            }
        </div>
    )
}

export default FormPreview
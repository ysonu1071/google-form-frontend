import React, { useState } from 'react'
import { FaFileAlt } from "react-icons/fa"
import { TbLogout } from "react-icons/tb"
import { AiOutlinePlus } from "react-icons/ai"
import { RiDeleteBin6Line } from "react-icons/ri"
import { AiOutlineClose } from "react-icons/ai"

import { useDispatch, useSelector } from 'react-redux'
import { setQuestionPage, setIsLogedIn, setCurentForm } from '../redux/slices/formSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'

function FormQuestion() {
    const [form, setForm] = useState({ title: "From Title", description: "from description" })
    const [questions, setQuestions] = useState([])
    const { isQuestionPageActive, userEmail } = useSelector((state) => state.form);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    

    const addQuestion = () => {
        let id = new Date().getTime();
        let obj = { id: id, type: "text", question: "Your question" }
        setQuestions([...questions, obj]);
    }

    const handleQuestionText = (value, id) => {
        let temp = [];
        for (let obj of questions) {
            if (obj.id === id) {
                obj.question = value;
            }
            temp.push(obj);
        }
        setQuestions(temp);
    }
    const handleSelectValue = (value, id) => {
        let temp = [];
        for (let obj of questions) {
            if (obj.id == id) {
                obj.type = value;
                if (value === "radio" || value === "checkbox") {
                    let optionId = new Date().getTime();
                    obj.options = [{ id: optionId, value: "Option1" }]
                }
            }

            temp.push(obj);
        }

        setQuestions(temp);
    }

    const handleDelteQuestion = (id) => {
        let temp = questions.filter((obj) => obj.id != id);
        setQuestions(temp);
    }

    const addRadioOption = (id) => {
        let temp = [];
        for (let obj of questions) {
            if (obj.id == id) {
                let optionId = new Date().getTime();
                let newOption = { id: optionId, value: "Option " + Number(obj.options.length + 1) }
                obj.options = [...obj.options, newOption];
            }

            temp.push(obj);
        }
        setQuestions(temp);
    }

    const deleteRadioOption = (questionId, optionId) => {
        let temp = [];
        for (let obj of questions) {
            if (obj.id === questionId) {
                let newOptions = obj.options.filter((option) => option.id !== optionId);
                obj.options = newOptions;
            }

            temp.push(obj);
        }

        setQuestions(temp);
    }

    const handleOptionValue = (value, optionId, questionId) => {
        let temp = [];
        for (let obj of questions) {
            if (obj.id === questionId) {
                let optTemp = [];
                for (let option of obj.options) {
                    if (option.id === optionId) {
                        option.value = value;
                    }
                    optTemp.push(option);
                }
                obj.options = optTemp;
            }

            temp.push(obj);
        }

        setQuestions(temp);
    }

    

    const handleSaveFormStructure = () => {
        let token = ''
        if(localStorage.getItem("userData")){
            let obj = JSON.parse(localStorage.getItem("userData"));
            token = obj.token;
        }

        fetch("http://localhost:8000/form/save-structure", {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + token
            },
            body: JSON.stringify({form, questions})
        }).then((response)=>{
            return response.json();
        }).then((response)=>{
            if(response.status === "success"){
                dispatch(setCurentForm({formInfo: response.formInfo, fieldsInfo: response.fieldsInfo}))
                navigate(`/form/preview/${response.formInfo._id}`)
            }else{
                console.log(response.message)
                alert(response.message);
            }
        }).catch((err)=>{
            console.log(err.message);
            alert(err.message);
        })
    }
    console.log(questions)

    return (
        <div>
            <Navbar/>

            <main className='w-full min-h-[600px] flex flex-col items-center py-4 bg-gray-200'>
                <div className='w-[700px] h-[150px] flex flex-col bg-white rounded-md border-t-8 border-blue-800 px-10 relative'>
                    <input type="text" value={form.title} onChange={(e) => setForm({ description:form.description, title: e.target.value})} className='w-full text-3xl py-3 px-1 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' />
                    <input type="text" value={form.description} className='w-full mt-4 px-1 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' onChange={(e)=> setForm({title:form.title, description: e.target.value})} />

                    {/* add question button */}
                    <div className='absolute top-[20px] right-[-50px] bg-white p-3 rounded-md text-blue-900 cursor-pointer shadow-md' title='Add question' onClick={addQuestion}>
                        <AiOutlinePlus />
                    </div>
                </div>



                {questions.map((obj) => <div key={obj.id} className='w-[700px] bg-white mt-4 rounded-md px-10 py-3'>
                    <div className='flex'>
                        <input type="text" value={obj.question} className='w-[70%] px-1 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800 text-xl' onChange={(e) => handleQuestionText(e.target.value, obj.id)} />
                        <div className='w-[30%] bg-gray-300 h-[50px] flex justify-center items-center'>
                            <select name="" id="" value={obj.type} onChange={(e) => handleSelectValue(e.target.value, obj.id)}>
                                <option value="text">Text input</option>
                                <option value="number">Number input</option>
                                <option value="email">Email input</option>
                                <option value="radio">Radio input</option>
                                <option value="checkbox">CheckBox input</option>
                            </select>
                        </div>
                    </div>

                    {obj.type == "text" ? <div className='w-full px-10px mt-4'>
                        <input type="text" className='w-full px-1 py-2 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' placeholder="answers" />
                    </div> : ""}

                    {obj.type == "number" ? <div className='w-full px-10px mt-4'>
                        <input type="number" className='w-full px-1 py-2 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' placeholder="answers" />
                    </div> : ""}

                    {obj.type == "email" ? <div className='w-full px-10px mt-4'>
                        <input type="email" className='w-full px-1 py-2 outline-none border-b border-gray-300 focus:border-b-2 focus:border-blue-800' placeholder="answers" />
                    </div> : ""}

                    {obj.type == "radio" ? <div className='w-full px-10px mt-4'>
                        {obj.options?.map((option) => <div className='flex gap-4 mt-3'>
                            <input type="radio" name="" value="answers" />
                            <input type="text" className='border-b border-gray-300 outline-none focus:border-b-2 focus:border-blue-800' value={option.value} onChange={(e) => handleOptionValue(e.target.value, option.id, obj.id)} />
                            <div className='cursor-pointer' onClick={() => deleteRadioOption(obj.id, option.id)}>
                                <AiOutlineClose />
                            </div>
                        </div>)}
                        <button className='mt-8 px-3 py-1 bg-gray-400 rounded-md' onClick={() => addRadioOption(obj.id)}>Add option</button>
                    </div> : ""}

                    {obj.type == "checkbox" ? <div className='w-full px-10px mt-4'>
                        {obj.options?.map((option) => <div key={option.id} className='flex gap-4 mt-3'>
                            <input type="checkbox" name="" value="answers" />
                            <input type="text" className='border-b border-gray-300 outline-none focus:border-b-2 focus:border-blue-800' value={option.value} onChange={(e) => handleOptionValue(e.target.value, option.id, obj.id)} />
                            <div className='cursor-pointer' onClick={() => deleteRadioOption(obj.id, option.id)}>
                                <AiOutlineClose />
                            </div>
                        </div>)}
                        <button className='mt-8 px-3 py-1 bg-gray-400 rounded-md' onClick={() => addRadioOption(obj.id)}>Add option</button>
                    </div> : ""}

                    {/* delete button */}
                    <div className='w-full flex justify-end mt-6 py-4 text-xl'>
                        <RiDeleteBin6Line className='cursor-pointer' onClick={() => handleDelteQuestion(obj.id)} />
                    </div>
                </div>)}


                {/* save button */}
                <div className=''>
                    <button className='px-3 py-2 bg-blue-800 rounded-md text-white cursor-pointer mt-8' onClick={handleSaveFormStructure}>Save form</button>
                </div>
            </main>
        </div>
    )
}

export default FormQuestion
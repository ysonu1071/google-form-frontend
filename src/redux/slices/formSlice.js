import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isQuestionPageActive: true,
    userEmail: "",
    isLogedIn: false,
    currentFormId: "",
    currentForm:{},
    formList:[],
    responseData: {}
}

const formSlice = createSlice({
    name:"form",
    initialState,
    reducers:{
        setQuestionPage: (state, action) => {
            state.isQuestionPageActive = action.payload;
        },
        setUserEmail: (state, action) => {
            state.userEmail = action.payload;
        },
        setIsLogedIn: (state, action) => {
            state.isLogedIn = action.payload;
        },
        setCurentForm: (state, action) => {
            state.currentForm = action.payload;
        },
        setFormList: (state, action) => {
            state.formList = [...action.payload];
        },
        setCurrentFormId: (state, action) => {
            state.currentFormId = action.payload;
        },
        setResponseData: (state, action) => {
            state.responseData = action.payload;
        }
        
    }
})

export const {setQuestionPage, setUserEmail, setIsLogedIn, setCurentForm, setFormList, setCurrentFormId, setResponseData} = formSlice.actions;
export default formSlice.reducer;

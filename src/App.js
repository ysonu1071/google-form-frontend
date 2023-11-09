import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import FormQuestion from "./pages/FormQuestion";
import FormResponse from "./pages/FormResponse";
import FormPreview from "./pages/FormPreview";

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/form/question" element={<FormQuestion/>} />
        <Route path="/form/response/:id" element={<FormResponse/>} />
        <Route path="/form/preview/:id" element={<FormPreview/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

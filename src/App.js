import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp'
import AuthorDashboard from './pages/AuthorDashboard/AuthorDashboard';
import AddSubmission from './pages/AddSubmission/AddSubmission';
import UpdateSubmission from './pages/UpdateSubmission/UpdateSubmission';
import { ToastContainer, toast } from "react-toastify";
import "../node_modules/react-toastify/dist/ReactToastify.css";
import ShowReviews from './pages/ShowReviews/ShowReviews';
import ViewStatus from './pages/ViewStatus/ViewStatus';
import ReviewerDashboard from './pages/ReviewerDashboard/ReviewerDashboard';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from "./pages/ResetPassword/ResetPassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/signin" />}/>
          <Route path='/signin' element={<SignIn/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/author-dashboard' element={<AuthorDashboard/>}/>
          <Route path='/addSubmission' element={<AddSubmission/>}/>
          <Route path='/updateSubmission' element={<AddSubmission/>}/>
          <Route path='/viewReviews' element={<ShowReviews/>}/>
          <Route path='/viewStatus' element={<ViewStatus/>}/>

          <Route path='/reviewer-dashboard' element={<ReviewerDashboard/>}/>
          <Route path='/forgotPassword' element={<ForgotPassword/>}/>
          <Route path='/resetPassword/:emailId' element={<ResetPassword/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;

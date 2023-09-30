import LoginPage from './client/auth/LoginPage';
import Register from './client/auth/Register';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './client/dashboard/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GuardedRoute from "./GuardedRoute";

function App() {
    return (
        <div className="App">
            <ToastContainer/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/dashboard" element={<GuardedRoute><Dashboard/></GuardedRoute>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}


export default App;

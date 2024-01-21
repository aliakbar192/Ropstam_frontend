import './App.css';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/dashboard/dashboard';
import PrivateRoutes from './PrivateRoutes';
import CarForm from './components/carForm/carForm';
const defaultTheme = createTheme();
function App() {
    return (
        <div className="App">
            <ToastContainer></ToastContainer>
            <ThemeProvider theme={defaultTheme}>
                <BrowserRouter>
                    <Routes>
                        <Route element={<PrivateRoutes />}>
                            <Route path="/dashboard" element={<Dashboard />}></Route>
                            <Route path="/addDetails" element={<CarForm />}></Route>
                        </Route>
                        <Route path="/" element={<Login />}></Route>
                        <Route path="/signup" element={<Signup />}></Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
}

export default App;

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import LoginCard from './LoginPage/LoginCard';
import SignupCard from './SignupPage/SignupCard';
import NotFoundPage from './Errors/NotFoundPage';
import NavBar from './navBar/NavBar';
import ProtectedRoute from './ProtectedRoute';
import ChatPage from './ChatPage/ChatPage';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginCard />} />
        <Route path="signup" element={<SignupCard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rt1={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  </BrowserRouter>
);

export default App;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/prisms_logo_.png";
//import LoginPage from './LoginPage';
import axios from "axios";
function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    //const [submitted, setSubmitted] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);
    // const handleEmailSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   // Simulate email check and move to password input
    //   setSubmitted(true);
    // };
    const handlEmailPasswordSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        let identifier = email;
        // if(email && newPassword){
        //   axios.post('https:localhost:8000/api/auth/reset-password', { identifier, newPassword })
        // }
        if (email && newPassword) {
            axios.post("https:localhost:8000/api/auth/reset-password", {
                identifier,
                newPassword,
            });
        }
        // TODO: Call backend API to reset password
        setPasswordChanged(true);
    };
    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center border-2 border-purple-200 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg border-[8px] border-purple-100 shadow-lg">
        <div className="mb-6 text-center">
          <img src={Logo} alt="PRISMS Logo" className="h-14 mx-auto mb-2"/>
          <h2 className="text-2xl font-semibold text-gray-700">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-500">
            Enter your email and new password below
          </p>
        </div>

        {!passwordChanged ? (<form onSubmit={handlEmailPasswordSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="you@example.com"/>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input id="password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="New password"/>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="Confirm password"/>
            </div>

            <button type="submit" className="w-full py-3 px-4 font-medium rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition">
              Reset Password
            </button>

            <div className="text-sm text-center mt-2">
              <Link to="/login" className="text-purple-700 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>) : (<div className="text-center text-blue-400">
            <p className="mb-4">
              ✅ Password has been reset successfully for{" "}
              <strong>{email}</strong>.
            </p>
            <Link to="/" className="text-purple-600 hover:underline text-sm">
              Return to Login
            </Link>
          </div>)}
      </div>
    </div>);
}
export default ForgotPasswordPage;

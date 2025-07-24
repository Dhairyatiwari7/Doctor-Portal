import React ,{useContext}from 'react';
import { useNavigate } from 'react-router-dom';
import {AppContext} from '../context/AppContext';
const Login = () => {
  const [state, setState] = React.useState("SignUp");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const Navigate=useNavigate();
  const{token,setToken}=useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault();



    setToken(true)
    Navigate('/')
    
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4"
    >
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-700">
          {state === "SignUp" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please {state === "SignUp" ? "sign up" : "login"} to book your Appointment
        </p>

        {state === "SignUp" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          {state === "SignUp" ? "Create Account" : "Login"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm">
            {state === "SignUp" ? "Already have an account?" : "Don’t have an account?"}
            <span
              onClick={() => setState(state === "SignUp" ? "Login" : "SignUp")}
              className="text-blue-600 ml-2 cursor-pointer font-semibold hover:underline"
            >
              {state === "SignUp" ? "Login" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Login;

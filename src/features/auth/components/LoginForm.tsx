import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { loginRequest } from "@/store/slices/authSlice";

import Loader from "@/components/common/Loader";

import { validateEmail, validatePassword } from "@/lib/validations";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = () => {
    const newErrors: any = {};

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) newErrors.email = emailCheck.message;

    const passCheck = validatePassword(password);
    if (!passCheck.valid) newErrors.password = passCheck.message;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    dispatch(loginRequest({ email, password }));
  };

  const inputClass =
    "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const btnClass =
    "w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
          <p className="text-sm text-gray-500 text-center">
            Sign in to your account
          </p>
        </div>

        <div>
          <input
            className={inputClass}
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              const check = validateEmail(e.target.value);
              setErrors({ ...errors, email: check.valid ? undefined : check.message });
            }}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            className={inputClass}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              const check = validatePassword(e.target.value);
              setErrors({ ...errors, password: check.valid ? undefined : check.message });
            }}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        {loading ? (
          <Loader />
        ) : (
          <button
            className={btnClass}
            onClick={handleLogin}
          >
            Login
          </button>
        )}

        {/* Link to Signup */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
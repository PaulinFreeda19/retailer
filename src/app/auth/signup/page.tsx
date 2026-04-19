import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signupNextStep,
  verifyOtpRequest,
  completeSignup,
} from "@/store/slices/authSlice";
import { required, validateEmail, validatePassword, validateOtp, validateName } from "@/lib/validations";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupStep, loading } = useSelector((s: any) => s.auth);

  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (signupStep === 4) {
      console.log("signupStep:", signupStep);
      timeoutId = setTimeout(() => navigate('/login'), 2000); // Show success for 2 seconds then redirect
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [signupStep, navigate]);

  const handleContinue = () => {
    const newErrors: any = {};
    if (signupStep === 1) {
      const nameCheck = validateName(form.name);
      if (!nameCheck.valid) newErrors.name = nameCheck.message;
      const emailCheck = validateEmail(form.email);
      if (!emailCheck.valid) newErrors.email = emailCheck.message;
      const passCheck = validatePassword(form.password);
      if (!passCheck.valid) newErrors.password = passCheck.message;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      dispatch(signupNextStep(form));
    }
  };

  const handleVerifyOtp = () => {
    const otpCheck = validateOtp(form.otp);
    if (!otpCheck.valid) {
      setErrors({ otp: otpCheck.message });
      return;
    }
    setErrors({});
    dispatch(verifyOtpRequest({ otp: form.otp }));
  };

  const handleFinish = () => {
    const businessCheck = required(form.business);
    if (!businessCheck.valid) {
      setErrors({ business: businessCheck.message });
      return;
    }
    setErrors({});
    dispatch(completeSignup());
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
          <h1 className="text-2xl font-bold text-center">Create Account</h1>
          <p className="text-sm text-gray-500 text-center">
            Step {signupStep} of 4
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(signupStep / 4) * 100}%` }}
          />
        </div>

        {/* Step 1 */}
        {signupStep === 1 && (
          <div className="space-y-4">
            <div>
              <input
                className={inputClass}
                placeholder="Name"
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  const check = validateName(e.target.value);
                  setErrors({ ...errors, name: check.valid ? undefined : check.message });
                }}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                className={inputClass}
                placeholder="Email"
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
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
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  const check = validatePassword(e.target.value);
                  setErrors({ ...errors, password: check.valid ? undefined : check.message });
                }}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button
              className={btnClass}
              onClick={handleContinue}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {signupStep === 2 && (
          <div className="space-y-4">
            <div>
              <input
                className={inputClass}
                placeholder="Enter OTP"
                onChange={(e) => {
                  setForm({ ...form, otp: e.target.value });
                  const check = validateOtp(e.target.value);
                  setErrors({ ...errors, otp: check.valid ? undefined : check.message });
                }}
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
            </div>
            <button
              className={btnClass}
              disabled={loading}
              onClick={handleVerifyOtp}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Step 3 */}
        {signupStep === 3 && (
          <div className="space-y-4">
            <div>
              <input
                className={inputClass}
                placeholder="Business Name"
                onChange={(e) => {
                  setForm({ ...form, business: e.target.value });
                  const check = required(e.target.value);
                  setErrors({ ...errors, business: check.valid ? undefined : check.message });
                }}
              />
              {errors.business && <p className="text-red-500 text-sm mt-1">{errors.business}</p>}
            </div>
            <button
              className={btnClass}
              onClick={handleFinish}
            >
              Finish Signup
            </button>
          </div>
        )}

        {/* Step 4 */}
        {signupStep === 4 && (
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-green-600">
              Success!
            </h2>
            <p className="text-gray-500">
              Your account has been created successfully. Redirecting to login...
            </p>
            <button
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate('/login')}
            >
              Go to Login Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
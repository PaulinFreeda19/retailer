import { useState } from "react";

export default function SecuritySettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  const handlePasswordChange = () => {
    if (!password || password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    setError("");
    alert("Password changed (mock)");
    setPassword("");
    setConfirm("");
    setShowPasswordForm(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-semibold text-lg">Security</h3>

      {/* Change Password */}
      <button
        onClick={() => setShowPasswordForm(!showPasswordForm)}
        className="px-3 py-2 bg-blue-500 text-white rounded"
      >
        Change Password
      </button>

      {showPasswordForm && (
        <div className="space-y-2">
          <input
            type="password"
            placeholder="New Password"
            className="border p-2 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 rounded w-full"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handlePasswordChange}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Save Password
          </button>
        </div>
      )}

      {/* 2FA */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={twoFA}
          onChange={() => setTwoFA(!twoFA)}
        />
        Enable Two-Factor Authentication (Mock)
      </label>
    </div>
  );
}
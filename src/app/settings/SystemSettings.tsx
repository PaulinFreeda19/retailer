import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateSettings } from "@/store/slices/profileSlice";

export default function SystemSettings() {
  const dispatch = useAppDispatch();
  const { settings, profile } = useAppSelector((s) => s.profile);

  const handleExport = () => {
    const data = JSON.stringify({ profile, settings }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "profile-data.json";
    a.click();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-semibold text-lg">System Settings</h3>

      {/* Theme */}
      <div>
        <label className="block text-sm mb-1">Theme</label>
        <select
          value={settings.theme}
          onChange={(e) =>
            dispatch(updateSettings({ theme: e.target.value as "light" | "dark" }))
          }
          className="border p-2 rounded w-full"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm mb-1">Language</label>
        <input
          value={settings.language}
          onChange={(e) =>
            dispatch(updateSettings({ language: e.target.value }))
          }
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-sm mb-1">Timezone</label>
        <input
          value={settings.timezone}
          onChange={(e) =>
            dispatch(updateSettings({ timezone: e.target.value }))
          }
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Export */}
      <button
        onClick={handleExport}
        className="px-3 py-2 bg-green-500 text-white rounded"
      >
        Export Data
      </button>
    </div>
  );
}
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateSettings } from "@/store/slices/profileSlice";

export default function NotificationSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((s) => s.profile.settings);

  const handleToggleAll = (value: boolean) => {
    dispatch(
      updateSettings({
        emailNotifications: value,
        pushNotifications: value,
      })
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-semibold text-lg">Notifications</h3>

      {/* Individual toggles */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.emailNotifications}
          onChange={(e) =>
            dispatch(updateSettings({ emailNotifications: e.target.checked }))
          }
        />
        Email Notifications
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.pushNotifications}
          onChange={(e) =>
            dispatch(updateSettings({ pushNotifications: e.target.checked }))
          }
        />
        Push Notifications
      </label>

      {/* Bulk controls */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => handleToggleAll(true)}
          className="px-2 py-1 bg-green-500 text-white rounded text-sm"
        >
          Enable All
        </button>

        <button
          onClick={() => handleToggleAll(false)}
          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
        >
          Disable All
        </button>
      </div>
    </div>
  );
}
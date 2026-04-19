import SecuritySettings from "../../app/settings/SecuritySettings";
import NotificationSettings from "../../app/settings/NotificationSettings";
import SystemSettings from "../../app/settings/SystemSettings";

export default function ProfilePage() {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <SecuritySettings />
      <NotificationSettings />
      <SystemSettings />
    </div>
  );
}
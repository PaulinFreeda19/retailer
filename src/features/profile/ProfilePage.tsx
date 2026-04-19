import ProfileForm from "./components/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <ProfileForm />
    </div>
  );
}
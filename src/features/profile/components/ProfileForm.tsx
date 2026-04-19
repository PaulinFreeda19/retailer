import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateProfile } from "@/store/slices/profileSlice";

import {
  validateName,
  validateEmail,
  required,
  validateField,
} from "@/lib/validations"; 

export default function ProfileForm() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.profile.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔹 Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Validate all fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameVal = validateField(formData.name, [required, validateName]);
    if (!nameVal.valid) newErrors.name = nameVal.message!;

    const emailVal = validateField(formData.email, [required, validateEmail]);
    if (!emailVal.valid) newErrors.email = emailVal.message!;

    const phoneVal = required(formData.phone);
    if (!phoneVal.valid) newErrors.phone = phoneVal.message!;

    const addressVal = required(formData.address);
    if (!addressVal.valid) newErrors.address = addressVal.message!;

    const businessVal = required(formData.businessName);
    if (!businessVal.valid) newErrors.businessName = businessVal.message!;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Save
  const handleSave = () => {
    if (!validateForm()) return;

    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  // 🔹 Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">

      {/* 🔹 Header */}
      <div className="flex justify-end items-center">

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Save
          </button>
        )}
      </div>

      {/* 🔹 Image */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border">
          {formData.image ? (
            <img src={formData.image} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        {isEditing && (
          <input type="file" onChange={handleImageUpload} />
        )}
      </div>

      {/* 🔹 Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Name */}
        <div>
          <input
            disabled={!isEditing}
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            disabled={!isEditing}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <input
            disabled={!isEditing}
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Phone"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div>
          <input
            disabled={!isEditing}
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Address"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        {/* Business */}
        <div>
          <input
            disabled={!isEditing}
            value={formData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Business Name"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm">{errors.businessName}</p>
          )}
        </div>

      </div>
    </div>
  );
}
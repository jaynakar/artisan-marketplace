// src/utils/cloudinaryUpload.js

const CLOUD_NAME = import.meta?.env?.VITE_CLOUDINARY_CLOUD_NAME || 'dwm7urbfg';
const UPLOAD_PRESET = import.meta?.env?.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_ecommerce';

export async function uploadImageToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const data = await response.json();
  return data.secure_url; // This is the image URL you can store in Firestore
}
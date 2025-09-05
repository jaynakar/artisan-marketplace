// src/utils/cloudinaryUpload.js

const CLOUD_NAME = 'dwm7urbfg'; // Replace with your Cloudinary cloud name
const UPLOAD_PRESET = 'unsigned_ecommerce'; // Replace with your unsigned upload preset

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
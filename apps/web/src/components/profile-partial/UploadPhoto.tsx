'use client';
import { useAppDispatch } from '@/lib/features/hooks';
import { setUser } from '@/lib/features/user/userSlice';
import Cookies from 'js-cookie';
import React, { useRef, useState } from 'react';

export default function UploadPhoto() {
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  const handleChange = () => {
    if (imageRef.current && imageRef.current.files) {
      const data = imageRef.current.files[0];
      setImage(data);
    }
  };

  const handleUpload = async (): Promise<void> => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      if (!image) {
        console.error('No image selected');
        return;
      }

      const formData = new FormData();
      formData.set('file', image);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;

      const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorResponse = await res.text();
        throw new Error(errorResponse);
      }

      const response = await res.json();

      if (response.status === 'success') {
        alert('Image uploaded successfully');
        dispatch(setUser(response.userData));
      } else {
        throw new Error(response.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  return (
    <div>
      <input
        accept="image/png, image/jpeg"
        onChange={handleChange}
        type="file"
        ref={imageRef}
      />
      <button className="btn btn-primary" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

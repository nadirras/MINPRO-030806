import EditEmail from '@/components/profile-partial/EditEmail';
import EditProfile from '@/components/profile-partial/EditProfile';
import UploadPhoto from '@/components/profile-partial/UploadPhoto';
import Link from 'next/link';
import React from 'react';

export default function EditProfilePage() {
  return (
    <div className="flex flex-col justify-center items-center mb-10">
      <Link href="/profile" className="btn btn-primary mt-10">
        {' '}
        {`<- Kembali`}
      </Link>
      <h1 className="text-3xl font-bold p-9">Update Profile</h1>
      {/* <UploadPhoto /> */}
      <EditEmail />
      <EditProfile />
    </div>
  );
}

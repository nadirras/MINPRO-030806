'use client';
import { useAppSelector } from '@/lib/features/hooks';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export interface IUser {
  username: string;
  email: string;
  UserDetail: {
    nama_depan: string;
    nama_belakang: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    nomor_telepon: string;
    photo_profile: string;
  } | null;
  referral: {
    myReferralCode: string;
  };
  totalActivePoints: number;
  discountVoucher: {
    discountCoupon: string;
    discountPercentage: number;
    expired_date: string;
  };
}

export default function MainProfile() {
  const [user, setUser] = useState<IUser | null>(null);
  const token = useAppSelector((state) => state.user.value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          console.log('Login first');
          return;
        }
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;
        console.log(userId);
        const res = await fetch(`http://localhost:8000/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await res.json();
        console.log(userData.userData.UserDetail);
        setUser(userData.userData);
        console.log(userData.UserData.photo_profile);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token]);

  function formatGender(gender: string) {
    if (gender === 'Laki_laki') {
      return 'Laki-laki';
    }
    return gender;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid-profile h-screen mx-10">
      {user && (
        <>
          <div className="container">
            <time dateTime="2030-10-25" suppressHydrationWarning />
            <div className="card bg-base-100 shadow-xl p-4">
              <div className="card-title">
                {user.UserDetail?.nama_depan || 'N/A'}{' '}
                {user.UserDetail?.nama_belakang || 'N/A'}
              </div>
              <div className="card-body">
                <table>
                  <tbody>
                    <tr>
                      <td>Poin</td>
                      <td>asdf</td>
                    </tr>
                    <tr>
                      <td>List</td>
                    </tr>
                    <tr>
                      <td>Voucher</td>
                    </tr>
                    <tr>
                      <td>Review</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="card bg-base-100 shadow-xl p-4">
              <div className="card-title">Biodata Diri</div>
              <div className="card-body">
                <div className="biodata-grid">
                  <div className="container max-md:w-[50%]">
                    <img
                      src={user.UserDetail?.photo_profile || 'N/A'}
                      alt="Profile"
                      className="w-[17rem] h-[17rem] object-cover max-md:w-[13rem] max-md:h-[13rem] max-sm:w-[9rem] max-sm:h-[9rem]"
                    />
                  </div>
                  <div className="container max-md:w-[100%]">
                    <table className="w-full h-auto">
                      <tbody>
                        <tr>
                          <td className="w-[40%]">Username</td>
                          <td className="w-[60%]">{user.username || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="w-[40%]">Nama Depan</td>
                          <td className="w-[60%]">
                            {user.UserDetail?.nama_depan || 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-[40%]">Nama Belakang</td>
                          <td className="w-[60%]">
                            {user.UserDetail?.nama_belakang || 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-[40%]">Email</td>
                          <td className="w-[60%]">{user.email || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="w-[40%]">Tanggal Lahir</td>
                          <td className="w-[60%]">
                            {user.UserDetail?.tanggal_lahir
                              ? new Date(
                                  user.UserDetail?.tanggal_lahir,
                                ).toLocaleDateString('id', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                })
                              : 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-[40%]">Jenis Kelamin</td>
                          <td className="w-[60%]">
                            {user.UserDetail?.jenis_kelamin
                              ? formatGender(user.UserDetail?.jenis_kelamin)
                              : 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-[40%]">Nomor Telepon</td>
                          <td className="w-[60%]">
                            {user.UserDetail?.nomor_telepon || 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td className="w-[40%]">Kode Referral</td>
                          <td className="w-[60%]">
                            {user.referral?.myReferralCode || 'N/A'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <Link
                      href="/profile/edit-profile"
                      className="btn btn-primary w-auto mt-10"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

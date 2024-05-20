'use client';
import { useAppSelector } from '@/lib/features/hooks';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import ChangeRole from './ChangeRole';

export interface IUser {
  id: number;
  username: string;
  email: string;
  usedReferralCode: string | null;
  userDetail: {
    nama_depan: string;
    nama_belakang: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    nomor_telepon: string;
    photo_profile: string;
  } | null;
  referral: {
    myReferralCode: string;
  } | null;
  totalActivePoints: number;
  discount: {
    discountCoupon: string;
    discountPercentage: number;
    expired_date: string;
  }[];
  role: string;
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

        const responseData = await res.json();
        setUser(responseData.data);
        // console.log('from mainprofile:', responseData);
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

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('de-DE').format(number);
  };
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid-profile  mx-10 -z-0">
      <div className="container flex flex-col gap-4">
        <time dateTime="2030-10-25" suppressHydrationWarning />
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-title">
            {user.userDetail?.nama_depan || 'N/A'}{' '}
            {user.userDetail?.nama_belakang || 'N/A'}
          </div>

          <div className="card-body">
            {user.discount.length > 0 ? (
              user.discount.map((voucher, index) => (
                <div key={index} className="voucher-item">
                  <p>
                    Voucher: <br /> Diskon {voucher.discountPercentage}%
                  </p>
                  <p>
                    Kadaluarsa:
                    <br />
                    {new Date(voucher.expired_date).toLocaleDateString('id', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p>No active vouchers</p>
            )}
            <p>
              Poin: <br /> {formatNumber(user.totalActivePoints)}
            </p>
          </div>
        </div>
        <ChangeRole />
      </div>

      <div className="container">
        <div className="card bg-base-100 shadow-xl p-4">
          <div className="card-title">Biodata Diri</div>
          <div className="card-body">
            <div className="biodata-grid">
              <div className="container max-md:w-[50%]">
                <img
                  src={user.userDetail?.photo_profile || 'N/A'}
                  alt="Profile"
                  className="w-[17rem] h-[17rem] object-cover max-md:w-[13rem] max-md:h-[13rem] max-sm:w-[9rem] max-sm:h-[9rem]"
                />
              </div>
              <div className="container max-md:w-[100%]">
                <table className="w-full h-auto ">
                  <tbody>
                    <tr>
                      <td className="w-[40%] text-left">Username </td>
                      <td className="w-[60%] text-center">
                        {user.username || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[40%] text-left">Nama Depan </td>
                      <td className="w-[60%] text-center">
                        {user.userDetail?.nama_depan || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[40%] text-left">Nama Belakang </td>
                      <td className="w-[60%] text-center">
                        {user.userDetail?.nama_belakang || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[40%]  text-left">Email </td>
                      <td className="w-[60%] text-center">
                        {user.email || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[40%]">Tanggal Lahir </td>
                      <td className="w-[60%] text-center">
                        {user.userDetail?.tanggal_lahir
                          ? new Date(
                              user.userDetail.tanggal_lahir,
                            ).toLocaleDateString('id', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[40%]">Jenis Kelamin </td>
                      <td className="w-[60%] text-center">
                        {user.userDetail?.jenis_kelamin
                          ? formatGender(user.userDetail.jenis_kelamin)
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[40%]">Nomor Telepon </td>
                      <td className="w-[60%] text-center">
                        {user.userDetail?.nomor_telepon || 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[40%]">Kode Referral</td>
                      <td className="w-[60%] text-center">
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

      {/* Displaying Discount Vouchers */}
    </div>
  );
}

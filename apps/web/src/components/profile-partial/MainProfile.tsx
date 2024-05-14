'use client';
import { useAppSelector } from '@/lib/features/hooks';
import { getUser } from '@/lib/user';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface IUser {
  username: string;
  email: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  nomor_telepon: string;
  referral: {
    myReferralCode: string;
  };
  photo_profile: string;
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

        const res = await fetch('http://localhost:8000/api/users/keep-login', {
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
        setUser(userData);
        console.log(userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token]);
  return (
    <div className="grid-profile h-screen mx-10 ">
      {user && (
        <>
          <div className="container">
            <div className="card bg-base-100 shadow-xl p-4">
              <div className="card-title">{user.username}</div>
              <div className="card-body">
                <ul>
                  <li>Poin</li>
                  <li>List Voucher</li>
                  <li>Histori Review</li>
                </ul>
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
                      src={user.photo_profile}
                      alt="Profile"
                      className="w-[20rem] h-auto"
                    />
                  </div>
                  <div className="container max-md:w-[100%]">
                    <table className="w-full n">
                      <tbody>
                        <tr>
                          <td className="w-[30%]">Nama</td>
                          <td className="w-[70%]">{user.username}</td>
                        </tr>
                        <tr>
                          <td className="w-[30%]">Email</td>
                          <td className="w-[70%]">{user.email}</td>
                        </tr>
                        <tr>
                          <td className="w-[30%]">Tanggal Lahir</td>
                          <td className="w-[70%]">{user.tanggal_lahir}</td>
                        </tr>
                        <tr>
                          <td className="w-[30%]">Jenis Kelamin</td>
                          <td className="w-[70%]">{user.jenis_kelamin}</td>
                        </tr>
                        <tr>
                          <td className="w-[30%]">Nomor Telepon</td>
                          <td className="w-[70%]">{user.nomor_telepon}</td>
                        </tr>
                        <tr>
                          <td className="w-[30%]">Kode Referral</td>
                          <td className="w-[70%]">
                            {user.referral.myReferralCode}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <Link
                      href="/profile/edit-profile"
                      className="btn btn-primary w-[30rem] mt-10"
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

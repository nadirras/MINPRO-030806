'use client';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { getUser } from '@/lib/user';
import { useEffect, useState } from 'react';
import { setUser } from '@/lib/features/user/userSlice';
import { usePathname } from 'next/navigation';
import { deleteToken } from '@/app/action';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { IUser } from './profile-partial/MainProfile';

export const Header = () => {
  const [isEventCreator, setIsEventCreator] = useState(false);
  const [isUser, setIsUser] = useState<IUser | null>(null);

  const router = useRouter();
  const users = useAppSelector((state) => state.user.value);
  const dispatch = useAppDispatch();
  const token = Cookies.get('token');
  const path = usePathname();
  const pageUrl = ['/login', '/register'];
  const url = pageUrl.includes(path) ? '/' : path;

  const onLogout = () => {
    dispatch(setUser(null));
    deleteToken('token');
    Cookies.remove('token');
    router.push('/login');
  };

  const keepLogin = async (token: any) => {
    try {
      const res = await getUser(token);
      dispatch(setUser(res.author));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    keepLogin(token);
  }, []);

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
        setIsUser(responseData.data);
        console.log('response navbar:', responseData);
        console.log('response user navbar:', responseData.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="drawer z-20 max-md:p-2 max-sm:p-3">
      <time dateTime="2030-10-25" suppressHydrationWarning />
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl text-primary">EventZenith</a>
          </div>

          {token && (
            <div className="flex-none gap-2">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Cari Event"
                  className="input input-bordered search-bar"
                />
              </div>
              <ul className="menu menu-horizontal flex gap-2 max-md:hidden list-nav">
                <li>
                  <Link href="/">Beranda</Link>
                </li>
                <li>
                  <Link href="/keranjang">Keranjang</Link>
                </li>
                <li>
                  <Link href="/tentang">Tentang Kami</Link>
                </li>
                <li>
                  <Link href="/event-creator">Event Saya</Link>
                </li>
              </ul>
              <label
                htmlFor="my-drawer"
                className="btn drawer-button md:hidden "
              >
                {/* Hamburger menu icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-menu"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </label>

              <div className="max-md:hidden dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={isUser?.userDetail?.photo_profile}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link href="/">Beranda</Link>
                  </li>
                  <li>
                    <Link href="/jelajah">Jelajah</Link>
                  </li>
                  <li>
                    <Link href="/keranjang">Keranjang</Link>
                  </li>
                  <li>
                    <Link href="/event-creator">Event Saya</Link>
                  </li>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <a onClick={onLogout}>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {!token && (
            <ul className="menu menu-horizontal flex gap-2 list-nav">
              <li>
                <Link href="/register">Register</Link>
              </li>

              <li>
                <Link href={`/login?redirect=${url}`}>Login</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}

          <li>
            <Link href="/">Beranda</Link>
          </li>
          <li>
            <Link href="/jelajah">Jelajah</Link>
          </li>
          <li>
            <Link href="/keranjang">Keranjang</Link>
          </li>
          <li>
            <Link href="/event-creator">Event Saya</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          <li>
            <a onClick={onLogout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

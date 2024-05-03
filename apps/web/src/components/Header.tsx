import Link from 'next/link';
export const Header = () => {
  return (
    <div className="drawer z-20">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <label htmlFor="my-drawer" className="btn drawer-button">
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
            <a className="btn btn-ghost text-xl text-primary">EventZenith</a>
          </div>
          <div className="flex-none gap-2">
            <div className="form-control">
              <input
                type="text"
                placeholder="Cari Event"
                className="input input-bordered w-24 md:w-auto"
              />
            </div>
            <ul className="menu menu-horizontal flex gap-2 max-sm:hidden ">
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
                <Link href="/kontak">Hubungi Kami</Link>
              </li>
            </ul>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li className="sm:hidden">
                  <Link href="/">Beranda</Link>
                </li>
                <li className="sm:hidden">
                  <Link href="/jelajah">Jelajah</Link>
                </li>
                <li className="sm:hidden">
                  <Link href="/keranjang">Keranjang</Link>
                </li>
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
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
            <Link href="/jelajah">Jelajah</Link>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

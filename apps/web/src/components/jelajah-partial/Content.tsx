'use client';
import React, { useEffect, useState } from 'react';
import { IEvent } from '@/type/event';
import Link from 'next/link';
import EventCard from '../home-partial/EventCard';
import Cookies from 'js-cookie';
import { useDebounce } from 'use-debounce';

const ITEMS_PER_PAGE = 5;

export default function Content() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filters, setFilters] = useState({
    province: '',
    isPaid: '',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [text, setText] = useState('');
  const [value] = useDebounce(text, 1000);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = Cookies.get('token');
      setIsLoggedIn(!!loggedIn);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    console.log(text);
    setFilters((prevFilters) => ({ ...prevFilters, search: value }));
  }, [value]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:8000/api/events?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }

      const responseData = await res.json();
      console.log('Fetched events:', responseData.eventData); // Debug log
      setEvents(responseData.eventData); // Set the array of events
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexofFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentEvents = events.slice(indexofFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="drawer lg:drawer-open h-full">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="flex justify-between items-center p-4 bg-base-100 shadow">
          <h1 className="text-3xl font-bold">Events</h1>
        </div>
        <div className="flex justify-center items-center gap-3 flex-wrap p-4">
          {currentEvents.map((event) => (
            <EventCard key={event.id} event={event} isLoggedIn={isLoggedIn} />
          ))}
        </div>
        {/* Pagination */}
        <div className="join flex justify-center mr-3 mb-3">
          {[...Array(totalPages)].map((_, index) => (
            // buat array dengan panjang totalPage, ini kayak len(totalPages) misal di Python. Pake sread operator biar lebih efektif buat arraynya (gak undefined), soalnya kalau undefined gabisa di map hayoloh
            // abis itu di map, nah karena cuman mau ngeloop berapa banyak dan ga butuh parameter tambahan yang diubah, pake _ aja, soalnya index bisanya di parameter kedua
            <button
              key={index}
              className={`btn btn-square join-item ${
                currentPage === index + 1 ? 'bg-primary text-white' : ''
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          className="drawer-overlay"
          aria-label="close sidebar"
        ></label>
        <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
          <li>
            <input
              type="text"
              placeholder="Cari Event"
              className="input input-bordered search-bar"
              defaultValue=""
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </li>
          <li>
            <details>
              <summary>Opsi Biaya</summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li>
                  <a>
                    <input
                      type="radio"
                      name="isPaid"
                      value="true"
                      checked={filters.isPaid === 'true'}
                      onChange={handleFilterChange}
                    />{' '}
                    Berbayar
                  </a>
                </li>
                <li>
                  <a>
                    <input
                      type="radio"
                      name="isPaid"
                      value="false"
                      checked={filters.isPaid === 'false'}
                      onChange={handleFilterChange}
                    />{' '}
                    Gratis
                  </a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary>Lokasi (Provinsi)</summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li>
                  <a>
                    <input
                      type="radio"
                      name="province"
                      value="Banten"
                      checked={filters.province === 'Banten'}
                      onChange={handleFilterChange}
                    />{' '}
                    Banten
                  </a>
                </li>
                <li>
                  <a>
                    <input
                      type="radio"
                      name="province"
                      value="DKI Jakarta"
                      checked={filters.province === 'DKI Jakarta'}
                      onChange={handleFilterChange}
                    />{' '}
                    DKI Jakarta
                  </a>
                </li>
                <li>
                  <a>
                    <input
                      type="radio"
                      name="province"
                      value="Jawa Barat"
                      checked={filters.province === 'Jawa Barat'}
                      onChange={handleFilterChange}
                    />{' '}
                    Jawa Barat
                  </a>
                </li>
                <li>
                  <a>
                    <input
                      type="radio"
                      name="province"
                      value="Jawa Tengah"
                      checked={filters.province === 'Jawa Tengah'}
                      onChange={handleFilterChange}
                    />{' '}
                    Jawa Tengah
                  </a>
                </li>
                <li>
                  <a>
                    <input
                      type="radio"
                      name="province"
                      value="Jawa Timur"
                      checked={filters.province === 'Jawa Timur'}
                      onChange={handleFilterChange}
                    />{' '}
                    Jawa Timur
                  </a>
                </li>
              </ul>
            </details>
          </li>
          <button
            className="btn btn-primary mt-4"
            onClick={() => setFilters({ province: '', isPaid: '', search: '' })}
          >
            Clear Filters
          </button>
        </ul>
      </div>
    </div>
  );
}

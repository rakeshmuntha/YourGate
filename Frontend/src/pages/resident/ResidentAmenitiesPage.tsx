import { useEffect, useState } from 'react';
import { amenityAPI } from '../../services/api';
import { Amenity } from '../../types';
import { HiOutlineBuildingOffice2, HiOutlineClock, HiOutlineArrowRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const ResidentAmenitiesPage = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    amenityAPI.getAll().then((r) => setAmenities(r.data.amenities));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Amenities</h1>
        <p className="text-gray-400 mt-1 text-sm">Browse and book community amenities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map((a) => (
          <div
            key={a._id}
            className="card group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => navigate(`/resident/bookings?amenityId=${a._id}&name=${encodeURIComponent(a.name)}`)}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center mb-4 group-hover:bg-gray-900 dark:group-hover:bg-white transition-colors">
              <HiOutlineBuildingOffice2 className="w-6 h-6 text-gray-500 group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
            </div>

            {/* Content */}
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{a.name}</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">{a.description}</p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
              <div className="flex items-center gap-1.5">
                <HiOutlineClock className="w-3.5 h-3.5" />
                <span>{a.timeSlots.length} slot{a.timeSlots.length !== 1 ? 's' : ''}</span>
              </div>
              <span>Max {a.bookingLimitPerUser} bookings</span>
            </div>

            {/* Slot chips */}
            {a.timeSlots.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {a.timeSlots.slice(0, 3).map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#222] text-gray-600 dark:text-gray-400"
                  >
                    {s.start}–{s.end}
                  </span>
                ))}
                {a.timeSlots.length > 3 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#222] text-gray-500">
                    +{a.timeSlots.length - 3} more
                  </span>
                )}
              </div>
            )}

            <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-black dark:hover:bg-gray-100 transition-colors">
              Book Now <HiOutlineArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {amenities.length === 0 && (
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#222] flex items-center justify-center mx-auto mb-4">
            <HiOutlineBuildingOffice2 className="w-7 h-7 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-900 dark:text-white">No amenities yet</p>
          <p className="text-sm text-gray-400 mt-1">Contact your community admin</p>
        </div>
      )}
    </div>
  );
};

export default ResidentAmenitiesPage;

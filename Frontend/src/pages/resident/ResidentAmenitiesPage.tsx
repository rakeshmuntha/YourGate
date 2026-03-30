import { useEffect, useState } from 'react';
import { amenityAPI } from '../../services/api';
import { Amenity } from '../../types';
import { HiOutlineBuildingOffice2, HiOutlineClock } from 'react-icons/hi2';
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
        <h1 className="text-3xl font-bold">Amenities</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Browse & book community amenities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((a) => (
          <div key={a._id} className="card hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HiOutlineBuildingOffice2 className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">{a.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{a.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <HiOutlineClock className="w-4 h-4" />
              <span>{a.timeSlots.length} time slots available</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Max {a.bookingLimitPerUser} bookings per user</p>
            <button
              onClick={() => navigate(`/resident/bookings?amenityId=${a._id}&name=${encodeURIComponent(a.name)}`)}
              className="btn-primary w-full"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {amenities.length === 0 && (
        <div className="card text-center py-16">
          <HiOutlineBuildingOffice2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No amenities available yet</p>
        </div>
      )}
    </div>
  );
};

export default ResidentAmenitiesPage;

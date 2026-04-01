import { useEffect, useState } from 'react';
import { amenityAPI } from '../../services/api';
import { Amenity } from '../../types';
import { Building2, Clock, ArrowRight } from 'lucide-react';
import { to12hr } from '../../utils/time';
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
        <h1 className="text-3xl font-black text-[#141414] dark:text-[#EEEEEE] tracking-tight">Amenities</h1>
        <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">Browse and book community amenities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map((a) => (
          <div
            key={a._id}
            className="card group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => navigate(`/resident/bookings?amenityId=${a._id}&name=${encodeURIComponent(a.name)}`)}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-[#EEEEEE] dark:bg-[#242424] flex items-center justify-center mb-4 group-hover:bg-[#141414] dark:group-hover:bg-white transition-colors">
              <Building2 className="w-6 h-6 text-[#8A8A8A] group-hover:text-white dark:group-hover:text-[#141414] transition-colors" />
            </div>

            {/* Content */}
            <h3 className="text-base font-bold text-[#141414] dark:text-[#EEEEEE] mb-1">{a.name}</h3>
            <p className="text-sm text-[#8A8A8A] dark:text-[#616161] mb-4 leading-relaxed">{a.description}</p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-[#8A8A8A] dark:text-[#616161] mb-5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
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
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#EEEEEE] dark:bg-[#1C1C1C] text-[#545454] dark:text-[#616161]"
                  >
                    {to12hr(s.start)}–{to12hr(s.end)}
                  </span>
                ))}
                {a.timeSlots.length > 3 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#EEEEEE] dark:bg-[#1C1C1C] text-[#8A8A8A] dark:text-[#616161]">
                    +{a.timeSlots.length - 3} more
                  </span>
                )}
              </div>
            )}

            <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-black dark:hover:bg-gray-100 transition-colors">
              Book Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {amenities.length === 0 && (
        <div className="card text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-[#ADADAD] dark:text-[#616161]" />
          </div>
          <p className="font-semibold text-[#141414] dark:text-[#EEEEEE]">No amenities yet</p>
          <p className="text-sm text-[#8A8A8A] dark:text-[#616161] mt-1">Contact your community admin</p>
        </div>
      )}
    </div>
  );
};

export default ResidentAmenitiesPage;

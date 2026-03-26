import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Plus, Clock, User as UserIcon, X, CheckCircle, Heart } from 'lucide-react';
import api from '../lib/api';
import StarRating from '../components/StarRating';
import TrustBadge from '../components/TrustBadge';

// Fix Leaflet icon issue
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface FoodListing {
  _id: string;
  title: string;
  description: string;
  location: {
    coordinates: [number, number];
  };
  ownerId: string;
  ownerName: string;
  ownerRating?: number;
  ownerTotalRatings?: number;
  expiresAt: string;
  claimedBy: string | null;
  distance?: number;
}

const UserLocationMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  return <Marker position={position} icon={userIcon}><Popup>You are here</Popup></Marker>;
};

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const FoodSharing: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [center, setCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dibsCode, setDibsCode] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState<number | ''>('');
  const [lng, setLng] = useState<number | ''>('');

  const fetchListings = async (latitude: number, longitude: number) => {
    try {
      const res = await api.get('/food/nearby', {
        params: { lat: latitude, lng: longitude, radius: 5000 },
      });
      setListings(res.data);
    } catch (err) {
      console.error('Error fetching food listings:', err);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
          setLat(latitude);
          setLng(longitude);
          fetchListings(latitude, longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLocationError('Please enable location to see food near you');
          fetchListings(center[0], center[1]);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      fetchListings(center[0], center[1]);
    }
  }, []);

  const handlePostFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/food', {
        title,
        description,
        lat: Number(lat),
        lng: Number(lng),
      });
      setIsModalOpen(false);
      fetchListings(center[0], center[1]);
      // Reset form
      setTitle('');
      setDescription('');
      setLat(userLocation ? userLocation[0] : '');
      setLng(userLocation ? userLocation[1] : '');
    } catch (err) {
      console.error('Error posting food:', err);
    }
  };

  const handleClaimDibs = async (id: string) => {
    try {
      const res = await api.post(`/food/${id}/dibs`);
      setDibsCode(res.data.dibsCode);
      fetchListings(center[0], center[1]);
    } catch (err) {
      console.error('Error claiming dibs:', err);
      alert('Could not claim dibs. It might have been taken.');
    }
  };

  return (
    <div className="h-[calc(100vh-89px)] bg-[#FAF9F6] flex flex-col lg:flex-row overflow-hidden selection:bg-slate-200 selection:text-slate-900">
      {/* Sidebar */}
      <div className="w-full lg:w-[480px] bg-white border-r border-slate-100 flex flex-col soft-shadow z-10 relative">
        <div className="p-10 border-b border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[8px] font-bold uppercase tracking-widest border border-slate-100 mb-3">
                <Heart className="w-3 h-3" /> Zero Waste
              </div>
              <h1 className="text-4xl font-display font-normal tracking-tight text-slate-900 leading-none">Proximity <span className="italic">Pulse</span></h1>
            </div>
            {user && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            )}
          </div>
          {locationError && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-100 flex items-center gap-3">
              <X className="w-3.5 h-3.5" /> {locationError}
            </div>
          )}
          <p className="text-base text-slate-500 font-normal leading-relaxed">
            Real-time food sharing. Claim surplus food from neighbors before it expires.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {listings.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 soft-shadow">
                <MapPin className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No active pulses nearby</p>
            </div>
          ) : (
            listings.map((listing) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-white rounded-[32px] border p-7 transition-all duration-500 group relative overflow-hidden ${
                  listing.claimedBy ? 'border-slate-100 opacity-60' : 'soft-shadow border-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-display font-normal text-slate-900 tracking-tight group-hover:text-slate-600 transition-colors">{listing.title}</h3>
                    {listing.distance !== undefined && (
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                        {listing.distance.toFixed(1)} KM DISTANCE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <Clock className="w-3 h-3" />
                    {new Date(listing.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <p className="text-slate-500 mb-6 font-normal leading-relaxed text-sm">{listing.description}</p>
                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none">{listing.ownerName}</span>
                        {listing.ownerRating !== undefined && (
                          <TrustBadge rating={listing.ownerRating} size="sm" />
                        )}
                      </div>
                    </div>
                  </div>
                  {!listing.claimedBy && user && user.id !== listing.ownerId && (
                    <button
                      onClick={() => handleClaimDibs(listing._id)}
                      className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10"
                    >
                      Claim Dibs
                    </button>
                  )}
                  {listing.claimedBy && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" /> Claimed
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer center={center} zoom={13} className="w-full h-full z-0">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapUpdater center={center} />
          {userLocation && <UserLocationMarker position={userLocation} />}
          {listings.map((listing) => (
            <Marker
              key={listing._id}
              position={[listing.location.coordinates[1], listing.location.coordinates[0]]}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-serif font-medium text-slate-900 mb-1">{listing.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">{listing.description}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">By {listing.ownerName}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Post Food Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-12 shadow-2xl border border-slate-100"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-3xl font-display font-normal text-slate-900 mb-8 tracking-tight">Post Food</h2>
              <form onSubmit={handlePostFood} className="space-y-6">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="e.g. Fresh Bagels"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium min-h-[100px] resize-none"
                    placeholder="Describe the food and pickup details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lat}
                      onChange={(e) => setLat(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                      placeholder="37.7749"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lng}
                      onChange={(e) => setLng(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                      placeholder="-122.4194"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                >
                  Post Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dibs Code Modal */}
      <AnimatePresence>
        {dibsCode && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDibsCode(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-12 text-center shadow-2xl border border-slate-100"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-normal text-slate-900 mb-4 tracking-tight">Dibs Claimed!</h2>
              <p className="text-slate-500 font-normal mb-8">Show this code to the owner upon pickup:</p>
              <div className="bg-slate-50 rounded-2xl py-6 mb-8 border border-slate-100">
                <span className="text-4xl font-bold tracking-[0.2em] text-slate-900">{dibsCode}</span>
              </div>
              <button
                onClick={() => setDibsCode(null)}
                className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodSharing;

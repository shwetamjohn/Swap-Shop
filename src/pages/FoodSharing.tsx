import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Plus, Clock, User as UserIcon, X, CheckCircle } from 'lucide-react';
import api from '../lib/api';

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
  ownerName: string;
  expiresAt: string;
  claimedBy: string | null;
}

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dibsCode, setDibsCode] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState<number | ''>('');
  const [lng, setLng] = useState<number | ''>('');

  const fetchListings = async () => {
    try {
      const res = await api.get('/food/nearby', {
        params: { lat: center[0], lng: center[1], radius: 5000 },
      });
      setListings(res.data);
    } catch (err) {
      console.error('Error fetching food listings:', err);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [center]);

  const handlePostFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/food', {
        title,
        description,
        location: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
      });
      setIsModalOpen(false);
      fetchListings();
      // Reset form
      setTitle('');
      setDescription('');
      setLat('');
      setLng('');
    } catch (err) {
      console.error('Error posting food:', err);
    }
  };

  const handleClaimDibs = async (id: string) => {
    try {
      const res = await api.post(`/food/${id}/dibs`);
      setDibsCode(res.data.dibsCode);
      fetchListings();
    } catch (err) {
      console.error('Error claiming dibs:', err);
      alert('Could not claim dibs. It might have been taken.');
    }
  };

  return (
    <div className="h-[calc(100vh-73px)] bg-[#F8F9FA] flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full lg:w-[450px] bg-white border-r border-gray-100 flex flex-col shadow-2xl z-10">
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Proximity Pulse</h1>
            {user && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Real-time food sharing. Claim surplus food from neighbors before it expires.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No listings nearby</p>
            </div>
          ) : (
            listings.map((listing) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-white rounded-[32px] border p-6 transition-all group ${
                  listing.claimedBy ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:border-black hover:shadow-xl shadow-black/5'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{listing.title}</h3>
                  <div className="flex items-center gap-1 text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {new Date(listing.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">{listing.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">{listing.ownerName}</span>
                  </div>
                  {!listing.claimedBy && user && user.id !== (listing as any).ownerId && (
                    <button
                      onClick={() => handleClaimDibs(listing._id)}
                      className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all active:scale-95"
                    >
                      Claim Dibs
                    </button>
                  )}
                  {listing.claimedBy && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Claimed
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
          {listings.map((listing) => (
            <Marker
              key={listing._id}
              position={[listing.location.coordinates[1], listing.location.coordinates[0]]}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-black uppercase tracking-tight mb-1">{listing.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{listing.description}</p>
                  <p className="text-[10px] font-bold text-gray-400">By {listing.ownerName}</p>
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">Post Food</h2>
              <form onSubmit={handlePostFood} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="e.g. Fresh Bagels"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold min-h-[100px]"
                    placeholder="Describe the food and pickup details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lat}
                      onChange={(e) => setLat(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                      placeholder="37.7749"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lng}
                      onChange={(e) => setLng(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                      placeholder="-122.4194"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-black text-white font-black rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95"
                >
                  POST LISTING
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-12 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Dibs Claimed!</h2>
              <p className="text-gray-500 font-medium mb-8">Show this code to the owner upon pickup:</p>
              <div className="bg-gray-50 rounded-2xl py-6 mb-8">
                <span className="text-4xl font-black tracking-[0.2em] text-black">{dibsCode}</span>
              </div>
              <button
                onClick={() => setDibsCode(null)}
                className="w-full py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all active:scale-95"
              >
                GOT IT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodSharing;

import React, { useState } from 'react';
import { MapPin, CalendarDays, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FOOD_CATEGORIES, STORAGE_OPTIONS, PREP_TIME_OPTIONS, PACKED_TIME_OPTIONS, PICKUP_WINDOW_OPTIONS, MEDIA } from '../data/initialData';
import ScreenHeader from '../components/ScreenHeader';
import PhotoTile from '../components/PhotoTile';

const PHOTO_POOL = [MEDIA.curry, MEDIA.pulao, MEDIA.roti, MEDIA.sweets, MEDIA.salad];

export default function AddDonationView() {
  const { navigate, addToast } = useApp();

  const [category, setCategory] = useState(FOOD_CATEGORIES[0]);
  const [itemName, setItemName] = useState('Rice - Dal - Sabzi');
  const [quantity, setQuantity] = useState('10');
  const [unit, setUnit] = useState('kg');
  const [prepTime, setPrepTime] = useState(PREP_TIME_OPTIONS[1]);
  const [packedTime, setPackedTime] = useState(PACKED_TIME_OPTIONS[1]);
  const [storage, setStorage] = useState(STORAGE_OPTIONS[0]);
  const [foodType, setFoodType] = useState('Veg');
  const [allergens, setAllergens] = useState('');
  const [photos, setPhotos] = useState([MEDIA.curry]);
  const [pickupAddress, setPickupAddress] = useState('123 Green Park, Andheri (W), Mumbai');
  const [pickupWindow, setPickupWindow] = useState(PICKUP_WINDOW_OPTIONS[0]);

  const addPhoto = () => {
    if (photos.length >= 3) {
      addToast('Photo limit reached', 'You can attach up to 3 photos.', 'info');
      return;
    }
    setPhotos(p => [...p, PHOTO_POOL[p.length % PHOTO_POOL.length]]);
  };

  const next = () => {
    if (!itemName.trim() || !quantity.trim() || !pickupAddress.trim()) {
      addToast('Missing details', 'Fill in item name, quantity and pickup address.', 'error');
      return;
    }
    const draft = {
      category,
      itemName: itemName.trim(),
      quantity: Number(quantity) || 0,
      unit,
      prepTimeHours: parseFloat(prepTime) || 2,
      packedTime,
      storage,
      foodType,
      allergens: allergens.trim() || 'None',
      photos,
      pickupAddress: pickupAddress.trim(),
      pickupWindow,
    };
    navigate('assessment', { draft });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScreenHeader title="Add Food Donation" />
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
        <div className="space-y-4">
          <div>
            <label className="fb-label">Food Category</label>
            <select className="fb-field" value={category} onChange={e => setCategory(e.target.value)}>
              {FOOD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="fb-label">Item Name</label>
            <input className="fb-field" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Rice - Dal - Sabzi" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="fb-label">Quantity</label>
              <div className="flex gap-2">
                <input className="fb-field flex-1" inputMode="numeric" value={quantity} onChange={e => setQuantity(e.target.value.replace(/\D/g, ''))} />
                <select className="fb-field !w-[74px]" value={unit} onChange={e => setUnit(e.target.value)}>
                  <option>kg</option>
                  <option>plates</option>
                  <option>trays</option>
                </select>
              </div>
            </div>
            <div>
              <label className="fb-label">Preparation Time</label>
              <select className="fb-field" value={prepTime} onChange={e => setPrepTime(e.target.value)}>
                {PREP_TIME_OPTIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="fb-label">Packed Time</label>
              <select className="fb-field" value={packedTime} onChange={e => setPackedTime(e.target.value)}>
                {PACKED_TIME_OPTIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="fb-label">Storage Condition</label>
              <select className="fb-field" value={storage} onChange={e => setStorage(e.target.value)}>
                {STORAGE_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="fb-label">Food Type</label>
              <div className="flex bg-white border border-line rounded-xl p-1 gap-1">
                {['Veg', 'Non-Veg'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFoodType(t)}
                    className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition ${
                      foodType === t ? 'bg-brand-600 text-white shadow' : 'text-muted hover:bg-brand-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="fb-label">Allergen Info</label>
              <input className="fb-field" value={allergens} onChange={e => setAllergens(e.target.value)} placeholder="(e.g. nuts, dairy, gluten)" />
            </div>
          </div>

          <div>
            <label className="fb-label">Upload Photos</label>
            <div className="flex gap-3">
              {photos.map((p, i) => (
                <div key={i} className="relative">
                  <PhotoTile media={p} className="w-[74px] h-[74px]" size="text-2xl" />
                  <button
                    onClick={() => setPhotos(list => list.filter((_, idx) => idx !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-line shadow flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-ink" />
                  </button>
                </div>
              ))}
              {photos.length < 3 && (
                <button
                  onClick={addPhoto}
                  className="w-[74px] h-[74px] rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 flex flex-col items-center justify-center text-brand-700"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-extrabold mt-0.5">Add Photo</span>
                  <span className="text-[8.5px] text-muted font-semibold">Max 3 photos</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="fb-label">Pickup Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input className="fb-field !pl-10" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} placeholder="Street, Area, City" />
            </div>
          </div>

          <div>
            <label className="fb-label">Pickup Window</label>
            <div className="relative">
              <CalendarDays className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select className="fb-field !pl-10" value={pickupWindow} onChange={e => setPickupWindow(e.target.value)}>
                {PICKUP_WINDOW_OPTIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <button className="fb-btn-primary mt-2" onClick={next}>Next</button>
        </div>
      </div>
    </div>
  );
}

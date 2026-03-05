import React, { useState, useEffect } from 'react';
import { QrCode, X, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdwXS_5t39g_4tAbv5_fTW_Xff0IoAKGdpkq3PlyhXYSDLWEfx2CvE13cricWY7Mo/exec"; 
const KOORDINAT_KANTOR = { lat: -7.0527355, lng: 107.5992798 };
const RADIUS_MAKSIMAL = 500; 
const QR_VALID_KANTOR = "KANTOR-PUSAT-123";

function RecenterMap({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], 17);
  }, [location, map]);
  return null;
}

const ScannerArea = ({ user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [tipeAbsen, setTipeAbsen] = useState(""); 
  const [userLocation, setUserLocation] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pesanSukses, setPesanSukses] = useState("");

  // GPS Watcher dengan penanganan error lebih baik
  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          if(pesan.includes("GPS")) setPesan(""); // Bersihkan pesan error jika lokasi didapat
        },
        (err) => {
          console.error("GPS Error:", err);
          setPesan("⚠️ GPS Error: Pastikan Izin Lokasi Aktif");
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [pesan]);

  useEffect(() => {
    let scanner;
    if (isScanning) {
      const config = { fps: 20, qrbox: 250, supportedScanTypes: [0] };
      scanner = new Html5QrcodeScanner("reader", config, false);
      scanner.render((decodedText) => {
        const hasilScan = decodedText.trim().toLowerCase();
        if (hasilScan.includes(QR_VALID_KANTOR.toLowerCase())) {
          scanner.clear().then(() => {
            setIsScanning(false);
            prosesAbsensi(tipeAbsen);
          });
        } else {
          setPesan(`❌ QR Salah! Terbaca: "${decodedText}"`);
        }
      }, (error) => {});
    }
    return () => { if (scanner) scanner.clear().catch(e => {}); };
  }, [isScanning, tipeAbsen]);

  const hitungJarak = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; 
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const deltaP = (lat2-lat1) * Math.PI/180;
    const deltaLon = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(deltaP/2) * Math.sin(deltaP/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))); 
  };

  const prosesAbsensi = async (tipe) => {
    setLoading(true);
    setPesan("📍 Memverifikasi Lokasi...");

    if (!userLocation) {
      setPesan("❌ Gagal! GPS belum mengunci lokasi.");
      setLoading(false);
      return;
    }

    const { lat, lng } = userLocation;
    const jarak = hitungJarak(lat, lng, KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng);

    if (jarak > RADIUS_MAKSIMAL) {
      setPesan(`❌ Gagal! Jarak Anda ${Math.round(jarak)}m (Maks 500m)`);
      setLoading(false);
      return;
    }

    try {
      setPesan("☁️ Mengirim data...");
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "absen", id: user?.id, nama: user?.nama, tipe,
          lokasi: `${lat},${lng}`, jarak: Math.round(jarak), status: "Valid"
        }),
      });
      const result = await response.json();
      if(result.status === "success") {
        setPesanSukses(`Berhasil Absen ${tipe}!`);
        setShowSuccessModal(true);
        setPesan("");
      }
    } catch (e) { setPesan("❌ Error Jaringan!"); }
    setLoading(false);
  };

  return (
    <div className="p-4 pb-24">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6 relative z-0">
        <div className="h-64 w-full">
          <MapContainer center={[KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng]} zoom={17} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle center={[KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng]} radius={RADIUS_MAKSIMAL} pathOptions={{ color: 'blue', fillOpacity: 0.1 }} />
            <Marker position={[KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng]}><Popup>Kantor</Popup></Marker>
            {userLocation && (
              <>
                <Marker position={[userLocation.lat, userLocation.lng]}><Popup>Anda</Popup></Marker>
                <RecenterMap location={userLocation} />
              </>
            )}
          </MapContainer>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl text-center">
        {!isScanning ? (
          <div className="space-y-4 py-4">
            <h2 className="text-xl font-bold">Mulai Presensi</h2>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => {setTipeAbsen("MASUK"); setIsScanning(true);}} className="bg-blue-600 text-white py-4 rounded-2xl font-bold">Absen Masuk</button>
              <button onClick={() => {setTipeAbsen("PULANG"); setIsScanning(true);}} className="bg-orange-500 text-white py-4 rounded-2xl font-bold">Absen Pulang</button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div id="reader" className="rounded-2xl overflow-hidden border-4 border-blue-500 bg-black"></div>
            <button onClick={() => setIsScanning(false)} className="mt-4 bg-red-500 text-white px-6 py-2 rounded-xl font-bold italic">Batal Scan</button>
          </div>
        )}
        {pesan && <p className="mt-4 font-bold text-blue-600 italic">{pesan}</p>}
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl text-center max-w-xs w-full shadow-2xl">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Presensi Berhasil</h2>
            <p className="mb-6">{pesanSukses}</p>
            <button onClick={() => {setShowSuccessModal(false); onSuccess();}} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerArea;
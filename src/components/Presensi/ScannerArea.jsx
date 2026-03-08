import React, { useState, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzdwXS_5t39g_4tAbv5_fTW_Xff0IoAKGdpkq3PlyhXYSDLWEfx2CvE13cricWY7Mo/exec";
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

  // 1. GPS WATCHER
  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          if (pesan.includes("GPS")) setPesan("");
        },
        (err) => {
          console.error("GPS Error:", err);
          setPesan("⚠️ GPS Error: Aktifkan Lokasi");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [pesan]);

  // 2. SCANNER ENGINE (Kamera + File)
  useEffect(() => {
    let scanner;
    if (isScanning) {
      // Delay sedikit agar div #reader siap
      const timer = setTimeout(() => {
        // Jangan pakai supportedScanTypes agar mode Kamera & File aktif dua-duanya
        scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 20,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            aspectRatio: 1.0,
            // TAMBAHKAN INI: Paksa izinkan kamera (0) dan file (1)
            supportedScanTypes: [0, 1],
          },
          false,
        );
        scanner.render(
          (decodedText) => {
            const hasilScan = decodedText.trim().toLowerCase();
            if (hasilScan.includes(QR_VALID_KANTOR.toLowerCase())) {
              scanner.clear().then(() => {
                setIsScanning(false);
                prosesAbsensi(tipeAbsen);
              });
            } else {
              setPesan(`❌ QR Salah!`);
            }
          },
          (err) => {},
        );
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scanner) scanner.clear().catch((e) => {});
      };
    }
  }, [isScanning, tipeAbsen]);

  const hitungJarak = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const deltaP = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
      Math.cos(p1) *
        Math.cos(p2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const prosesAbsensi = async (tipe) => {
    setLoading(true);
    setPesan("📍 Verifikasi Lokasi...");

    if (!userLocation) {
      setPesan("❌ GPS belum mengunci.");
      setLoading(false);
      return;
    }

    const { lat, lng } = userLocation;
    const jarak = hitungJarak(
      lat,
      lng,
      KOORDINAT_KANTOR.lat,
      KOORDINAT_KANTOR.lng,
    );

    if (jarak > RADIUS_MAKSIMAL) {
      setPesan(`❌ Jarak ${Math.round(jarak)}m (Max 500m)`);
      setLoading(false);
      return;
    }

    try {
      // AMBIL FOTO SNAPSHOT DARI VIDEO (Jika kamera aktif)
      const video = document.querySelector("#reader video");
      let fotoBase64 = "";
      if (video) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        fotoBase64 = canvas.toDataURL("image/jpeg", 0.5);
      }

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "absen",
          id: user?.id,
          nama: user?.nama,
          tipe,
          lokasi: `${lat},${lng}`,
          jarak: Math.round(jarak),
          status: "Valid",
          foto: fotoBase64,
        }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setPesanSukses(`Berhasil Absen ${tipe}!`);
        setShowSuccessModal(true);
      }
    } catch (e) {
      setPesan("❌ Error Jaringan!");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 pb-24 text-left">
      {/* MAP AREA */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6 relative z-0">
        <div className="h-64 w-full">
          <MapContainer
            center={[KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng]}
            zoom={17}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle
              center={[KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng]}
              radius={RADIUS_MAKSIMAL}
              pathOptions={{ color: "blue", fillOpacity: 0.1 }}
            />
            <Marker position={[KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng]}>
              <Popup>Kantor</Popup>
            </Marker>
            {userLocation && (
              <>
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>Anda</Popup>
                </Marker>
                <RecenterMap location={userLocation} />
              </>
            )}
          </MapContainer>
        </div>
      </div>

      {/* ACTION AREA */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl text-center">
        {!isScanning ? (
          <div className="space-y-4 py-4">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">
              Pilih Tipe Presensi
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => {
                  setTipeAbsen("MASUK");
                  setIsScanning(true);
                }}
                className="bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Absen Masuk
              </button>
              <button
                onClick={() => {
                  setTipeAbsen("PULANG");
                  setIsScanning(true);
                }}
                className="bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Absen Pulang
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-blue-600 bg-black shadow-2xl">
              <div id="reader"></div>
              <div className="scanner-overlay"></div>
            </div>
            <button
              onClick={() => setIsScanning(false)}
              className="w-full py-3 bg-red-100 text-red-600 rounded-xl font-black uppercase text-xs tracking-widest"
            >
              Batalkan
            </button>
          </div>
        )}
        {pesan && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold italic">
            {pesan}
          </div>
        )}
      </div>

      {/* MODAL SUKSES */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-[3rem] text-center max-w-xs w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">
              Berhasil!
            </h2>
            <p className="text-sm font-bold text-gray-500 mb-8 uppercase tracking-widest">
              {pesanSukses}
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                onSuccess();
              }}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl"
            >
              Mantap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerArea;

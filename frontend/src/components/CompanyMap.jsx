import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const cityCoordinates = {
     Butwal: [27.7006, 83.4484],
  Bhairahawa: [27.5050, 83.4163],
  Siddharthanagar: [27.5050, 83.4163],
  Tilottama: [27.6400, 83.5000],
  Bardaghat: [27.5300, 83.7900],
  Sunwal: [27.6100, 83.6700],
  Parasi: [27.5333, 83.6667],
  Tansen: [27.8673, 83.5467],
  Ghorahi: [28.0400, 82.4860],
  Tulsipur: [28.1300, 82.3000],
  Nepalgunj: [28.0500, 81.6167],
  Kohalpur: [28.1980, 81.6920],
  Lumbini: [27.4698, 83.2750],
  Remote: [27.7006, 83.4484],
  Other: [27.7006, 83.4484]
}

const CompanyMap = ({ location, companyName }) => {
    const coords = cityCoordinates[location]
    if (!coords) return null

    return (
        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden mb-6'>
            <div className='px-5 py-4 border-b border-gray-100 dark:border-gray-700'>
                <h2 className='text-sm font-semibold text-gray-800 dark:text-white'>
                    Company Location
                </h2>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                    {location}, Nepal
                </p>
            </div>
            <div style={{ height: '300px', width: '100%' }}>
                <MapContainer
                    center={coords}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={coords}>
                        <Popup>
                            <div className='text-center'>
                                <p className='font-semibold text-sm'>{companyName}</p>
                                <p className='text-xs text-gray-500'>{location}, Nepal</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    )
}

export default CompanyMap
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
    'Kathmandu': [27.7172, 85.3240],
    'Lalitpur': [27.6588, 85.3247],
    'Bhaktapur': [27.6710, 85.4298],
    'Pokhara': [28.2096, 83.9856],
    'Chitwan': [27.5291, 84.3542],
    'Butwal': [27.7006, 83.4532],
    'Biratnagar': [26.4525, 87.2718],
    'Birgunj': [27.0104, 84.8777],
    'Dharan': [26.8065, 87.2846],
    'Hetauda': [27.4167, 85.0333],
    'Remote': [27.7172, 85.3240],
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
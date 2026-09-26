import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import InstagramEmbed from './InstagramEmbed'

const iconColors = {
  カフェ: 'green',
  グルメ: 'red',
  '観光・スポット': 'blue',
  スイーツ: 'orange',
  '絶景・ホテル': 'violet',
  '雑貨・ショップ': 'gold',
  すべて: 'grey',
}

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

function MapController({ selectedPlace }) {
  const map = useMap()

  if (selectedPlace) {
    map.setView(
      [Number(selectedPlace.lat), Number(selectedPlace.lon)],
      16
    )
  }

  return null
}

function MapView({
  selectedPlace,
  filteredStores,
  deleteStore,
}) {
  return (
    <div className="map-placeholder">

      <div className="map-placeholder-icon">
        📍
      </div>

      <h3>
        地図
      </h3>

      <MapContainer
        center={[35.1815, 136.9066]}
        zoom={13}
        zoomControl={true}
        style={{
          height: '400px',
          width: '100%',
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          selectedPlace={selectedPlace}
        />

        {selectedPlace && (
          <Marker
            position={[
              Number(selectedPlace.lat),
              Number(selectedPlace.lon),
            ]}
          >
            <Popup>
              {selectedPlace.name ||
                selectedPlace.display_name}
            </Popup>
          </Marker>
        )}

        {filteredStores.map((store) => (
          <Marker
            key={store.id}
            position={[
              store.lat,
              store.lng,
            ]}
            icon={createIcon(
              iconColors[store.category] || 'blue'
            )}
          >
            <Popup>

              <div>

                <h3>
                  {store.name}
                </h3>

                <p>
                  {store.category}
                </p>

                {store.url && (
                  <InstagramEmbed
                    url={store.url}
                  />
                )}

                <br />
                <br />

                <button
                  onClick={() =>
                    deleteStore(store.id)
                  }
                >
                  削除
                </button>

              </div>

            </Popup>
          </Marker>
        ))}

      </MapContainer>

    </div>
  )
}


export default MapView
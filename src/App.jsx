import { useState, useEffect } from 'react'
import './App.css'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import L from "leaflet";

const iconColors = {
  カフェ: "green",
  グルメ: "red",
  "観光・スポット": "blue",
  スイーツ: "orange",
  "絶景・ホテル": "violet",
  "雑貨・ショップ": "gold",
  すべて: "grey",
};

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

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
function App() {
  const [activeTab, setActiveTab] = useState('すべて')
  const [activeCategory, setActiveCategory] = useState('すべて')
  const [selectedCategory, setSelectedCategory] = useState('カフェ')
  const [currentPage, setCurrentPage] = useState('ホーム')

  // =========================
  // お店登録用
  // =========================

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // 検索結果から選択した場所
  const [selectedPlace, setSelectedPlace] = useState(null)


  // =========================
  // 検索用
  // =========================

  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)


  // =========================
  // 保存したお店
  // =========================

  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem('stores')

    return saved
      ? JSON.parse(saved)
      : []
  })


  // storesが変更されたらlocalStorageに保存
  useEffect(() => {
    localStorage.setItem(
      'stores',
      JSON.stringify(stores)
    )
  }, [stores])


  // =========================
  // カテゴリー
  // =========================

  const categories = [
    { name: 'すべて', icon: '✦' },
    { name: 'カフェ', icon: '☕' },
    { name: 'グルメ', icon: '🍝' },
    { name: '観光・スポット', icon: '🗼' },
    { name: 'スイーツ', icon: '🍰' },
    { name: '絶景・ホテル', icon: '🌿' },
    { name: '雑貨・ショップ', icon: '🛍️' },
  ]


  // =========================
  // 店を検索
  // =========================

  const handleSearch = async () => {
    if (!searchText.trim()) return

    setIsSearching(true)
    setSearchResults([])

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          searchText
        )}&accept-language=ja&countrycodes=jp&layer=poi&addressdetails=1&limit=20`
      )

      if (!response.ok) {
        throw new Error('検索に失敗しました')
      }

      const data = await response.json()

      // 都道府県を優先
      const prefectures = [
        '北海道',
        '青森県',
        '岩手県',
        '宮城県',
        '秋田県',
        '山形県',
        '福島県',
        '茨城県',
        '栃木県',
        '群馬県',
        '埼玉県',
        '千葉県',
        '東京都',
        '神奈川県',
        '新潟県',
        '富山県',
        '石川県',
        '福井県',
        '山梨県',
        '長野県',
        '岐阜県',
        '静岡県',
        '愛知県',
        '三重県',
        '滋賀県',
        '京都府',
        '大阪府',
        '兵庫県',
        '奈良県',
        '和歌山県',
        '鳥取県',
        '島根県',
        '岡山県',
        '広島県',
        '山口県',
        '徳島県',
        '香川県',
        '愛媛県',
        '高知県',
        '福岡県',
        '佐賀県',
        '長崎県',
        '熊本県',
        '大分県',
        '宮崎県',
        '鹿児島県',
        '沖縄県',
      ]

      const matchedPrefecture =
        prefectures.find((prefecture) =>
          searchText.includes(prefecture)
        )

      let results = data

      if (matchedPrefecture) {
        results = data
          .filter((result) =>
            result.display_name?.includes(
              matchedPrefecture
            )
          )
          .concat(
            data.filter(
              (result) =>
                !result.display_name?.includes(
                  matchedPrefecture
                )
            )
          )
      }

      setSearchResults(results.slice(0, 10))

    } catch (error) {
      console.error(error)
      setSearchResults([])

    } finally {
      setIsSearching(false)
    }
  }


  // Enterキーでも検索
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }


  // =========================
  // 検索結果を選択
  // =========================

  const selectPlace = (result) => {
    setSelectedPlace(result)

    // 店名を自動入力
    setName(
      result.name ||
      result.display_name?.split(',')[0] ||
      ''
    )

    // Instagram URLはあとから入力
    setUrl('')

    // 登録フォームを表示
    setShowAddForm(true)

    // 検索結果を閉じる
    setSearchResults([])
  }


  // =========================
  // お店を登録
  // =========================

  const addStore = async () => {

    if (!name.trim()) {
      alert('店名を入力してください')
      return
    }

    if (!url.trim()) {
      alert('Instagram URLを入力してください')
      return
    }


    try {

      let lat
      let lng


      // 検索結果から選択した場合
      if (selectedPlace) {

        lat = Number(selectedPlace.lat)
        lng = Number(selectedPlace.lon)

      } else {

        // 検索結果を使わず直接入力した場合
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            name
          )}&accept-language=ja&countrycodes=jp&layer=poi&limit=1`
        )

        if (!response.ok) {
          throw new Error('場所の検索に失敗しました')
        }

        const data = await response.json()

        if (data.length === 0) {
          alert('店舗の場所が見つかりませんでした')
          return
        }

        lat = Number(data[0].lat)
        lng = Number(data[0].lon)
      }


      // 新しい店舗データ
      const newStore = {
        id: Date.now(),
        name: name.trim(),
        url: url.trim(),
        category: selectedCategory,
        lat,
        lng,
      }


      // 保存
      setStores((prev) => [
        ...prev,
        newStore,
      ])


      // 入力をリセット
      setName('')
      setUrl('')
      setSelectedPlace(null)
      setShowAddForm(false)

      // ホームに戻す
      setCurrentPage('ホーム')

    } catch (error) {

      console.error(error)

      alert(
        '店舗の登録に失敗しました'
      )
    }
  }


  // =========================
  // お店を削除
  // =========================

  const filteredStores =
    activeCategory === 'すべて'
      ? stores
      : stores.filter(
        (store) =>
          store.category === activeCategory
      )

  const deleteStore = (id) => {

    setStores((prev) =>
      prev.filter(
        (store) => store.id !== id
      )
    )
  }


  return (
    <div className="app">

      {/* ヘッダー */}
      <header className="header">

        <div className="logo">
          <span className="logo-icon">
            ✦
          </span>

          <span>
            SNS PLACE
          </span>
        </div>

        <button className="profile-button">
          ♡
        </button>

      </header>


      {/* メイン */}
      <main className="main-content">

        {/* あいさつ */}
        <section className="greeting-section">

          <div>

            <p className="small-text">
              SNS PLACEへようこそ
            </p>

            <h1>
              週末の計画は
              <br />
              どうする？
            </h1>

          </div>
          <button className="notification-button">
            🔔
          </button>

        </section>


        {/* 検索 */}
        <section className="search-section">

          <div className="search-box">

            <button
              className="search-icon"
              onClick={handleSearch}
              aria-label="検索"
            >
              ⌕
            </button>

            <input
              type="text"
              placeholder="エリアや店名、タグで検索..."
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />

          </div>

          <button className="filter-button">
            ☰
          </button>

        </section>


        {/* 検索結果 */}
        {(isSearching ||
          searchResults.length > 0) && (

            <section className="search-results">

              {isSearching && (
                <p className="search-status">
                  場所を検索しています...
                </p>
              )}


              {!isSearching &&
                searchResults.map((result) => (

                  <button
                    key={result.place_id}
                    className="search-result-item"
                    onClick={() =>
                      selectPlace(result)
                    }
                  >

                    <span className="search-result-icon">
                      📍
                    </span>

                    <span className="search-result-text">

                      <strong>
                        {result.name ||
                          result.display_name}
                      </strong>

                      <small>
                        {result.display_name}
                      </small>

                    </span>

                  </button>

                ))}


              {!isSearching &&
                searchResults.length === 0 && (

                  <p className="search-status">
                    場所が見つかりませんでした
                  </p>

                )}

            </section>
          )}


        {/* =========================
            登録フォーム
        ========================= */}

        {showAddForm && (

          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '20px',
              margin: '16px 0',
              boxShadow:
                '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >

            <h2>
              スポットを登録
            </h2>

            <p
              style={{
                fontSize: '13px',
                color: '#777',
              }}
            >
              店名とInstagramのURLを入力してください
            </p>


            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="店名"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '10px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />


            <input
              type="url"
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              placeholder="Instagram URL"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '10px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '10px',
                boxSizing: 'border-box',
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            >
              <option value="カフェ">
                ☕ カフェ
              </option>

              <option value="グルメ">
                🍝 グルメ
              </option>

              <option value="観光・スポット">
                🗼 観光・スポット
              </option>

              <option value="スイーツ">
                🍰 スイーツ
              </option>

              <option value="絶景・ホテル">
                🌿 絶景・ホテル
              </option>

              <option value="雑貨・ショップ">
                🛍️ 雑貨・ショップ
              </option>
            </select>


            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >

              <button
                onClick={addStore}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#111',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                保存
              </button>


              <button
                onClick={() => {
                  setShowAddForm(false)
                  setSelectedPlace(null)
                  setName('')
                  setUrl('')
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                キャンセル
              </button>

            </div>

          </div>
        )}


        {/* タブ */}
        <div className="tab-container">

          {['すべて', '行きたい', '行った'].map(
            (tab) => (

              <button
                key={tab}
                className={`tab-button ${activeTab === tab
                  ? 'active'
                  : ''
                  }`}
                onClick={() =>
                  setActiveTab(tab)
                }
              >

                {tab}

                <span className="tab-count">
                  {tab === 'すべて'
                    ? stores.length
                    : 0}
                </span>

              </button>

            )
          )}

        </div>


        {/* カテゴリー */}
        <section className="category-section">

          <div className="category-scroll">

            {categories.map((category) => (

              <button
                key={category.name}
                className={`category-chip ${activeCategory === category.name
                  ? 'active'
                  : ''
                  }`}
                onClick={() =>
                  setActiveCategory(
                    category.name
                  )
                }
              >

                <span>
                  {category.icon}
                </span>

                {category.name}

              </button>

            ))}

          </div>

        </section>


        {/* 今週末の候補 */}
        <section className="weekend-card">

          <div className="weekend-header">

            <div>

              <p className="section-label">
                WEEKEND PLAN
              </p>

              <h2>
                今週末の候補
              </h2>

            </div>

            <span className="candidate-count">
              0件
            </span>

          </div>

          <p className="weekend-area">
            📍 まだ計画中の場所はありません
          </p>

          <div className="plan-members">

            <div className="member-icon">
              ＋
            </div>

            <span>
              友達と共有
            </span>

          </div>

        </section>


        {/* 保存したスポット */}
        <section className="places-section">

          <div className="places-header">

            <div>

              <p className="section-label">
                MY PLACES
              </p>

              <h2>
                保存したスポット
              </h2>

              <p className="sub-text">
                登録した場所がここに表示されます
              </p>

            </div>


            {/* 表示切り替え */}
            <div className="view-buttons">

              <button
                className={
                  currentPage === 'ホーム'
                    ? 'view-button active'
                    : 'view-button'
                }
                onClick={() =>
                  setCurrentPage('ホーム')
                }
              >
                ▦
              </button>


              <button
                className={
                  currentPage === '地図'
                    ? 'view-button active'
                    : 'view-button'
                }
                onClick={() =>
                  setCurrentPage('地図')
                }
              >
                ⌖
              </button>

            </div>

          </div>
          {/* =========================
              ホーム画面
          ========================= */}

          {currentPage === 'ホーム' && (

            <>
              {filteredStores.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    📍
                  </div>

                  <h3>
                    まだ場所がありません
                  </h3>

                  <p>
                    行きたい場所や行った場所を
                    <br />
                    登録してみましょう
                  </p>

                </div>

              ) : (

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginTop: '16px',
                  }}
                >

                  {filteredStores.map((store) => (

                    <div
                      key={store.id}
                      onClick={() => {
                        setSelectedPlace({
                          lat: store.lat,
                          lon: store.lng,
                          name: store.name,
                          display_name: store.name,
                        })
                        setCurrentPage('地図')
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: '#fff',
                        border: '1px solid #eee',
                        cursor: 'pointer',
                      }}
                    >

                      <h3
                        style={{
                          margin:
                            '0 0 8px 0',
                        }}
                      >
                        {store.name}
                      </h3>
                      <p
                        style={{
                          color: '#666',
                          marginBottom: '8px',
                        }}
                      >
                        {store.category}
                      </p>


                      <a
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagramを見る
                      </a>


                      <button
                        onClick={() =>
                          deleteStore(
                            store.id
                          )
                        }
                        style={{
                          display: 'block',
                          marginTop: '10px',
                          border: 'none',
                          background: 'none',
                          color: '#999',
                          cursor: 'pointer',
                        }}
                      >
                        削除
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </>

          )}


          {/* =========================
              地図画面
          ========================= */}

          {currentPage === '地図' && (

            <div className="map-placeholder">

              <div className="map-placeholder-icon">
                📍
              </div>

              <h3>
                地図
              </h3>


              <MapContainer
                center={[
                  35.1815,
                  136.9066,
                ]}
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

                <MapController selectedPlace={selectedPlace} />


                {/* 登録したお店をピン表示 */}

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
                      iconColors[store.category] || "blue"
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

                          <a
                            href={store.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Instagramを見る
                          </a>

                        )}


                        <br />
                        <br />


                        <button
                          onClick={() =>
                            deleteStore(
                              store.id
                            )
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

          )}

        </section>

      </main>


      {/* =========================
          下部ナビゲーション
      ========================= */}

      <nav className="bottom-nav">

        <button
          className={
            currentPage === 'ホーム'
              ? 'nav-item active'
              : 'nav-item'
          }
          onClick={() =>
            setCurrentPage('ホーム')
          }
        >
          <span>⌂</span>
          <small>
            ホーム
          </small>
        </button>


        <button
          className={
            currentPage === '地図'
              ? 'nav-item active'
              : 'nav-item'
          }
          onClick={() =>
            setCurrentPage('地図')
          }
        >
          <span>⌖</span>
          <small>
            地図
          </small>
        </button>


        {/* ＋ボタン */}

        <button
          className="add-button"
          onClick={() => {
            setName('')
            setUrl('')
            setSelectedPlace(null)
            setShowAddForm(true)
          }}
        >
          ＋
        </button>


        <button className="nav-item">

          <span>
            ♧
          </span>

          <small>
            共有
          </small>

        </button>


        <button className="nav-item">

          <span>
            ♡
          </span>

          <small>
            マイページ
          </small>

        </button>

      </nav>

    </div>
  )
}

export default App

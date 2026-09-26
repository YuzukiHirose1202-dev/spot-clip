import { useState, useEffect } from 'react'
import './App.css'
import MapView from './components/MapView'
import StoreCard from './components/StoreCard'
import SearchBox from './components/SearchBox'
import {
  searchPlaces,
  findPlace,
} from './services/nominatim'

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
  // AI旅行プラン用
  // =========================

  const [selectedStoreIds, setSelectedStoreIds] = useState([])
  const [travelPreferences, setTravelPreferences] = useState('')
  const [travelPlan, setTravelPlan] = useState('')

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
    const results = await searchPlaces(searchText)

    setSearchResults(results)

  } catch (error) {
    console.error(error)
    setSearchResults([])

  } finally {
    setIsSearching(false)
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
        const place = await findPlace(name)

        if (!place) {
          alert('店舗の場所が見つかりませんでした')
          return
        }

        lat = Number(place.lat)
        lng = Number(place.lon)
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
  // AI旅行プラン用
  // =========================

  const toggleStoreSelection = (storeId) => {
    setSelectedStoreIds((prev) => {
      if (prev.includes(storeId)) {
        return prev.filter((id) => id !== storeId)
      }

      return [...prev, storeId]
    })
  }

  const generateTravelPlan = async () => {
  if (!travelPreferences.trim()) {
    alert('旅行の希望を入力してください')
    return
  }

  if (selectedStoreIds.length === 0) {
    alert('旅行に使いたいお店を選択してください')
    return
  }

  try {
    const selectedStores = stores.filter((store) =>
      selectedStoreIds.includes(store.id)
    )

    const response = await fetch(
      'http://localhost:3001/api/travel-plan',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stores: selectedStores,
          preferences: travelPreferences,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'AI旅行プランの作成に失敗しました'
      )
    }

    setTravelPlan(data.plan)

  } catch (error) {
    console.error(error)

    alert(
      'AI旅行プランの作成に失敗しました'
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
          <img src="/logo.png" alt="SNS PLACE" />
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
              週末の計画はどうする？
            </h1>

          </div>
          <button className="notification-button">
            🔔
          </button>

        </section>

        {/* 検索 */}
        <SearchBox
          searchText={searchText}
          setSearchText={setSearchText}
          isSearching={isSearching}
          searchResults={searchResults}
          onSearch={handleSearch}
          onSelectPlace={selectPlace}
        />


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
                  background: '#e88190',
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


        {/* =========================
            AI旅行プラン
        ========================= */}
        <section className="weekend-card">

          <div className="weekend-header">

            <div>
              <p className="section-label">
                AI TRAVEL PLAN
              </p>

              <h2>
                AIに旅行プランを作ってもらう
              </h2>
            </div>

            <span className="candidate-count">
              {selectedStoreIds.length}件選択
            </span>

          </div>

          <p className="weekend-area">
            保存したスポットから行きたいスポットを選んで、
            旅行の希望を入力してください。
          </p>

          <textarea
            value={travelPreferences}
            onChange={(e) =>
              setTravelPreferences(e.target.value)
            }
            placeholder="例：カフェを中心に、ゆっくり回りたい"
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              boxSizing: 'border-box',
              borderRadius: '8px',
              border: '1px solid #ddd',
              resize: 'vertical',
              marginBottom: '12px',
            }}
          />

          <button
            onClick={generateTravelPlan}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: '#fdc8d0',
              color: '#3a2121',
              cursor: 'pointer',
            }}
          >
            AIで旅行プランを作る
          </button>

          {travelPlan && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                borderRadius: '8px',
                background: '#f7f7f7',
                whiteSpace: 'pre-wrap',
              }}
            >
              <h3>旅行プラン</h3>
              <p>{travelPlan}</p>
            </div>
          )}

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
                      <StoreCard
                        key={store.id}
                        store={store}
                        onSelect={(store) => {
                          setSelectedPlace({
                            lat: store.lat,
                            lon: store.lng,
                            name: store.name,
                            display_name: store.name,
                          })
                          setCurrentPage('地図')
                        }}
                        onDelete={deleteStore}
                        isSelected={selectedStoreIds.includes(store.id)}
                        onToggleSelect={toggleStoreSelection}
                      />
                    ))}
                  </div>

              )}

            </>

          )}

          {/* 地図画面 */}

      {currentPage === '地図' && (
        <MapView
          selectedPlace={selectedPlace}
          filteredStores={filteredStores}
          deleteStore={deleteStore}
        />
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

function SearchBox({
  searchText,
  setSearchText,
  isSearching,
  searchResults,
  onSearch,
  onSelectPlace,
}) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <>
      {/* 検索 */}
      <section className="search-section">

        <div className="search-box">

          <button
            className="search-icon"
            onClick={onSearch}
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
                  onSelectPlace(result)
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
    </>
  )
}

export default SearchBox
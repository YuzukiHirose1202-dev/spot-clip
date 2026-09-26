function StoreCard({
  store,
  onSelect,
  onDelete,
  isSelected,
  onToggleSelect,
  onStatusChange,
}) {
  return (
    <div
      onClick={() => onSelect(store)}
      style={{
        padding: '16px',
        borderRadius: '12px',
        background: '#fff',
        border: '1px solid #eee',
        cursor: 'pointer',
      }}
    >
        <label
            onClick={(event) => {
            event.stopPropagation()
            }}
            style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px',
            cursor: 'pointer',
            }}
        >
            <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(store.id)}
            />
            AI旅行プランに追加
      </label>
      <h3>{store.name}</h3>

<p>
  {store.category}
</p>

<p
  style={{
    fontSize: '12px',
    fontWeight: 'bold',
    color:
      store.status === '行った'
        ? '#4CAF50'
        : '#e88190',
  }}
>
  {store.status}
</p>

<a
  href={store.url}
  target="_blank"
  rel="noopener noreferrer"
>
  Instagramを見る
</a>

      <button
        onClick={(event) => {
          event.stopPropagation()
          onDelete(store.id)
        }}
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
      <div
  style={{
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  }}
>
  <button
  onClick={(e) => {
    e.stopPropagation()
    onStatusChange(store.id, '行きたい')
  }}
  style={{
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background:
      store.status === '行きたい'
        ? '#e88190'
        : '#f3f3f3',
    color:
      store.status === '行きたい'
        ? '#fff'
        : '#666',
    fontWeight:
      store.status === '行きたい'
        ? 'bold'
        : 'normal',
  }}
>
  行きたい
</button>

  <button
  onClick={(e) => {
    e.stopPropagation()
    onStatusChange(store.id, '行った')
  }}
  style={{
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background:
      store.status === '行った'
        ? '#7dc7a6'
        : '#f3f3f3',
    color:
      store.status === '行った'
        ? '#fff'
        : '#666',
    fontWeight:
      store.status === '行った'
        ? 'bold'
        : 'normal',
  }}
>
  行った
</button>
</div>
    </div>
  )
}

export default StoreCard
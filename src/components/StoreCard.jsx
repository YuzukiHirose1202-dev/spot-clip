function StoreCard({
  store,
  onSelect,
  onDelete,
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
      <h3
        style={{
          margin: '0 0 8px 0',
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
    </div>
  )
}

export default StoreCard
import './SharePage.css'

function SharePage({
    onMapClick,
    onAddClick,
}) {
    // ハリボテ用データ
    const groups = [
        {
            id: 1,
            icon: '👭',
            tag: '選択中',
            name: '週末カフェ巡り部',
            members: 4,
            spots: 18,
            active: true,
        },
        {
            id: 2,
            icon: '🗼',
            tag: '旅行',
            name: '8月 東京女子旅',
            members: 3,
            spots: 12,
            active: false,
        },
        {
            id: 3,
            icon: '🍖',
            tag: 'グルメ',
            name: '美味しいもの倶楽部',
            members: 6,
            spots: 24,
            active: false,
        },
    ]

    return (
        <div className="share-page">

            {/* =========================
          上部タイトル
      ========================= */}

            <div className="share-page-header">
                <div>
                    <p className="share-page-label">
                        SHARED PLACES
                    </p>

                    <h1>
                        共有
                    </h1>
                </div>

                <button className="share-header-button">
                    ＋
                </button>
            </div>

            {/* =========================
          グループ一覧
      ========================= */}

            <section className="share-groups-section">

                <div className="share-groups-scroll">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className={
                                group.active
                                    ? 'share-group-card active'
                                    : 'share-group-card'
                            }
                        >
                            <div className="share-group-top">

                                <span
                                    className={
                                        group.active
                                            ? 'share-group-tag active'
                                            : 'share-group-tag'
                                    }
                                >
                                    {group.tag}
                                </span>

                                {group.active && (
                                    <span className="share-group-check">
                                        ✓
                                    </span>
                                )}

                            </div>

                            <div className="share-group-icon">
                                {group.icon}
                            </div>

                            <h2 className="share-group-name">
                                {group.name}
                            </h2>

                            <div className="share-group-meta">
                                <span>
                                    ♡ {group.members}人
                                </span>

                                <span className="share-meta-dot">
                                    •
                                </span>

                                <span>
                                    ♧ {group.spots}スポット
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </section>

            {/* =========================
          アクティブグループ
      ========================= */}

            <section className="active-group-card">

                <div className="active-group-header">

                    <div>
                        <div className="active-group-label">
                            <span className="active-dot" />
                            ACTIVE GROUP
                        </div>

                        <h2>
                            週末カフェ巡り部
                        </h2>

                        <p>
                            土日に行きたい都内のおしゃれカフェをみんなで...
                        </p>
                    </div>

                    <button className="group-menu-button">
                        ⋮
                    </button>

                </div>

                {/* メンバー */}

                <div className="active-group-bottom">

                    <div className="member-avatars">

                        <div className="member-avatar">
                            👩🏻
                        </div>

                        <div className="member-avatar">
                            👩🏼
                        </div>

                        <div className="member-avatar">
                            👩🏻
                        </div>

                        <div className="member-avatar">
                            👩🏼
                        </div>

                    </div>

                    <button className="invite-button">
                        ♡＋ 招待
                    </button>

                    <button className="link-share-button">
                        🔗 リンク共有
                    </button>

                </div>

            </section>

            {/* =========================
          タブ
      ========================= */}

            <div className="shared-tabs">

                <button className="shared-tab active">
                    すべて (18)
                </button>

                <button className="shared-tab">
                    行きたい・未訪問 (13)
                </button>

                <button className="shared-tab">
                    訪問済み (5)
                </button>

            </div>

            {/* =========================
          新着スポット
      ========================= */}

            <section className="shared-spots-section">

                <div className="shared-spots-header">

                    <div>
                        <h2>
                            ✨ 新着スポット＆おすすめ
                        </h2>
                    </div>

                    <span>
                        4人が共同編集
                    </span>

                </div>

                {/* スポットカード */}

                <div className="shared-spot-card">

                    <div className="shared-spot-user">

                        <div className="shared-user-avatar">
                            👩🏻
                        </div>

                        <div>
                            <strong>
                                @sakura_03
                            </strong>

                            <span>
                                2時間前
                            </span>

                            <p>
                                昨日Instagramで見つけた！サワードウのパ...
                            </p>
                        </div>

                        <button className="bookmark-button">
                            ♧
                        </button>

                    </div>

                    <div className="shared-spot-image">
                        <div className="fake-cafe-image">
                            <span>
                                ☕
                            </span>

                            <strong>
                                人形町・ベーカリーカフェ
                            </strong>
                        </div>
                    </div>

                    <div className="shared-spot-content">

                        <h3>
                            bread & cafe
                        </h3>

                        <p>
                            東京都中央区人形町
                        </p>

                        <button className="want-button">
                            ♡ 行きたい！
                        </button>

                    </div>

                </div>

            </section>

            {/* =========================
          下部アクション
      ========================= */}

            <div className="share-actions">

                <button
                    className="map-summary-button"
                    onClick={onMapClick}
                >
                    <span>
                        ♧
                    </span>

                    <strong>
                        地図でまとめて見る
                    </strong>

                    <i />
                </button>

                <button
                    className="add-spot-button"
                    onClick={onAddClick}
                >
                    <span>
                        ♡＋
                    </span>

                    <strong>
                        スポット追加
                    </strong>
                </button>

            </div>

        </div>
    )
}

export default SharePage
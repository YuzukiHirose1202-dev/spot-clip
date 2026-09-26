function MyPage({
    stores = [],
    onEditProfile,
}) {
    // ハリボテのプロフィール情報
    const profile = {
        name: 'めい / Mei',
        username: '@mei_lifestyle',
        bio: '都内近郊の淡色カフェと建築巡り☕📸\nInstagram保存スポットを整理中✨',
        image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    }

    // ハリボテの共有グループ
    const groups = [
        {
            id: 1,
            name: '週末カフェ巡り部',
            members: 4,
            spots: 18,
            icon: '👭',
        },
        {
            id: 2,
            name: '8月 東京女子旅',
            members: 3,
            spots: 12,
            icon: '🗼',
        },
        {
            id: 3,
            name: '美味しいもの倶楽部',
            members: 6,
            spots: 24,
            icon: '🍖',
        },
    ]

    const savedCount = stores.length

    const wantCount = stores.filter(
        (store) => store.status === '行きたい'
    ).length

    const visitedCount = stores.filter(
        (store) => store.status === '行った'
    ).length

    return (
        <main className="mypage">
            <h1 className="mypage-title">
                マイページ
            </h1>

            {/* プロフィール */}
            <section className="profile-card">
                <div className="profile-image-wrapper">
                    <img
                        src={profile.image}
                        alt="プロフィール"
                        className="profile-image"
                    />

                    <button className="profile-camera">
                        📷
                    </button>
                </div>

                <h2 className="profile-name">
                    {profile.name}
                </h2>

                <p className="profile-username">
                    ◈ {profile.username}
                </p>

                <p className="profile-bio">
                    {profile.bio.split('\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>

                <button
                    className="edit-profile-button"
                    onClick={onEditProfile}
                >
                    ✎　プロフィールを編集
                </button>
            </section>

            {/* 統計 */}
            <section className="profile-stats">
                <div className="profile-stat">
                    <strong>{savedCount}</strong>
                    <span>保存した場所</span>
                </div>

                <div className="profile-stat">
                    <strong>{wantCount}</strong>
                    <span>行きたい</span>
                </div>

                <div className="profile-stat">
                    <strong>{visitedCount}</strong>
                    <span>行った</span>
                </div>
            </section>

            {/* グループ */}
            <section className="groups-section">
                <div className="groups-header">
                    <h2>
                        👥 参加中の共有グループ
                        <span className="group-count">
                            {groups.length}
                        </span>
                    </h2>

                    <button className="view-all-button">
                        すべて見る
                    </button>
                </div>

                <div className="groups-card">
                    {groups.map((group, index) => (
                        <div
                            key={group.id}
                            className={`group-item ${index === groups.length - 1
                                    ? 'last'
                                    : ''
                                }`}
                        >
                            <div className="group-icon">
                                {group.icon}
                            </div>

                            <div className="group-info">
                                <h3>{group.name}</h3>

                                <p>
                                    メンバー {group.members}名
                                    <span>・</span>
                                    {group.spots}スポット
                                </p>
                            </div>

                            <div className="group-arrow">
                                ›
                            </div>
                        </div>
                    ))}
                </div>

                <button className="new-group-button">
                    <span>⊕</span>
                    新しいグループを作成
                </button>
            </section>
        </main>
    )
}

export default MyPage
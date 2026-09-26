import "./MyPage.css";
import ichigoImage from "../assets/ichigo.jpg";

function MyPage({ stores = [], onEditProfile }) {
    const savedCount = stores.length
    const wantCount = stores.filter(
        (store) => store.status === '行きたい'
    ).length
    const visitedCount = stores.filter(
        (store) => store.status === '行った'
    ).length

    const profile = {
        name: 'めい / Mei',
        username: '@mei_lifestyle',
        bio: (
            <>
                都内近郊の淡色カフェと建築巡り ☕📸
                <br />
                Instagram保存スポットを整理中 ✨
            </>
        ),
        image: ichigoImage,
    }

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

    return (
        <div className="mypage">
            {/* ページタイトル */}
            <div className="mypage-title-row">
                <h1>マイページ</h1>
                <span className="mypage-title-dot"></span>

                <button
                    className="mypage-setting-button"
                    type="button"
                    aria-label="設定"
                >
                    ⚙
                </button>
            </div>

            {/* プロフィールカード */}
            <section className="profile-card">
                <div className="profile-image-wrapper">
                    <img
                        src={profile.image}
                        alt="プロフィール"
                        className="profile-image"
                    />

                    <button
                        className="profile-camera-button"
                        type="button"
                        aria-label="プロフィール画像を変更"
                    >
                        📷
                    </button>
                </div>

                <h2 className="profile-name">
                    {profile.name}
                </h2>

                <p className="profile-username">
                    <span className="verified-mark">✧</span>
                    {profile.username}
                </p>

                <p className="profile-bio">
                    {profile.bio}
                </p>

                <button
                    className="profile-edit-button"
                    type="button"
                    onClick={onEditProfile}
                >
                    <span className="edit-icon">✎</span>
                    プロフィールを編集
                </button>
            </section>

            {/* 統計 */}
            <section className="profile-stats">
                <div className="stat-card">
                    <strong className="stat-number saved">
                        {savedCount}
                    </strong>

                    <span className="stat-label">
                        保存した場所
                    </span>

                    <span className="stat-icon saved-icon">
                        ♡
                    </span>
                </div>

                <div className="stat-card">
                    <strong className="stat-number want">
                        {wantCount}
                    </strong>

                    <span className="stat-label">
                        行きたい
                    </span>

                    <span className="stat-icon want-icon">
                        ♡
                    </span>
                </div>

                <div className="stat-card">
                    <strong className="stat-number visited">
                        {visitedCount}
                    </strong>

                    <span className="stat-label">
                        行った
                    </span>

                    <span className="stat-icon visited-icon">
                        ✓
                    </span>
                </div>
            </section>

            {/* 共有グループ */}
            <section className="groups-section">
                <div className="section-heading">
                    <div className="section-heading-left">
                        <span className="groups-heading-icon">
                            ♡
                        </span>

                        <h2>参加中の共有グループ</h2>

                        <span className="group-count">
                            {groups.length}
                        </span>
                    </div>

                    <button
                        className="view-all-button"
                        type="button"
                    >
                        すべて見る
                        <span>›</span>
                    </button>
                </div>

                <div className="group-list">
                    {groups.map((group) => (
                        <button
                            className="group-card"
                            key={group.id}
                            type="button"
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

                            <span className="group-arrow">
                                ›
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    className="create-group-button"
                    type="button"
                >
                    <span>＋</span>
                    新しい共有グループを作成
                </button>
            </section>
        </div>
    )
}

export default MyPage
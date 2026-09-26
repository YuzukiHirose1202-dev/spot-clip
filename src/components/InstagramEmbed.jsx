import { useEffect, useRef } from 'react'

function InstagramEmbed({ url }) {
    const embedRef = useRef(null)

    useEffect(() => {
        if (!url) return

        // InstagramのURLでなければ何もしない
        if (!url.includes('instagram.com')) {
            return
        }

        const processInstagram = () => {
            if (
                window.instgrm &&
                window.instgrm.Embeds
            ) {
                window.instgrm.Embeds.process()
            }
        }

        // すでにInstagramの埋め込みJSが読み込まれている場合
        if (
            window.instgrm &&
            window.instgrm.Embeds
        ) {
            processInstagram()
            return
        }

        // Instagramの埋め込みJSを探す
        let script = document.querySelector(
            'script[src="https://www.instagram.com/embed.js"]'
        )

        // なければ追加
        if (!script) {
            script = document.createElement('script')

            script.src =
                'https://www.instagram.com/embed.js'

            script.async = true

            document.body.appendChild(script)
        }

        // 読み込み完了後に埋め込みを処理
        script.addEventListener(
            'load',
            processInstagram
        )

        return () => {
            script.removeEventListener(
                'load',
                processInstagram
            )
        }
    }, [url])

    // URLがない場合
    if (!url) {
        return null
    }

    // Instagram URLではない場合
    if (!url.includes('instagram.com')) {
        return (
            <p
                style={{
                    fontSize: '13px',
                    color: '#999',
                    marginTop: '10px',
                }}
            >
                Instagramの投稿URLを登録してください
            </p>
        )
    }

    return (
        <div
            ref={embedRef}
            onClick={(event) => {
                event.stopPropagation()
            }}
            style={{
                width: '100%',
                overflow: 'hidden',
                marginTop: '12px',
            }}
        >
            <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                    background: '#FFF',
                    border: 0,
                    borderRadius: '3px',
                    boxShadow:
                        '0 0 1px 0 rgba(0, 0, 0, 0.5), 0 1px 10px 0 rgba(0, 0, 0, 0.15)',
                    margin: '1px auto',
                    maxWidth: '540px',
                    minWidth: '280px',
                    padding: 0,
                    width: 'calc(100% - 2px)',
                }}
            >
                <div
                    style={{
                        padding: '16px',
                    }}
                >
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: 'none',
                            color: '#111',
                        }}
                    >
                        Instagramの投稿を見る
                    </a>
                </div>
            </blockquote>
        </div>
    )
}

export default InstagramEmbed
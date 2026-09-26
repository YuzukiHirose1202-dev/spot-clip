const NOMINATIM_URL =
  'https://nominatim.openstreetmap.org/search'

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


export const searchPlaces = async (query) => {
  const response = await fetch(
    `${NOMINATIM_URL}?format=jsonv2&q=${encodeURIComponent(
      query
    )}&accept-language=ja&countrycodes=jp&layer=poi&addressdetails=1&limit=20`
  )

  if (!response.ok) {
    throw new Error('検索に失敗しました')
  }

  const data = await response.json()

  const matchedPrefecture =
    prefectures.find((prefecture) =>
      query.includes(prefecture)
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

  return results.slice(0, 10)
}


export const findPlace = async (name) => {
  const response = await fetch(
    `${NOMINATIM_URL}?format=jsonv2&q=${encodeURIComponent(
      name
    )}&accept-language=ja&countrycodes=jp&layer=poi&limit=1`
  )

  if (!response.ok) {
    throw new Error('場所の検索に失敗しました')
  }

  const data = await response.json()

  if (data.length === 0) {
    return null
  }

  return data[0]
}

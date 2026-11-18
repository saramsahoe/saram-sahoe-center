/**
 * 네이버 지도 "공유" URL(예: https://map.naver.com/p/entry/place/1690471513...)에서
 * 플레이스 ID를 뽑아낸 뒤, 네이버 모바일 플레이스 페이지(m.place.naver.com)의
 * 서버 렌더링된 HTML에 박혀 있는 좌표(JSON)를 읽어온다.
 *
 * 네이버가 공식 제공하는 Geocoding API는 "주소 문자열"을 받아 좌표로 바꿔주는
 * 방식이라 공유 URL을 바로 넣을 수 없고, 별도 Client Secret 발급도 필요하다.
 * 반면 모바일 플레이스 페이지는 그 장소를 보여주기 위해 이미 좌표를 포함한
 * 상태로 서버에서 렌더링되므로, 그 값을 그대로 읽는 편이 추가 인증 없이
 * 공유 URL 하나만으로 좌표를 구할 수 있는 유일한 방법이다.
 *
 * 다만 이건 네이버의 "공식 API"가 아니라 그들 프런트엔드가 쓰는 내부 페이지의
 * 현재 구조에 의존한다 — 페이지 구조가 바뀌면 깨질 수 있다. 실패하면 null을
 * 반환하므로, 호출부는 이전 좌표 값을 그대로 유지하면 된다.
 */

const PLACE_ID_PATTERN = /\/place\/(\d+)/;
const COORDINATE_PATTERN =
  /"coordinate":\{"__typename":"Coordinate","x":"(-?\d+(?:\.\d+)?)","y":"(-?\d+(?:\.\d+)?)"/;

function extractPlaceId(url: string): string | null {
  const match = url.match(PLACE_ID_PATTERN);
  return match ? match[1] : null;
}

export type NaverCoordinates = { lat: number; lng: number };

export async function geocodeNaverMapUrl(
  naverMapUrl: string
): Promise<NaverCoordinates | null> {
  try {
    // naver.me 같은 단축 URL은 플레이스 ID가 리다이렉트 이후에야 나타난다.
    const resolved = await fetch(naverMapUrl, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const placeId = extractPlaceId(resolved.url) ?? extractPlaceId(naverMapUrl);
    if (!placeId) return null;

    const response = await fetch(`https://m.place.naver.com/place/${placeId}/home`, {
      headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(COORDINATE_PATTERN);
    if (!match) return null;

    const lng = Number(match[1]);
    const lat = Number(match[2]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    return { lat, lng };
  } catch (error) {
    console.error("[geocodeNaverMapUrl]", error);
    return null;
  }
}

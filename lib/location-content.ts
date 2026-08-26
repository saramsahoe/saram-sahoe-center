export type BusStop = {
  stop: string
  type: string
  lines: string[]
}

export const transitInfo = {
  subway: {
    line: "지하철 7호선",
    station: "학동역",
    exit: "",
    walk: "역에서 도보 약 7분",
  },
  // 정확한 정류장/노선 정보를 확인하지 못해, 확인되지 않은 노선을 임의로 적지 않고
  // 지도 앱 확인을 안내한다.
  busNote:
    "정확한 정류장 및 버스 노선은 네이버지도 또는 카카오맵에서 주소를 검색해 확인해 주세요.",
  buses: [] as BusStop[],
  parking: {
    visitor: "건물 내 방문자 주차 가능 여부는 방문 전 연구센터로 문의해 주세요.",
    accessibility: "장애인 편의시설 관련 사항은 방문 전 연구센터로 문의해 주세요.",
  },
}

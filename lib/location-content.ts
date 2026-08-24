export type BusStop = {
  stop: string
  type: string
  lines: string[]
}

export const transitInfo = {
  subway: {
    line: "지하철 5·6호선",
    station: "청구역",
    exit: "2번 출구",
    walk: "출구에서 도보 약 5분 (약 350m)",
  },
  buses: [
    { stop: "신당동주민센터", type: "간선", lines: ["104", "301"] },
    { stop: "청구로4길입구", type: "지선", lines: ["2233", "7212"] },
  ] satisfies BusStop[],
  parking: {
    visitor:
      "건물 지하 1층 방문자 주차장을 이용해 주세요. 1층 안내데스크에서 방문 등록하시면 2시간 무료 주차가 제공됩니다.",
    accessibility:
      "1층 로비에 경사로와 장애인 전용 승강기가 마련되어 있으며, 건물 입구 근처에 휠체어 이용자를 위한 전용 주차 구역이 있습니다.",
  },
}

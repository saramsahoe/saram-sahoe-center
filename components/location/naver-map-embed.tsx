"use client"

import { useEffect, useRef } from "react"

// Naver Maps JS SDK는 타입 패키지를 따로 설치하지 않고, 꼭 필요한 만큼만 선언해서 쓴다.
declare global {
  interface Window {
    naver?: {
      maps: {
        LatLng: new (lat: number, lng: number) => unknown
        Map: new (el: HTMLElement, options: { center: unknown; zoom: number }) => unknown
        Marker: new (options: { position: unknown; map: unknown }) => unknown
        InfoWindow: new (options: { content: string }) => {
          open: (map: unknown, marker: unknown) => void
        }
        Event: { addListener: (target: unknown, type: string, handler: () => void) => void }
      }
    }
  }
}

const SCRIPT_ID = "naver-maps-sdk"

function loadNaverMapsScript(clientId: string): Promise<void> {
  if (window.naver?.maps) return Promise.resolve()

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
  if (existing) {
    return new Promise((resolve) => existing.addEventListener("load", () => resolve()))
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("네이버 지도 스크립트를 불러오지 못했습니다."))
    document.head.appendChild(script)
  })
}

/** 실제 네이버 지도를 띄운다 (팬/줌 가능). 마커를 누르면 placeUrl이 새 탭으로 열린다. */
export function NaverMapEmbed({
  clientId,
  lat,
  lng,
  placeName,
  placeUrl,
  onError,
}: {
  clientId: string
  lat: number
  lng: number
  placeName: string
  placeUrl: string
  onError?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    loadNaverMapsScript(clientId)
      .then(() => {
        if (cancelled || !containerRef.current || !window.naver) return

        const { maps } = window.naver
        const position = new maps.LatLng(lat, lng)
        const map = new maps.Map(containerRef.current, { center: position, zoom: 16 })
        const marker = new maps.Marker({ position, map })

        const infoWindow = new maps.InfoWindow({
          content: `<a href="${placeUrl}" target="_blank" rel="noopener noreferrer" style="display:block;padding:8px 12px;font-size:13px;font-family:inherit;white-space:nowrap;">${placeName}<br/><span style="color:#888;font-size:11px;">지도에서 자세히 보기 →</span></a>`,
        })
        infoWindow.open(map, marker)

        maps.Event.addListener(marker, "click", () => {
          window.open(placeUrl, "_blank", "noopener,noreferrer")
        })
      })
      .catch(() => {
        if (!cancelled) onError?.()
      })

    return () => {
      cancelled = true
    }
  }, [clientId, lat, lng, placeName, placeUrl, onError])

  return <div ref={containerRef} className="size-full" />
}

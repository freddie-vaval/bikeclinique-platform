'use client'

import { useState, useEffect, useRef } from 'react'

interface DeliveryZone {
  center_lat: number
  center_lng: number
  radius_km: number
  polygon?: [number, number][]
}

interface DeliveryZoneMapProps {
  zone: DeliveryZone
  onChange: (zone: DeliveryZone) => void
}

export default function DeliveryZoneMap({ zone, onChange }: DeliveryZoneMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [drawMode, setDrawMode] = useState<'circle' | 'polygon'>('polygon')
  const mapInstanceRef = useRef<any>(null)
  const circleRef = useRef<any>(null)
  const polygonRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const drawnItemsRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapLoaded) return

    const initMap = async () => {
      const L = await import('leaflet')
      // CSS is loaded via globals.css or next/font
      const leafletDraw = await import('leaflet-draw')
      
      // Fix leaflet marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const mapInstance = L.map(mapRef.current!).setView([zone.center_lat || 51.409, zone.center_lng || -0.192], 11)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapInstance)

      // Layer for drawn items
      const drawnItems = new L.FeatureGroup()
      mapInstance.addLayer(drawnItems)
      drawnItemsRef.current = drawnItems

      // Draw controls
      const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
          polyline: false,
          circle: false,
          circlemarker: false,
          rectangle: false,
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
              color: '#FF4500',
              fillColor: '#FF4500',
              fillOpacity: 0.2
            }
          },
          marker: {
            icon: L.divIcon({
              className: 'custom-marker',
              html: '<div style="background:#FF4500;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }
        },
        edit: {
          featureGroup: drawnItems,
          remove: true
        }
      })
      mapInstance.addControl(drawControl)

      // Draw events
      mapInstance.on(L.Draw.Event.CREATED, (e: any) => {
        drawnItems.clearLayers()
        drawnItems.addLayer(e.layer)
        
        if (e.layerType === 'polygon') {
          const latlngs = e.layer.getLatLngs()[0]
          const coords: [number, number][] = latlngs.map((ll: any) => [ll.lat, ll.lng])
          onChange({ ...zone, polygon: coords })
          polygonRef.current = e.layer
          if (circleRef.current) {
            mapInstance.removeLayer(circleRef.current)
            circleRef.current = null
          }
        } else if (e.layerType === 'marker') {
          const latlng = e.layer.getLatLng()
          onChange({ ...zone, center_lat: latlng.lat, center_lng: latlng.lng })
          if (markerRef.current) {
            mapInstance.removeLayer(markerRef.current)
          }
          markerRef.current = e.layer
        }
      })

      mapInstance.on(L.Draw.Event.DELETED, () => {
        polygonRef.current = null
        onChange({ ...zone, polygon: [] })
      })

      // Add initial marker if no polygon
      if (!zone.polygon || zone.polygon.length === 0) {
        const marker = L.marker([zone.center_lat || 51.409, zone.center_lng || -0.192], { 
          draggable: true,
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background:#FF4500;width:24px;height:24px;border-radius:50%;border:4px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(mapInstance)
        
        marker.on('drag', (e: any) => {
          const lat = e.latlng.lat
          const lng = e.latlng.lng
          onChange({ ...zone, center_lat: lat, center_lng: lng })
        })
        
        markerRef.current = marker
      }

      // Add existing polygon if any
      if (zone.polygon && zone.polygon.length > 0) {
        const polygon = L.polygon(zone.polygon as [number, number][], {
          color: '#FF4500',
          fillColor: '#FF4500',
          fillOpacity: 0.2
        }).addTo(mapInstance)
        drawnItems.addLayer(polygon)
        polygonRef.current = polygon
      }

      mapInstanceRef.current = mapInstance
      setMapLoaded(true)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const clearDrawing = () => {
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers()
    }
    polygonRef.current = null
    onChange({ ...zone, polygon: [] })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={clearDrawing}
          className="px-4 py-2 bg-[#FF4500] text-black font-bold text-xs uppercase hover:bg-white transition-colors"
        >
          Clear Drawing
        </button>
      </div>
      
      <div ref={mapRef} className="h-96 w-full" />
      
      <div className="bg-[#1A1A1A] p-3 border border-[#333]">
        <p className="text-xs text-[#888]">
          <strong className="text-[#FF4500]">Draw your area:</strong> Use the polygon tool (▼) in the top-right of the map. Click points to outline your delivery coverage. Click the first point to close the shape.
        </p>
        <p className="text-xs text-[#666] mt-2">
          You can also drag the marker to set your shop location. Use the edit tool (✏️) to adjust points, or delete (🗑️) to start over.
        </p>
      </div>
    </div>
  )
}

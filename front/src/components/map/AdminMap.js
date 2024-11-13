import { useEffect } from 'react';

import './Map.css';

const { kakao } = window;

const AdminMap = ({ selectedLocation, height = '170px', level = 3 }) => {
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.558883838702705, 126.99848057788074),
      level: level,
    };

    const map = new kakao.maps.Map(container, options);
    map.setZoomable(true);

    const locations = {
      'info-building': [{ lat: 37.55967671827378, lng: 126.99865881989537, message: '정보문화관 P동 3층' }],
      'newengineering-building': [
        { lat: 37.55828467735671, lng: 126.99862489155105, message: '신공학관 9층' },
        { lat: 37.558104477204786, lng: 126.99856547673933, message: '신공학관 3층' },
      ],
      'wonheung-building': [{ lat: 37.55862705908502, lng: 126.9988908539538, message: '원흥관 3층' }],
    };

    const selectedCoordinates = locations[selectedLocation];

    // SVG 마커 이미지 설정
    const markerImageSrc = `data:image/svg+xml;utf-8,
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="35" viewBox="0 0 24 35">
        <path fill="%23D04020" d="M12 0C6.477 0 2 4.477 2 10c0 7.333 10 23 10 23s10-15.667 10-23C22 4.477 17.523 0 12 0z"/>
        <circle cx="12" cy="10" r="3" fill="%23fff"/>
      </svg>`;
    const markerImageSize = new kakao.maps.Size(24, 35);
    const markerImageOption = { offset: new kakao.maps.Point(12, 35) };
    const markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerImageSize, markerImageOption);

    const createMarker = (coord) => {
      const markerPosition = new kakao.maps.LatLng(coord.lat, coord.lng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      const infoWindow = new kakao.maps.InfoWindow({
        content: `<div class="Map_custom-info-window">${coord.message}</div>`,
      });

      let isOpen = false;
      kakao.maps.event.addListener(marker, 'click', () => {
        if (isOpen) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
        isOpen = !isOpen;
      });

      setTimeout(() => marker.setMap(map), 300);
    };

    if (selectedCoordinates) {
      selectedCoordinates.forEach((coord) => createMarker(coord));
    }
  }, [selectedLocation, level]);

  return <div id="map" style={{ width: '100%', height }}></div>;
};

export default AdminMap;

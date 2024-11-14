import { useEffect } from 'react';
import './Map.css';

const Map = ({ selectedLocation, height = '175px', level = 3 }) => {
  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps) return; // kakao 객체 확인

    const container = document.getElementById('map');
    if (!container) return;

    const options = {
      center: new kakao.maps.LatLng(37.558883838702705, 126.99848057788074),
      level: level,
    };

    const map = new kakao.maps.Map(container, options);

    const locations = {
      infoculture: [
        {
          lat: 37.55967671827378,
          lng: 126.99865881989537,
          message: '정보문화관 P동 3층',
        },
      ],
      newengineering: [
        {
          lat: 37.55828467735671,
          lng: 126.99862489155105,
          message: '신공학관 9층',
        },
        {
          lat: 37.558104477204786,
          lng: 126.99856547673933,
          message: '신공학관 3층',
        },
      ],
      wonheung: [
        {
          lat: 37.55862705908502,
          lng: 126.9988908539538,
          message: '원흥관 3층',
        },
      ],
    };

    const selectedCoordinates = locations[selectedLocation];

    const markerImageSrc = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="35" viewBox="0 0 24 35">
        <path fill="#D04020" d="M12 0C6.477 0 2 4.477 2 10c0 7.333 10 23 10 23s10-15.667 10-23C22 4.477 17.523 0 12 0z"/>
        <circle cx="12" cy="10" r="3" fill="#fff"/>
      </svg>
    `)}`;
    const markerImageSize = new kakao.maps.Size(24, 35);
    const markerImageOption = { offset: new kakao.maps.Point(12, 35) };
    const markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerImageSize, markerImageOption);

    const markers = []; // 마커 객체들을 저장하는 배열

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

      marker.setMap(map);
      markers.push(marker); // 생성된 마커 저장
      map.setCenter(markerPosition);
    };

    if (selectedCoordinates) {
      selectedCoordinates.forEach((coord) => createMarker(coord));
    }

    map.relayout();

    // Cleanup 함수로 마커와 지도 정리
    return () => {
      markers.forEach((marker) => marker.setMap(null)); // 모든 마커 제거
    };
  }, [selectedLocation, level]);

  return <div id="map" className="Map_map" style={{ width: '100%', height }}></div>;
};

export default Map;

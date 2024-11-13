import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './LostPostDetailPopUp.css';

const LostPostDetailPopUp = ({ itemType, storageLocation, lostTime, lostLocation, onClose, onComplete }) => {
  const [pickupDate, setPickupDate] = useState('');
  const [pickupHour, setPickupHour] = useState('');
  const [pickupMinute, setPickupMinute] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [hourOptions, setHourOptions] = useState([]);
  const [minuteOptions, setMinuteOptions] = useState([]);

  // Hour와 Minute 옵션을 업데이트하는 함수
  const updateHourAndMinuteOptions = useCallback(
    (selectedDate, currentHour, currentMinute) => {
      const isToday = selectedDate === minDate;

      const startHour = isToday ? (currentMinute >= 50 ? Math.max(currentHour + 1, 9) : Math.max(currentHour, 9)) : 9;
      const endHour = 20;
      setHourOptions(generateHourOptions(startHour, endHour));

      if (isToday && parseInt(pickupHour, 10) === currentHour && currentMinute < 50) {
        setMinuteOptions(generateMinuteOptions(currentMinute));
      } else {
        setMinuteOptions(generateMinuteOptions());
      }
    },
    [minDate, pickupHour]
  );

  const generateHourOptions = (startHour = 9, endHour = 20) => {
    const options = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      options.push(
        <option key={hour} value={String(hour).padStart(2, '0')}>
          {String(hour).padStart(2, '0')}
        </option>
      );
    }
    return options;
  };

  const generateMinuteOptions = (startMinute = 0) => {
    const options = [];
    const roundedStartMinute = Math.ceil(startMinute / 10) * 10;
    for (let minute = roundedStartMinute; minute < 60; minute += 10) {
      options.push(
        <option key={minute} value={String(minute).padStart(2, '0')}>
          {String(minute).padStart(2, '0')}
        </option>
      );
    }
    return options;
  };

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    setMinDate(today);

    updateHourAndMinuteOptions(today, currentHour, currentMinute);
  }, [updateHourAndMinuteOptions]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setPickupDate(selectedDate);
    setPickupHour('');
    setPickupMinute('');

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    updateHourAndMinuteOptions(selectedDate, currentHour, currentMinute);
  };

  const handleTimeChange = (type, value) => {
    if (type === 'hour') {
      setPickupHour(value);
      const now = new Date();

      if (pickupDate === minDate && parseInt(value, 10) === now.getHours() && now.getMinutes() < 50) {
        setMinuteOptions(generateMinuteOptions(now.getMinutes()));
      } else {
        setMinuteOptions(generateMinuteOptions());
      }
      setPickupMinute('');
    } else {
      setPickupMinute(value);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      onClose();
      onComplete();
      return;
    }

    try {
      const response = await axios.post('/api/pickup-request', {
        itemType,
        storageLocation,
        lostTime,
        lostLocation,
        pickupDate,
        pickupTime: `${pickupHour}:${pickupMinute}`,
      });

      if (response.status === 200) {
        alert('수취 신청이 성공적으로 제출되었습니다.');
        setIsSubmitted(true);
      } else {
        alert('수취 신청에 실패했습니다.');
      }
    } catch (error) {
      console.error('수취 신청 중 오류 발생:', error);
      alert('수취 신청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="LostPostDetailPopUp_popup-overlay" onClick={onClose}>
      <div className="LostPostDetailPopUp_popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="LostPostDetailPopUp_itemtype">{itemType || '분실물'}</div>
        <div className="LostPostDetailPopUp_storageLocation">보관 장소: {storageLocation}</div>
        <div className="LostPostDetailPopUp_pickupdate_layout">
          <div className="LostPostDetailPopUp_time">수취 날짜:</div>
          <input
            className="LostPostDetailPopUp_time_select"
            type="date"
            value={pickupDate}
            min={minDate}
            onChange={handleDateChange}
            onKeyDown={(e) => e.preventDefault()}
            onFocus={(e) => e.target.showPicker && e.target.showPicker()}
          />
        </div>
        <div className="LostPostDetailPopUp_pickuphourminute_layout">
          <div className="LostPostDetailPopUp_time">수취 시간:</div>
          <select
            className="LostPostDetailPopUp_time_select"
            value={pickupHour}
            onChange={(e) => handleTimeChange('hour', e.target.value)}
            disabled={!pickupDate}
          >
            <option className="LostPostDetailPopUp_time_select" value="">
              시 선택
            </option>
            {hourOptions}
          </select>
          :
          <select
            className="LostPostDetailPopUp_time_select"
            value={pickupMinute}
            onChange={(e) => handleTimeChange('minute', e.target.value)}
            disabled={!pickupHour}
          >
            <option className="LostPostDetailPopUp_time_select" value="">
              분 선택
            </option>
            {minuteOptions}
          </select>
        </div>
        <div>
          <button onClick={handleSubmit} className="LostPostDetailPopUp_pickup_btn">
            {isSubmitted ? '확인' : '수취 신청'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LostPostDetailPopUp;

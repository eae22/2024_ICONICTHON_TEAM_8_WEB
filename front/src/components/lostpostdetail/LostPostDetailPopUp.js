import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LostPostDetailPopUp.css";

const LostPostDetailPopUp = ({
  itemId, // Accept 'itemId' as a prop
  itemType,
  storageLocation,
  lostTime,
  lostLocation,
  onClose,
  onComplete,
}) => {
  const [pickupDate, setPickupDate] = useState("");
  const [pickupHour, setPickupHour] = useState("");
  const [pickupMinute, setPickupMinute] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [hourOptions, setHourOptions] = useState([]);
  const [minuteOptions, setMinuteOptions] = useState([]);

  const navigate = useNavigate(); // useNavigate hook 추가

  // Generate options for hour and minute dropdowns
  const generateOptions = (start, end, step = 1) => {
    const options = [];
    for (let value = start; value <= end; value += step) {
      options.push(
        <option key={value} value={String(value).padStart(2, "0")}>
          {String(value).padStart(2, "0")}
        </option>
      );
    }
    return options;
  };

  const updateHourAndMinuteOptions = useCallback(
    (selectedDate, currentHour, currentMinute) => {
      const isToday = selectedDate === minDate;
      const startHour = isToday
        ? Math.max(currentHour + (currentMinute >= 50 ? 1 : 0), 9)
        : 9;
      setHourOptions(generateOptions(startHour, 20));

      if (
        isToday &&
        parseInt(pickupHour, 10) === currentHour &&
        currentMinute < 50
      ) {
        setMinuteOptions(
          generateOptions(Math.ceil(currentMinute / 10) * 10, 50, 10)
        );
      } else {
        setMinuteOptions(generateOptions(0, 50, 10));
      }
    },
    [minDate, pickupHour]
  );

  // Initialize date options on mount
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    setMinDate(today);

    updateHourAndMinuteOptions(today, now.getHours(), now.getMinutes());
  }, [updateHourAndMinuteOptions]);

  // Handle date changes
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setPickupDate(selectedDate);
    setPickupHour("");
    setPickupMinute("");

    const now = new Date();
    updateHourAndMinuteOptions(selectedDate, now.getHours(), now.getMinutes());
  };

  // Handle time changes
  const handleTimeChange = (type, value) => {
    if (type === "hour") {
      setPickupHour(value);
      const now = new Date();

      if (
        pickupDate === minDate &&
        parseInt(value, 10) === now.getHours() &&
        now.getMinutes() < 50
      ) {
        setMinuteOptions(
          generateOptions(Math.ceil(now.getMinutes() / 10) * 10, 50, 10)
        );
      } else {
        setMinuteOptions(generateOptions(0, 50, 10));
      }
      setPickupMinute("");
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

    if (
      !pickupDate ||
      !pickupHour ||
      !pickupMinute ||
      !itemType ||
      !storageLocation
    ) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    try {
      const data = {
        itemId, // Include 'itemId' in the request
        itemType,
        storageLocation,
        lostTime,
        lostLocation,
        pickupDate,
        pickupTime: `${pickupHour}:${pickupMinute}`,
      };

      const response = await axios.post("/pickup-request", data);

      if (response.status === 200) {
        alert("수취 신청이 성공적으로 제출되었습니다.");
        setIsSubmitted(true);
        navigate("/mypage");
      } else {
        alert("수취 신청에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error during pickup request:", error);
      alert("수취 신청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="LostPostDetailPopUp_popup-overlay" onClick={onClose}>
      <div
        className="LostPostDetailPopUp_popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="LostPostDetailPopUp_itemtype">
          {itemType || "분실물"}
        </div>
        <div className="LostPostDetailPopUp_storageLocation">
          보관 장소: {storageLocation}
        </div>
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
            onChange={(e) => handleTimeChange("hour", e.target.value)}
            disabled={!pickupDate}
          >
            <option value="">시 선택</option>
            {hourOptions}
          </select>
          :
          <select
            className="LostPostDetailPopUp_time_select"
            value={pickupMinute}
            onChange={(e) => handleTimeChange("minute", e.target.value)}
            disabled={!pickupHour}
          >
            <option value="">분 선택</option>
            {minuteOptions}
          </select>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            className="LostPostDetailPopUp_pickup_btn"
          >
            {isSubmitted ? "확인" : "수취 신청"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LostPostDetailPopUp;

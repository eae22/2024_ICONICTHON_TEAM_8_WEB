import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import LostPostList from "./components/lostpostlist/LostPostList";
import Login from "./components/login/Login";
import LostPostDetail from "./components/lostpostdetail/LostPostDetail";
import CategoryChoice from "./components/category/CategoryChoice";
import MyPageTotal from "./components/mypage/MypageTotal";
import AdminPage from "./components/adminpage/AdminPage";
import CCTVLive from "./components/cctv/CCTVLive";
import AfterCategoryChoice from "./components/category/AfterCategoryChoice";

import "./App.css";

function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    setScreenSize();
    window.addEventListener("resize", setScreenSize);
    return () => window.removeEventListener("resize", setScreenSize);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LostPostList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/lostpost/detail/:id" element={<LostPostDetail />} />
      <Route path="/categoryChoice" element={<CategoryChoice />} />
      <Route path="/category/:category" element={<AfterCategoryChoice />} />
      <Route path="/mypage" element={<MyPageTotal />} />
      <Route path="/adminpage" element={<AdminPage />} />
      <Route path="/cctvlive/:location" element={<CCTVLive />} />
    </Routes>
  );
}

export default App;

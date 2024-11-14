import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Dongguk from '../../images/DonggukLogo.png';
import AllLaF from '../../images/All-LaFLogo.png';

import './Login.css';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/process/login', { id, password }, { withCredentials: true });

      if (response.data.success) {
        // 로그인 성공 시 sessionStorage에 loggedIn 값 저장
        sessionStorage.setItem('loggedIn', 'true');
        console.log('로그인 상태:', sessionStorage.getItem('loggedIn'));

        if (id === 'admin') {
          navigate('/adminpage');
        } else {
          navigate('/');
        }
      } else {
        alert(response.data.message || '로그인 실패');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.message || '로그인 실패');
      } else {
        alert('서버 오류');
      }
    }
  };

  return (
    <div className="Login_container">
      <div></div>
      <form onSubmit={handleLogin}>
        <div className="Login_AllLaF_logo_layout">
          <img className="Login_AllLaF_logo" src={AllLaF} alt="All-Laf" />
        </div>
        <div>
          <input
            className="Login_loginInput"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="ndrims ID(학번)을 입력해주세요."
            required
          />
        </div>
        <input
          className="Login_passwordInput"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요."
          required
        />
        <div>
          <button className="Login_login_btn" type="submit">
            로그인
          </button>
        </div>
      </form>
      <div></div>
      <div className="Login_AllLaF_logo_layout">
        <img className="Login_dongguk_logo" src={Dongguk} alt="동국대학교" />
      </div>
    </div>
  );
};

export default Login;

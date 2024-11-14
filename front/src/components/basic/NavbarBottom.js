import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import main from '../../images/NavbarBottom11111.png';
import categorychoice from '../../images/NavbarBottom22222.png';
import mypage from '../../images/NavbarBottom33333.png';

import './NavbarBottom.css';

function NavbarBottom() {
  const location = useLocation();
  const { isLoggedIn, isAdmin } = useContext(AuthContext);

  // 현재 경로가 /login이면 NavbarBottom 숨기기
  if (location.pathname === '/login' || location.pathname === '/Login') {
    return null;
  }

  // 로그인하지 않은 경우 아무것도 렌더링하지 않음
  if (!isLoggedIn) {
    return null;
  }

  // 현재 URL과 일치하는 경우 활성화된 링크에 스타일 적용
  const isActiveLink = (path) => (location.pathname === path ? 'active' : '');

  return (
    <>
      {isAdmin ? (
        <div className="NavbarBottom_body">
          <div className="NavbarBottom_layout">
            {/* 관리자 페이지 */}
            <Link to="/" className={`NavbarBottom_link ${isActiveLink('/')}`}>
              <img className="NavbarBottom_user_img" src={main} alt="전체게시판" />
              <div className="NavbarBottom_text">전체게시판</div>
            </Link>
            <Link to="/adminpage" className={`NavbarBottom_link ${isActiveLink('/adminpage')}`}>
              <img className="NavbarBottom_user_img" src={mypage} alt="관리자 페이지" />
              <div className="NavbarBottom_text">관리자 페이지</div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="NavbarBottom_body">
          <div className="NavbarBottom_layout">
            {/* 일반 사용자 페이지 */}
            <Link className={`NavbarBottom_link ${isActiveLink('/')}`} to="/">
              <img className="NavbarBottom_user_img" src={main} alt="메인" />
              <div className="NavbarBottom_text">메인</div>
            </Link>

            <Link className={`NavbarBottom_link ${isActiveLink('/categorychoice')}`} to="/categorychoice">
              <img className="NavbarBottom_user_img" src={categorychoice} alt="카테고리 선택" />
              <div className="NavbarBottom_text">카테고리 선택</div>
            </Link>

            <Link className={`NavbarBottom_link ${isActiveLink('/mypage')}`} to="/mypage">
              <img className="NavbarBottom_user_img" src={mypage} alt="마이페이지" />
              <div className="NavbarBottom_text">마이페이지</div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default NavbarBottom;

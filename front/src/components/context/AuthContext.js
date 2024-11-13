// import React, { createContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true); // 데이터 로딩 상태
//   const [error, setError] = useState(null); // 에러 상태 추가
//   const navigate = useNavigate(); // 리디렉션을 위한 네비게이트 훅 사용

//   useEffect(() => {
//     axios
//       .get('/check-login', { withCredentials: true })
//       .then((response) => {
//         const { loggedIn, user } = response.data;

//         if (loggedIn) {
//           setIsLoggedIn(true);
//           setIsAdmin(user.id === 'admin');
//         } else {
//           setIsLoggedIn(false);
//           setIsAdmin(false);
//           navigate('/login'); // 로그인이 필요한 경우 리디렉션
//         }
//       })
//       .catch((error) => {
//         console.error('로그인 상태 확인 중 오류 발생:', error);
//         setError('로그인 상태를 확인할 수 없습니다.');
//         setIsLoggedIn(false);
//         setIsAdmin(false);
//         navigate('/login'); // 오류가 발생하면 로그인 페이지로 리디렉션
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [navigate]);

//   if (loading) {
//     return <div>로딩 중...</div>; // 로딩 중일 때 표시
//   }

//   return <AuthContext.Provider value={{ isLoggedIn, isAdmin }}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 항상 로그인된 상태로 유지하도록 임시 설정
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // 필요 시 true로 변경 가능
  const [loading, setLoading] = useState(false); // 로딩 상태를 false로 설정하여 로딩 없이 바로 렌더링

  return <AuthContext.Provider value={{ isLoggedIn, isAdmin }}>{children}</AuthContext.Provider>;
};

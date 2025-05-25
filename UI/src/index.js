import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home/Home';
import Listen from './pages/Listen/Listen';
import Login from './pages/Login/Login';
import LoginGoogle from './pages/Login/LoginGoogle';
import UserInfo from './pages/Users/UserInfo';
import AboutUs from './pages/AboutUs/AboutUs';
import NoPage from './pages/NoPage';
//import reportWebVitals from './reportWebVitals';
import Sidebar from './components/Sidebar/Sidebar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import i18n from './providers/i18n';
import AuthProvider from './providers/auth/AuthProvider';
import PrivateRoute from './providers/auth/PrivateRoute';
import Loader from './providers/loader/LoaderComponent';
import NavigationTracker from './providers/analytics/analytics';
import './index.css';
import Settings from './pages/Settings/Settings';

export default function App() {

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {

    // handle the window resize, it's used to set the height of the "content-container" in this way it's scrollable
    function updateSize() {
      setContainerSize({ width: window.innerWidth, height: window.innerHeight - 60 });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
  }, [setContainerSize]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <NavigationTracker />
        <Sidebar />
        <Loader />

        <div className='content-container' style={{ height: containerSize.height }}>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="about" element={<AboutUs />} />
              <Route element={<PrivateRoute />}>
                <Route path="listen" element={<Listen />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="logingoogle" element={<LoginGoogle />} />
              <Route element={<PrivateRoute />}>
                <Route path="userinfo" element={<UserInfo />} />
              </Route>
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

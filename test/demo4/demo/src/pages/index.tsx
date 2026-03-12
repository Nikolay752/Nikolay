import { Link, Navigate, useNavigate, Outlet } from 'umi';
import styles from './index.less';
import Mainstyle from '@/layouts/Mainstyle.less';
import btnstyles from '../layouts/button_login.less';
import { useState, useEffect } from 'react';
import { KeyboardEvent } from 'react';
import Hello from '../layouts/Hello';
import Items from '../layouts/items';
import { login, LoginResponse } from '@/services/api';
import { signup } from '@/services/api';


export default function Layout() {
  // 状态管理
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // 新增：智能问答函数
const [question, setQuestion] = useState('');
const [answer, setAnswer] = useState('');
const [agentLoading, setAgentLoading] = useState(false);
  
  // 导航和功能列表
  const { functionList } = Items();
  const navigate = useNavigate();

  // 格式化时间
  const formatTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  // 副作用：时间更新 + 登录状态恢复
  useEffect(() => {
    // 初始化时间
    setCurrentTime(formatTime());
    // 每秒更新时间
    const timer = setInterval(() => setCurrentTime(formatTime()), 1000);

    // 刷新页面恢复登录状态
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (savedToken && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }

    // 清除定时器
    return () => clearInterval(timer);
  }, []);

  // 登录处理
  const handleLogin = async () => {
    // 表单校验
    if (!username.trim() || !password.trim()) {
      alert('请正确输入账号和密码！');
      return;
    }

    setLoading(true);
    try {
      const res: LoginResponse = await login({ username, password });

      if (res.success) {
        // 更新登录状态
        setIsLoggedIn(true);
        // 存储用户信息到本地
        localStorage.setItem('username', res.username);
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        // 清空密码
        setPassword('');
        // 跳转到系统页面
        navigate('/system');
      } else {
        alert(res.message || '账号或密码错误！');
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      alert('网络异常，请稍后重试！');
    } finally {
      setLoading(false);
    }
  };

  // 注册跳转
  const handleSignup = () => {
    navigate('/signup');
  };

  // 回车登录
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoggedIn && username) {
      handleLogin();
    }
  };

  // 渲染页面
  return (
    <div className={Mainstyle.main}>
      {/* 头部 */}
      <div className={Mainstyle.header}>
        <Hello username={username} />
      </div>

      {/* 主体内容 */}
      {!isLoggedIn ? (
        // 未登录状态：登录表单
        <div className={Mainstyle.body}>
          <p className='login'>Please Login</p>
          <input
            className={Mainstyle.input}
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            className={Mainstyle.input}
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={btnstyles.button} onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button className={btnstyles.button} onClick={handleSignup}>
            signup
          </button>
        </div>
      ) : (
        // 已登录状态：功能链接 + 登出按钮
        <div className={Mainstyle.body}>
          <div className='link'>
            {functionList.map((item) => (
              <div key={item.id}>
                {item.externalLink ? (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={Mainstyle.linkItem}
                  >
                    {item.name}
                  </a>
                ) : item.internalLink ? (
                  <Link to={item.internalLink} className={Mainstyle.linkItem}>
                    {item.name}
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
          <button
            className={btnstyles.button}
            onClick={() => {
              setIsLoggedIn(false);
              setUsername('');
              setPassword('');
              localStorage.clear();
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* 底部 */}
      <div className={Mainstyle.footer}>
        <span className={Mainstyle.currentTime}>{currentTime}</span>
      </div>
    </div>
  );
}
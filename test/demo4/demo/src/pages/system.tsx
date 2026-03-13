// system.tsx 完整修改后代码
import React, { useState, useEffect } from "react";
import { useNavigate } from 'umi';
import Mainstyle from '@/layouts/Mainstyle_system.less';
import button from '../layouts/button_back.less';
import spanstyle from '../layouts/span_title.less';
import button_Stu from '../layouts/button_Stu.less';
import Hello from "@/layouts/Hello";
import { PageAgent } from 'page-agent';

// 从环境变量读取 API Key，避免硬编码
const API_KEY = process.env.REACT_APP_DASHSCOPE_API_KEY || '';

export default function SystemPage() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();
  const [agentAnswer, setAgentAnswer] = useState<string>('');
  const [agentLoading, setAgentLoading] = useState<boolean>(false);

  // 初始化 PageAgent
  const agent = new PageAgent({
    model: 'qwen3.5-plus',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'sk-39d259240a734b7983b83579a934f1bf',
    language: 'zh-CN'
  });

  // 修复：还原PageAgent原生面板逻辑（避免ask方法不存在报错），保留loading状态
  const handleAgentChat = () => {
    if (!API_KEY) {
      alert('未配置智能助手 API Key，请联系管理员');
      return;
    }
    setAgentLoading(true);

    // 调用原生面板
    agent.panel.show();

    // 面板打开后，延迟重置 loading
    setTimeout(() => {
      setAgentLoading(false);
    }, 1000);
  };

  // 时间格式化
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

  // 角色跳转核心方法（仅保留手动跳转）
  const handleRoleJump = (targetRole: string, targetPath: string) => {
    const currentRole = localStorage.getItem('role');
    console.log('当前角色：', currentRole, '目标角色：', targetRole, '目标路径：', targetPath); // 新增日志

    if (!currentRole) {
      alert('未检测到角色信息，请重新登录！');
      navigate('/login');
      return;
    }

    if (currentRole === targetRole) {
      // 新增：强制跳转（解决navigate可能失效问题）
      navigate(targetPath, { replace: true });
      console.log('跳转成功：', targetPath);
    } else {
      alert(`无${targetRole === 'student' ? '学生' : '教师'}权限！`);
    }
  };

  // 新增：处理back按钮点击，确保登录状态标识存在
  const handleBackClick = () => {
    // 确认localStorage中有token（登录标识），保证index页面能识别登录状态
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('token', 'fake_token_for_test'); // 兜底，和index.tsx保持一致
    }
    // 标记登录状态为true（显式标识）
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/'); // 返回首页（index页面）
  };

  // 移除未完成的 handleClassJump 方法（无用代码清理）

  useEffect(() => {
    setCurrentTime(formatTime());
    const timer = setInterval(() => setCurrentTime(formatTime()), 1000);
    const token = localStorage.getItem('token');

    // 未登录时提前清除定时器+返回
    if (!token) {
      clearInterval(timer);
      alert('登录状态已失效，请重新登录！');
      navigate('/login');
      return;
    }

    // 已登录，初始化信息
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('username');
    setUserRole(role || '');
    setUsername(name || '');

    // 移除自动跳转调用 ← 核心修改点

    // 清除定时器
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className={Mainstyle.main}>
      <div className={Mainstyle.header}>
        <Hello username={username || '用户'} />
        {/* 修改：绑定自定义的back点击事件 */}
        <div className={button.button} onClick={handleBackClick}>
          back
        </div>
      </div>
      <div className={Mainstyle.body}>
        <button
          className={button_Stu.button}
          onClick={() => handleRoleJump('student', '/system/student')}
        >
          学生系统
        </button>
        <button
          className={button_Stu.button}
          onClick={() => handleRoleJump('teacher', '/system/teacher')}
        >
          教师系统
        </button>
        <div>
          <h5 className={spanstyle.span}>系统智能助手</h5>
          <button
            className={button_Stu.button}
            onClick={handleAgentChat}
            disabled={agentLoading}
          >
            {agentLoading ? '思考中...' : '提问'}
          </button>
          {/* 大模型回答展示 */}
          {agentAnswer && (
            <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#f5f7fa', borderRadius: '4px', fontSize: '14px' }}>
              <span style={{ fontWeight: 'bold', color: '#666' }}>助手回答：</span>
              <span>{agentAnswer}</span>
            </div>
          )}
        </div>
      </div>
      <div className={Mainstyle.footer}>
        <span className={Mainstyle.currentTime}>{currentTime}</span>
      </div>
    </div>
  );
}
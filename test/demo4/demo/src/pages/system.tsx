import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'umi';
import Mainstyle from '@/layouts/Mainstyle_system.less';
import button from '../layouts/button_back.less';
import spanstyle from '../layouts/span_title.less';
import button_Stu from '../layouts/button_Stu.less';
import Hello from "@/layouts/Hello";
import { PageAgent } from 'page-agent';
import { use } from "echarts/types/src/extension.js";

export default function SystemPage() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();
  const [agentQuestion, setAgentQuestion] = useState<string>('');
  const [agentAnswer, setAgentAnswer] = useState<string>('');
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const agent = new PageAgent({
    model: 'qwen3.5-plus',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'sk-39d259240a734b7983b83579a934f1bf',
    language: 'zh-CN'
  });
  // 直接调用面板，让用户在弹窗里输入问题
  const handleAgentChat = () => {
    agent.panel.show();
  };
  // 时间格式化（复用原有逻辑）
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

  // 角色跳转核心方法：封装通用跳转逻辑，减少冗余代码
  const handleRoleJump = (targetRole: string, targetPath: string) => {
    if (userRole === targetRole) {
      navigate(targetPath); // 角色匹配，跳转到对应页面
    } else {
      alert(`无${targetRole === 'student' ? '学生' : '教师'}权限！`);
    }
  };

  // 自动跳转（可选：进入系统页后，根据角色自动跳转到专属页面）
  const autoJumpByRole = () => {
    switch (userRole) {
      case 'student':
        navigate('/system/student');
        break;
      case 'teacher':
        navigate('/system/teacher');
        break;
      case 'admin':
        navigate('/system/admin');
        break;
      default:
        alert('无有效角色权限，请联系管理员');
        navigate('/'); // 无角色则返回首页
    }
  };

  useEffect(() => {
    // 1. 实时更新时间
    setCurrentTime(formatTime());
    const timer = setInterval(() => setCurrentTime(formatTime()), 1000);

    // 2. 校验登录态和角色
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('username');

    if (!token) {
      // 未登录，强制返回首页
      navigate('/');
      return;
    }

    // 已登录，初始化角色和用户名
    setUserRole(role || '');
    setUsername(name || '');

    // 可选：自动跳转到角色专属页面（无需手动点击按钮）
    // autoJumpByRole();

    // 清除定时器
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className={Mainstyle.main}>
      <div className={Mainstyle.header}>
        <Hello username={username} />
        <div className={button.button} onClick={() => navigate('/')}>
          back
        </div>
      </div>

      {/* 核心：根据角色渲染操作按钮 */}
      <div className={Mainstyle.body}>
        {/* 学生按钮：仅角色为student时可点击跳转 */}
        <button
          className={button_Stu.button}
          onClick={() => handleRoleJump('student', '/system_student')}
        >
          学生系统
        </button>

        {/* 教师按钮：仅角色为teacher时可点击跳转 */}
        <button
          className={button_Stu.button}
          onClick={() => handleRoleJump('teacher', '/system_teacher')}
        >
          教师系统
        </button>
        <div>
          <h5 className={spanstyle.span}>系统智能助手</h5>

          <button className={button_Stu.button}
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
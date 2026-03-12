import React, { useState, useEffect } from "react";
import { useNavigate } from 'umi';
import Mainstyle from '@/layouts/Mainstyle_system.less';
import button from '../layouts/button_back.less';
import spanstyle from '../layouts/span_title.less';
import button_Stu from '../layouts/button_Stu.less';
import { KeyboardEvent } from 'react';
import { signup } from '../services/api';

export default function SignupPage() {
    // 时间状态
    const [currentTime, setCurrentTime] = useState<string>('');
    // 注册表单状态
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPwd, setConfirmPwd] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('student'); // 默认学生角色
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    // 复用时间格式化逻辑
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

    // 初始化时间
    useEffect(() => {
        setCurrentTime(formatTime());
        const timer = setInterval(() => setCurrentTime(formatTime()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 返回登录页
    const handleBackClick = () => {
        navigate('/');
    };

    // 回车触发注册
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    // 注册逻辑
    const handleSignup = async () => {
    // 表单校验（无修改）
    if (!username.trim()) { alert('请输入用户名！'); return; }
    if (password.length < 6) { alert('密码长度不能少于6位！'); return; }
    if (password !== confirmPwd) { alert('两次输入的密码不一致！'); return; }

    // 【修改：移动到此处】设置加载状态
    setLoading(true); 

    try {
        // 保留原 fetch 请求逻辑（无修改）
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role: userRole }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
            alert('注册成功！即将跳转到登录页');
            navigate('/');
        } else {
            alert(data.message || '注册失败，请重试！');
        }
    } catch (error) {
        console.error('注册请求失败:', error);
        alert('网络异常，注册失败！');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className={Mainstyle.main}>
            <div className={Mainstyle.header}>
                <span className={spanstyle.span_title}>User Sign Up</span>
                <div className={button.button} onClick={handleBackClick}>
                    Back
                </div>
            </div>

            <div className={Mainstyle.body}>
                {/* 用户名 */}
                <input
                    className={Mainstyle.input}
                    type="text"
                    placeholder="请设置用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                {/* 密码 */}
                <input
                    className={Mainstyle.input}
                    type="password"
                    placeholder="请设置密码（不少于6位）"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                {/* 确认密码 */}
                <input
                    className={Mainstyle.input}
                    type="password"
                    placeholder="请确认密码"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                {/* 角色选择 */}
                <div className={Mainstyle.roleSelect}>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="student"
                            checked={userRole === 'student'}
                            onChange={() => setUserRole('student')}
                            disabled={loading}
                        />
                        学生
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="teacher"
                            checked={userRole === 'teacher'}
                            onChange={() => setUserRole('teacher')}
                            disabled={loading}
                        />
                        教师
                    </label>
                </div>
                {/* 注册按钮 */}
                <button
                    className={button_Stu.button}
                    onClick={handleSignup}
                    disabled={loading}
                >
                    {loading ? '注册中...' : 'Sign Up'}
                </button>
            </div>

            <div className={Mainstyle.footer}>
                <span className={Mainstyle.currentTime}>{currentTime}</span>
            </div>
        </div>
    );
}
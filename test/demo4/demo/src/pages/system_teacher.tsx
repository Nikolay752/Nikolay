import React, { useState, useEffect } from "react";
import { useNavigate } from 'umi'; // 无用的Link删掉，减少冗余
import Mainstyle from '@/layouts/Mainstyle_teacher.less';
import button from '../layouts/button_back.less';
import Hello from "@/layouts/Hello";
import TeacherCreditChart from "@/layouts/Charts/TeacherCreditChart";
import TeacherScheduleChart from "@/layouts/Charts/TeacherScheduleChart";
import ClassCountChart from "@/layouts/Charts/ClassCountChart";
import Collage from "@/layouts/Charts/Collage";
import ClassDistribution from "@/layouts/Charts/ClassDistribution";
import { mockSchedule, mockCredit, mockClass, mockCollage, mockClassDistribution } from "@/mockData/teacherData";

export default function SystemPage() {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [scheduleData, setScheduleData] = useState<any[]>([]);
    const [creditData, setCreditData] = useState<any[]>([]);
    const [classData, setClassData] = useState<any[]>([]);
    const [collageData, setCollageData] = useState<any[]>([]);
    const [ClassDistributionData, setClassDistributionData] = useState<any[]>([]);
    const navigate = useNavigate();

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

    // 模拟/请求图表数据
    const fetchChartData = () => {
        try {
            setScheduleData(mockSchedule);
            setCreditData(mockCredit);
            setClassData(mockClass);
            setCollageData(mockCollage);
            setClassDistributionData(mockClassDistribution);
            console.log('图表数据初始化成功（来自外部 mock)');
        } catch (error) {
            console.error('图表数据初始化失败:', error);
        }
    };

    useEffect(() => {
        // 1. 实时更新时间
        setCurrentTime(formatTime());
        const timer = setInterval(() => setCurrentTime(formatTime()), 1000);

        // 2. 校验登录态+赋值用户信息
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('username');
        if (!token) {
            navigate('/login');
        } else {
            setUserRole(role || '老师');
            setUsername(name || '老师');
        }

        fetchChartData();

        // 清除定时器
        return () => clearInterval(timer);
    }, [navigate]);



    return (
        <div className={Mainstyle.main}>
            <div className={Mainstyle.header}>
                <Hello username={username || '老师'} />
                <div className={button.button} onClick={() => navigate('/system')}>
                    back
                </div>
            </div>

            <div className={Mainstyle.body}>
                <div className={Mainstyle.chartWrapper}>
                    <h3 className={Mainstyle.chartTitle}>个人课表</h3>
                    <TeacherScheduleChart scheduleData={scheduleData} />
                </div>
                <div className={Mainstyle.chartWrapper}>
                    <h3 className={Mainstyle.chartTitle}>学生分数情况</h3>
                    <TeacherCreditChart creditData={creditData} />
                </div>
                <div className={Mainstyle.chartWrapper}>
                    <h3 className={Mainstyle.chartTitle}>授课班级人数</h3>
                    <ClassCountChart classData={classData} />
                </div>
                <div className={Mainstyle.chartWrapper}>
                    <h3 className={Mainstyle.chartTitle}>院系分布</h3>
                    <Collage collageData={collageData} />
                </div>
                <div className={Mainstyle.chartWrapper}>
                    <h3 className={Mainstyle.chartTitle}>学院内人数分布</h3>
                    <ClassDistribution classDistributionData={ClassDistributionData} />
                </div>
            </div>
        </div>
    );
}
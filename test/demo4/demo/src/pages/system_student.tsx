import React, { useState, useEffect } from "react";
import { useNavigate } from 'umi'; // 无用的Link删掉，减少冗余
import Mainstyle from '@/layouts/Mainstyle_student.less';
import button from '../layouts/button_back.less';
import Hello from "@/layouts/Hello";
import StudentCreditChart from "@/layouts/Charts/StudentCreditChart";
import StudentScheduleChart from "@/layouts/Charts/StudentScheduleChart";
import Collage from "@/layouts/Charts/Collage";
import { mockSchedule, mockCredit ,mockCollage} from "@/mockData/studentData";
import { use } from "echarts/types/src/extension.js";

export default function SystemPage() {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [scheduleData, setScheduleData] = useState<any[]>([]);
    const [creditData, setCreditData] = useState<any[]>([]);
    const [collageData, setcollageData] = useState<any[]>([]);
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
        setcollageData(mockCollage);
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
            setUserRole(role || '学生');
            setUsername(name || '同学');
        }

        fetchChartData();

        // 清除定时器
        return () => clearInterval(timer);
    }, [navigate]);



    return (
        <div className={Mainstyle.main}>
            <div className={Mainstyle.header}>
                <Hello username={username || '同学'} />
                <div className={button.button} onClick={() => navigate('/system')}>
                    back
                </div>
            </div>

            <div className={Mainstyle.body}>
                <div className={Mainstyle.chartWrapper}>
                    <h3 className={Mainstyle.chartTitle}>个人课表</h3>
                    <StudentScheduleChart scheduleData={scheduleData} />
                </div>
                <div className={Mainstyle.chartWrapper}>
                    <h3 className={Mainstyle.chartTitle}>课程学分分布</h3>
                    <StudentCreditChart creditData={creditData} />
                </div>
                <div className={Mainstyle.chartWrapper}>
                    <h3 className={Mainstyle.chartTitle}>院系分布</h3>
                    <Collage collageData={collageData} />
                </div>
            </div>
        </div>
    );
}
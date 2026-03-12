import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './StudentCharts.less';
interface StudentScheduleChartProps {
    scheduleData: any[];
}
const StudentScheduleChart: React.FC<StudentScheduleChartProps> = ({ scheduleData }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    // 定义Y轴节次数组，作为匹配基准
    const yAxisPeriods = ['0','1', '2', '3', '4', '5', '6', '7', '8'];

    useEffect(() => {
        // 双重校验：容器存在 + 数据有长度
        if (!chartRef.current || !Array.isArray(scheduleData) || scheduleData.length === 0) {
            console.log('课表数据为空或容器不存在');
            return;
        }
        // 初始化ECharts，先销毁旧实例防止重复创建
        const oldChart = echarts.getInstanceByDom(chartRef.current);
        if (oldChart) oldChart.dispose();
        const myChart = echarts.init(chartRef.current);
        // 处理数据：核心修复——将节次数字转为Y轴数组的对应索引
        const chartData = scheduleData.map(item => {
            // 1. 获取节次数字，转成字符串（和Y轴数据格式统一）
            const periodStr = String(item.period || 0);
            // 2. 找到该节次在Y轴数组中的索引，精准匹配
            const periodIndex = yAxisPeriods.findIndex(p => p === periodStr);
            // 3. 索引存在则用索引，不存在则默认0（避免错位）
            const targetIndex = periodIndex > -1 ? periodIndex : 0;
            return [
                item.weekDay || '', // 星期（X轴）
                targetIndex,        // 节次索引（Y轴，核心修复）
                item.courseName || '未知课程'
            ];
        });

        const option = {
            backgroundColor: '#282c34',
            tooltip: {
                trigger: 'item',
                formatter: '{c}', // 悬浮显示课程名
                backgroundColor: 'rgba(0,0,0,0.7)',
                textStyle: { color: '#antiquewhite' }
            },
            xAxis: {
                type: 'category',
                name: '星期',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                axisLabel: { interval: 0, fontSize: 12, color: 'antiquewhite' },
                nameTextStyle: { fontSize: 14, fontWeight: 600, color: 'antiquewhite' }, // 补全星期标题颜色
            },
            yAxis: {
                type: 'category',
                name: '节次',
                data: yAxisPeriods, // 复用基准数组，避免重复
                axisLabel: { interval: 0, fontSize: 12, color: 'antiquewhite' },
                nameTextStyle: { fontSize: 14, fontWeight: 600, color: 'antiquewhite' }, // 补全节次标题颜色
            },
            series: [
                {
                    type: 'scatter',
                    symbolSize: 40, // 课程圆点大小
                    data: chartData,
                    itemStyle: { color: '#409eff', borderRadius: 4 } // 加圆角，更美观
                }
            ],
            grid: { left: '12%', right: '12%', top: '20%', bottom: '15%' }
        };
        myChart.setOption(option);
        // 自适应窗口+销毁实例
        const resizeHandler = () => myChart.resize();
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
            myChart.dispose();
        };
    }, [scheduleData]);

    // 兜底：数据为空时显示提示
    if (!Array.isArray(scheduleData) || scheduleData.length === 0) {
        return <div className={styles.chartEmpty}>暂无课表数据</div>;
    }
    return <div ref={chartRef} className={styles.chartContainer}></div>;
};
export default StudentScheduleChart;
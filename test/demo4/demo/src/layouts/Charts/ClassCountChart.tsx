import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './StudentCharts.less'; // 需新建样式文件

// 定义组件属性类型
interface ClassCountChartProps {
    classData: Array<{
        className: string; // 班级名称
        studentCount: number; // 班级人数
    }>;
    chartType?: 'bar' | 'pie'; // 图表类型，默认柱状图
}

const ClassCountChart: React.FC<ClassCountChartProps> = ({
    classData,
    chartType = 'bar',
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 校验容器和数据
        if (!chartRef.current || !Array.isArray(classData) || classData.length === 0) {
            console.log('班级人数数据为空或容器不存在');
            return;
        }

        // 销毁旧实例，避免内存泄漏
        const oldChart = echarts.getInstanceByDom(chartRef.current);
        if (oldChart) oldChart.dispose();

        const myChart = echarts.init(chartRef.current);

        // 处理图表数据
        const xAxisData = classData.map(item => item.className); // X轴/饼图名称
        const seriesData = classData.map(item => item.studentCount); // 数值

        // 图表配置项（保持和现有图表风格统一）
        const option = {
            backgroundColor: '#282c34',
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} 人', // 悬浮提示：班级名 + 人数
                backgroundColor: 'rgba(0,0,0,0.7)',
                textStyle: { color: '#eeefba' },
            },
            // 柱状图配置
            ...(chartType === 'bar' && {
                xAxis: {
                    type: 'category',
                    name: '班级',
                    data: xAxisData,
                    axisLabel: { interval: 0, fontSize: 12, color: '#eeefba' },
                    nameTextStyle: { fontSize: 14, fontWeight: 600, color: '#eeefba' },
                },
                yAxis: {
                    type: 'value',
                    name: '人数',
                    min: 0, // 人数从0开始
                    axisLabel: { fontSize: 12, color: '#eeefba' },
                    nameTextStyle: { fontSize: 14, fontWeight: 600, color: '#eeefba' },
                },
            }),
            // 饼图配置
            ...(chartType === 'pie' && {
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    textStyle: { color: '#antiquewhite' },
                },
            }),
            series: [
                {
                    name: '班级人数',
                    type: chartType,
                    data: chartType === 'pie'
                        ? classData.map(item => ({ name: item.className, value: item.studentCount }))
                        : seriesData,
                    itemStyle: {
                        color: '#409eff', // ✅ 直接使用十六进制颜色
                        borderRadius: chartType === 'bar' ? 4 : 0,
                    },
                },
            ],
            grid: chartType === 'bar' ? { left: '12%', right: '12%', top: '20%', bottom: '15%' } : {},
        };

        myChart.setOption(option);

        // 自适应窗口大小
        const resizeHandler = () => myChart.resize();
        window.addEventListener('resize', resizeHandler);

        // 组件卸载时清理
        return () => {
            window.removeEventListener('resize', resizeHandler);
            myChart.dispose();
        };
    }, [classData, chartType]);

    // 数据为空时显示兜底提示
    if (!Array.isArray(classData) || classData.length === 0) {
        return <div className={styles.chartEmpty}>暂无班级人数数据</div>;
    }

    return <div ref={chartRef} className={styles.chartContainer}></div>;
};

export default ClassCountChart;
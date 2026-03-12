import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './StudentCharts.less';

interface CollageProps {
    collageData: any[]; 
}

const Collage: React.FC<CollageProps> = ({ collageData }) => { 
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current || !Array.isArray(collageData) || collageData.length === 0) {
            console.log('院校数据为空或容器不存在'); 
            return;
        }

        const oldChart = echarts.getInstanceByDom(chartRef.current);
        if (oldChart) oldChart.dispose();
        const myChart = echarts.init(chartRef.current);

        // 修复：映射正确的字段（name和count，而非courseType和credit）
        const chartData = collageData.filter(item => item.count > 0).map(item => ({
            name: item.name || '未知院系', 
            value: item.count || 0
        }));

        const option = {
            backgroundColor: '#282c34',
            tooltip: {
                trigger: 'item',
                // 修复：tooltip文案匹配院系人数场景
                formatter: '{b}: {c} 人 ({d}%)', 
                backgroundColor: 'rgba(0,0,0,0.7)',
                textStyle: { color: '#fff' }
            },
            legend: {
                orient: 'vertical',
                left: 10,
                top: 'center',
                textStyle: { fontSize: 12, color: '#fff' } // 新增：适配深色背景的文字颜色
            },
            series: [
                {
                    name: '院系人数', // 修复：series名称匹配场景
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['60%', '50%'], 
                    data: chartData,
                    label: { 
                        show: true, 
                        fontSize: 12,
                        color: '#fff' // 新增：标签文字适配深色背景
                    },
                    color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#73c0de'] // 新增：适配6个院系的颜色
                }
            ]
        };

        myChart.setOption(option);

        const resizeHandler = () => myChart.resize();
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
            myChart.dispose();
        };
    }, [collageData]); 

    if (!Array.isArray(collageData) || collageData.length === 0) {
        return <div className={styles.chartEmpty}>暂无院系数据</div>; 
    }

    return <div ref={chartRef} className={styles.chartContainer} style={{ height: '400px' }}></div>;
};

export default Collage;
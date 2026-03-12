import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './StudentCharts.less';

interface StudentCreditChartProps {
  creditData: any[];
}

const StudentCreditChart: React.FC<StudentCreditChartProps> = ({ creditData }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 双重校验：容器存在 + 数据有长度
    if (!chartRef.current || !Array.isArray(creditData) || creditData.length === 0) {
      console.log('学分数据为空或容器不存在');
      return;
    }

    // 初始化ECharts，销毁旧实例
    const oldChart = echarts.getInstanceByDom(chartRef.current);
    if (oldChart) oldChart.dispose();
    const myChart = echarts.init(chartRef.current);

    // 处理数据：过滤无效数据
    const chartData = creditData.filter(item => item.credit > 0).map(item => ({
      name: item.courseType || '未知类型',
      value: item.credit || 0
    }));

    const option = {
        backgroundColor : '#282c34',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 学分 ({d}%)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        textStyle: { color: '#fff' }
      },
      legend: { 
        orient: 'vertical', 
        left: 10, 
        top: 'center',
        textStyle: { fontSize: 12 }
      },
      series: [
        {
          name: '学分',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'], // 饼图居中，适配容器
          data: chartData,
          label: { show: true, fontSize: 12 },
          // 饼图颜色自定义，更美观
          color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c','#909399']
        }
      ]
    };

    myChart.setOption(option);

    // 自适应窗口+销毁实例
    const resizeHandler = () => myChart.resize();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      myChart.dispose();
    };
  }, [creditData]);

  // 兜底：数据为空时显示提示
  if (!Array.isArray(creditData) || creditData.length === 0) {
    return <div className={styles.chartEmpty}>暂无学分数据</div>;
  }

  return <div ref={chartRef} className={styles.chartContainer}></div>;
};

export default StudentCreditChart;
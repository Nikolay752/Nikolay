import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './StudentCharts.less';

// 修正Props接口名和组件名，匹配教师页面使用的TeacherCreditChart
interface TeacherCreditChartProps {
  creditData: any[];
}

// 组件名改为TeacherCreditChart，和导入名一致
const TeacherCreditChart: React.FC<TeacherCreditChartProps> = ({ creditData }) => {
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

    // 关键修复：匹配mock数据的字段（gradeLevel/studentCount）
    const chartData = creditData.filter(item => item.studentCount > 0).map(item => ({
      name: item.gradeLevel || '未知等级', // 替换courseType为gradeLevel
      value: item.studentCount || 0 // 替换credit为studentCount
    }));

    const option = {
      backgroundColor: '#282c34',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 人次 ({d}%)', // 保持显示逻辑
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
          name: '学生分数等级', // 优化名称，匹配数据含义
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          data: chartData,
          label: { show: true, fontSize: 12 },
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
    return <div className={styles.chartEmpty}>暂无分数等级数据</div>;
  }

  return <div ref={chartRef} className={styles.chartContainer} style={{ height: '400px' }}></div>;
};

// 导出正确的组件名
export default TeacherCreditChart;
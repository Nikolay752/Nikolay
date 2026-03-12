// src/mockData/teacherData.ts

import StudentCreditChart from "@/layouts/Charts/TeacherCreditChart";

// 课表数据
export const mockSchedule = [
  { weekDay: '周一', period: 2, courseName: '物联2302' },
  { weekDay: '周二', period: 3, courseName: '物联2301' },
  { weekDay: '周三', period: 4, courseName: '网络2301' },
  { weekDay: '周五', period: 3, courseName: '网络2302' },
];

// 学分/成绩分布数据
export const mockCredit = [
  { courseType: '优秀', credit: 5 },
  { courseType: '良好', credit: 8 },
  { courseType: '中等', credit: 5 },
  { courseType: '及格', credit: 15 },
  { courseType: '不及格', credit: 5 }
];

// 班级人数数据
export const mockClass = [
  { className: '网络2301', studentCount: 37 },
  { className: '网络2302', studentCount: 42 },
  { className: '物联2301', studentCount: 41 },
  { className: '物联2302', studentCount: 34 },
];

export const mockCollage = [
    { name: '智能制造学院' , count: 2000},
    { name: '人工智能学院' , count: 1200},
    { name: '创意设计学院' , count: 1300},
    { name: '增材制造学院' , count: 1100},
    { name: '智慧交通学院' , count: 1300},
    { name: '国际教育学院' , count: 700 },
]

export const mockClassDistribution = [
  { className: '物联网应用技术', studentCount: 89 },
  { className: '计算机应用技术', studentCount: 83 },
  { className: '计算机网络技术', studentCount: 85 },
  { className: '云计算技术应用', studentCount: 44 },
  { className: '大数据技术', studentCount: 45 },
  { className: '物联网应用技术（中外合作）', studentCount: 56},
  { className: '物联网工程', studentCount: 42 },
];
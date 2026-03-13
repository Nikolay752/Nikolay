// src/mockData/teacherData.ts

import StudentCreditChart from "@/layouts/Charts/TeacherCreditChart";

// 课表数据
export const classScheduleMap = {
  "物联2301": [
    { weekDay: '周一', period: 3, courseName: '阿里云物联网套件开发' },
    { weekDay: '周一', period: 4, courseName: '阿里云物联网套件开发' },
    { weekDay: '周三', period: 1, courseName: '阿里云物联网套件开发' },
    { weekDay: '周三', period: 2, courseName: '阿里云物联网套件开发' },
    { weekDay: '周三', period: 3, courseName: '大学生职业发展与就业指导' },
    { weekDay: '周三', period: 4, courseName: '大学生职业发展与就业指导' },
    { weekDay: '周四', period: 7, courseName: '形式与政策'},
    { weekDay: '周四', period: 8, courseName: '形式与政策'},
    { weekDay: '周五', period: 1, courseName: 'Linux系统管理' },
    { weekDay: '周五', period: 2, courseName: 'Linux系统管理' },
    { weekDay: '周五', period: 3, courseName: 'Linux系统管理' },
    { weekDay: '周五', period: 4, courseName: 'Linux系统管理' }
  ],
  "网络2301": [
    { weekDay: '周一', period: 1, courseName: '网络安全技术' },
    { weekDay: '周一', period: 2, courseName: '网络安全技术' },
    { weekDay: '周一', period: 3, courseName: 'Web前端开发进阶' },
    { weekDay: '周一', period: 4, courseName: 'Web前端开发进阶' },
    { weekDay: '周一', period: 5, courseName: '毛泽东思想和中国特色社会主义理论体系概论' },
    { weekDay: '周一', period: 6, courseName: '毛泽东思想和中国特色社会主义理论体系概论' },
    { weekDay: '周二', period: 1, courseName: 'Web前端开发进阶' },
    { weekDay: '周二', period: 2, courseName: 'Web前端开发进阶' },
    { weekDay: '周二', period: 3, courseName: '体育与健康' },
    { weekDay: '周二', period: 4, courseName: '体育与健康' },
    { weekDay: '周三', period: 1, courseName: '应用写作与表达技巧' },
    { weekDay: '周三', period: 2, courseName: '应用写作与表达技巧' },
    { weekDay: '周三', period: 3, courseName: 'UI界面设计' },
    { weekDay: '周三', period: 4, courseName: 'UI界面设计' },
    { weekDay: '周四', period: 1, courseName: '计算机网络通信编程' },
    { weekDay: '周四', period: 2, courseName: '计算机网络通信编程' },
    { weekDay: '周四', period: 3, courseName: '毛泽东思想和中国特色社会主义理论体系细论' },
    { weekDay: '周四', period: 4, courseName: '毛泽东思想和中国特色社会主义理论体系细论' },
    { weekDay: '周四', period: 5, courseName: '工程概预算' },
    { weekDay: '周四', period: 6, courseName: '工程概预算' },
    { weekDay: '周五', period: 1, courseName: '形式与政策' },
    { weekDay: '周五', period: 2, courseName: '形式与政策' },
    { weekDay: '周五', period: 3, courseName: '计算机网络通信编程' },
    { weekDay: '周五', period: 4, courseName: '计算机网络通信编程' },
    { weekDay: '周五', period: 5, courseName: '之江匠心' },
    { weekDay: '周五', period: 6, courseName: '之江匠心' }
  ],
  "云计算2301": [
    { weekDay: '周一', period: 1, courseName: '传感器与无线传感网络' },
    { weekDay: '周一', period: 3, courseName: '传感器与无线传感网络' },
    { weekDay: '周一', period: 5, courseName: '智能终端开发' },
    { weekDay: '周一', period: 7, courseName: '体育与健康' },
    { weekDay: '周二', period: 3, courseName: 'Web前端开发基础' },
    { weekDay: '周二', period: 5, courseName: '思想道德与法制' },
    { weekDay: '周二', period: 7, courseName: '形式与政策' },
    { weekDay: '周三', period: 1, courseName: 'Web前端开发基础' },
    { weekDay: '周三', period: 3, courseName: '人工智能基础' },
    { weekDay: '周四', period: 1, courseName: '智能终端开发' },
    { weekDay: '周四', period: 3, courseName: '思想道德与法制' },
    { weekDay: '周四', period: 5, courseName: '物联网智能网关' },
    { weekDay: '周五', period: 3, courseName: '中国共产党党史概要' },
  ]
};
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
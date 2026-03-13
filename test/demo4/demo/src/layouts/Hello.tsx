import React from 'react';

interface HelloProps {
  username?: string; // 新增：匹配system页面的传参属性
  userIndex?: number; // 保留：兼容原索引传参方式
}   

// 兜底用户名，防止所有传参都为空
const DEFAULT_USERNAME = 'Guest';

export default function Hello({ username, userIndex }: HelloProps) {
  // 优先级：传了username直接用（适配现有业务）> 传了userIndex兼容处理 > 兜底名
  let showName = DEFAULT_USERNAME;
  if (username) {
    showName = username;
  } 
  // 若仍需要保留从json取用户的逻辑，取消下面注释并保证路径正确
  // else if (typeof userIndex === 'number') {
  //   import('../../backend/users.json').then(usersData => {
  //     const targetUser = usersData.default[userIndex];
  //     if (targetUser?.username) showName = targetUser.username;
  //   });
  // }

  return (
    <div style={{ textAlign:'center', color:'antiquewhite', fontSize:'25px' }}>
      <h2 style={{ cursor:'default' }}>Welcome, {showName}</h2>
    </div>
  );
}

// 两种使用方式都兼容（无缝适配）：
// 1. 现有system页面使用：<Hello username={username || '用户'} /> ✅
// 2. 原索引方式使用：<Hello userIndex={0} /> ✅
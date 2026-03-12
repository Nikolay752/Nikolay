const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs-extra'); // 更友好的文件操作

const app = express();
app.use(cors()); // 解决跨域
app.use(express.json()); // 解析JSON请求体

// 配置项
const JWT_SECRET = 'your-secret-key-123456'; // Token密钥（自定义）
const JWT_EXPIRES = '2h'; // Token有效期
const USER_FILE = './users.json'; // 用户数据文件路径

// 初始化用户文件（如果不存在则创建空数组）
async function initUserFile() {
  if (!await fs.pathExists(USER_FILE)) {
    await fs.writeJson(USER_FILE, []);
  }
}
initUserFile();

// 1. 注册接口
app.post('/api/signup', async (req, res) => {
  const { username, password, role } = req.body;

  // 校验参数
  if (!username || !password || !['student', 'teacher', 'admin'].includes(role)) {
    return res.json({ success: false, message: '参数错误：用户名/密码/角色不能为空，角色仅支持student/teacher/admin' });
  }

  // 读取现有用户
  const users = await fs.readJson(USER_FILE);
  
  // 检查用户名是否已存在
  if (users.some(user => user.username === username)) {
    return res.json({ success: false, message: '用户名已存在' });
  }

  // 密码加密
  const hashedPassword = await bcrypt.hash(password, 10);

  // 新增用户
  const newUser = {
    id: Date.now(), // 用时间戳作为唯一ID
    username,
    password: hashedPassword, // 存储加密后的密码
    role,
    createTime: new Date().toISOString()
  };
  users.push(newUser);

  // 写入JSON文件
  await fs.writeJson(USER_FILE, users, { spaces: 2 }); // spaces:2 格式化JSON，方便查看

  res.json({ success: true, message: '注册成功' });
});

// 2. 登录接口
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // 校验参数
  if (!username || !password) {
    return res.json({ success: false, message: '用户名和密码不能为空' });
  }

  // 读取用户数据
  const users = await fs.readJson(USER_FILE);
  
  // 查找用户
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.json({ success: false, message: '用户名不存在' });
  }

  // 校验密码
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({ success: false, message: '密码错误' });
  }

  // 生成Token（不包含密码）
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  // 返回登录结果（不返回密码）
  res.json({
    success: true,
    username: user.username,
    role: user.role,
    token,
    message: '登录成功'
  });
});

// 3. 获取用户信息接口（可选，用于页面刷新后获取用户信息）
app.post('/api/getUserInfo', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.json({ success: false, message: 'Token不能为空' });
  }

  try {
    // 验证Token
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      success: true,
      userInfo: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (err) {
    res.json({ success: false, message: 'Token无效或已过期' });
  }
});

// 启动后端服务
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`);
  console.log(`用户数据文件路径：${__dirname}/${USER_FILE}`);
});
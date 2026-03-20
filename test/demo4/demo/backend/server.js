const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

// 跨域配置：允许所有来源（适配本机+手机访问）
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));

// 数据文件路径
const GOBANG_RECORD_PATH = path.join(__dirname, 'gobang-record.json');
const USERS_PATH = path.join(__dirname, 'users.json');
const BOARD_SIZE = 15;

// 初始化默认棋盘数据
const initDefaultRecord = () => ({
  currentBoard: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)),
  currentPlayer: 'black',
  gameOver: false,
  winner: null,
  gameMode: 'human',
  updateTime: new Date().toISOString()
});

// 确保数据文件存在
const ensureRecordFile = () => {
  if (!fs.existsSync(GOBANG_RECORD_PATH)) {
    fs.writeFileSync(GOBANG_RECORD_PATH, JSON.stringify(initDefaultRecord(), null, 2), 'utf8');
  }
  if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, JSON.stringify([], null, 2), 'utf8');
  }
};
ensureRecordFile();

// --- 登录接口（无 bcrypt，明文比对）---
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ success: false, message: '用户名或密码不能为空' });
    }
    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
    const user = users.find(u => u.username === username);
    if (!user) return res.json({ success: false, message: '用户名不存在' });
    if (user.password !== password) return res.json({ success: false, message: '密码错误' });
    res.json({
      success: true,
      message: '登录成功',
      userInfo: { username: user.username, role: user.role, class: user.class }
    });
  } catch (err) {
    res.json({ success: false, message: '登录失败', error: err.message });
  }
});

// --- 注册接口（无 bcrypt，明文存储）---
app.post('/api/signup', (req, res) => {
  try {
    const { username, password, role, class: className } = req.body;
    if (!username || !password || !role || !className) {
      return res.json({ success: false, message: '参数缺失：用户名、密码、角色、班级均为必填项' });
    }
    if (password.length < 6) {
      return res.json({ success: false, message: '密码长度不能少于6位' });
    }
    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
    if (users.some(u => u.username === username)) {
      return res.json({ success: false, message: '用户名已存在' });
    }
    const newUser = {
      id: Date.now(),
      username,
      password, // 明文存储（仅测试用）
      role,
      class: className,
      createTime: new Date().toISOString()
    };
    users.push(newUser);
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf8');
    res.json({ success: true, message: '注册成功', userInfo: { username, role, class: className } });
  } catch (err) {
    res.json({ success: false, message: '注册失败', error: err.message });
  }
});

// --- 核心新增：获取棋盘数据接口（适配本机+手机访问）---
app.get('/api/gobang/getRecord', (req, res) => {
  try {
    const record = JSON.parse(fs.readFileSync(GOBANG_RECORD_PATH, 'utf8'));
    res.json({ code: 200, msg: '获取成功', data: record });
  } catch (err) {
    // 读取失败则返回默认空棋盘
    const defaultData = initDefaultRecord();
    res.json({ code: 500, msg: '获取失败，使用默认数据', error: err.message, data: defaultData });
  }
});

// --- 核心修改：删除重复的GET重置接口，保留POST重置接口 ---
app.post('/api/gobang/resetRecord', (req, res) => {
  try {
    const defaultData = initDefaultRecord();
    fs.writeFileSync(GOBANG_RECORD_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
    res.json({ code: 200, msg: '重置成功', data: defaultData });
  } catch (err) {
    res.json({ code: 500, msg: '重置失败', error: err.message });
  }
});

// --- 更新棋盘数据接口 ---
app.post('/api/gobang/updateRecord', (req, res) => {
  try {
    const { currentBoard, currentPlayer, gameOver, winner, gameMode } = req.body;
    const newRecord = {
      currentBoard,
      currentPlayer,
      gameOver: gameOver ?? false,
      winner: winner ?? null,
      gameMode: gameMode ?? 'human',
      updateTime: new Date().toISOString()
    };
    fs.writeFileSync(GOBANG_RECORD_PATH, JSON.stringify(newRecord, null, 2), 'utf8');
    res.json({ code: 200, msg: '更新成功', data: newRecord });
  } catch (err) {
    res.json({ code: 500, msg: '更新失败', error: err.message });
  }
});

// --- 给POST接口增加GET访问提示（避免页面空白）---
app.get('/api/login', (req, res) => {
  res.json({ success: false, message: '该接口仅支持POST请求，请通过表单/接口工具调用' });
});
app.get('/api/signup', (req, res) => {
  res.json({ success: false, message: '该接口仅支持POST请求，请通过表单/接口工具调用' });
});
app.get('/api/gobang/resetRecord', (req, res) => {
  res.json({ code: 405, msg: '该接口仅支持POST请求，请使用POST方式调用' });
});
app.get('/api/gobang/updateRecord', (req, res) => {
  res.json({ code: 405, msg: '该接口仅支持POST请求，请使用POST方式调用' });
});

// 启动服务（绑定0.0.0.0，允许本机+局域网访问）
app.listen(PORT, '0.0.0.0', () => {
  // 获取本机局域网IP
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let localIp = 'localhost';
  for (const key of Object.keys(networkInterfaces)) {
    for (const iface of networkInterfaces[key]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
  }
  console.log(`✅ 服务运行在：`);
  console.log(`   - 本机访问：http://localhost:${PORT}`);
  console.log(`   - 局域网访问：http://${localIp}:${PORT}`);
  console.log(`✅ 可用接口：`);
  console.log(`   - 获取棋盘：GET http://${localIp}:${PORT}/api/gobang/getRecord`);
  console.log(`   - 重置棋盘：POST http://${localIp}:${PORT}/api/gobang/resetRecord`);
  console.log(`   - 更新棋盘：POST http://${localIp}:${PORT}/api/gobang/updateRecord`);
});
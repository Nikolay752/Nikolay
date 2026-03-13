const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
// 解决跨域和JSON解析问题（修复file parse err核心）
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' })); // 解析JSON请求体，避免解析失败
app.use(express.urlencoded({ extended: true }));

// 配置项
const PORT = 3001;
const USER_FILE_PATH = path.join(__dirname, 'users.json'); // 绝对路径，避免文件找不到

// 初始化users.json（文件不存在则创建，避免读取失败）
const initUserFile = () => {
    if (!fs.existsSync(USER_FILE_PATH)) {
        fs.writeFileSync(USER_FILE_PATH, JSON.stringify([], null, 2), 'utf8');
    }
};
initUserFile();

// 读取用户文件（封装方法，避免重复代码）
const readUsers = () => {
    const data = fs.readFileSync(USER_FILE_PATH, 'utf8');
    return JSON.parse(data);
};

// 写入用户文件（格式化JSON，方便查看）
const writeUsers = (users) => {
    fs.writeFileSync(USER_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
};

// 注册接口：核心处理班级存储，移除班级有效性校验
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password, role, class: className } = req.body;

        // 基础校验：用户名/密码/角色/班级不能为空
        if (!username.trim() || !password || !role || !className.trim()) {
            return res.status(200).json({
                success: false,
                message: '用户名、密码、角色、班级均不能为空！'
            });
        }

        // 校验角色仅为student/teacher
        if (!['student', 'teacher'].includes(role)) {
            return res.status(200).json({
                success: false,
                message: '角色仅支持学生(student)/教师(teacher)！'
            });
        }

        const users = readUsers();
        // 校验用户名是否已存在
        if (users.some(u => u.username === username)) {
            return res.status(200).json({
                success: false,
                message: '用户名已存在，请更换！'
            });
        }

        // 密码加密（10轮盐值）
        const salt = bcrypt.genSaltSync(10);
        const hashedPwd = bcrypt.hashSync(password, salt);

        // 构造新用户：包含class字段，学生/教师统一存储
        const newUser = {
            id: Date.now(), // 时间戳作为唯一ID
            username,
            password: hashedPwd,
            role,
            class: className, // 直接存储选择的班级，无有效性校验
            createTime: new Date().toISOString()
        };

        // 写入文件并返回成功
        users.push(newUser);
        writeUsers(users);
        res.status(200).json({ success: true, message: '注册成功！' });

    } catch (error) {
        console.error('注册接口错误：', error);
        res.status(500).json({ success: false, message: '服务器内部错误！' });
    }
});

// 登录接口（附带返回班级信息，方便前端使用）
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username.trim() || !password) {
            return res.status(200).json({ success: false, message: '用户名和密码不能为空！' });
        }

        const users = readUsers();
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(200).json({ success: false, message: '用户名不存在！' });
        }

        // 校验密码
        const pwdValid = bcrypt.compareSync(password, user.password);
        if (!pwdValid) {
            return res.status(200).json({ success: false, message: '密码错误！' });
        }

        // 返回用户信息（包含班级），无JWT简化版，可直接使用
        res.status(200).json({
            success: true,
            message: '登录成功！',
            token: `user_${user.id}_${Date.now()}`, // 生成简易token（替代空值）
            userInfo: {
                id: user.id,
                username: user.username,
                role: user.role,
                class: user.class
            }
        });

    } catch (error) {
        console.error('登录接口错误：', error);
        res.status(500).json({ success: false, message: '服务器内部错误！' });
    }
});

// 启动服务
app.listen(PORT, () => {
    console.log(`后端服务成功启动：http://localhost:${PORT}`);
    console.log(`用户数据文件路径：${USER_FILE_PATH}`);
});
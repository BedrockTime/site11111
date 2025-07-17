const express = require('express');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'секретный_ключ';


async function read(file) {
    try { return JSON.parse(await fs.readFile(file, 'utf8')); } 
    catch { return []; }
}
async function write(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}
function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Нет токена' });
    try {
        req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: 'Неверный токен' });
    }
}


const usersFile = './data/users.json';
const categoriesFile = './data/categories.json';
const taskListsFile = './data/taskLists.json';
const tasksFile = './data/tasks.json';


app.post('/auth/register', async (req, res) => {
    const { email, username, password } = req.body;
    const users = await read(usersFile);
    if (users.find(u => u.email === email)) return res.status(400).json({ message: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, username, password: hash };
    users.push(newUser);
    await write(usersFile, users);
    res.json({ message: 'User created successfully' });
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const users = await read(usersFile);
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) 
        return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ access_token: token, token_type: 'bearer' });
});


app.get('/categories', auth, async (req, res) => res.json(await read(categoriesFile)));

app.post('/categories', auth, async (req, res) => {
    const { name, icon_id } = req.body;
    const categories = await read(categoriesFile);
    const newCat = { id: Date.now(), name, icon_id };
    categories.push(newCat);
    await write(categoriesFile, categories);
    res.json(newCat);
});


app.get('/task-lists', auth, async (req, res) => {
    const { category_id } = req.query;
    let lists = await read(taskListsFile);
    if (category_id) lists = lists.filter(l => l.category_id == category_id);
    lists = lists.map(l => {
        const tasks = require('./data/tasks.json').filter(t => t.task_list_id === l.id);
        return { ...l, total_tasks: tasks.length, done_tasks: tasks.filter(t => t.done).length };
    });
    res.json(lists);
});

app.post('/task-lists', auth, async (req, res) => {
    const { title, category_id } = req.body;
    const lists = await read(taskListsFile);
    const newList = { id: Date.now(), title, category_id };
    lists.push(newList);
    await write(taskListsFile, lists);
    res.json(newList);
});

app.get('/task-lists/:id', auth, async (req, res) => {
    const lists = await read(taskListsFile);
    const list = lists.find(l => l.id == req.params.id);
    if (!list) return res.status(404).json({ message: 'Not found' });
    const tasks = (await read(tasksFile)).filter(t => t.task_list_id == list.id);
    res.json({ ...list, tasks });
});

app.delete('/task-lists/:id', auth, async (req, res) => {
    let lists = await read(taskListsFile);
    const oldLen = lists.length;
    lists = lists.filter(l => l.id != req.params.id);
    if (lists.length === oldLen) return res.status(404).json({ message: 'Not found' });
    await write(taskListsFile, lists);
    res.json({ message: 'Task list deleted' });
});


app.post('/tasks', auth, async (req, res) => {
    const { text, done, task_list_id } = req.body;
    const tasks = await read(tasksFile);
    const newTask = { id: Date.now(), text, done, task_list_id };
    tasks.push(newTask);
    await write(tasksFile, tasks);
    res.json(newTask);
});

app.put('/tasks/:id', auth, async (req, res) => {
    const { text, done } = req.body;
    const tasks = await read(tasksFile);
    const task = tasks.find(t => t.id == req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (text !== undefined) task.text = text;
    if (done !== undefined) task.done = done;
    await write(tasksFile, tasks);
    res.json(task);
});

app.delete('/tasks/:id', auth, async (req, res) => {
    let tasks = await read(tasksFile);
    const oldLen = tasks.length;
    tasks = tasks.filter(t => t.id != req.params.id);
    if (tasks.length === oldLen) return res.status(404).json({ message: 'Not found' });
    await write(tasksFile, tasks);
    res.json({ message: 'Task deleted' });
});


app.get('/categories/:id/stats', auth, async (req, res) => {
    const lists = (await read(taskListsFile)).filter(l => l.category_id == req.params.id);
    res.json({
        category_id: +req.params.id,
        total_lists: lists.length,
        done_lists: lists.filter(l => {
            const tasks = require('./data/tasks.json').filter(t => t.task_list_id === l.id);
            return tasks.length > 0 && tasks.every(t => t.done);
        }).length
    });
});

app.get('/task-lists/:id/stats', auth, async (req, res) => {
    const tasks = (await read(tasksFile)).filter(t => t.task_list_id == req.params.id);
    res.json({
        task_list_id: +req.params.id,
        total_tasks: tasks.length,
        done_tasks: tasks.filter(t => t.done).length
    });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`🔥 Сервер запущен на порту ${PORT}`));
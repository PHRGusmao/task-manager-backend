const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Task } = require('./sequelize');

const app = express();
const port = 8080;

const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        console.log('Tarefas retornadas:', tasks);
        res.json(tasks.map(task => task.toJSON()));
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        console.log('Dados recebidos:', req.body);

        const { title, description, completion_date, status } = req.body;

        if (!title || !description || !completion_date || status === undefined) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        const task = await Task.create({
            title,
            description,
            completion_date,
            status,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
});


app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        const { title, description, completion_date, status } = req.body;

        const validStatus = typeof status === 'boolean' ? status : task.status;

        await task.update({
            title: title || task.title,
            description: description || task.description,
            completion_date: completion_date || task.completion_date,
            status: validStatus
        });

        res.json(task);
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        await task.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        res.status(500).json({ error: 'Erro ao excluir tarefa' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

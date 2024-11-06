const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('task-edamatec', 'root', '', {
    host: 'localhost', 
    dialect: 'mysql',
    port: 3306  
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados bem-sucedida!');
    })
    .catch((error) => {
        console.error('Erro ao conectar ao banco de dados:', error);
    });

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completion_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false
    }    
}, {
    tableName: 'task',
    timestamps: false  
});


sequelize.sync()
    .then(() => console.log('Banco de dados sincronizado'))
    .catch(err => console.log('Erro ao sincronizar o banco de dados:', err));

module.exports = { sequelize, Task };

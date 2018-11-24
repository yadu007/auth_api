module.exports = function(sequelize, Sequelize) {
    return sequelize.define('users', {
        id: {
            type:          Sequelize.BIGINT,
            primaryKey:    true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(32)
        },
        email: {
            type: Sequelize.STRING(64)
        },
        password: {
            type: Sequelize.STRING(64)
        },
        created_at: {
            type: Sequelize.DATE
        },
    }, {
        indexes: [{
            unique: true,
            fields: ['email']
        }, {
            unique: false,
            fields: ['name']
        }]
    });
}
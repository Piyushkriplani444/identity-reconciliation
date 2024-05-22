'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('contacts', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            phoneNumber: {
                type: Sequelize.STRING,
                allowNull: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true
                // validate: {
                //     isEmail: true
                // }
            },
            linkedId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            linkPrecedence: {
                type: Sequelize.STRING
                // defaultValue: 'primary'
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false
            }
        });

        // await queryInterface.addIndex('users', ['email'], {
        //     indicesType: 'UNIQUE'
        // });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('contacts');
    }
};

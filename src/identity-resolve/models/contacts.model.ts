import { Model, Sequelize, DataTypes } from 'sequelize';
export default class Contacts extends Model {
    public id?: number;
    public phoneNumber?: string;
    public email?: string;
    public linkedId?: number;
    public linkPrecedence?: string;
}
module.exports = (sequelize: Sequelize) => {
    Contacts.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            phoneNumber: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING
            },
            linkedId: {
                type: DataTypes.INTEGER
            },
            linkPrecedence: {
                type: DataTypes.ENUM('primary', 'secondary'),
                defaultValue: 'primary'
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('NOW'),
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('NOW'),
                allowNull: false
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: 'contacts',
            timestamps: false
        }
    );
    return Contacts;
};

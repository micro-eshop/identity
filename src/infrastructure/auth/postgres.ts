import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from '@sequelize/core';
import { v4 as uuid } from 'uuid';
import { UserReader } from '../../core/repository/user';
import { genSalt, hashPassword } from './password';


class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    declare userId: string;
    declare username: string;
    declare email: string;
    declare password: string;
    declare salt: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    mapToUser() : User {
        return {
            userId: this.userId,
            username: this.username,
            email: this.email,
            password: this.password,
            salt: this.salt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
  }

export async function connect(connectionString: string): Promise<Sequelize> {
    const sequelize = new Sequelize(connectionString, { dialect: 'postgres' });
    await sequelize.authenticate();
    const user = UserModel.init({
        userId: DataTypes.UUID,
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        salt : DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
      }, { sequelize, modelName: 'user' });

      sequelize.sync();
      return sequelize;
}

export class PostgresUserReader implements UserReader {
    constructor(private sequelize: Sequelize) {}
    
    async findUser(username: string): Promise<User | null> {
        const user = await UserModel.findOne({ limit: 1, where: { username: username } });
        if (user !== null) {
            return user.mapToUser();
        }
        return null;
    }

    
}


export async function seed(db: Sequelize) {
    const defaultUser = await UserModel.findOne({ limit: 1, where: { username: 'test' } });
    if(defaultUser === null){
        const salt = await genSalt()
        const password = await hashPassword('test', salt)
        await UserModel.create({userId: uuid(), username: 'test', email: 'test@test.pl', password:password, salt: salt, createdAt: new Date(new Date().toUTCString()), updatedAt: new Date(new Date().toUTCString())})
    }
}
import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from '@sequelize/core';
import { string } from 'fp-ts';
import pino from 'pino';
import { v4 as uuid } from 'uuid';
import { CreateUser, UserReader, UserWriter } from '../../core/repository/user';
import { genSalt, hashPassword } from './password';


class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    declare userId: string;
    declare username: string;
    declare email?: string;
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

export async function connect(connectionString: string, logger: pino.Logger): Promise<Sequelize> {
    const sequelize = new Sequelize(connectionString, { dialect: 'postgres', logging: (msg) => logger.debug(msg) });
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

export class PostgresUserWriter implements UserWriter {
    constructor(private sequelize: Sequelize, private genSalt: () => Promise<string>, private hashPassword: (password: string, salt: string) => Promise<string>) {}
    
    async createUser(user: CreateUser): Promise<User> {
        const salt = await this.genSalt()
        const hash = await this.hashPassword(user.password, salt)
        const cmd = {userId: uuid(), username: user.username, email: user.email, password: hash, salt: salt, createdAt: new Date(new Date().toUTCString()), updatedAt: new Date(new Date().toUTCString())};
        await UserModel.create(cmd)
        return { userId: cmd.userId, username: cmd.username, email: cmd.email, password: user.password, salt: salt, createdAt: cmd.createdAt, updatedAt: cmd.updatedAt };
    }

}



export async function seed(reader: PostgresUserReader, writer: PostgresUserWriter) {
    const defaultUser = await reader.findUser('test');
    if(defaultUser === null){
        writer.createUser({username: 'test', password: 'test', email: "test@test.test"})
    }
}
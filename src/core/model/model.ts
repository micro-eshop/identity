
interface User {
    readonly userId: string;
    readonly username: string;
    readonly email?: string;
    readonly password: string;
    readonly salt: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
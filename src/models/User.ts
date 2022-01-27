import { knex } from "../dbConnection";

interface UserI {
    id: number;
    name: string;
    password: string;
    role: string;
}

interface UserNoIdI {
    name: string;
    password: string;
    role: string;
}

export class User {
    private id: number;
    public name: string;
    public password: string;
    public role: string;

    private constructor(id: number, name: string, password: string, role: string) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.role = role;
    }

    private static fromI(data: UserI) : User {
        return new User(data.id, data.name, data.password, data.role);
    }

    public static async findByName(name: string) : Promise<User | null> {
        const query = knex<UserI>('users').select("*").where({ name }).first();
        const p = await query;
        if(p) {
            return User.fromI(p);
        }
        else {
            return null;
        }
    }

    public async addUser(data : UserNoIdI) {
        const [res] = await knex<UserI>('users').insert(data).returning("*");
        return User.fromI(res);
    }
}

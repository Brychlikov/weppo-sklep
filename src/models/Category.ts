import { knex } from "../dbConnection";

interface CategoryI {
    id: number | null;
    name: string;
}

export class Category {
    private id: number;
    public name: string;

    private constructor(data: CategoryI) {
        if(data.id == null) {
            throw new Error ("Can't initialize Category without id");
        }
        this.id = data.id;
        this.name = data.name;
    }

    public static async createCategory(name: string) : Promise<Category> {
        const [res] = await knex<CategoryI>('products').insert({ name }).returning("*");
        return new Category(res);
    }

    public static async categoriesOf(productId: number) : Promise<Category[]> {
        const res = await knex('products').select("*").where({ product_id: productId }) as CategoryI[];
        const cats = res.map(d => new Category(d));
        return cats;
    }
}


import { knex } from "../dbConnection";
import { Category } from "./Category";

interface ProductI {
    id: number;
    name: string;
    price: number;
    description: string;
    img_url: string;
}

interface ProductNoIdI {
    name: string;
    price: number;
    description: string;
    img_url: string;
}

export class Product {
    public id: number;
    public name: string;
    public price: number;
    public description: string;
    public img_url: string;
    // public categories: Category[];

    private constructor(data: ProductI, categories: Category[]) {
        this.id = data.id;
        this.name = data.name;
        this.price = data.price;
        this.description = data.description;
        this.img_url = data.img_url;
        // this.categories = categories;
    }

    private static fromI(data: ProductI) : Product {
        return new Product(data, []);
    }


    public static async findByName(name: string) : Promise<Product | null> {
        const query = knex<ProductI>('products').select("*").where({ name }).first();
        const p = await query;
        if(p) {
            const cats = await Category.categoriesOf(p.id);
            return new Product(p, cats);
        }
        else {
            return null;
        }
    }

    public static async findById(id: number) : Promise<Product | null> {
        const query = knex<ProductI>('products').select("*").where({ id }).first();
        const p = await query;
        if(p) {
            // const cats = await Category.categoriesOf(p.id);
            return Product.fromI(p);
        }
        else {
            return null;
        }
    }

    public static async createProduct(data: ProductNoIdI) : Promise<Product> {
            const [res] = await knex<ProductI>('products').insert(data).returning("*");
            return Product.fromI(res);
    }

    // public async addCategory(categoryId: number) : Promise<void> {
    //     const q = await knex('product_categories').insert({ category_id: categoryId, product_id: this.id });
    // }


    // TODO This should be paginated, but we don't have 
    // enough products for this to be a problem anyway
    public static async getAll() : Promise<Product[]> {
        const res = await knex<ProductI>('products').select("*");
        return res.map(Product.fromI);
    }
}

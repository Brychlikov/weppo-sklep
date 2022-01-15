import { knex } from "../dbConnection";

interface ProductI {
    id: number;
    name: string;
    price: number;
    description: string;
    img_url: string;
}
export class Product {
    private id: number;
    public name: string;
    public price: number;
    public description: string;
    public img_url: string;

    private constructor(id: number, name: string, price: number, description: string, imgUrl: string) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.img_url = imgUrl;
    }

    private static fromI(data: ProductI) : Product {
        return new Product(data.id, data.name, data.price, data.description, data.img_url);
    }

    public static async findByName(name: string) : Promise<Product | null> {
        const query = knex<ProductI>('products').select("*").where({ name }).first();
        const p = await query;
        if(p) {
            return Product.fromI(p);
        }
        else {
            return null;
        }
    }


    // TODO This should be paginated, but we don't have 
    // enough products for this to be a problem anyway
    public static async getAll() : Promise<Product[]> {
        const res = await knex<ProductI>('products').select("*");
        return res.map(Product.fromI);
    }
}

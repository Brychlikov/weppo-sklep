import { knex } from "../dbConnection";

interface ProductI {
    id: number;
    name: string;
    img_url: string;
}
export class Product {
    private id: number;
    public name: string;
    public imgUrl: string;

    private constructor(id: number, name: string, imgUrl: string) {
        this.id = id;
        this.name = name;
        this.imgUrl = imgUrl;
    }

    public static async findByName(name: string) : Promise<Product | null> {
        const query = knex<ProductI>('products').select("*").where({ name }).first();
        const p = await query;
        if(p) {
            return new Product(p.id, p.name, p.img_url);
        }
        else {
            return null;
        }
    }
}

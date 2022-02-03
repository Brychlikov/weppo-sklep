import { Product } from "./Product";

export interface ProductWithCount {
    id: number;
    name: string;
    price: number;
    description: string;
    img_url: string;
    qt : number;
}

export class ProductWithCount {
    public id : number;
    public name: string;
    public price: number;
    public description: string;
    public img_url: string;

    public static async changeFromProduct(prod : Product, cnt : number) : Promise<ProductWithCount>{
        const ret = new ProductWithCount();
        ret.id = prod.id;
        ret.name = prod.name;
        ret.price = prod.price;
        ret.img_url = prod.img_url;
        ret.qt = cnt;
        return ret;
    }
}

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

    public static changeFromProduct(prod : Product, cnt : number) : ProductWithCount{
        const ret = new ProductWithCount();
        ret.id = prod.id;
        ret.name = prod.name;
        ret.price = prod.price;
        ret.img_url = prod.img_url;
        ret.qt = cnt;
        return ret;
    }

    public static async changeFromProductsId(data : string[]) : Promise<ProductWithCount[]>{
        const products = [];
        const pom = data.map(Number).sort((a: number, b: number) => (a < b ? -1 : ((a > b) ? 1 : 0)));
        let previous = -1;
        let cnt = 0;
        for (const prod_id of pom) {
            if(prod_id != previous && previous != -1){
                const prod = await Product.findById(previous);
                if(prod){
                    const prodWithCount = await ProductWithCount.changeFromProduct(prod, cnt);
                    products.push(prodWithCount);
                }
                cnt = 0;
            }
            cnt++;
            previous = prod_id;
        }
        if(previous != -1){
            const prod = await Product.findById(previous);
            if(prod){
                const prodWithCount = await ProductWithCount.changeFromProduct(prod, cnt);
                products.push(prodWithCount);
            }
        }
        return products;
    }

    public static getCostOfAllProducts (data : ProductWithCount[]) : number {
        let suma = 0;
        for(const x of data){
            suma += x.price*x.qt;
        }
        return suma;
    }
}

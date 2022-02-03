import { count } from "console";
import { knex } from "../dbConnection";
import { Product } from "./Product";
import { ProductWithCount } from "./ProductWithCount";


interface SingleProductI {
    id : number;
    user_id : number;
    order_id : number;
    product_id : number;
    count : number;
}

interface SingleProductNoIdI {
    user_id : number;
    order_id : number;
    product_id : number;
    count : number;
}

interface SingleProductNoOtherIds{
    product_id : number;
    count : number;
}

class SingleProduct {
    public id : number;
    public user_id : number;
    public order_id : number;
    public product_id : number;
    public count : number;

    private constructor(data: SingleProductI) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.order_id = data.order_id;
        this.product_id = data.product_id;
        this.count = data.count;
    }

    public static fromI(data: SingleProductI) : SingleProduct {
        return new SingleProduct(data);
    }

    public static SingleProductToSingleProductNoOtherIds(data : SingleProduct) : SingleProductNoOtherIds{
        let x : SingleProductNoOtherIds;
        x = { product_id : data.product_id, count : data.count}
        return x;
    }
}

export interface Order{
    id : number;
    user_id : number;
    // products : SingleProductNoOtherIds[];
    products : ProductWithCount[];
}
export class Order {
    public id : number;
    public user_id : number;
    // public products : SingleProductNoOtherIds[];
    public products : ProductWithCount[];
    public totalCost : number;

    private constructor(data: Order) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.products = data.products;
        this.totalCost = data.totalCost;
    }

    public static async findByUserId(user_id : number) : Promise<Order[] | null> {
        const res = await knex<SingleProductI>('orders').select("*").where({ user_id });
        if(res) {
            let ret : Order[];
            ret = [];
            res.map(SingleProduct.fromI);
            if(res.length == 0) return ret;
            const user_id = res[0].user_id;
            res.sort((a : SingleProductI, b : SingleProductI) =>{
                if(a.order_id < b.order_id) return -1;
                if(a.order_id > b.order_id) return 1;
                return 0;
            });
            let previous = -1;
            let singOrd : Order;
            singOrd = {id : -1, user_id : user_id, products : [], totalCost : 0};
            for (const sing of res) {
                if(sing.order_id != previous && previous != -1){;
                    ret.push(new Order(singOrd));
                    singOrd.products = [];
                    singOrd.totalCost = 0;
                }
                const prod = await Product.findById(sing.product_id);
                if(prod) singOrd.products.push(ProductWithCount.changeFromProduct(prod, sing.count));
                else return null;
                singOrd.totalCost += prod.price*sing.count;
                singOrd.id = sing.order_id;
                previous = sing.order_id;
            }
            ret.push(new Order(singOrd));
            return ret;
        }
        else {
            return null;
        }
    }

    public static async createOrder(data: Order) : Promise<Order | null> {
        for(const el of data.products){
            let dod : SingleProductNoIdI;
            dod = { order_id : data.id, product_id : el.id, user_id : data.user_id, count : el.qt };
            const [x] = await knex<SingleProductI>('orders').insert(dod).returning("*");
            if(!x) return null;
        }
        return data;
    }

    public static async getAll() : Promise<Order[] | null> {
        const res = await knex<SingleProductI>('orders').select("*");
        if(res) {
            let ret : Order[];
            ret = [];
            res.map(SingleProduct.fromI);
            res.sort((a : SingleProductI, b : SingleProductI) =>{
                if(a.order_id < b.order_id) return -1;
                if(a.order_id > b.order_id) return 1;
                return 0;
            });
            let previous = -1;
            let singOrd : Order;
            singOrd = {id : -1, user_id : -1, products : [], totalCost : 0};
            for (const sing of res) {
                if(sing.order_id != previous && previous != -1){;
                    ret.push(new Order(singOrd));
                    singOrd.products = [];
                    singOrd.totalCost = 0;
                }
                const prod = await Product.findById(sing.product_id);
                if(prod) singOrd.products.push(ProductWithCount.changeFromProduct(prod, sing.count));
                else return null;
                singOrd.totalCost += prod.price*sing.count;
                singOrd.id = sing.order_id;
                singOrd.user_id = sing.user_id;
                previous = sing.order_id;
            }
            ret.push(new Order(singOrd));
            return ret;
        }
        else {
            return [];
        }
    }

    public static async getMaxIdOrder() : Promise<number>{
        const res = await knex<SingleProductI>('orders').select("*")
        let maks = 1;
        if(res){
            res.map(SingleProduct.fromI);
            for(const el of res){
                if(el.order_id > maks) maks = el.order_id;
            }
        }
        return maks;
    }
}

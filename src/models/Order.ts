import { knex } from "../dbConnection";


interface OrderI {
    id : number;
    user_id : number;
    order_id : number;
    product_id : number;
    count : number;
}

interface OrderNoIdI {
    user_id : number;
    order_id : number;
    product_id : number;
    count : number;
}

export class Order {
    public id : number;
    public user_id : number;
    public order_id : number;
    public product_id : number;
    public count : number;

    private constructor(data: OrderI) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.order_id = data.order_id;
        this.product_id = data.product_id;
        this.count = data.count;
    }

    private static fromI(data: OrderI) : Order {
        return new Order(data);
    }


    public static async findByUserId(user_id : number) : Promise<Order[] | null> {
        const res = await knex<OrderI>('orders').select("*").where({ user_id });
        if(res) {
            return res.map(Order.fromI);
        }
        else {
            return null;
        }
    }

    public static async createOrder(data: OrderNoIdI[]) : Promise<Order[]> {
        const res = [];
        for(const x of data){
            const [x] = await knex<OrderI>('orders').insert(data).returning("*");
            res.push(x);
        }
        return res.map(Order.fromI);
    }

    // public static async getAll() : Promise<Order[][]> {
        //TODO
    // }
}

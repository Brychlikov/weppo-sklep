import { Request, Response } from "express";
import express from "express";
import { ProductWithCount } from "../models/ProductWithCount";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { User } from "../models/User";

export const checkoutRouter = express.Router();

checkoutRouter.get("/", async (req: Request, res: Response) => {
    const user = await User.findByName(req.signedCookies.user);
    res.render("checkout.ejs", {
        user: user,
        url: "/checkout",
        cart_item_count: req.signedCookies.cart_item_count,
    });
});

checkoutRouter.post("/", async (req: Request, res: Response) => {

    const [name, family_name, address_line1, address_line2, city, postal_code, phone] = 
    [req.body.given_name, req.body.family_name, req.body["address-line1"], req.body["address-line2"], req.body.city, 
    req.body["postal-code"], req.body.phone];
    const terms = req.body.terms ? 1 : 0;
    const terms2 = req.body.terms2 ? 1 : 0;
    
    const errors = 0;
    if(errors){

    }

    const products = await ProductWithCount.changeFromProductsId(req.signedCookies.cart);
    const sum = ProductWithCount.getCostOfAllProducts(products);
    const user = await User.findByName(req.signedCookies.user);
    let order_count = await Order.getMaxIdOrder();
    order_count++;
    let order : Order;
    if(user) order = {id : order_count, user_id : user.id, products : [], totalCost : ProductWithCount.getCostOfAllProducts(products)};
    else{
         res.redirect("/checkout"); // message
         order = {id : order_count, user_id : 0, products : [] , totalCost : 0} // bo krzyczy niżej, a to i tak nieuzywane.
    }
    for(const prod of products){
        order.products.push(prod);
    }
    Order.createOrder(order);
    res.cookie("cart", [], {signed : true});
    res.cookie("cart_item_count", 0, {signed : true});
    res.redirect("/");
});
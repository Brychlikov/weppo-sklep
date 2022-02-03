import { Request, Response } from "express";
import express from "express";
import { ProductWithCount } from "../models/ProductWithCount";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { emit } from "process";

export const checkoutRouter = express.Router();

checkoutRouter.get("/", async (req: Request, res: Response) => {
    const user = await User.findByName(req.signedCookies.user);
    res.render("checkout.ejs", {
        user: user,
        url: "/checkout",
        cart_item_count: req.signedCookies.cart_item_count,
        message : req.query.message,
    });
});

function validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePostalCode(postalCode : string) :boolean{
    return /^([0-9]{2}-[0-9]{3})$/.test(postalCode);
}
function validatePhone(phone : string) :boolean{
    const re = /^\+?\d{9,12}/
    return re.test(phone);
}
checkoutRouter.post("/", async (req: Request, res: Response) => {

    const [name, family_name, address_line1, address_line2, city, postal_code, phone, email] = 
    [req.body.given_name, req.body.family_name, req.body["address-line1"], req.body["address-line2"], req.body.city, 
    req.body["postal-code"], req.body.phone, req.body.email];
    if(!validateEmail(email)){
        res.redirect("/checkout?message=Niepoprawny email");
        return;
    }
    if(!validatePostalCode(postal_code)){
        res.redirect("/checkout?message=Niepoprawny kod pocztowy");
        return;
    }
    if(!validatePhone(phone)){
        res.redirect("/checkout?message=Niepoprawny numer telefonu");
        return;
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
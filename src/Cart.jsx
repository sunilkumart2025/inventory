//Cart.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
function Cart(props){
    const grandTotal = props.cartArray.reduce((total, item) => {
        return total + (item.quantity * item.selling_price);
    }, 0 );
    const total = props.cartArray.reduce((tot, item) => {
        return tot + (item.quantity * item.cost_price);
    }, 0);
    return(
        <div>
            <h1>Cart Items</h1>
            <table>
                <tr>
                    <th>S.No</th>
                    <th>Product Name</th>
                    <th>HSN Code</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Cost Per Item</th>
                </tr>
                {props.cartArray.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.hsn_code}</td>
                        <td><button onClick={() => props.reduceQuantity(item.id)}>-</button><input type="number" onChange={(e) => props.customQuantity(item.id, e.target.value)} value={item.quantity}/><button onClick={() => props.increaseQuantity(item.id)}>+</button></td>
                        <td>{item.selling_price}</td>
                        <td>{item.quantity * item.selling_price}</td>
                    </tr>
                ))}
            </table>
                <h3>Total : {total.toFixed(2)}</h3>
                <h4>Discount Amount : {(total - grandTotal).toFixed(2)}</h4>
                <h3>Grand Total : {(grandTotal).toFixed(2)}</h3>
            <Link to='/products'>Add More</Link>
            <br/>
            <Link to="/checkout">CheckOut Products</Link>
        </div>
    );
}
export default Cart
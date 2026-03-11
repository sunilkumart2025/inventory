//AddProduct.jsx
import './App.css';
import { supabase } from './suparbaseClient';
import { useState } from 'react';
import { Link } from 'react-router-dom';
function AddProduct(){
    const [name, setName] = useState("");
    const [hns, setHns] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [selling, setSelling] = useState(0);
    const [quantity, setQuantity] = useState(1);
    async function addProduct(){
        try{
            const {data, error} = await supabase
                .from("products")
                .insert([{name:name, hsn_code: hns, category:category, unit_type: type, cost_price: price, selling_price:selling, discount_percent: discount, stock_quantity:quantity}])
                .select()
            if(error) throw error;
            alert("Product Added Successfully!");
            setName("");
            setHns("");
            setCategory("");
            setPrice(0);
            setDiscount(0);
            setSelling(0);
            setQuantity(1);
        }
        catch(error){
            alert(error.message);
        }

    }
    return(
        <div>
            <Link to='/'>Home</Link>
            <Link to='/profile'>Profile</Link>
            <br/>
            <h2>Add Your New Products</h2>
            <label>Product Name : </label>
            <input value={name} onChange={(e) => setName(e.target.value)}/>
            <br></br>
            <label>Give the HNS Code : </label>
            <input value={hns} onChange={(e) => setHns(e.target.value)}/>
            <br></br>
            <label>Product Category : </label>
            <input value={category} onChange={(e) => setCategory(e.target.value)}/>
            <br></br>
            <label>Unit Type : </label>
            <select onChange={(e) => setType(e.target.value)}>
                <option value="kg">Kg</option>
                <option value="pcs">Pices</option>
                <option value="pkt">Packets</option>
            </select>
            <br></br>
            <label>Cost per Unit : </label>
            <input type='number' value={price} onChange={(e) => {
                setPrice(e.target.value);
                const currentPrice = Number(e.target.value);
                const currentDiscount = Number(discount);
                const disAmount = (currentPrice * currentDiscount) / 100;
                const finalValue = currentPrice - disAmount;
                setSelling(finalValue);
                }}/>
            <br></br>
            <label>Disount on each Unit in %: </label>
            <input type='number' min={1} max={100} value={discount} onChange={(e) => {
                setDiscount(e.target.value);
                const currentPrice = Number(price);
                const currentDiscount = Number(e.target.value);
                const disAmount = (currentPrice * currentDiscount) / 100;
                const finalValue = currentPrice - disAmount;
                setSelling(finalValue);
                }}/>
            <br></br>
            <label>Selling Price : {selling}</label>
            <br></br>
            <label>Stock Quantity : </label>
            <input value={quantity} type="number" min={1} onChange={(e) => setQuantity(e.target.value)}/>
            <br/>

            <button onClick={addProduct}>Add Product</button>
        </div>
    );
}
export default AddProduct
//Stock.jsx
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./suparbaseClient";
import './App.css'
import html2pdf from "html2pdf.js";
function Stock(){
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [editStyle, setEditStyle] = useState("edit-popup-close");
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [hns, setHns] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [selling, setSelling] = useState(0);
    const [quantity, setQuantity] = useState(1);
    useEffect(() => {
        getProducts();
    }, []);
    async function getProducts(){
        try{
            const {data, error} = await supabase
                .from("products")
                .select("*")
            if(data){
                setProducts(data);
            }
            if(error) throw error;
        }
        catch(error){
            alert(error.message);
        }
    }
    const filtered = products.filter((item) => {
        return(
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase()) ||
            item.hsn_code.toLowerCase().includes(search.toLowerCase())
        )
    });
    const totalStockPrice = products.reduce((total, item) => {
        return total + item.cost_price * item.stock_quantity;
    },0);
    const totalDiscount = products.reduce((total, item) => {
        return total +  item.selling_price * item.stock_quantity;
    },0);
    const totalQuantity = products.reduce((total, item) => {
        return total + item.stock_quantity;
    },0);
    const openEditForm = () => {
        setEditStyle("edit-popup-open");
    };
    const closeEditForm = () => {
        setEditStyle("edit-popup-close");

    };
    async function updataeChanges(){
        try{
            const confirmUpdate = window.confirm("Are you sure you want to Update this product?");
            if (!confirmUpdate) return;
            const {data, error} = await supabase
            .from("products")
            .update({name: name, hsn_code: hns, category: category, unit_type: type, cost_price:price, selling_price:selling, discount_percent: discount, stock_quantity: quantity})
            .eq('id', id)
            if(error) throw error;
            setEditStyle("edit-popup-close");
            getProducts();
        }
        catch(error){
            alert(error.message);
        }
    }
    return(
        <div>
            <lable>Search : </lable>
            <input value={search} onChange={(e) => {
                setSearch(e.target.value);
                }
            } placeholder="Search hear.."/>
            {filtered.map((item) => <div key={item.id}>
                    <h3>Name : {item.name}</h3>
                    <h4>HSN Code : {item.hsn_code}</h4>
                    <p>Category : {item.category}</p>
                    <p>Selling Price :  ₹ <span style={{textDecoration: 'line-through'}}>{item.cost_price} </span> {item.selling_price}</p>
                    <p>Avalible Quantity : {item.stock_quantity}</p>
                    <p>Comparative Stock in % : {(item.stock_quantity * 100 / totalQuantity).toFixed(2)}</p>
                    <button onClick={() => {
                        openEditForm();
                        setId(item.id);
                        setName(item.name);
                        setHns(item.hsn_code);
                        setPrice(item.cost_price);
                        setCategory(item.category);
                        setType(item.unit_type);
                        setDiscount(item.discount_percent);
                        setQuantity(item.stock_quantity);
                    }}>Edit</button>
                    <button>Delete</button>
                </div>)}
            <div className={editStyle}>
                <h2>Update the Product</h2>
                <table>
                    <tr>
                        <th>Field</th>
                        <th>Discription</th>
                    </tr>
                    <tr>
                        <td>Name : </td>
                        <td><input value={name} onChange={(e) => setName(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>HSN Code : </td>
                        <td><input value={hns} onChange={(e) => setHns(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>Category : </td>
                        <td><input value={category} onChange={(e) => setCategory(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>Unit Type : </td>
                        <td>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value='pcs'>pcs</option>
                                <option value='kg'>kg</option>
                                <option value='pkt'>pkt</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>MRP : </td>
                        <td><input value={price} onChange={(e) => {
                            setPrice(e.target.value);
                            const sell = e.target.value - (discount*e.target.value/100);
                            setSelling(sell);
                        }}/></td>
                    </tr>
                    <tr>
                        <td>Discount in % : </td>
                        <td><input value={discount} onChange={(e) => {
                            setDiscount(e.target.value);
                            const sell = price - (e.target.value*price/100);
                            setSelling(sell);
                        }}/></td>
                    </tr>
                    <tr>
                        <td>Selling Price : </td>
                        <td>{price - (discount*price / 100)}</td>
                    </tr>
                    <tr>
                        <td>Quantity : </td>
                        <td><input value={quantity} onChange={(e) => setQuantity(e.target.value)}/></td>
                    </tr>
                </table>
                <button onClick={closeEditForm}>Close</button>
                <button onClick={updataeChanges}>Update Changes</button>
            </div>
            <h2>Total Stock Price : {totalStockPrice}</h2>
            <p>Overall Discount : ₹ {(totalStockPrice - totalDiscount).toFixed(2)} or {((totalStockPrice - totalDiscount) * 100 / totalStockPrice).toFixed(2)} %</p>
            <h2>After Gross Stock Price : {(totalDiscount).toFixed(2)}</h2>
            <br/>
            <Link to='/'>Home Page</Link>
            <br/>
            <Link to='/cart'>Cart</Link>
        </div>
    );
}
export default Stock
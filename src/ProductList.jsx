//ProductList.jsx
import { useEffect,useState } from "react";
import { supabase } from "./suparbaseClient";
import { Link } from "react-router-dom";
function ProductList(props){
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
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
                    <button onClick={() => props.addToCart(item)}>Add to Cart</button>
                    <br/>
                </div>)}
            <br/>
            <Link to='/'>Home Page</Link>
            <br/>
            <Link to='/cart'>Cart</Link>
        </div>
    );
}
export default ProductList
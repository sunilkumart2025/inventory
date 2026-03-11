//SalesHistory.jsx
import './Salse.css';
import { supabase } from '../suparbaseClient.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
function SalesHistory(){
    const [invoice, setInvoice] = useState([]);
    const [invoiceItem, setInvoiceItem] = useState([]);
    const [selected_invoice, setSelected_invoice] = useState("");
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [invoice_no, setInvoice_no] = useState("");
    const [customer_name, setCustomer_name] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [shipAddress1, setShipAddress1] = useState("");
    const [shipAddress2, setShipAddress2] = useState("");
    const [shipState, setShipState] = useState("");
    const [shipPincode, setShipPincode] = useState("");
    useEffect(() => {
        if(selected_invoice){
            getInvoiceItem();
        }
        getData();
    },[selected_invoice]);
    async function getData(){
        try{
            const {data, error} = await supabase
                .from("invoices")
                .select(` id,
                        invoice_no,
                        total_amount,
                        tax_amount,
                        payment_method,
                        payment_status,
                        amount_paid,
                        balance_due,
                        cgst,
                        sgst,
                        customers(
                            name,
                            phone,
                            address1,
                            address2,
                            state,
                            pincode,
                            email,
                            ship_state,
                            ship_address1,
                            ship_address2,
                            ship_pincode
                        )

                    `)
            if(error) throw error;
            if(data){
                setInvoice(data || []);
            }
        }
        catch(error){
            alert(error.message);
        }
    }

    async function getInvoiceItem(){
        try{
            const{data,error} =await supabase
                .from("invoice_items")
                .select(`id, quantity,
                    unit_price,
                    unit_price_at_sale,
                    discount_applied,
                    unit_cgst,
                    total_cgst,
                    unit_sgst,
                    total_sgst,
                    line_total,
                    products(
                    name,
                    hsn_code,
                    category,
                    unit_type
                    )`
                )
                .eq('invoice_id', selected_invoice);
            if(error) throw error;
            if(data){
                setInvoiceItem(data);
            }
        }
        catch(error){
            alert(error.message);
        }
    }
    const total_revenue = invoice.reduce((total, item) => {
        return total + item.total_amount;
    },0);
    const outstanding_due = invoice.reduce((total, item) => {
        return total + item.balance_due;
    },0);
    const tax_collected = invoice.reduce((total, item) => {
        return total + item.cgst + item.sgst ;
    },0);
    const filtered =invoice.filter((item) => {
        return (item.invoice_no?.toString() || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.customers.name?.toString() || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.customers.phone?.toString() || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.customers.address1?.toString() || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.customers.address2?.toString() || "").toLowerCase().includes(search.toLowerCase())
    });
    return(
        <div>
            <div>
                <button>Last One Month</button>
                <button>Last 7 Days</button>
                <button>Last 24 Hours</button>
            </div>
            <div >
                <div>
                    <h3>Total Revenue</h3>
                    <h4>{((total_revenue).toFixed(2))}</h4>
                </div>
                <div>
                    <h3>Outstanding Dues</h3>
                    <h4>{((outstanding_due).toFixed(2))}</h4>
                </div>
                <div>
                    <h3>Tax Collected</h3>
                    <h4>{((tax_collected).toFixed(2))}</h4>
                </div>
            </div>
            <input placeholder='Search Hear...' onChange={(e) => setSearch(e.target.value)}/>
            <div>
                <div className=''>
                    <h3>Pending Bills</h3>
                    {filtered.length == 0 ? 
                        <div>
                            <h4>No Record Found</h4>
                        </div>
                        :
                        <div>
                            <h4>{filtered.length} records found</h4>
                        </div>
                    }
                    <div>
                        {filtered.filter((item) => item.balance_due > 0).map((item) => (
                            <div className='pending-outer-box'>
                                <div>
                                    <h4>Invoice No: {item.invoice_no}</h4>
                                    <p>Name : {item.customers.name}</p>
                                    <p>Remaining Amount: {item.balance_due} - {(item.balance_due*100 / item.total_amount).toFixed(2)} %</p>
                                </div>
                                <div className='view-detials'>
                                    <button onClick={()=> {
                                        setSelected_invoice(item.id);
                                        setIsViewOpen(!isViewOpen);
                                        setInvoice_no(item.invoice_no);
                                        setCustomer_name(item.customers.name);
                                        setAddress1(item.customers.address1);
                                        setAddress2(item.customers.address2);
                                        setPincode(item.customers.pincode);
                                        setState(item.customers.state);
                                        setPhone(item.customers.phone);
                                        setEmail(item.customers.email);
                                        setShipAddress1(item.customers.ship_address1);
                                        setShipAddress2(item.customers.ship_address2);
                                        setShipState(item.customers.ship_state);
                                        setShipPincode(item.customers.ship_pincode);
                                        }}>View Detials</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <h3>Complted Bills</h3>
                {filtered.filter(item => item.balance_due == 0).map((item) => (
                    <div>
                        <h3>Name : {item.customers.name}</h3>
                    </div>
                ))
                }
                <div>
                    <button onClick={() => setIsOpen(!isOpen)}>Open</button>
                </div>
                
                
                {isViewOpen && (
                    <div className='modal-overlay'>
                        <div  className='modal-content'>
                            <h2>Invoice Information</h2>
                            <h3>Invoice No : {invoice_no}</h3>
                            <p>Customer Name : {customer_name}</p>
                            <div className='address-field'>
                                <div>
                                    <p>Address :</p>
                                </div>
                                <div>
                                    <p>{address1}</p>
                                    <p>{address2}</p>
                                    <p>{state} - {pincode}</p>
                                </div>
                            </div>
                            <p>Email ID : {email}</p>
                            <p>Phone No : {phone}</p>
                            <h3>Shipping Detials </h3>
                            <div className='address-field'>
                                <div>
                                    <p>Address :</p>
                                </div>
                                <div>
                                    <p>{shipAddress1 || "NA"}</p>
                                    <p>{shipAddress2 || "NA"}</p>
                                    <p>{shipState|| "NA"} - {shipPincode || "NA"}</p>
                                </div>
                            </div>
                            <div>
                                <table>
                                    <tr>
                                        <th>S. No</th>
                                        <th>Product Name</th>
                                        <th>HSN/ SAC</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Soled Price</th>
                                        <th>CGST</th>
                                        <th>SGST</th>
                                        <th>Total</th>
                                    </tr>
                                    {invoiceItem.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1 }</td>
                                            <td>{item.products?.name}</td>
                                            <td>{item.products?.hsn_code}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.unit_price}</td>
                                            <td>{item.unit_price_at_sale}</td>
                                            <td>{item.total_cgst || "Nil"}</td>
                                            <td>{item.total_sgst || "Nil"}</td>
                                            <td>{item.gross_total}</td>
                                        </tr>
                                    ))}
                                </table>
                            </div>
                            <p>Taxable Value</p>
                            <p>Tax Amount : </p>
                            <p>Gross Total : </p>
                            <button className='close-btn' onClick={() => setIsViewOpen(!isViewOpen)}> Close</button>
                            <button>Update Invoice</button>
                            <button>Download Invoice</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default SalesHistory
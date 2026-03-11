//CheckOut.jsx
import './App.css';
import {supabase} from './suparbaseClient.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import {QRCodeSVG } from 'qrcode.react';
import React from 'react'; 
function CheckOut(probs){
    const [profile, setProfile]= useState([]);
    const [cgst, setCgst] = useState(0);
    const [sgst, setSgst] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [payStatus, setPayStatus] = useState("Unpaid");
    const [payMethod, setPayMethod] = useState("Cash");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email,setEmail] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [shipAddress1, setShipAddress1] = useState("");
    const [shipAdress2, setShipAdress2] = useState("");
    const [shipState, setShipState] = useState("");
    const [shipPincode, setShipPincode] = useState("");
    const [invoiceNo, setInvoiceNo] = useState();
    useEffect(()=> {
        getStoreDetials();
        getInvoiceNo();
    },[]);
    async function getStoreDetials(){
        try{
            const {data, error} = await supabase
            .from("store_details")
            .select("*")
            .single()
            if(data){
                setProfile(data);
                console.log(profile);
            }
            if(error) throw error;
        }
        catch(error){
            alert(error.message);
        }
        
    }
    async function getInvoiceNo(){
        try{
            const {data, error} = await supabase
            .from("invoices")
            .select("invoice_no")
            .order("invoice_no" ,{ascending: false})
            .limit(1)
            .single();
            if(error) throw error;
            if(data){
                setInvoiceNo(Number(data.invoice_no) + 1);
            }
            else{
                setInvoiceNo(1);
            }
        }
        catch(error){
            alert(error.message);
        }
    }
    function downloadPDF() {
        const element = document.getElementById("invoice-content");
        const options = {
            margin: 0, // Set to 0 because padding is already in your CSS
            filename: `Invoice_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                letterRendering: true,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // New logic: Ensure the element is visible and has height before capture
        html2pdf().set(options).from(element).save();
    }
    const total = probs.out.reduce((tot, item) => {
        return tot + (item.selling_price * sgst * item.quantity) + (item.selling_price * cgst * item.quantity) + item.selling_price;
    },0);
    const taxable_total = probs.out.reduce((total, item) => {
        return total + Number(item.selling_price) * Number(item.quantity);
    },0);
    const cgst_total = probs.out.reduce((total, item) => {
        return total + ((item.selling_price * cgst * item.quantity) / 100);
    },0);
    const sgst_total = probs.out.reduce((total, item) => {
        return total + ((item.selling_price * sgst * item.quantity) / 100);
    },0);
    async function createOrder(){
        try{
            const{data : customer, error: coError} = await supabase
            .from("customers")
            .insert([{
                name: name,
                phone: phone,
                address1: address1,
                address2 : address2,
                state: state,
                pincode: pincode,
                ship_address1: shipAddress1,
                ship_address2 : shipAdress2,
                ship_state: shipState,
                ship_pincode: shipPincode,
                email: email
            }])
            .select()
            .single()
            if(coError) throw coError;

            const{data : invoice, error: invError} = await supabase
            .from("invoices")
            .insert([{
                customer_id:customer.id,
                invoice_no: invoiceNo,
                total_amount: taxable_total + cgst_total + sgst_total,
                tax_amount:taxable_total,
                payment_method: payMethod,
                payment_status:payStatus,
                amount_paid:paidAmount,
                balance_due: taxable_total + cgst_total + sgst_total - Number(paidAmount)
            }])
            .select()
            .single()

            if(invError) throw invError;
            
            const itemToInsert = probs.out.map((item) => ({
                invoice_id: invoice.id,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.cost_price,
                unit_price_at_sale: item.selling_price,
                discount_applied: item.discount_percent,
                unit_cgst: ((item.selling_price * cgst ) / 100),
                total_cgst: ((item.selling_price * cgst * item.quantity) / 100),
                unit_sgst: ((item.selling_price * sgst) / 100),
                total_sgst: ((item.selling_price * sgst * item.quantity) / 100),
                line_total: item.quantity * item.cost_price,
                total_tax: (((item.selling_price * cgst * item.quantity) / 100) + ((item.selling_price * sgst * item.quantity) / 100)),
                gross_total: ((item.selling_price * item.quantity) + ((item.selling_price * sgst * item.quantity) / 100) + ((item.selling_price * sgst * item.quantity) / 100))
            }));

            const{error: itError} =await supabase
            .from("invoice_items")
            .insert(itemToInsert)

            if(itError) throw itError;
            downloadPDF();
            alert("Order Created");
        }
        catch(error){
            alert(error.message);
        }
    }

    function numberToWords(num) {
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return ''; 
        let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees Only' : 'Rupees Only';
        return str;
    }
    return(
        <div>
            <h2>CheckOut Products</h2>
            <table>
                <tr>
                    <th>Coustomer Detials</th>
                    <th>Values</th>
                </tr>
                <tr>
                    <td>Name</td>
                    <td><input value={name} onChange={(e) => setName(e.target.value)}/></td>
                </tr>
                <tr>
                    <td>Address Line 1</td>
                    <td><input value={address1} onChange={(e) => setAddress1(e.target.value)}/></td>
                </tr>
                <tr>
                    <td>Address Line 2</td>
                    <td value={address2} onChange={(e) => setAddress2(e.target.value)}><input/></td>
                </tr>
                <tr>
                    <td>State</td>
                    <td ><input value={state} onChange={(e) => setState(e.target.value)}/></td>
                </tr>
                <tr>
                    <td>Pincode</td>
                    <td ><input value={pincode} type='number' onChange={(e) => {if(e.target.value.length <= 6)setPincode(e.target.value)}}/></td>
                </tr>
                <tr>
                    <td>Phone No</td>
                    <td><input type='number' value={phone} onChange={(e) => {if(e.target.value.length <11) setPhone(e.target.value)}}/></td>
                </tr>
                <tr>
                    <td>Email </td>
                    <td><input type='email' value={email} onChange={(e) => setEmail(e.target.value)}/></td>
                </tr>
                <label>Same as Personal<input type='checkbox' onChange={(e) => {
                    if(e.target.checked){
                        setShipAdress2(address2);
                        setShipAddress1(address1);
                        setShipPincode(pincode);
                        setShipState(state);
                    }
                    else{
                        setShipAddress1("");
                        setShipAdress2("");
                        setShipPincode("");
                        setShipState("");
                    }

                }}/></label>
                <tr>
                    <th>Shipping Data</th>
                    <th >Values</th>
                </tr>
                <tr>
                    <td>Shipping address 1</td>
                    <input value={shipAddress1} onChange={(e) => setShipAddress1(e.target.value)}/>
                </tr>
                <tr>
                    <td>Shipping address 2</td>
                    <input value={shipAdress2} onChange={(e) => setShipAdress2(e.target.value)}/>
                </tr>
                <tr>
                    <td>Shapping State</td>
                    <td><input value={shipState} onChange={(e) => setShipState(e.target.value)}/></td>
                </tr>
                <tr>
                    <td>Pincode</td>
                    <td><input type='number' value={shipPincode} onChange={(e) => setShipPincode(e.target.value)}/></td>
                </tr>
            </table>
            <div>
                <h3>Billing Information</h3>
                <h4>Store Name: {profile.store_name}</h4>
                <p>GSTIN no.{profile.gstin}</p>
                <p>CGST : <input onChange={() => {
                    const cgstValue = Number(profile.default_cgst_percent);
                    if(cgst == 0){
                        setCgst(cgstValue);
                    }
                    else{
                        setCgst(0);
                    }
                }} type='checkbox'/> {cgst} </p>
                <p>SGST : <input onChange={() => {
                    const sgstValue = Number(profile.default_sgst_percent);
                    if(sgst == 0){
                        setSgst(sgstValue);
                    }
                    else{
                        setSgst(0);
                    }
                }} type='checkbox'/> {sgst} </p>
            </div>
            <table >
                <tr>
                    <th>S. No</th>
                    <th>Item Description</th>
                    <th>HSN/SAC</th>
                    <th>Quantity</th>
                    <th>Product Cost</th>
                    <th>Discount in %</th>
                    <th>Taxable Value</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Amount</th>
                </tr>
                <br/>
                {probs.out.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.hsn_code}</td>
                        <td>{item.quantity} {item.unit_type}</td>
                        <td>{(item.cost_price).toFixed(2)}</td>
                        <td>{(item.discount_percent).toFixed(2)}</td>
                        <td>{(item.selling_price * item.quantity).toFixed(2)}</td>
                        <td>{((item.selling_price * cgst * item.quantity) / 100).toFixed(2)}</td>
                        <td>{((item.selling_price * sgst * item.quantity) / 100).toFixed(2)}</td>
                        <td>{((item.selling_price * sgst * item.quantity) + (item.selling_price * cgst * item.quantity) + item.selling_price).toFixed(2)}</td>
                    </tr>
                ))}
                <br/>
                <tr>
                    <th></th>
                    <th>Total</th>
                    <th></th>
                    <th></th>
                    <th>{(total).toFixed(2)}</th>
                    <th></th>
                    <th>{(taxable_total).toFixed(2)}</th>
                    <th>{(cgst_total).toFixed(2)}</th>
                    <th>{(sgst_total).toFixed(2)}</th>
                    <th>{(taxable_total + cgst_total + sgst_total).toFixed(2)}</th>
                </tr>
            </table>
            <br/>
            <label>Payment Method</label>
            <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Card">Card</option>
                <option value="Other">Others</option>
            </select>
            <br/>
            <label>Payment Status : </label>
            <select value={payStatus} onChange={(e) => setPayStatus(e.target.value)}>
                <option value='Paid'>Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
            </select>
            <br/>
            <label>PaidAmount</label>
            <input max={taxable_total + cgst_total + sgst_total} value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} type="number"/>
            <br/>
            <label>Balance Amount : {(taxable_total + cgst_total + sgst_total - Number(paidAmount)).toFixed(3)}</label>
            <br/>
            <button onClick={createOrder} >Save & Print</button>
            <br/>
            <Link to='/cart'>Missed Something</Link>

            <br/>
            <div className='very-outer-hide'>
                <div id='invoice-content'>
                    <div className='for-boder'>
                        <div className="invoice-main-body">
                            <div>
                                <div className='inner-top-section'>
                                    <div className='inner-top-left'>
                                        <div className='inner-top-left-first'>
                                            <h3>Seller</h3>
                                            <h4>{profile.store_name}</h4>
                                            <p>{profile.address1}</p>
                                            <p>{profile.address2}</p>
                                            <p>{profile.state} - {profile.pincode}</p>
                                            <p>Mail - {profile.email}</p>
                                            <p>Phone No : {profile.phone_number}</p>
                                            <p>GSTIN : {profile.gstin}</p>
                                        </div>
                                        <div className='inner-top-left-second'>
                                            <h3>Billed To</h3>
                                            <h4>{name}</h4>
                                            <p>{address1}</p>
                                            <p>{address2}</p>
                                            <p>{state}-{pincode}</p>
                                            <p>Phone No. {phone}</p>
                                            <p>Mail - {email}</p>
                                        </div>
                                    </div>
                                    <div className='inner-top-right'>
                                        <div>
                                            <div style={{ textAlign: 'center', fontSize: '20px', textTransform: 'uppercase' }}>
                                                <strong>Tax Invoice</strong><br/>
                                                <small>(Original for Recipient)</small>
                                            </div>
                                            <h4>Invoice No : {invoiceNo}</h4>
                                            <p>Issue Date : {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className='inner-top-right-second'>
                                            <h3>Ship To</h3>
                                            <p>{shipAddress1}</p>
                                            <p>{shipAdress2}</p>
                                            <p>{shipState} - {shipPincode}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <table className="invoice-table">
                                        <tr>
                                            <th>S. No</th>
                                            <th>Item Description</th>
                                            <th>HSN / SAC</th>
                                            <th>QTY</th>
                                            <th>Item Cost</th>
                                            <th>Discount per unit</th>
                                            <th>Taxable Value</th>
                                            <th>CGST (₹)</th>
                                            <th>SGST (₹)</th>
                                            <th>Amount (₹)</th>
                                        </tr>
                                        <br/>
                                        {probs.out.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.hsn_code}</td>
                                                <td>{item.quantity} {item.unit_type}</td>
                                                <td>{(item.cost_price).toFixed(2)}</td>
                                                <td>{(item.discount_percent * item.cost_price /100).toFixed(2)}  ({(item.discount_percent).toFixed(2)} %)</td>
                                                <td>{(item.selling_price * item.quantity).toFixed(2)}</td>
                                                <td>{((item.selling_price * cgst * item.quantity) / 100).toFixed(2)}</td>
                                                <td>{((item.selling_price * sgst * item.quantity) / 100).toFixed(2)}</td>
                                                <td>{((item.selling_price * sgst * item.quantity) + (item.selling_price * cgst * item.quantity) + item.selling_price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <br/>
                                        <tr>
                                            <th></th>
                                            <th>Total</th>
                                            <th></th>
                                            <th></th>
                                            <th>{(total).toFixed(2)}</th>
                                            <th></th>
                                            <th>{(taxable_total).toFixed(2)}</th>
                                            <th>{(cgst_total).toFixed(2)}</th>
                                            <th>{(sgst_total).toFixed(2)}</th>
                                            <th>{(taxable_total + cgst_total + sgst_total).toFixed(2)}</th>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="footer-section">
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div style={{ width: '60%' }}>
                                        <div style={{display:'flex'}}>
                                            <div style={{ display: 'flex',flexDirection:'column', alignItems: 'center', gap: '15px', borderRight:'0.1px solid #e5e5ef' }}>
                                                <QRCodeSVG value={profile.location || "Store"} size={80} style={{margin:'20px',marginTop:'0', marginBottom:'0'}} />
                                                <p style={{ fontSize: '10px', margin: 0 }}>Scan to locate our store</p>
                                            </div>
                                            <div style={{marginLeft:'auto', width:'50%'}}>
                                                <h4 style={{margin:'0', marginBottom:'5px'}}>Payment Information</h4>
                                                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                                    <spam>Total Amount : </spam>
                                                    <spam>₹ {(taxable_total + cgst_total + sgst_total).toFixed(2)}</spam>
                                                </div>
                                                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                                    <spam>Paid Amount : </spam>
                                                    <spam>₹ {paidAmount}</spam>
                                                </div>
                                                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between',fontWeight: 'bold', borderTop:'1px solid #000', marginTop:'5px', paddingTop:'5px'}}>
                                                    <spam>Remaining Amount : </spam>
                                                    <spam>₹ {((taxable_total + cgst_total + sgst_total) - paidAmount).toFixed(2)}</spam>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    
                                    <div style={{ width: '35%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span>Subtotal:</span> <span>₹ {taxable_total.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span>CGST({profile.default_cgst_percent}%) :</span> <span>₹ {(cgst_total).toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span>SGST({profile.default_sgst_percent}%) :</span> <span>₹ {(sgst_total).toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span>Total Tax:</span> <span>₹ {(cgst_total + sgst_total).toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', borderTop: '1px solid #000', marginTop: '5px', paddingTop: '5px' }}>
                                            <span>Grand Total:</span> <span>₹ {(taxable_total + cgst_total + sgst_total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{display:'flex',justifyContent:'center', marginTop: '15px' }}>
                                    <p style={{ fontSize: '11px', margin: 0 }}><strong>To pay in Words:</strong></p>
                                    <p style={{ fontSize: '12px', fontStyle: 'italic', margin: 0,marginLeft:'10px' }}>{numberToWords(Math.round((taxable_total + cgst_total + sgst_total)-paidAmount))} Only</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex',textAlign:'start',borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <div style={{ flex: 2, fontSize: '10px', paddingRight: '20px' }}>
                                    <strong>Terms & Conditions:</strong>
                                    <p style={{ margin: '2px 0' }}>1. {profile.terms1}</p>
                                    {profile.terms2 && <p style={{ margin: '2px 0' }}>2. {profile.terms2}</p>}
                                    {profile.terms3 && <p style={{ margin: '2px 0' }}>3. {profile.terms3}</p>}
                                    <p style={{ marginTop: '10px' }}><strong>Disclaimer:</strong> {profile.declaration}</p>
                                </div>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <p style={{ fontSize: '10px' }}>For {profile.store_name}</p>
                                    <br /><br />
                                    <div style={{ borderTop: '1px solid #000', paddingTop: '5px', fontSize: '11px' }}>Authorised Signatory</div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '15px', borderTop: '1px solid #000', padding: '5px 0' }}>
                                <h3 style={{ margin: 0, fontSize: '14px' }}>{profile.footer}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
export default CheckOut
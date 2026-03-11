//Profile.jsx
import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import {supabase} from './suparbaseClient.js';
import { useEffect, useState, } from 'react';
function Profile(){
    const [profile, setProfile] = useState({});
    const [editing ,setEditing] = useState(false);
    const [name, setName] = useState("");
    const [gstin, setGstin] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [cgst, setCgst] = useState("");
    const [sgst, setSgst] = useState("");
    const [terms1, setTerms1] = useState("");
    const [terms2, setTerms2] = useState("");
    const [terms3, setTerms3] = useState("");
    const [decl, setDecl] = useState("");
    const [footer, setFooter] = useState("");
    const [location, setLocation] = useState("");
    useEffect(() => {
        getProfile();
    },[]);
    async function getProfile(){
        try{
            const {data, error} = await supabase
                .from("store_details")
                .select("*")
                .single();
            if(data){
                setProfile(data);
            }
            if(error) throw error; 
        }
        catch(error){
            alert(error.message);
        }
    }

    async function updateProfile(){
        try{
            const {data, error} = await supabase
                .from("store_details")
                .update({
                    store_name:name, 
                    gstin:gstin, 
                    phone_number:phone, 
                    address1: address1, 
                    address2: address2, 
                    default_cgst_percent:cgst, 
                    default_sgst_percent: sgst, 
                    state:state, 
                    pincode:pincode, 
                    email: email, 
                    terms1: terms1, 
                    terms2: terms2, 
                    terms3: terms3, 
                    declaration: decl, 
                    footer: footer, 
                    location: location})
                .eq('id', 1)
            if(error) throw error;
            alert("Profile Updated");
            getProfile();
        }
        catch(error){
            alert(error.message);
        }
    }
    return(
        <div>
            <h1>Bussiness Inforamtion</h1>
            <h2>Welcome back !</h2>
            {editing ? <div>
                <table>
                    <tr>
                        <th>Data</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>
                            <label>Store Name</label>
                        </td>
                        <td><input value={name} onChange={(e) => setName(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td><label>Address Line 1 : </label></td>
                        <td><textarea value={address1} onChange={(e) => setAddress1(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td><label>Address line 2 : </label></td>
                        <tg><textarea value={address2} onChange={(e) => setAddress2(e.target.value)}/></tg>
                    </tr>
                    <tr>
                        <td><label>State : </label></td>
                        <td><input value={state} onChange={(e) => setState(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td><label>Pin Code : </label></td>
                        <td><input value={pincode} onChange={(e) => {
                            if((e.target.value).length <= 6){
                                setPincode(e.target.value);
                            }
                            }}/></td>
                    </tr>
                    <tr>
                        <td><label>GSTIN : </label></td>
                        <td><input value={gstin} onChange={(e) => setGstin(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>CGST : </td>
                        <td><input value={cgst}/></td>
                    </tr>
                    <tr>
                        <td>SGST : </td>
                        <td><input value={sgst}/></td>
                    </tr>
                    <tr>
                        <td>Phone Number : </td>
                        <td><input value={phone}/></td>
                    </tr>
                    <tr>
                        <td>Mail Id :</td>
                        <td><input value={email}/></td>
                    </tr>
                    <tr>
                        <td>Location Link</td>
                        <td><input value={location} onChange={(e) => setLocation(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <th>
                            Mention 3
                        </th>
                        <th>
                            <label>Terms & Condition</label>
                        </th>
                    </tr>
                    <tr>
                        <td>Condition 1 : </td>
                        <td><textarea value={terms1} onChange={(e) => setTerms1(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>Condition 2 : </td>
                        <td><textarea value={terms2} onChange={(e) => setTerms2(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>Condition 3 : </td>
                        <td><textarea value={terms3} onChange={(e) => setTerms3(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <th>Mention</th>
                        <th>Declaration</th>
                    </tr>
                    <tr>
                        <td>Declaration : </td>
                        <td><textarea value={decl} onChange={(e) => setDecl(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <th>Add</th>
                        <th>Footer</th>
                    </tr>
                    <tr>
                        <td>Discribe</td>
                        <td><textarea value={footer} onChange={(e) => setFooter(e.target.value)}/></td>
                    </tr>
                </table>
                <button onClick={() => {
                    updateProfile();
                    setEditing(false);
                    }}>Update Information</button>
            </div> 
                : 
            <div>
                <h2>Store Name : {profile.store_name}</h2>
                <h4>Your GSTIN Number is: {profile.gstin}</h4>
                <p>Phone Number: {profile.phone_number}</p>
                <p>Address Line 1 : {profile.address1}</p>
                <p>Address Line 2 : {profile.address2}</p>
                <p>State : {profile.state}</p>
                <p>Pincode : {profile.pincode}</p>
                <h3>CGST: {profile.default_cgst_percent}</h3>
                <h3>SGST : {profile.default_sgst_percent}</h3>
                <p>Invoice Prefix: {profile.invoice_prefix}</p>
                <p>Terms & Condition</p>
                <ol>
                    <li>{profile.terms1}</li>
                    <li>{profile.terms2}</li>
                    <li>{profile.terms3}</li>
                </ol>
                <p>Declaration : {profile.declaration}</p>
                <p>Footer : {profile.footer}</p>
                
                <button onClick={() => {
                        setEditing(true);
                        setName(profile.store_name);
                        setAddress1(profile.address1);
                        setGstin(profile.gstin);
                        setAddress2(profile.address2);
                        setPhone(profile.phone_number);
                        setCgst(profile.default_cgst_percent);
                        setSgst(profile.default_sgst_percent);
                        setState(profile.state);
                        setPincode(profile.pincode);
                        setEmail(profile.email);
                        setLocation(profile.location);
                        setTerms1(profile.terms1);
                        setTerms2(profile.terms2);
                        setTerms3(profile.terms3);
                        setDecl(profile.declaration);
                        setFooter(profile.footer);
                    }}>Edit Information</button>
            </div>}

            <br></br>
            <Link to='/'>Home</Link>
            <br/>
            <Link to='/Add'>Add Products</Link>
        </div>
    );
}
export default Profile
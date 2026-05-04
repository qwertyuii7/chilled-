
import { useState } from "react";
import { create_shop } from "../api/api"; 
import { useNavigate } from "react-router-dom";

function CreateShop() {
    
    const [shopName, setShopName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const navigate = useNavigate();

    const handle_create = async () => {
        
        const payload = { 
            name: ownerName, 
            serviceType, 
            shopName, 
            address, 
            phone 
        };

        try {
            const res = await create_shop(payload);
            
            
            if (res && res.data && res.data._id) {
                navigate(`/shop/${res.data._id}`);
            }
        } catch (error) {
            console.error("Failed to create shop", error);
        }
    }

    return (
        <div>
            <h2>Create Shop</h2>
            <input placeholder="Shop Name" onChange={e => setShopName(e.target.value)} />
            <input placeholder="Owner Name" onChange={e => setOwnerName(e.target.value)} />
            <input placeholder="Service Type" onChange={e => setServiceType(e.target.value)} />
            <input placeholder="Address" onChange={e => setAddress(e.target.value)} />
            <input placeholder="Phone" onChange={e => setPhone(e.target.value)} />

            <button onClick={handle_create}>Create Shop</button>
        </div>
    );
}

export default CreateShop;
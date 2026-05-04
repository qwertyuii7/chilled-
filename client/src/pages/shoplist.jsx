import { useEffect, useState } from "react";
import { getshops} from "../api/api";
import { Link } from "react-router-dom";


function Shoplist(){

    const [shops , setShops]= useState([])

    useEffect(()=>(

        getshops().then(setShops)

    ),[])


    return(
        <div>
            <h2>All shops</h2>
            {shops.map(shop=>(

                <div key={shop._id}>                 
                <Link to={`/shop/${shop._id}`} >{shop.name}</Link>                
                </div>
            ))}
            
        </div>

    )
}

export default Shoplist ;



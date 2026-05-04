const BASE_URL = import.meta.env.VITE_API_URL;


export const create_shop = async(data) =>{
    const res = await fetch(`${BASE_URL}/shop/create`,{
        method :"POST",
        headers :{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    });
    return res.json();
}

export const getshops = async() => {
    const res = await fetch(`${BASE_URL}/shops`)

    return res.json();
}



export const getshop = async(shopId) => {
    const res =await fetch(`${BASE_URL}/shop/${shopId}`);
    return res.json();
}

export const join = async(data) => {
    const res = await fetch(`${BASE_URL}/join/join`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    })
    return res.json();
}

export const create_booking = async(data) =>{
    const res = await fetch(`${data}/booking/create_booking`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringyfy(),



    })
    return res.json()
}

export const get_queue = async (shopId) => {
    const res = await fetch(`${BASE_URL}/queue?shopId=${shopId}`)
    return res.json()
}

export const nextCustomer = async (shopId) => {
  const res = await fetch(`${BASE_URL}/queue/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shopId })
  });
  return res.json();
};
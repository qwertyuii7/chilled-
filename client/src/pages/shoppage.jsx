import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_queue, join, nextCustomer } from "../api/api";

function Shoppage() {
    const { id: shopId } = useParams();
    const [queue, setQueue] = useState([]);
    const [name, setName] = useState("");

    const fetchqueue = async () => {
        const data = await get_queue(shopId);
        setQueue(data.queue);
    }

    const Joinhandler = async () => {
        await join({ customerName: name, shopId }) // bug 1: comma → semicolon
        setName("");
        fetchqueue();
    }

    const handlenext = async () => {
        await nextCustomer(shopId);
        fetchqueue();
    }

    useEffect(() => {
        fetchqueue(); 
        const interval = setInterval(fetchqueue, 5000);
        return () => clearInterval(interval);

        
    }, [shopId]) 
    return (
        <div>
            <h2>Shop Queue</h2>
            <h1>booking and registration</h1>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
            />
            <button onClick={Joinhandler}>Join Queue</button>
            <button onClick={handlenext}>Next</button>

            <h3>Queue</h3>
            {queue.map(user => (
                <div key={user._id}>
                    {user.customerName} - Pos: {user.position} - Ahead: {user.peopleAhead}
                </div>
            ))}
        </div>
    );
}

export default Shoppage;
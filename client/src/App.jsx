
import { useEffect, useState } from "react";

import './App.css'
import { api } from '../src/api/api'

function App() {
  async function mains() {
    const data = await api.getShops()
    console.log(data)
    
  }
  mains();
  
  

  return (
    <>
    hello world!

    routes will be here in sometime!
    keep updated!

    
    

    </>
  )
}

export default App

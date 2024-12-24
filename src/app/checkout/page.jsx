'use client'
import Checkout from '@/Component/Checkout/checkout';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [products, setProducts] = useState([]);
    const [qty, setQty] = useState(0);
    useEffect(()=>{
        const productData = localStorage.getItem('products');
        const qtyData = localStorage.getItem('qty');
        const routeFrom = localStorage.getItem('route');
        console.log(productData, qty, routeFrom);
        if(routeFrom==='buy'){
            setProducts(JSON.parse(productData));
        }else{
            setProducts(JSON.parse(productData));
        }
        setQty(JSON.parse(qtyData));
    }, [])
  return (
    <>
    <div>
        <Checkout qty={qty} products={products} setQty = {setQty}/>
    </div>
    </>
  )
}

export default Page;
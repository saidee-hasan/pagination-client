import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import { Link, useAsyncError, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    // const [cart, setCart] = useState([]);
    const cart = useLoaderData();
    const [currentPage , setCurrentPage]= useState(0)
    const { result } = 76;

    const [itemsPerPages,setItemsPerPage] = useState(8)
    
    const storedCart = getShoppingCart();
    const [count,setCount]=useState(0)
    const savedCart = [];
    const numberOfPage = Math.ceil(count / itemsPerPages);
    const pages = numberOfPage > 0 ? [...Array(numberOfPage).keys()] : [];

    const storeCartIds= Object.keys(storedCart)


    useEffect(()=>{
        fetch('http://localhost:5000/productsCount') 
        .then(res => res.json())
        .then(data => setCount(data.result));
    })

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemsPerPages}`)
            .then(res => res.json())
            .then(data => setProducts(data));
    }, [currentPage,itemsPerPages]);

    // useEffect(() => {
     
    //     for (const id in storedCart) {
    //         const addedProduct = products.find(product => product._id === id);
    //         if (addedProduct) {
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             savedCart.push(addedProduct);
    //         }
    //     }
    //     setCart(savedCart);
    // }, [products]);

    const handleAddToCart = (product) => {
        let newCart = [];
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product];
        } else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id);
    };

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    };

    const handleItemsPerPage = (e)=>{
        setItemsPerPage(parseInt(e.target.value))

    }
    const handlePrevPage =()=>{
        if(currentPage > 0){
            setCurrentPage(currentPage-1)
        }
    }
    const handleNextPage = ()=>{
        if(currentPage < pages.length){
            setCurrentPage(currentPage + 1 )
        }
    }
    return (
        <div className='p-8'>
            <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {/* Product Display */}
                <div className="col-span-1 md:col-span-3 lg:col-span-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {
                            products.map(product => (
                                <Product
                                    key={product._id}
                                    product={product}
                                    handleAddToCart={handleAddToCart}
                                />
                            ))
                        }
                    </div>
                </div>

                {/* Cart Section */}
                <div className="col-span-1">
                    <Cart
                        cart={cart}
                        handleClearCart={handleClearCart}
                    >
                        <Link className='block text-center' to="/orders">
                            <button className='bg-orange-500 w-full h-14 text-lg rounded-md text-white mt-2'>
                                Review Order
                            </button>
                        </Link>
                    </Cart>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <h1>{currentPage}</h1>
                <button onClick={handlePrevPage} className='btn'>Previous</button>
                {
                    pages.map((page, idx) => (
                        <button      className={`px-4 py-2 mx-1 rounded-md ${

                            currentPage === page
                    
                              ? 'bg-blue-500 text-white' // Selected page styles
                    
                              : 'bg-gray-200 text-gray-700' // Default styles
                    
                          }`} onClick={()=>setCurrentPage(page)} key={idx}>
                            {page }
                        </button>
                    ))
                }
                <button onClick={handleNextPage} className='btn'>Next</button>
                <select onChange={handleItemsPerPage}  className="select select-ghost w-full max-w-xs">
  <option disabled value={itemsPerPages}></option>
  <option>5</option>
  <option>20</option>
  <option>30</option>
</select>
            </div>
        </div>
    );
};

export default Shop;

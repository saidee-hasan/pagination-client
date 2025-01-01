import { getShoppingCart } from "../utilities/fakedb";

const cartProductsLoader = async () => {
    // Fetch the products from the server
    const loadedProductsResponse = await fetch('http://localhost:5000/products'); // Adjust the endpoint as needed
    const products = await loadedProductsResponse.json();

    // Get the stored cart data
    const storedCart = getShoppingCart();
    const storedCartId = Object.keys(storedCart);
    console.log(storedCart);

    // Fetch the products by their IDs
    const loadedProductsByIdResponse = await fetch('http://localhost:5000/productById', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(storedCartId)
    });

    const loadedProductsById = await loadedProductsByIdResponse.json();

    // Create a saved cart array
    const savedCart = [];

    // Map through the loaded products and match them with the stored cart
    for (const id of storedCartId) {
        const addedProduct = loadedProductsById.find(pd => pd._id === id);
        if (addedProduct) {
            const quantity = storedCart[id];
            addedProduct.quantity = quantity; // Add quantity to the product
            savedCart.push(addedProduct); // Add the product to the saved cart
        }
    }

    // Return the saved cart
    return savedCart;
}

export default cartProductsLoader;
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios"; 
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

 let productArray;

const Products = () => {
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState({});
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [cartItem, setCartItem] = useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      const {data} = response;
      setLoading(false);
      setProducts([...data]);
      setFilteredProducts([...data]);
    } catch (error) {
      const {response} = error
      setLoading(false);
      if (response && response.status === 500) {
        enqueueSnackbar(response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. check that the backend is running, reachable and return valid JSON",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      const {data} = response;
      setLoading(false);
      setFilteredProducts([...data]);
    } catch (error) {
      setLoading(false);
      const {response} = error;
      if (response) {
        if(response.status === 404){
          setFilteredProducts([]);
        }else if (response.status === 500) {
          enqueueSnackbar(response.message, { variant: "error" });
          setFilteredProducts(products);
        }
      } else {
        enqueueSnackbar(
          "Could not fetch the products. check that the backend is running, reachable and return valid JSON",
          { variant: "error" }
        );
      }
    }
  };

  const handleInputEvent = (e) => {
    debounceSearch(e, debounceTimeout)
  }


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(async() => {
      await performSearch(value);
    }, 500);
    setDebounceTimeout(timeout);
  };

  


  useEffect(() => {
    performAPICall();
    fetchCart(token);
  },[]);

  
  if(products){
    productArray = products;
  }

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */


   



   
   const fetchCart = async (token) => {
    if (!token) return;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });
      const {data} = response;
      if(response.status === 200){
        setCartItem(generateCartItemsFrom(data,productArray));
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  
  const isItemInCart = (items, productId) => {
    for(let i = 0; i<items.length; i++){
      if(items[i]["_id"] === productId){
        return true;
      }
    }
    return false;
  };
  


  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

   const handleAddToCart = (id) => {
    addToCart(token, cartItem, productArray, id, 1);
   }

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    // options = { preventDuplicate: false }
  ) => {
    if(token){
      if(isItemInCart(items, productId)){ 
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          {
            variant: "warning",
          }
        );
      }else{
        await addInCart(productId, qty);
      }
    }else{
      enqueueSnackbar(
        "Login to add an item to the Cart",
        {
          variant: "error",
        }
      );
    }

  };


  const addInCart = async(id, quantity) => {
    if(quantity < 0) return
      const body = {
        productId: id,
        qty: quantity,
      }
      try{
        const response = await axios.post(`${config.endpoint}/cart`,body, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const {data} = response
        if(response.status === 200){
        setCartItem(generateCartItemsFrom(data, productArray));
        }
      }catch (e) {
        if (e.response && e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
      }
  } 

const handleQuantity = (proId, quantity) => {
  addInCart(proId, quantity)
}


  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          sx={{ width: "50ch"}}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={handleInputEvent}
        />
      </Header>
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={handleInputEvent}

      />
      <Grid container>
         <Grid item xs md>
          <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid> 
          {isLoading ? (
            <Box className="loading">
            <CircularProgress />
            <h4>Loading Products...</h4>
          </Box>
          
          ) : (
                <Grid container spacing={2} padding={"0.8rem"}>
                {filteredProducts.length ? (
                  filteredProducts.map((product) => (
                    <Grid item xs={6} md={3} key={product._id}>
                      <ProductCard
                        product={product}
                        handleAddToCart={(e) => handleAddToCart(product["_id"])}
                      />
                    </Grid>
                  ))
                ) : (
                  <Box className="loading">
                    <SentimentDissatisfied color="action" />
                    <h4 style={{ color: "#636363 " }}>No products found</h4>
                  </Box>
                )}
              </Grid>
          )}
         </Grid>
         {token && <Grid item xs={12} md={3} sx={{background: "#E9F5E1"}}>
          <Cart products={productArray} items={cartItem} handleQuantity={handleQuantity}/>
         </Grid>}
           
       </Grid>
      <Footer />
    </div>
  );
};

export default Products;

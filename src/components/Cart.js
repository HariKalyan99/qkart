import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */

 
export const generateCartItemsFrom = (cartData, productsData) => {
  let CartItem = [];
  if(cartData.length && productsData.length){
    for(let i = 0; i<cartData.length; i++){
      const items = productsData.find(product => product["_id"] === cartData[i].productId);
      if(items){
        items.qty = cartData[i].qty;
        CartItem.push(items);
      }
    }
  }
  return CartItem;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let total = 0;
  for(let i = 0; i<items.length; i++){
    if(items[i].qty > 0){
      total+=items[i].cost*items[i].qty
    }
  }
  return total;
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {
  if(isReadOnly){
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          <span style={{"fontWeight": "bold"}}>
           Qty: {value}
          </span>
        </Box>
      </Stack>
    );
  }else{
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  }
};

export const getTotalItems = (totalCart) => {
    // console.log(totalCart);
    let totalQty = 0;
    for(let i =0; i<totalCart.length; i++){
      totalQty+=totalCart[i].qty;
    }


    return (
      <Box  className="cart" style={{padding: "1rem"}}>
      <h1>Order Details</h1>
        <Box className="cart-row">
          <p>Products</p>
          <p>{totalQty}</p>
        </Box>
        <Box className="cart-row">
          <p>Subtotal</p>
          <p>${getTotalCartValue(totalCart)}</p>
        </Box>
        <Box className="cart-row">
          <p>Shipping Charges</p>
          <p>$0</p>
        </Box>
        <Box className="cart-row">
          <p style={{fontSize: "larger", fontWeight: "bold"}}>Total</p>
          <p style={{fontSize: "larger", fontWeight: "bold"}}>${getTotalCartValue(totalCart)}</p>
        </Box>
      </Box>
    )
  }

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {



  const historyCheckOut = useHistory();
  const loggedIn = localStorage.getItem("token");
  if(!loggedIn){
    historyCheckOut.push("/");
  }
  
  
  const handleCheckout = () => {
      historyCheckOut.push("/checkout");
  }


  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      
      {items.length ? <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((ele) => (
          <Box display="flex" alignItems="flex-start" padding="1rem" key={ele["_id"]}>
          <Box className="image-container">
              <img
                  // Add product image
                  src={ele.image}
                  // Add product name as alt eext
                  alt={ele.name}
                  width="100%"
                  height="100%"
              />
          </Box>
          <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
          >
              <div>{ele.name}</div>
              <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
              >
              {isReadOnly ? <ItemQuantity
              // Add required props by checking implementation
              value={ele.qty}
              handleAdd={() => handleQuantity(ele["_id"], ele.qty + 1)}
              handleDelete={() => handleQuantity(ele["_id"], ele.qty - 1)}
              isReadOnly
              /> : <ItemQuantity
              // Add required props by checking implementation
              value={ele.qty}
              handleAdd={() => handleQuantity(ele["_id"], ele.qty + 1)}
              handleDelete={() => handleQuantity(ele["_id"], ele.qty - 1)}
              />}
              <Box padding="0.5rem" fontWeight="700">
                  ${ele.cost}
              </Box>
              </Box>
          </Box>
      </Box>
        ))}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {!isReadOnly ? <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </Box> : null}
        
      </Box>: null}
      {isReadOnly && getTotalItems(items)}
    </>
  );
};

export default Cart;

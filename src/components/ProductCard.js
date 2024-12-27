import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card sx={{ maxWidth: 400 }} className="card">
      <CardMedia
        component="img"
        // height=""
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="h6" display="block" gutterBottom>
        {product.name}
        </Typography>
        <Typography variant="h6">${product.cost}</Typography>
      </CardContent>
      <CardActions className="card-actions">
        <Rating
          readOnly
          name="readOnly"
          size="medium"
          defaultValue={product.rating}
        />
      </CardActions>
      <CardActions className="card-actions">
        <Button
          variant="contained"
          className="card-button"
          startIcon={<AddShoppingCartOutlined />}
          onClick={handleAddToCart}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;

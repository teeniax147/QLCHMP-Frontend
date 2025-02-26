import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../config";

const useGetCart = () => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartItemCount = async () => {
    try {

        console.log('loading count.........');
        
      const response = await axios.get(`${API_BASE_URL}/Carts/item-count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      setCartItemCount(response.data.ItemCount);
    } catch (error) {
      return error;
    }
  };

  return { cartItemCount, fetchCartItemCount };
};

export default useGetCart;

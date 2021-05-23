import React, {useEffect, useState} from "react";
import {commerce} from "./lib/commerce";
import {Cart,Products, Navbar} from "./components";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

const App = () => {
   const [products, setProducts] = useState([]);
   const [cart, setCart] = useState({});

   const fetchProducts = async () => {
      const {data} = await commerce.products.list();
      setProducts(data);
   };

   const fetchCard = async () => {
      setCart(await commerce.cart.retrieve());
   };

   const handleAddToCart = async (productId, quantity) => {
      const item = await commerce.cart.add(productId, quantity);
      setCart(item.cart);
   };

   useEffect(() => {
      fetchProducts();
      fetchCard();
   }, []);

   console.log(cart);

   return (
      <Router>
         <div>
            <Navbar totalItems={cart.total_items}/>
            <Switch>
               <Route exact path={"/"}>
                  <Products products={products} onAddToCart={handleAddToCart}/>
               </Route>
               <Route path={"/cart"}>
                  <Cart cart={cart}/>
               </Route>
            </Switch>
         </div>
      </Router>
   );
};

export default App;
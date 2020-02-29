import React, { useEffect, useState } from 'react';
import Commerce from '@chec/commerce.js'
import { Grid } from 'semantic-ui-react';

//Component Imports
import Nav from './components/Nav'
import LeftPanel from './components/LeftPanel'
import Footer from './components/Footer'
import ProductContainer from './components/ProductContainer'

function App() {

    const commerce = new Commerce(process.env.REACT_APP_PUBLICKEY_SANDBOX)
    const [cart, setCart] = useState()
    const cartHelperFunctions = {

        deleteItem: (lineItemId) => {
            commerce.cart.remove(lineItemId)
                .then(res => {
                    console.log(res, 'response from line item removal')
                    setCart(res.cart)
                })
        },
        addQaunity: (lineItemId, newQuanity) => {
            commerce.cart.update(lineItemId, {quantity: newQuanity})
                .then(res => {
                    console.log(res, 'res from adding quanity')
                    setCart(res.cart)
                    
                })
        },
        subtractQuanity: (lineItemId, newQuanity) => {
            console.log(newQuanity, 'new Q when subtracting Item')

            if (newQuanity === 0) {
                console.log(lineItemId, 'lineitem ID')
                cartHelperFunctions.deleteItem(lineItemId)
            } else {
                commerce.cart.update(lineItemId, {quantity: newQuanity})
                    .then(res => {
                        console.log(res, 'res from subtracting quanity')
                        setCart(res.cart)
                    })
            }

        }
    }

    useEffect(() => {
        commerce.cart.retrieve()
            .then(res => {
                console.log(res, 'response from app useEffect')
                setCart(res)
            })
    },[])

    const addToCart = (productId, variantInfo) => {

        if(variantInfo) {
            commerce.cart.add(productId, 1, variantInfo)
                .then(res => {
                    console.log(res, 'res from adding to CART!!')
                    setCart(res.cart)
                })
        } else {
            // console.log('Error - Please Select Size')
            window.alert('Please Select a Shirt Size')
        }
    }

    const emptyCart = () => {
        console.log('works')
        commerce.cart.empty()
            .then(res => {
                console.log(res, 'res from empty cart')
                setCart(null)
            })
    }

    return (
        <div className="App">
            <CartItemsContext.Provider value={cartHelperFunctions}>
                <Nav cart={cart} emptyCart={emptyCart}/>
            </CartItemsContext.Provider>
            <Grid centered stackable padded relaxed>
                <Grid.Column className='left-column' width={5}>
                    <LeftPanel />
                </Grid.Column>
                <Grid.Column width={9}>
                    <ProductContainer 
                        addToCart={addToCart} 
                    />
                </Grid.Column>
            </Grid>
            <Footer />
        </div>
  );
}

export default App;



export const CartItemsContext = React.createContext()
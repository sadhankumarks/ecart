import { cartActions } from './cart-slice';
import { uiActions } from './ui-slice';

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending...',
        title: 'Sending',
        message: 'Uploading cart data'
      }) // return object
    );

    const sendRequest = async () => {
      const response = await fetch('https://fir-a17fc-default-rtdb.firebaseio.com/cart.json', {
        method: 'PUT',
        body: JSON.stringify(cart),
        mode:'cors'
      });

      if(!response.ok) {
        throw new Error('Sending cart data failed.')
      }
    }

    try {
      await sendRequest();

      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Uploaded cart data successfully.'
        })
      )
    }
    catch (err) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Uploading cart data failed.'
        })
      )
    }
  }
}

export const fetchCartData = () => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await fetch('https://fir-a17fc-default-rtdb.firebaseio.com/cart.json');

      if(!response.ok){
        throw new Error('Could not fetch data');
      }

      const data = response.json();

      return data;
    }

    try {
      const cartData = await sendRequest();
      dispatch(cartActions.replaceCart({
        items: cartData.items || [],
        totalQuantity: cartData.totalQuantity
    }));
    }
    catch(err) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Fetching cart data failed.'
        })
      )
    }
  }
}
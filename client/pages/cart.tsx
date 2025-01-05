import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../src/store/store";
import { removeFromCart } from "../src/store/features/cartSlice";
import requestHook from "@/src/hooks/requestHook";
import router from "next/router";

const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { requestData, formErrors } = requestHook(
    `/api/orders`,
    "post",
    (response) => {
      router.push("/orders/[orderId]", `/orders/${response?.data.id}`);
    }
  );
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border p-4 rounded"
              >
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-right">
            <p className="text-xl font-bold">Total: ${total}</p>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded mt-4 hover:bg-green-600"
              onClick={async () =>
                await requestData({ ticketId: cartItems[0].id })
              }
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

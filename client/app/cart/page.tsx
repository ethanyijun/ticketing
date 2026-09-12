"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/src/store/store";
import { clearCart, removeFromCart } from "@/src/store/features/cartSlice";
import requestHook from "@/src/hooks/requestHook";

export default function CartPage() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { requestData, formErrors } = requestHook(
    `/api/orders`,
    "post",
    (response) => {
      dispatch(clearCart());
      router.push(`/orders/${response?.data.id}`);
    }
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (isCheckingOut || cartItems.length === 0) return;

    setIsCheckingOut(true);
    const order = await requestData({
      ticketId: cartItems[0].id,
      quantity: cartItems[0].quantity,
    });

    if (!order) {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {isCheckingOut ? (
        <p>Redirecting to your order...</p>
      ) : cartItems.length === 0 ? (
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
                  <p className="text-gray-600">Price: ${item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
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
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "Creating order..." : "Checkout"}
            </button>
            {formErrors && (
              <div className="text-red-500 mt-2">{formErrors}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

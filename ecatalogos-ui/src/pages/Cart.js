import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { ChevronLeft, Minus, Plus } from "lucide-react";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCartProducts = async () => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const filteredCart = currentCart.filter((item) => item.quantity >= 1);
    const productIds = filteredCart.map((item) => item.id);

    if (productIds.length === 0) {
      setProducts([]);
      return;
    }

    try {
      const response = await api.post("/cart/", { ids: productIds });
      const fetchedProducts = response.data;

      const updatedProducts = fetchedProducts.map((product) => {
        const cartItem = currentCart.find((item) => item.id === product.id);
        return {
          ...product,
          quantity: cartItem ? cartItem.quantity : 0,
        };
      });

      setProducts(updatedProducts);

      const total = updatedProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      setTotalPrice(total);
    } catch (error) {
      console.error("Erro ao buscar produtos do carrinho:", error);
    }
  };

  const addToCart = (id, mode) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = currentCart.findIndex((item) => item.id === id);

    if (itemIndex > -1) {
      if (mode === "minus") {
        currentCart[itemIndex].quantity -= 1;
      } else if (mode === "plus") {
        currentCart[itemIndex].quantity += 1;
      }
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    fetchCartProducts();
  };

  const handleRemoveFromCart = (id) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = currentCart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    fetchCartProducts();
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  return (
    <div className="flex flex-col p-6 bg-gray-100 h-full w-full overflow-y-scroll">
      <div className="relative flex text-xl pb-4 mb-4 font-semibold justify-center space-x-3 w-full border-b border-gray-500">
        <Link to="/" className="absolute top-1/2 left-2 -translate-y-1/2">
          <ChevronLeft className="text-3xl text-black hover:text-gray-900 transition-colors" />
        </Link>
        <h1 className="text-2xl font-semibold text-center">
          CARINHO ({products.length})
        </h1>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex gap-4 p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
            >
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[0].link}
                    alt={`Imagem do produto ${product.name}`}
                    className="w-32 h-auto object-cover rounded"
                  />
                </>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center mt-4">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}

              <div className="flex flex-col space-y-3">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">
                  Preço unitário: R${product.price.toFixed(2)}
                </p>
                <p className="text-gray-600">Quantidade: {product.quantity}</p>
                <p className="text-gray-900 font-bold">
                  Subtotal: R${(product.price * product.quantity).toFixed(2)}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => addToCart(product.id, "minus")}
                      className="bg-black px-2 py-2 rounded-full text-white font-bold text-xl hover:bg-gray-300"
                    >
                      <Minus size={25} />
                    </button>
                    <span className="text-xl font-bold">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(product.id, "plus")}
                      className="bg-black px-2 py-2 rounded-full text-white font-bold text-xl hover:bg-gray-300"
                    >
                      <Plus size={25} />
                    </button>
                  </div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    onClick={() => handleRemoveFromCart(product.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      )}

      {products.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Total: R${totalPrice.toFixed(2)}
          </h2>
        </div>
      )}
    </div>
  );
};

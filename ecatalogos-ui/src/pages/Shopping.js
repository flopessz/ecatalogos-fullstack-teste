import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Eye, Eraser, ChevronRight, ShoppingCart } from "lucide-react";

export default function Shopping() {
  const [products, setProducts] = useState([]);
  const [viewProductsSelect, setViewProductsSelect] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [gridCols, setGridCols] = useState(2);
  const [cartViewCount, setCartViewCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = (id) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = currentCart.findIndex((item) => item.id === id);

    if (itemIndex > -1) {
      currentCart.splice(itemIndex, 1);
    } else {
      currentCart.push({ id, quantity: 0 });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    updateCartCount();
  };

  const filteredProducts = products.filter((product) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isInCart = currentCart.some((item) => item.id === product.id);

    if (viewProductsSelect) {
      return isInCart;
    }

    return selectedCategory === "" || product.category === selectedCategory;
  });

  const handleRemoveAllCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    updateCartCount();
  };

  const isInCart = (id) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    return currentCart.some((item) => item.id === id);
  };

  const updateCartCount = () => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const uniqueItemsCount = new Set(currentCart.map((item) => item.id)).size;
    const itemsWithQuantity = currentCart.filter((item) => item.quantity > 0).length;
    setCartCount(itemsWithQuantity)
    setCartViewCount(uniqueItemsCount);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);

        const uniqueCategories = [
          ...new Set(
            response.data.map((product) => product.category || "Outros")
          ),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProducts();
    updateCartCount();
  }, []);

  return (
    <div className="flex flex-col px-2 w-full h-full bg-gray-100">
      <div className="relative flex text-xl pb-3 pt-2 font-semibold mb-4 items-center justify-center space-x-3 w-full border-b border-gray-500">
        <Link to="/cart" className="absolute top-1/2 left-2 -translate-y-1/2">
          <ShoppingCart className="text-3xl text-black hover:text-gray-900 transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
        {viewProductsSelect ? (
          <span>PRODUTOS SELECIONADOS</span>
        ) : (
          <span>PRODUTOS DISPONIVEIS</span>
        )}
        <span className="py-1 px-2 border-2 border-black rounded-full">
          {filteredProducts.length}
        </span>
        {cartViewCount > 0 && (
          <Link to="/view" className="absolute top-1/2 right-2 -translate-y-1/2">
            <ChevronRight className="text-3xl text-black hover:text-gray-900 transition-colors" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartViewCount}
            </span>
          </Link>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="font-bold text-lg">VISUALIZAÇÃO:</span>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((view) => (
              <button
                key={view}
                onClick={() => setGridCols(view)}
                className={`${gridCols === view
                  ? "bg-green-500 text-white scale-95"
                  : "bg-gray-400 text-white"
                  } border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-200`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
        <div className="flex space-y-3 justify-between">
          <div className="flex flex-col">
            <select
              id="category"
              className="mt-2 text-center block w-fit py-2 px-3 border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Categorias</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-3 items-end pb-2">
            <Eye onClick={() => setViewProductsSelect(!viewProductsSelect)} />
            <Eraser onClick={() => handleRemoveAllCart()} />
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className={`grid grid-cols-${gridCols} gap-6 overflow-y-scroll`}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product.id)}
              className={`bg-white border border-black shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].link}
                    alt={`Imagem do produto ${product.name}`}
                    className="object-contain w-48 h-48"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center mt-4">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>
              <p
                className={` mt-2 text-center rounded-b-lg text-white py-1
                ${isInCart(product.id) ? "bg-green-500" : "bg-gray-400"}`}
              >
                R${Number(product.price || 0).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Nenhum produto encontrado...</p>
      )}
    </div>
  );
};

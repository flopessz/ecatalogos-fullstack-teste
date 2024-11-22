import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { ChevronRight, ChevronLeft, Plus, Minus, Info, ShoppingCart } from "lucide-react";
import Modal from "../components/Modal";

export default function View() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentItem = cartItems[currentIndex];

  const fetchCartProducts = async () => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIds = currentCart.map((item) => item.id);

    if (productIds.length === 0) {
      setCartItems([]);
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

      setCartItems(updatedProducts);

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
      if (mode === "minus" && currentCart[itemIndex].quantity >= 1) {
        currentCart[itemIndex].quantity -= 1;
      } else if (mode === "plus") {
        currentCart[itemIndex].quantity += 1;
      }
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    fetchCartProducts();
  };

  const handlePrev = () => {
    setCurrentImageIndex(0);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cartItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex(0);
    setCurrentIndex((prevIndex) =>
      prevIndex === cartItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="relative flex text-xl py-4 font-semibold justify-center space-x-3 w-full border-b border-gray-500">
        <Link to="/" className="absolute top-1/2 left-2 -translate-y-1/2">
          <ChevronLeft className="text-3xl text-black hover:text-gray-900 transition-colors" />
        </Link>
        <h1 className="text-2xl font-semibold text-center">COMPRAR</h1>
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="flex flex-col items-center px-6">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2 className="text-lg font-semibold mb-4">
                Detalhes do Produto
              </h2>
              <p>
                <strong>Nome do produto:</strong> {currentItem.name}
              </p>
              <p>
                <strong>Referência:</strong> {currentItem.reference}
              </p>
              <p>
                <strong>Marca:</strong> {currentItem.brand}
              </p>
              <p>
                <strong>Categoria:</strong> {currentItem.category}
              </p>
            </Modal>

            {currentItem && currentItem.images?.[0]?.link ? (
              <div className="flex items-center justify-between w-full border-b border-black">
                <button
                  onClick={handlePrev}
                  className="px-2 py-2 h-fit bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  <ChevronLeft />
                </button>
                <img
                  src={currentItem.images[currentImageIndex].link || ""}
                  alt={currentItem.name}
                  className="h-[35rem] w-full mb-6"
                />
                <button
                  onClick={handleNext}
                  className="px-2 py-2 h-fit  bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  <ChevronRight />
                </button>
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-300 flex items-center justify-center mb-6">
                <span className="text-gray-500">Imagem indisponível</span>
              </div>
            )}

            {currentItem && (
              <>
                <div className="flex items-center justify-center w-full space-x-2">
                  <Info onClick={() => setIsModalOpen(!isModalOpen)} />
                  <div className="flex items-center space-x-3 py-2">
                    {currentItem.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.link}
                        alt={`Imagem do produto ${currentItem.name}`}
                        onClick={() => handleThumbnailClick(index)}
                        className={`w-12 h-12 object-cover rounded cursor-pointer ${
                          index === currentImageIndex
                            ? "border-2 border-blue-500"
                            : "border border-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Link to={"/cart"}><ShoppingCart/></Link>
                </div>

                <div className="flex items-center justify-between w-full">
                  <h2 className="text-lg font-bold">{currentItem.name}</h2>
                  <p className="text-sm text-gray-600">
                    REF: {currentItem.reference}
                  </p>
                  <p className=" text-green-600 font-bold text-lg">
                    R$ {currentItem.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between w-full">
                  <p className="flex flex-col text-black mt-2">
                    <strong className="text-lg">Atual:</strong> R${" "}
                    {currentItem.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => addToCart(currentItem.id, "minus")}
                      className="bg-black px-2 py-2 rounded-full text-white font-bold text-xl hover:bg-gray-300"
                    >
                      <Minus size={25} />
                    </button>
                    <span className="text-xl font-bold">
                      {currentItem.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(currentItem.id, "plus")}
                      className="bg-black px-2 py-2 rounded-full text-white font-bold text-xl hover:bg-gray-300"
                    >
                      <Plus size={25} />
                    </button>
                  </div>
                  <p className="flex flex-col text-black mt-2">
                    <strong>Acumulado:</strong> R$ {totalPrice.toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-center text-center w-full bg-gray-400 pt-6 pb-4 space-x-4">
            <div className="flex relative flex-col items-center text-gray-400 text-2xl font-semibold rounded-lg bg-white px-4">
              <span className="font-bold absolute -right-2 -top-3 bg-black text-white text-sm rounded-full px-2">
                G
              </span>
              <span>4</span>
            </div>
            <div className="flex relative flex-col items-center text-gray-400 text-2xl font-semibold rounded-lg bg-white px-4">
              <span className="font-bold absolute -right-2 -top-3 bg-black text-white text-sm rounded-full px-2">
                GG
              </span>
              <span>3</span>
            </div>
            <div className="flex relative flex-col items-center text-gray-400 text-2xl font-semibold rounded-lg bg-white px-4">
              <span className="font-bold absolute -right-2 -top-3 bg-black text-white text-sm rounded-full px-2">
                M
              </span>
              <span>2</span>
            </div>
            <div className="flex relative flex-col items-center text-gray-400 text-2xl font-semibold rounded-lg bg-white px-4">
              <span className="font-bold absolute -right-2 -top-3 bg-black text-white text-sm rounded-full px-2">
                P
              </span>
              <span>3</span>
            </div>
            <span className="flex flex-col text-xl font-semibold">=</span>
            <div className="flex relative flex-col text-xl px-4 py-1 font-semibold text-gray-400 rounded-lg bg-white">
              <span className="absolute -top-5 left-0 text-base text-white">
                PACK
              </span>
              <span>12</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center h-full translate-y-1/2">Nenhum produto selecionado.</p>
      )}
    </div>
  );
}

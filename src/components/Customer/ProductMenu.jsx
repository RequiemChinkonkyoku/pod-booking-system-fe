import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../utils/axiosConfig";
import "../../css/ProductMenu.css";

const ProductMenu = ({ booking, onAddProducts }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);

  // Fetch products and categories
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("/Products"),
          axios.get("/Categories"),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching products and categories:", error);
        toast.error("Failed to load products. Please refresh the page.");
      }
    };
    fetchProductsAndCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.categoryId === parseInt(selectedCategory);
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    if (product.quantity === 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    const existing = cart.find((item) => item.id === product.id);
    const newQuantity = (existing?.quantity || 0) + 1;

    if (newQuantity > product.quantity) {
      toast.error(`Only ${product.quantity} ${product.name} available`);
      return;
    }

    setCart((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    if (newQuantity < 0) {
      toast.error(`Quantity cannot be negative`);
      return;
    }

    if (newQuantity > product.quantity) {
      toast.error(`Only ${product.quantity} ${product.name} available`);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      toast.info(`Removed ${product.name} from cart`);
    }
  };

  const ProductCard = ({ product }) => {
    const categoryName =
      categories.find((c) => c.id === product.categoryId)?.name ||
      "Uncategorized";
    const randomColor = `hsl(${(product.id * 137.508) % 360}, 70%, 85%)`;
    const isOutOfStock = product.quantity === 0;

    return (
      <div
        className={`card h-100 shadow-sm ${isOutOfStock ? "opacity-75" : ""}`}
      >
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            height: "200px",
            backgroundColor: randomColor,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="category-badge">{categoryName}</div>
          {isOutOfStock && (
            <div className="out-of-stock-banner">OUT OF STOCK</div>
          )}
          <Package size={64} color="#666" />
        </div>
        <div className="card-body">
          <h5 className="card-title mb-2">{product.name}</h5>
          <div
            className="card-text text-muted small mb-3"
            style={{ minHeight: "48px" }}
          >
            {product.description || "No description available"}
          </div>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <div>
              <span className="h5 mb-0 text-primary">
                {product.price.toLocaleString()} VND
              </span>
              <br />
              <small
                className={`${isOutOfStock ? "text-danger" : "text-muted"}`}
              >
                {isOutOfStock
                  ? "Out of stock"
                  : `${product.quantity} available`}
              </small>
            </div>
            <button
              className={`btn ${
                isOutOfStock ? "btn-secondary" : "btn-outline-primary"
              } btn-sm`}
              onClick={() => !isOutOfStock && addToCart(product)}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    );
  };
  const ShoppingCartSection = () => {
    if (!cart.length) return null;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return (
      <div className="card mt-4">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <ShoppingCart size={20} className="mr-2" />
              Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
            </h5>
            <button
              className="btn btn-sm btn-outline-light d-flex align-self-end"
              onClick={() => {
                setCart([]);
                toast.info("Cart cleared");
              }}
            >
              <X size={16} className="align-items-center" /> Clear Cart
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">Product</th>
                  <th
                    className="border-0 text-center"
                    style={{ width: "120px" }}
                  >
                    Price
                  </th>
                  <th
                    className="border-0 text-center"
                    style={{ width: "150px" }}
                  >
                    Quantity
                  </th>
                  <th
                    className="border-0 text-right"
                    style={{ width: "120px" }}
                  >
                    Total
                  </th>
                  <th className="border-0" style={{ width: "50px" }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.id);
                  return (
                    <tr key={item.id}>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center mr-3"
                            style={{
                              width: "40px",
                              height: "40px",
                              backgroundColor: `hsl(${
                                (item.id * 137.508) % 360
                              }, 70%, 85%)`,
                              flexShrink: 0,
                            }}
                          >
                            <Package size={20} />
                          </div>
                          <div>
                            <h6 className="mb-0">{item.name}</h6>
                            <small className="text-muted">
                              {product
                                ? `${product.quantity} available`
                                : "Loading..."}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle text-center">
                        {item.price.toLocaleString()} VND
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              className="quantity-input"
                              value={item.quantity}
                              onChange={(e) => {
                                const val =
                                  e.target.value === ""
                                    ? 0
                                    : parseInt(e.target.value);
                                if (!isNaN(val)) {
                                  if (val > product.quantity) {
                                    toast.error(
                                      `Only ${product.quantity} ${product.name} available`
                                    );
                                    return;
                                  }
                                  updateCartQuantity(item.id, val);
                                }
                              }}
                              min="0"
                              max={product?.quantity}
                            />
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle text-right font-weight-bold">
                        {(item.price * item.quantity).toLocaleString()} VND
                      </td>
                      <td className="align-middle text-center">
                        <button
                          className="btn btn-remove mx-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-light">
                <tr>
                  <td colSpan="2" className="border-0"></td>
                  <td className="text-right border-0">
                    <strong>Total Items:</strong>
                  </td>
                  <td className="text-right border-0">
                    <strong>{totalItems}</strong>
                  </td>
                  <td className="border-0"></td>
                </tr>
                <tr>
                  <td colSpan="2" className="border-0"></td>
                  <td className="text-right border-0">
                    <strong>Total Amount:</strong>
                  </td>
                  <td className="text-right border-0">
                    <strong className="text-primary">
                      {totalAmount.toLocaleString()} VND
                    </strong>
                  </td>
                  <td className="border-0"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white">
          <div className="text-right">
            <button
              className="btn btn-primary"
              onClick={() => {
                onAddProducts(cart);
                setCart([]);
                toast.success("Products added to booking successfully!");
              }}
            >
              Add to Booking
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (
    !booking ||
    (booking.bookingStatusId !== 4 && booking.bookingStatusId !== 3)
  ) {
    return (
      <div className="alert alert-warning" role="alert">
        Products can only be added when the booking status is "On-going"
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header card-header-rose card-header-text">
        <div className="card-text">
          <h4 className="card-title">Order Products</h4>
        </div>
      </div>
      <div className="card-body">
        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <Search size={20} />
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <Filter size={20} />
                </span>
              </div>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="col-md-4 mb-4">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <Package size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No products found</h5>
              <p className="text-muted small">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Shopping Cart */}
        <ShoppingCartSection />

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ top: "70px" }}
          limit={3}
        />
      </div>
    </div>
  );
};

export default ProductMenu;

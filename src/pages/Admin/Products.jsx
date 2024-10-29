import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button from react-bootstrap

export const Products = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null); // Track the selected product for editing or deleting
  const [editModalVisible, setEditModalVisible] = useState(false); // Edit modal visibility
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Delete modal visibility
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");

  // Fetch all products on component mount
  useEffect(() => {
    axios.get("/Products").then((response) => {
      setProducts(response.data);
    });
    axios.get("/Categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  // Open edit modal and set current product data
  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setEditModalVisible(true);
  };

  // Close edit modal and reset current product data
  const handleCloseEditModal = () => {
    setCurrentProduct(null);
    setEditModalVisible(false);
  };

  // Open delete modal and set current product data
  const handleOpenDeleteModal = (product) => {
    setCurrentProduct(product);
    setDeleteModalVisible(true);
  };

  // Close delete modal and reset current product data
  const handleCloseDeleteModal = () => {
    setCurrentProduct(null);
    setDeleteModalVisible(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/Products", {
        name,
        price,
        description,
        status: "1",
        quantity,
        unit,
        categoryId: selectedCategory,
      });
      setName("");
      setPrice("");
      setDescription("");
      setQuantity("");
      setUnit("");
      setSelectedCategory("");
      axios.get("/Products").then((response) => {
        setProducts(response.data); // Refresh the pod list
      });
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  // Handle editing a product
  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/Products/${currentProduct.id}`, currentProduct); // Update product details
      handleCloseEditModal(); // Close modal after successful update
      axios.get("/Products").then((response) => {
        setProducts(response.data); // Refresh product list
      });
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/Products/${currentProduct.id}`); // Delete the selected product
      handleCloseDeleteModal(); // Close modal after successful delete
      axios.get("/Products").then((response) => {
        setProducts(response.data); // Refresh product list
      });
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  // Function to handle category creation
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/Categories", {
        name: categoryName,
      });
      setCategoryName(""); // Clear the input after creation
      axios.get("/Categories").then((response) => {
        setCategories(response.data); // Refresh category list
      });
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <>
      <Head />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel ps-container ps-theme-default">
          <Navbar />
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header card-header-icon card-header-rose">
                      <div className="card-icon">
                        <i className="material-icons">assignment</i>
                      </div>
                      <h4 className="card-title">Products</h4>
                    </div>
                    <div className="card-body table-full-width table-hover">
                      <div className="table-responsive">
                        <table className="table">
                          {/* Table Head */}
                          <thead>
                            <tr>
                              <th className="text-center">#</th>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Desc</th>
                              <th>Status</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                              <th>CategoryId</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product) => (
                              <tr key={product.id}>
                                <td className="text-center">{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.description}</td>
                                <td>{product.status}</td>
                                <td>{product.quantity}</td>
                                <td>{product.unit}</td>
                                <td>{product.categoryId}</td>
                                <td className="td-actions text-right">
                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => handleOpenEditModal(product)}
                                  >
                                    <i className="material-icons">edit</i>
                                  </button>
                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleOpenDeleteModal(product)
                                    }
                                  >
                                    <i className="material-icons">close</i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header card-header-rose card-header-text">
                      <div className="card-text">
                        <h4 className="card-title">CREATE NEW PRODUCT</h4>
                      </div>
                    </div>
                    <form
                      role="form"
                      onSubmit={handleCreate}
                      className="form-horizontal"
                    >
                      <div className="card-body">
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Name
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Price
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Description
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Quantity
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Unit
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Category
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <select
                                className="form-control"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                              >
                                <option value="" disabled>
                                  Select Category
                                </option>
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button type="submit" className="btn btn-fill btn-rose">
                          Create
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header card-header-rose card-header-text">
                      <div className="card-text">
                        <h4 className="card-title">CREATE NEW CATEGORY</h4>
                      </div>
                    </div>
                    <form
                      role="form"
                      onSubmit={handleCreateCategory}
                      className="form-horizontal"
                    >
                      <div className="card-body">
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Category Name
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={categoryName}
                                onChange={(e) =>
                                  setCategoryName(e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button type="submit" className="btn btn-fill btn-rose">
                          Create Category
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={editModalVisible} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditProduct}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={currentProduct?.name || ""}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={currentProduct?.price || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    price: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={currentProduct?.description || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={currentProduct?.status || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    status: e.target.value,
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                className="form-control"
                value={currentProduct?.quantity || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    quantity: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input
                type="text"
                className="form-control"
                value={currentProduct?.unit || ""}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, unit: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Category ID</label>
              <input
                type="number"
                className="form-control"
                value={currentProduct?.categoryId || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    categoryId: e.target.value,
                  })
                }
              />
            </div>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModalVisible} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the product{" "}
            {currentProduct ? currentProduct.name : ""}?
          </p>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Products;

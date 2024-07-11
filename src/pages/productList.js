
import React, { useEffect, useState } from "react";
import productService from "../productService";
import { CardComponent } from "../components/cardComponent";
import { Dropdown, Button, TextInput } from "flowbite-react";
import { EditModal } from "../components/EditForm";

import { CiSearch, CiDollar } from "react-icons/ci";
import { Tabs } from "flowbite-react";
import { HiAdjustments, HiUserCircle } from "react-icons/hi";
import { MdSortByAlpha } from "react-icons/md";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortOrder, setSortOrder] = useState("ascending"); // or "descending"
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Function to toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
  };

  // Function to sort products by price
  const sortProductsByPrice = (products, order) => {
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) =>
      order === "ascending" ? a.price - b.price : b.price - a.price
    );
    return sortedProducts;
  };

  // Function to filter products based on current filters
  const filterProducts = (products) => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter((item) => {
      const itemPrice = item.price;
      const minPrice = priceRange.min !== "" ? parseInt(priceRange.min) : 0;
      const maxPrice = priceRange.max !== "" ? parseInt(priceRange.max) : Infinity;

      return itemPrice >= minPrice && itemPrice <= maxPrice;
    });

    return filtered;
  };

  // Function to handle category selection toggle
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
    } else {
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  // Function to reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };
  useEffect(() => {
    // Fetch products from productService
    productService
      .getProducts()
      .then((response) => {
        setProducts(response.data);
        const uniqueCategories = [
          ...new Set(response.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    // Update filtered product list based on filters and sorting
    const filteredProducts = filterProducts(products);
    const sortedProducts = sortProductsByPrice(filteredProducts, sortOrder);
    setFilteredProductList(sortedProducts);
  }, [products, selectedCategories, searchTerm, priceRange, sortOrder]);

  return (
    <div className="container mx-auto p-4 bg-white mt-4 rounded">
      <Tabs aria-label="Tabs with underline" variant="underline">
        <Tabs.Item active title="All Product" icon={HiUserCircle}>
          <TextInput
            type="text"
            value={searchTerm}
            icon={CiSearch}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2"
            placeholder="Search by name..."
          />
        </Tabs.Item>
        <Tabs.Item
          title="Filter Product"
          icon={HiAdjustments}
          className="border-0 border-b-2 rouded-t-lg"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex items-center space-x-4 ">
              <Dropdown label="Category" dismissOnClick={false}>
                {categories.map((category) => (
                  <Dropdown.Item
                    key={category}
                    className={`mr-2 mb-2 px-4 py-2 rounded ${
                      selectedCategories.includes(category)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Dropdown.Item>
                ))}
              </Dropdown>

              <div className="flex space-x-2">
                <TextInput
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  icon={CiDollar}
                  className="w-full p-2"
                  placeholder="Min"
                />

                <TextInput
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  icon={CiDollar}
                  className="w-full p-2"
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <TextInput
                type="text"
                value={searchTerm}
                icon={CiSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2"
                placeholder="Search by name..."
              />

              <div className="mt-4 lg:mt-0 flex items-center justify-end">
                <Button onClick={resetFilters} className="">
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Sort By Price" icon={MdSortByAlpha}>
          <div className="flex justify-between">
            <Button onClick={toggleSortOrder}>
              {sortOrder === "ascending" ? "Sort Dsc " : "Sort Asc"}
            </Button>
            <Button onClick={resetFilters}>Reset</Button>
          </div>
        </Tabs.Item>
      </Tabs>

      <div className="flex justify-between items-center mb-4">
        {/* <h1 className="text-2xl font-bold">Products</h1> */}
      </div>


      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProductList.map((product) => (
          <CardComponent
           key={product.id}
            name={product.name}
            brand={product.brand}
            category={product.category}
            description={product.description}
            price={product.price}
            image={product.photos}
            onEdit={() => handleEdit(product)}
          />
        ))}
      </div>

      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
          onSave={handleSaveEdit}
        />
      )}

    </div>
  );
};

export default ProductList;

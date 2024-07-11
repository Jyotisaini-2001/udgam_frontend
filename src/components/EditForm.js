import { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import { Input } from "./input";

export function EditModal({ isOpen, onClose, product, onSave }) {
  const [formData, setFormData] = useState({
    name: product.name,
    brand: product.brand,
    category: product.category,
    description: product.description,
    price: product.price,
    image: product.photos,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://udgam-backend-host.onrender.com/products/update/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        onSave(updatedProduct);
        onClose();
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal show={isOpen} size="xl" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="flex justify-center">
          <div className="relative flex w-full max-w-screen-lg">
            <div className="bg-white w-full lg:max-w-md ml-0 lg:ml-10 lg:mt-0">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Edit Product
              </h3>
              <form className="flex flex-col gap-6" onSubmit={handleSave}>
                <Input
                  label="Product Name"
                  id="productName"
                  placeholder="Enter product name"
                  FieldName={formData.name}
                  setFieldName={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                />
                <Input
                  label="Category"
                  id="category"
                  placeholder="Enter category"
                  FieldName={formData.category}
                  setFieldName={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                />
                <Input
                  label="Brand Name"
                  id="brandName"
                  placeholder="Enter brand name"
                  FieldName={formData.brand}
                  setFieldName={(value) =>
                    setFormData({ ...formData, brand: value })
                  }
                />
                <Input
                  label="Price"
                  id="price"
                  placeholder="Enter price"
                  FieldName={formData.price}
                  setFieldName={(value) =>
                    setFormData({ ...formData, price: value })
                  }
                />
                <Input
                  label="Description"
                  id="description"
                  placeholder="Enter description"
                  FieldName={formData.description}
                  setFieldName={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                />
                <Input
                  label="Image"
                  id="image"
                  placeholder="Enter image URL"
                  FieldName={formData.image}
                  setFieldName={(value) =>
                    setFormData({ ...formData, image: value })
                  }
                />
                <div className="flex justify-end">
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

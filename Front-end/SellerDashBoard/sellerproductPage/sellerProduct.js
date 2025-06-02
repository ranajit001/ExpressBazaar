import { API_BASE_URL } from "../../baseurl.js";

const productsTable = document.getElementById('productsTable');
const addProductForm = document.getElementById('addProductForm');
let products = [];

// 1. Fetch Products
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/seller/products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        products = data.products;
        displayProducts();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch products');
    }
}

// 2. Display Products
function displayProducts() {
    console.log((products));
    
    productsTable.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.images?.[0] ||
                 'https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png'}" class="preview-image"></td>
            <td>${product.title}</td>
            <td>${product.category}</td>
            <td>${product.brand}</td>
            <td>₹${product.price}</td>
            <td>${product.stock || 0}</td>
            <td class="action-buttons">
                <button onclick="updateProduct('${product._id}')" class="update-btn">Update</button>
                <button onclick="deleteProduct('${product._id}')" class="delete-btn">Delete</button>
            </td>
        </tr>
    `).join('');
}

// 3. Add Product
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch(`${API_BASE_URL}/seller/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            alert('Product added successfully');
            e.target.reset();
            fetchProducts();
        } else {
            alert('Failed to add product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add product');
    }
});

// 4. Delete Product
async function deleteProduct(id) {
    if (!confirm('Are you sure?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/seller/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert('Product deleted successfully');
            fetchProducts();
        } else {
            alert('Failed to delete product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete product');
    }
}

// 5. Update Product
async function updateProduct(id) {
    const product = products.find(p => p._id === id);
    if (!product) return;

    // Fill the update form
    const updateForm = document.getElementById('updateProductForm');
    updateForm.productId.value = id;
    updateForm.title.value = product.title;
    updateForm.category.value = product.category;
    updateForm.brand.value = product.brand;
    updateForm.price.value = product.price;
    updateForm.stock.value = product.stock || 0;
    updateForm.description.value = product.description;
    updateForm.tags.value = product.tags.join(',');

    // Show modal
    document.getElementById('updateModal').style.display = 'block';
}

// Add update form submit handler
document.getElementById('updateProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productId = formData.get('productId');

    try {
        const response = await fetch(`${API_BASE_URL}/seller/update/${productId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: formData.get('title'),
                category: formData.get('category'),
                brand: formData.get('brand'),
                price: Number(formData.get('price')),
                stock: Number(formData.get('stock')),
                description: formData.get('description'),
                tags: formData.get('tags').split(',').map(tag => tag.trim())
            })
        });

        if (response.ok) {
            document.getElementById('updateModal').style.display = 'none';
            alert('Product updated successfully');
            fetchProducts();
        } else {
            alert('Failed to update product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update product');
    }
});

// Add modal close functionality
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('updateModal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('updateModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Make deleteProduct and updateProduct available globally
window.deleteProduct = deleteProduct;
window.updateProduct = updateProduct;

// Initialize
fetchProducts();
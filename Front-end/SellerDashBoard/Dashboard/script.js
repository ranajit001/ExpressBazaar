 // Get seller ID from localStorage
        const sellerId = localStorage.getItem('sellerId');
        const token = localStorage.getItem('token');

        // Base URL for API
        const API_BASE_URL = 'http://localhost:8080';//      <= correct it

        async function fetchDashboardData() {
            try {
                // Fetch products data
                const productsResponse = await fetch(`${API_BASE_URL}/seller/products?sellerId=${sellerId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const products = await productsResponse.json();

                // Update statistics
                document.getElementById('activeProducts').textContent = products.length;
                
                // Calculate average rating
                const totalRating = products.reduce((sum, product) => sum + (product.rating || 0), 0);
                const avgRating = products.length ? (totalRating / products.length).toFixed(1) : '0.0';
                document.getElementById('averageRating').textContent = avgRating;

                // Mock data for demonstration
                document.getElementById('totalRevenue').textContent = '₹' + (Math.random() * 100000).toFixed(2);
                document.getElementById('productsSold').textContent = Math.floor(Math.random() * 1000);

                // Populate recent orders table with mock data
                const mockOrders = [
                    { id: 'ORD001', product: 'Smartphone', customer: 'John Doe', price: '₹15,999', status: 'delivered' },
                    { id: 'ORD002', product: 'Laptop', customer: 'Jane Smith', price: '₹45,999', status: 'pending' },
                    { id: 'ORD003', product: 'Headphones', customer: 'Mike Johnson', price: '₹1,999', status: 'delivered' },
                ];

                const ordersHTML = mockOrders.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.product}</td>
                        <td>${order.customer}</td>
                        <td>${order.price}</td>
                        <td><span class="status ${order.status}">${order.status}</span></td>
                    </tr>
                `).join('');

                document.getElementById('recentOrdersTable').innerHTML = ordersHTML;

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        }

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../signupLogin/signupOrlogin.html';
        });

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', fetchDashboardData);
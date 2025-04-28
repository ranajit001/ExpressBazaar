document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchTermElement = document.getElementById('search-term');
    const searchTermPlaceholders = document.querySelectorAll('.search-term-placeholder');
    const resultsGridElement = document.getElementById('results-grid');
    const noResultsElement = document.getElementById('no-results');
    const loadingElement = document.getElementById('loading');
    const paginationElement = document.getElementById('pagination');
    const resultsCountElement = document.getElementById('results-count');
    const sortSelect = document.getElementById('sort-select');
    const priceFilterBtn = document.getElementById('price-filter-btn');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search') || '';
    const currentPage = parseInt(urlParams.get('page') || '1');
    const currentSort = urlParams.get('sort') || 'price';
    const currentOrder = urlParams.get('order') || 'asc';
    
    // Set initial values based on URL parameters
    searchInput.value = searchQuery;
    searchTermElement.textContent = searchQuery;
    searchTermPlaceholders.forEach(el => el.textContent = searchQuery);
    
    // Set sort select value
    if (currentSort === 'price' && currentOrder === 'asc') {
        sortSelect.value = 'price_asc';
    } else if (currentSort === 'price' && currentOrder === 'desc') {
        sortSelect.value = 'price_desc';
    } else if (currentSort === 'rating' && currentOrder === 'desc') {
        sortSelect.value = 'rating_desc';
    } else if (currentSort === 'createdAt' && currentOrder === 'desc') {
        sortSelect.value = 'newest';
    }

    // Function to fetch products from API
    async function fetchProducts() {
        // Show loading
        loadingElement.style.display = 'block';
        resultsGridElement.style.display = 'none';
        noResultsElement.style.display = 'none';
        paginationElement.style.display = 'none';

        // Get filter values
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;
        
        const selectedCategories = [...document.querySelectorAll('input[name="category"]:checked')]
            .map(checkbox => checkbox.value);
        
        const selectedBrands = [...document.querySelectorAll('input[name="brand"]:checked')]
            .map(checkbox => checkbox.value);
        
        const selectedRatings = [...document.querySelectorAll('input[name="rating"]:checked')]
            .map(checkbox => checkbox.value);
        
        // Build query parameters
        let queryParams = new URLSearchParams();
        
        if (searchQuery) {
            queryParams.append('search', searchQuery);
        }
        
        queryParams.append('page', currentPage);
        queryParams.append('limit', 12); // Number of products per page
        
        // Sort parameters from the dropdown
        const [sortField, sortOrder] = sortSelect.value.split('_');
        if (sortField === 'price') {
            queryParams.append('sort', 'price');
            queryParams.append('order', sortOrder);
        } else if (sortField === 'rating') {
            queryParams.append('sort', 'rating');
            queryParams.append('order', sortOrder);
        } else if (sortField === 'newest') {
            queryParams.append('sort', 'createdAt');
            queryParams.append('order', 'desc');
        }
        
        // Additional filters - these would need to be handled on your backend
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (selectedCategories.length > 0) queryParams.append('categories', selectedCategories.join(','));
        if (selectedBrands.length > 0) queryParams.append('brands', selectedBrands.join(','));

        try {
            // Replace with your actual API endpoint
            const apiUrl = `/api/products?${queryParams.toString()}`;
            
            // For now, we'll simulate the API call
            // In a real implementation, you would use fetch like this:
            // const response = await fetch(apiUrl);
            // const data = await response.json();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Simulate API response based on search query
            const mockData = simulateApiResponse(searchQuery, currentPage, sortSelect.value);
            
            // Process and display results
            displayResults(mockData);
            
        } catch (error) {
            console.error('Error fetching products:', error);
            noResultsElement.style.display = 'block';
            loadingElement.style.display = 'none';
        }
    }

    // Function to simulate API response (for demonstration)
    function simulateApiResponse(query, page, sortValue) {
        // Create sample products - in real app these would come from your API
        let products = [];
        
        // Generate products only if search query is not empty
        if (query) {
            // Sample product data
            const productTypes = [
                'Smartphone', 'Laptop', 'Headphones', 'Tablet', 'Camera', 
                'Smartwatch', 'Speaker', 'TV', 'Gaming Console', 'Keyboard'
            ];
            
            const brands = ['Samsung', 'Apple', 'Sony', 'Dell', 'HP', 'Lenovo', 'LG', 'Bose'];
            
            // Generate sample products based on search query
            for (let i = 1; i <= 50; i++) {
                const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
                const brand = brands[Math.floor(Math.random() * brands.length)];
                const price = (Math.random() * 1000 + 50).toFixed(2);
                const rating = (Math.random() * 3 + 2).toFixed(1); // Rating between 2.0 and 5.0
                
                // Only include products that match the search query
                if (productType.toLowerCase().includes(query.toLowerCase()) || 
                    brand.toLowerCase().includes(query.toLowerCase())) {
                    products.push({
                        id: i,
                        title: `${brand} ${productType} - Premium Model`,
                        brand: brand,
                        price: price,
                        rating: rating,
                        image: `/api/placeholder/200/180?text=${brand}+${productType}`
                    });
                }
            }
        }
        
        // Apply sorting
        if (sortValue === 'price_asc') {
            products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortValue === 'price_desc') {
            products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortValue === 'rating_desc') {
            products.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        } else if (sortValue === 'newest') {
            // Just shuffle the array for "newest" since we don't have real timestamps
            products.sort(() => Math.random() - 0.5);
        }
        
        // Paginate results
        const limit = 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = products.slice(startIndex, endIndex);
        const totalPages = Math.ceil(products.length / limit);
        
        return {
            success: true,
            message: "Products fetched successfully",
            products: paginatedProducts,
            totalProducts: products.length,
            currentPage: page,
            totalPages: totalPages
        };
    }

    // Function to display results
    function displayResults(data) {
        loadingElement.style.display = 'none';
        
        if (!data.products || data.products.length === 0) {
            noResultsElement.style.display = 'block';
            return;
        }
        
        // Display results count
        resultsCountElement.innerHTML = `Showing ${data.products.length} of ${data.totalProducts} results for: "<span id="search-term">${searchQuery}</span>"`;
        
        // Display products
        resultsGridElement.innerHTML = '';
        resultsGridElement.style.display = 'grid';
        
        data.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Create star rating HTML
            const rating = parseFloat(product.rating);
            const stars = '★'.repeat(Math.floor(rating)) + 
                         (rating % 1 >= 0.5 ? '½' : '') + 
                         '☆'.repeat(5 - Math.ceil(rating));
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    <div class="product-rating">${stars} (${rating})</div>
                    <button>Add to Cart</button>
                </div>
            `;
            
            resultsGridElement.appendChild(productCard);
        });
        
        // Create pagination
        if (data.totalPages > 1) {
            paginationElement.innerHTML = '';
            paginationElement.style.display = 'flex';
            
            // Previous page
            if (data.currentPage > 1) {
                const prevLink = createPaginationLink(data.currentPage - 1, '&laquo; Prev');
                paginationElement.appendChild(prevLink);
            }
            
            // Page numbers
            const maxPages = 5; // Max number of page links to show
            let startPage = Math.max(1, data.currentPage - Math.floor(maxPages / 2));
            let endPage = Math.min(data.totalPages, startPage + maxPages - 1);
            
            if (endPage - startPage + 1 < maxPages) {
                startPage = Math.max(1, endPage - maxPages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                const isActive = i === data.currentPage;
                const pageLink = createPaginationLink(i, i.toString(), isActive);
                paginationElement.appendChild(pageLink);
            }
            
            // Next page
            if (data.currentPage < data.totalPages) {
                const nextLink = createPaginationLink(data.currentPage + 1, 'Next &raquo;');
                paginationElement.appendChild(nextLink);
            }
        }
    }

    // Helper function to create pagination links
    function createPaginationLink(page, text, isActive = false) {
        const link = document.createElement('a');
        link.href = `?search=${encodeURIComponent(searchQuery)}&page=${page}&sort=${currentSort}&order=${currentOrder}`;
        link.innerHTML = text;
        if (isActive) {
            link.className = 'active';
        }
    }})
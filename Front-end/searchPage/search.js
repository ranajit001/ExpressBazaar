import { API_BASE_URL } from "../baseurl.js";

document.addEventListener('DOMContentLoaded', () => {
    // API Base URL - You'll need to replace this with your actual API URL later

    // Get elements
    const searchInput = document.getElementById('search-input'); //
    const searchButton = document.getElementById('search-button');//
    const resultsGridElement = document.getElementById('results-grid');//
    const noResultsElement = document.getElementById('no-results');//
    const loadingElement = document.getElementById('loading');
    const paginationElement = document.getElementById('pagination');
    const resultsCountElement = document.getElementById('results-count');
    const sortSelect = document.getElementById('sort-select');
    // Filter Elements

    const priceFilterBtn = document.getElementById('price-filter-btn').addEventListener('click',filterFetch)
    const ratingCheckboxes = document.querySelectorAll('input[name="rating"]');
    const ratingDiv = document.getElementById('customer_rating').addEventListener('change', filterFetch);

const all_brand_filter = document.getElementById('all_brand');
const all_catagory_filter = document.getElementById('all_category')



let currentPage = 1;
let hasMoreItems = false; //pagination indicator



 // to prevent selectiong more then 1 reting checkbox
  ratingCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      if (this.checked) {
        ratingCheckboxes.forEach((cb) => {
          if (cb !== this) cb.checked = false; // Uncheck others
        });
      }
    });
  });











//********************************Search bar search functonality********************************************* */
// everything will be re-fetched and shown
    // Event listeners
    searchButton.addEventListener('click', (e) => {
       initialFetch(searchInput.value) 

    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            initialFetch(searchInput.value)
        }
    });

    let allProducts = null;
    let allcategories = null;
    let allbrands = null;


    async function initialFetch(search_keyword){ //initial sear funnction => search filter reset
        

     resultsGridElement.innerHTML = '';

    const backnedUrl =`${API_BASE_URL}/allProducts?search=${encodeURIComponent(search_keyword)}`; //taking params from frontnedn url
    const response = await fetch(backnedUrl);
    const data = await response.json();
    // console.log(data.products);

    allProducts =data.products;
    allcategories =  data.categories;
    allbrands = data.brands;
    hasMoreItems = data.hasMoreItems; console.log(data.products,'from initial');
    
     displayProduct();
     displayBrands();
     displayCategory();
    //   createSimplePagination(hasMoreItems);
}
initialFetch('')
//********************************************Left side filter functionaliy*************************************************************** */

//only product chenges , filter selection remains same.  <= attention


async function filterFetch(){ // called from displaybrand display category, top price filtrtbtn eventlistner

    //new query parameter
     const params = new URLSearchParams();

     params.append('search',encodeURIComponent(searchInput.value));
     params.append('page',currentPage)

            // categoty checked filter left
                const categoryCheckboxes = document.querySelectorAll('input[name="category"]');

        const selectedCategories = Array.from(categoryCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
            // console.log(selectedCategories);
            
        if (selectedCategories.length > 0) {
            params.append('categories', selectedCategories.join(','));
            }



// brands checked filter left
        const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
        const selectedBrands = Array.from(brandCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        if (selectedBrands.length > 0) {
            console.log(selectedBrands);
            params.append('brands', selectedBrands.join(','));
}


    // Max min price filtr left
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
            const minPrice = minPriceInput.value;
        const maxPrice = maxPriceInput.value;
        if (minPrice) {
            params.append('minPrice', minPrice || 1);
        }
        if (maxPrice) {
            params.append('maxPrice', maxPrice);
        }

    //rating part left
    const ratingBox = document.querySelectorAll('input[name="rating"]');
    const selectedRating = Array.from(ratingBox).find(cb => cb.checked); console.log('hiiiiiiiii');
    // Only one allowed anyway 
        if (selectedRating) { console.log(selectedRating);
        
        params.append('rating', selectedRating.value); 
    }


    // top-middle right low heigh filter
        //     const [sortField, sortOrder] = sortSelect.value.split('_'); // => price_asc -> split
        // params.append('sort', sortField === 'newest' ? 'createdAt' : sortField);
        // params.append('order', sortField === 'newest' ? 'desc' : sortOrder);

        const backendurl_for_filter = `${API_BASE_URL}/allProducts?${params.toString()}`

    const response = await fetch(backendurl_for_filter); // Changed from backnedUrl to backendurl_for_filter
    const data = await response.json();
    // console.log(data);
        hasMoreItems = data.hasMoreItems; console.log(data.products,'from filter');
    displayProduct(data.products); 
    // createSimplePagination(hasMoreItems)
}












// Function to display results
     function displayProduct(products) {
       products =  products ? products : allProducts
        loadingElement.style.display = 'none';

        // Check if there are products
        if (!products|| products.length === 0) {
            noResultsElement.style.display = 'block';
            resultsGridElement.innerHTML = '';
            return;
        }
        noResultsElement.style.display = 'none';
        // Update results count
        resultsCountElement.innerHTML = `Showing results for: "<span id="search-term">${searchInput.value}</span>"`;

        // Display products
        resultsGridElement.innerHTML = '';
        resultsGridElement.style.display = 'grid';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            // Create star rating display
            const rating = parseFloat(product.rating || 0);
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            const stars = '★'.repeat(fullStars) +
                (hasHalfStar ? '½' : '') +
                '☆'.repeat(emptyStars);

            // Handle image URL
            let imageUrl = product.images[0] ? product.image[0] :`https://media.newyorker.com/photos/62c4511e47222e61f46c2daa/master/w_1920,c_limit/shouts-animals-watch-baby-hemingway.jpg`
            // Add HTML for product card
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    <div class="product-rating">${stars} (${rating || 0})</div>
                   
                    <button
                    style="background-color: ${product.count > 0 ? '#28a745' : '#8f6a75'}; color: white;" 
                    ${product.count > 0 ? '' : 'disabled'}
                    >${product.count>0 ? `Add to Cart`:`Out of Stock`}</button>
                </div>
            `;

            resultsGridElement.appendChild(productCard);
        });

    };



function displayBrands(brands){
    brands = brands ? brands : allbrands;
    all_brand_filter.innerHTML = ''
    brands.forEach(el=>{
        const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" name="brand" value="${el}"> ${el}`;

    const checkbox = label.querySelector('input'); // so that every time i clik on check-box 
    checkbox.addEventListener('change', filterFetch); //filterfetch function is called

    all_brand_filter.appendChild(label);
    });
};



function displayCategory(category){
    category = category ? category : allcategories;
    all_catagory_filter.innerHTML = ''
    category.forEach(el => {
        const label = document.createElement('label');
        // Changed from 'brand' to 'category'
        label.innerHTML = `<input type="checkbox" name="category" value="${el}"> ${el}`; 

        const checkbox = label.querySelector('input');
        checkbox.addEventListener('change', filterFetch);
        
        all_catagory_filter.appendChild(label);
    });
}






    // Create simple pagination links (previous/next)
    function createSimplePagination(hasMoreItems) {

        Element.innerHTML = '';
        paginationElement.style.display = 'flex';

        // Previous page link
        if (currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevLink.innerHTML = '&laquo; Prev';
            paginationElement.appendChild(prevBtn);
            currentPage -=1
        }

        // Current page indicator
        const currentPageIndicator = document.createElement('button');
        currentPageIndicator.className = 'active';
        currentPageIndicator.textContent = currentPage;
        paginationElement.appendChild(currentPageIndicator);

        // Next page link (show only if we have items equal to limit, suggesting more pages)
        if (hasMoreItems) {
            const nextLink = document.createElement('button');
            nextLink.innerHTML = 'Next &raquo;';
            paginationElement.appendChild(nextLink);
            currentPage++
        }
    }
});
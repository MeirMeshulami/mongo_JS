document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchButton').addEventListener('click', async () => {
        const query = document.getElementById('searchInput').value;
        const response = await fetch(`/api/products?search=${query}`);
        const product = await response.json();

        displayProductDetails(product);
    });

    document.getElementById('removeButton').addEventListener('click', async () => {
        const productName = document.getElementById('removeInput').value;
        
        try {
            const response = await fetch('/api/removeProduct', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: productName })
            });
    
            if (response.ok) {
                const result = await response.json();
                displayMessage(result.message);
            } else {
                throw new Error('Failed to remove product');
            }
        } catch (error) {
            console.error(error);
            displayMessage('Error: Unable to remove product');
        }
    });
    

    document.getElementById('addButton').addEventListener('click', async () => {
        const productName = document.getElementById('addNameInput').value;
        const productCategory = document.getElementById('addCategoryInput').value;
        const productPrice = document.getElementById('addPriceInput').value;
        const productStock = document.getElementById('addStockInput').value;
        const productSupplier = document.getElementById('addSupplierInput').value;
        
        const response = await fetch('/api/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: productName,
                category: productCategory,
                price: productPrice,
                stock: productStock,
                supplier: productSupplier
            })
        });
        const result = await response.json();
        displayMessage(result.message);
    });
});

function displayProductDetails(product) {
    const productDetailsContainer = document.getElementById('productDetails');
    if (Object.keys(product).length === 0) {
        productDetailsContainer.innerHTML = 'Product not found';
    } else {
        let detailsHtml = '<h2>Product Details</h2>';
        for (const key in product) {
            detailsHtml += `<p><strong>${key}:</strong> ${product[key]}</p>`;
        }
        productDetailsContainer.innerHTML = detailsHtml;
    }
}

function displayMessage(message) {
    const productDetailsContainer = document.getElementById('productDetails');
    productDetailsContainer.innerHTML = `<p>${message}</p>`;
}

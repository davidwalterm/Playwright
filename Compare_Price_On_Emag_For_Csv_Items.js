const { chromium } = require('playwright');
const fs = require('fs');

(async () => {

    //Read the csv file and save it    
    const items = fs.readFileSync('search items.csv')
        .toString() //convert Buffer to string
        .split('\n')    //split string to lines
        .map(e => e.trim()) //remove white spaces for each line

    for(const item of items){

        console.log('Item name: ' + item +'.');
        console.log('Verifying prices on first search result.\n');
        // Launch a new Chromium browser instance
        const browser = await chromium.launch();
  
        // Create a new page
        const page = await browser.newPage();

        // Navigate to the commercial website
        await page.goto('https://www.emag.ro/#opensearch'); // Replace with the URL of the commercial website you want to search.

        // Perform a search for your desired item
        await page.type('input[name="query"]', item); // Replace with the appropriate selector and item name

        // Press Enter to initiate the search
        await page.press('input[name="query"]', 'Enter');

        // Wait for search results to load (you may need to adjust the timeout)
        await page.waitForSelector('.page-container', { timeout: 5000 });

        // Get the price of the searched item from the search results
        const searchResultPrice = await page.$eval('.page-container .card-v2 .product-new-price', (priceElement) => priceElement.textContent);

        // Click on the first search result to view the item details page
        await page.click('.page-container .card-v2:first-child');

        // Wait for the item details page to load
        await page.waitForSelector('.main-container-inner', { timeout: 5000 });

        // Get the price of the item on the details page
        const itemDetailsPrice = await page.$eval('.main-container-inner .product-new-price', (priceElement) => priceElement.textContent);

        // Compare the prices
        if (searchResultPrice === itemDetailsPrice) {
            console.log('Price on search results page: ' + searchResultPrice);
            console.log('Price on item details page: ' + itemDetailsPrice);
            console.log('Prices are the same.\n');
        } else {
            console.log('Price on search results page: ' + searchResultPrice);
            console.log('Price on item details page: ' + itemDetailsPrice);
            console.log('Prices are different.\n');
        }

        // Close the browser
        await browser.close();
    }
})();
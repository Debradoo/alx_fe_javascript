/*JavaScript Implementation:
Write a JavaScript file (script.js) that handles the
 creation and manipulation of DOM elements based on user interactions.
Manage an array of quote objects where each quote has a text
 and a category. Implement functions to display a random quote 
 and to add new quotes
 called showRandomQuote and createAddQuoteForm` respectively */
 // Array of quote objects
 const quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: 'The sky is blue', category: 'Nature' },
    { text: 'The sun sets', category: 'Sky' },
    { text: 'The moon rises', category: 'Sky' },
    { text: 'The earth revolves around the sun', category: 'Nature' },
    { text: 'The stars twinkle', category: 'Sky' }
];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}
// Function to display a random quote
 function showRandomQuote() {
    // Get a random index from the quotes array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    // Get the quote text and category from the random quote object
    const quoteText = quotes[randomIndex].text;
    const quoteCategory = quotes[randomIndex].category;
    // Update the quote display area with the randomly selected quote
    const quoteDisplay =document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `${quoteText} - ${quoteCategory}`;
    sessionStorage.setItem('lastQuote', JSON.stringify({ text: quoteText, category: quoteCategory }));
}



const btnNewQuote = document.getElementById('newQuote');

// Event listener for the new quote button click
btnNewQuote.addEventListener('click', showRandomQuote);

/*Adding Quotes Dynamically:
Enhance the application to allow users to add their
 own quotes through a simple form interface. Update 
the DOM and the quotes array dynamically when a new quote is added. */


const addQuote = function (){
    // Get the form inputs
    const quoteInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    //retrieve the value
    const text= quoteInput.value;
    const category = categoryInput.value;
    // Create a new quote object
    const newQuote = {text: text, category: category};
    // Add the new quote to the quotes array
    quotes.push(newQuote);
    // Clear the form inputs
    localStorage.setItem('quotes', JSON.stringify(quotes));
    quoteInput.value = '';
    categoryInput.value = '';
    // Display the newly added quote
    // Create new list item dynamically
    const li = document.createElement('li');
    li.textContent = `${text} - ${category}`;
    quoteDisplay.appendChild(li); // Append new quote to the list

    showRandomQuote();

}
// Load last quote from session storage
const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
if (lastQuote) {
    alert(`Last viewed quote: "${lastQuote.text}" - ${lastQuote.category}`);
}
console.log(quotes);

// Function to export quotes as a JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
// Filter Quotes Based on Selected Category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    showRandomQuote();
}

function getFilteredQuotes() {
    const selectedCategory = categoryFilter.value;
    return selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
}

// Populate Categories in Dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}


// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");

            quotes.push(...importedQuotes);
            saveQuotes();
            alert("Quotes imported successfully!");
            displayQuotes(); // Refresh UI
        } catch (error) {
            alert("Error importing quotes: " + error.message);
        }
    };
    fileReader.readAsText(file);
}

// Function to display all quotes in the list
function displayQuotes() {
    const quoteList = document.getElementById('quoteList');
    quoteList.innerHTML = ''; // Clear existing list

    quotes.forEach(quote => {
        const li = document.createElement('li');
        li.textContent = `${quote.text} - ${quote.category}`;
        quoteList.appendChild(li);
    });
}

// Attach event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize the quote display
showRandomQuote();
displayQuotes();


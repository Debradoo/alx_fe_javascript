/*JavaScript Implementation:
Write a JavaScript file (script.js) that handles the
 creation and manipulation of DOM elements based on user interactions.
Manage an array of quote objects where each quote has a text
 and a category. Implement functions to display a random quote 
 and to add new quotes
 called showRandomQuote and createAddQuoteForm` respectively */
 // Array of quote objects
 const API_URL = "https://jsonplaceholder.typicode.com/posts";
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
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newQuote),
        });

        if (!response.ok) throw new Error("Failed to sync with server");

        alert("Quote added & synced with server!");
    } catch (error) {
        console.error("Error posting quote:", error);
        alert("Failed to sync with server. Please try again later.");
    }
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

// Fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch server quotes");

        const serverQuotes = await response.json();
        const formattedQuotes = serverQuotes.slice(0, 5).map(post => ({
            text: post.title,
            category: "General"
        }));

        handleDataSync(formattedQuotes);
    } catch (error) {
        console.error("Error fetching server quotes:", error);
    }
}

// Handle data sync & resolve conflicts
function handleDataSync(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let conflicts = false;

    serverQuotes.forEach(serverQuote => {
        const existsLocally = localQuotes.some(localQuote => localQuote.text === serverQuote.text);

        if (!existsLocally) {
            quotes.push(serverQuote);
            conflicts = true;
        }
    });

    if (conflicts) {
        saveQuotes();
        displayQuotes();
        alert("New quotes synced from the server!");
    }
}

// Periodic server sync (every 60 seconds)
setInterval(fetchQuotesFromServer, 60000);

// Load last quote from session storage
const lastQuoted = JSON.parse(sessionStorage.getItem("lastQuote"));
if (lastQuoted) {
    alert(`Last viewed quote: "${lastQuoted.text}" - ${lastQuoted.category}"`);
}

// Initialize UI
showRandomQuote();
displayQuotes();
fetchQuotesFromServer();
/*JavaScript Implementation:
Write a JavaScript file (script.js) that handles the
 creation and manipulation of DOM elements based on user interactions.
Manage an array of quote objects where each quote has a text
 and a category. Implement functions to display a random quote 
 and to add new quotes
 called showRandomQuote and createAddQuoteForm` respectively */
 // Array of quote objects
 const quotes = [
    {text: 'The sky is blue', category: 'Nature'},
    {text: 'The sun sets', category: 'Sky'},
    {text: 'The moon rises', category: 'Sky'},
    {text: 'The earth revolves around the sun', category: 'Nature'},
    {text: 'The stars twinkle', category: 'Sky'}
];

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
    quoteInput.value = '';
    categoryInput.value = '';
    // Display the newly added quote
    // Create new list item dynamically
    const li = document.createElement('li');
    li.textContent = `${text} - ${category}`;
    quoteDisplay.appendChild(li); // Append new quote to the list

    showRandomQuote();

}
console.log(quotes);


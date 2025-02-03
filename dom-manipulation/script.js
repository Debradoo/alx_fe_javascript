// Dynamic Quote Generator with Server Sync and Conflict Resolution

const quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: 'The sky is blue', category: 'Nature' },
    { text: 'The sun sets', category: 'Sky' },
    { text: 'The moon rises', category: 'Sky' },
    { text: 'The earth revolves around the sun', category: 'Nature' },
    { text: 'The stars twinkle', category: 'Sky' }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const btnNewQuote = document.getElementById('newQuote');

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.textContent = `${quote.text} - ${quote.category}`;
}

function addQuote() {
    const quoteInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const newQuote = { text: quoteInput.value, category: categoryInput.value };
    quotes.push(newQuote);
    localStorage.setItem('quotes', JSON.stringify(quotes));

    quoteInput.value = '';
    categoryInput.value = '';
    showRandomQuote();
    syncWithServer();
}

function syncWithServer() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(serverQuotes => {
            serverQuotes.forEach(serverQuote => {
                if (!quotes.some(localQuote => localQuote.text === serverQuote.title)) {
                    quotes.push({ text: serverQuote.title, category: 'Server' });
                }
            });
            localStorage.setItem('quotes', JSON.stringify(quotes));
            showNotification('Data synced with server.');
        })
        .catch(error => console.error('Sync error:', error));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.backgroundColor = '#90ee90';
    notification.style.padding = '10px';
    notification.style.margin = '10px 0';
    document.body.insertBefore(notification, quoteDisplay);

    setTimeout(() => notification.remove(), 3000);
}

btnNewQuote.addEventListener('click', showRandomQuote);

window.addEventListener('load', () => {
    showRandomQuote();
    syncWithServer();
    setInterval(syncWithServer, 60000);
});

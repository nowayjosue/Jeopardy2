// Define an array to store used categories to avoid duplicates
let usedCategories = [];

// Function to fetch random categories and their questions from jService API
function getRandomCategories() {
    return $.ajax({
        url: 'http://jservice.io/api/categories',
        data: {
            count: 100, // Get a large pool of categories to choose from
        },
    });
}

// Function to get 5 random questions from a category
function getRandomQuestions(categoryId) {
    return $.ajax({
        url: `http://jservice.io/api/clues?category=${categoryId}`,
    });
}

// Function to create the game board
function createGameBoard(categories) {
    const table = $('#jeopardy-board tbody');
    table.empty();

    for (let row = 0; row < 5; row++) {
        const tr = $('<tr>');
        for (let col = 0; col < 6; col++) {
            const td = $('<td>').text('?').addClass('question');
            tr.append(td);
        }
        table.append(tr);
    }

    // Set the category names in the header cells
    $('#jeopardy-board thead tr th').each(function(index) {
        $(this).text(categories[index].title);
    });
}

// Function to handle user interactions
function setupClickHandlers() {
    $('#jeopardy-board').on('click', 'td', function() {
        const cell = $(this);

        if (cell.hasClass('question')) {
            // Fetch and display the question
            const categoryIndex = cell.index();
            const categoryId = categories[categoryIndex].id;

            getRandomQuestions(categoryId).done(function(questions) {
                if (questions.length > 0) {
                    cell.text(questions[0].question);
                    cell.removeClass('question').addClass('answer');
                }
            });
        } else if (cell.hasClass('answer')) {
            // Do nothing if the cell is already an answer
        }
    });

    $('#restart-button').on('click', function() {
        usedCategories = [];
        initializeGame();
    });
}

// Function to initialize the game
function initializeGame() {
    getRandomCategories().done(function(data) {
        categories = data.filter(category => !usedCategories.includes(category.id));
        if (categories.length < 6) {
            // if not enough categories are available, restart the game
            initializeGame();
        } else {
            usedCategories.push(...categories.map(category => category.id));
            createGameBoard(categories);
        }
    });
}

$(document).ready(function() {
    let categories = [];

    initializeGame();
    setupClickHandlers();
});
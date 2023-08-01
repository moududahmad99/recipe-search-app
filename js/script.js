const searchForm = document.getElementById('searchForm');
const searchQuery = document.getElementById('searchQuery');
const recipeResults = document.getElementById('recipeResults');
const modalContainer = document.getElementById('modalContainer');
const modalContent = document.getElementById('modalContent');
const closeModalButton = document.getElementById('closeModal');
const viewMoreButton = document.getElementById('viewMoreButton');

const appId = '317ea2f5';
const appKey = '1174a5af1b8ae31e26464ec3c1d6cc44';
let currentPage = 1;
let currentQuery = '';

function fetchRecipes(query, page) {
    const url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}&from=${(page - 1) * 10}&to=${page * 10}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.hits);
            if (data.hits.length === 0) {
                viewMoreButton.style.display = 'none';
            } else {
                viewMoreButton.style.display = 'block';
            }
        })
        .catch(error => console.log(error));
}

function displayRecipes(recipes) {
    if (currentPage === 1) {
        recipeResults.innerHTML = '';
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const recipeItem = document.createElement('div');
        recipeItem.classList.add('recipe-item');
        recipeItem.innerHTML = `
      <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
      <p class="food-name">Name: ${recipe.recipe.label}</p>
      <p>Source: ${recipe.recipe.source}</p>
      <button class="view-more">Details</button>
    `;

        const viewMoreButton = recipeItem.querySelector('.view-more');
        viewMoreButton.addEventListener('click', () => openModal(recipe.recipe));

        recipeCard.appendChild(recipeItem);
        recipeResults.appendChild(recipeCard);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    const query = searchQuery.value;
    currentQuery = query;
    currentPage = 1;
    fetchRecipes(query, currentPage);
}

function handleViewMore() {
    currentPage++;
    fetchRecipes(currentQuery, currentPage);
}

function openModal(recipe) {
    modalContent.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.label}">
    <p class="recipe-name">Name: ${recipe.label}</p>
    <p>Source: ${recipe.source}</p>
    <p class="ingedient-text">Ingredients:</p>
    <ul class="ingredient-list">
      ${recipe.ingredients.map(ingredient => `<li>${ingredient.text}</li>`).join('')}
    </ul>
  `;
    modalContainer.style.display = 'block';
}



function closeModal() {
    modalContainer.style.display = 'none';
}

searchForm.addEventListener('submit', handleFormSubmit);
closeModalButton.addEventListener('click', closeModal);
viewMoreButton.addEventListener('click', handleViewMore);

// Go Back
function goBack() {
    history.back();
}

const searchBox = document.querySelector('.searchBox');
const searchButton = document.querySelector('.searchButton');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');



// Function to get recipes
const fetchRecipes = async (query) => {
    // Display fetching message
    recipeContainer.innerHTML = '<h2>Fetching recipes....</h2>';
    
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        
        // Clear the fetching message before appending new data
        recipeContainer.innerHTML = '';

        if (response.meals) {
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `

                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                //Adding EventListender to recipe button
                button.addEventListener('click', ()=>{
                    openRecipePopup(meal);
                });


                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = '<p>No recipes found. Try another search.</p>';
        }
    } catch (error) {
        recipeContainer.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
    }
}
//function to fetch ingredients and measurments
const fetchIngredientsList =(meal) => {
    let ingredientsList = "";
    for(let i=1;i<=20;i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`
        }
        else{
            break;
        }
    }
    return ingredientsList;
}

const openRecipePopup= (meal)=>{
    recipeDetailsContent.innerHTML = ` 

        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients: </h3>
        <ul class="ingredientList">${fetchIngredientsList(meal)}</ul>
        <div class="recipeInstuctions">
            <h3>Instructions:</h3>
            <p >${meal.strInstructions}</p>
        </div>
        `
        

        recipeDetailsContent.parentElement.style.display = "block";
}


recipeCloseBtn.addEventListener('click', ()=> {
    recipeDetailsContent.parentElement.style.display = "none";
});
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    } else {
        recipeContainer.innerHTML = '<p>Please enter a search term.</p>';
    }
});


export default function IngredientsList ({ ingredients, removeIngredient, getRecipe, recipeSection}){
    return (
        <section>
            <h2>Ingredient on hand:</h2>
<ul>
        {ingredients.map(val => (
          <li key={val}>
            {val}{" "}
            <button
              type="button"
              className="remove-btn"
              aria-label={`Remove ${val}`}
              onClick={() => removeIngredient(val)}
            >
              ✖
              <span className="tooltip">Remove</span>
            </button>
          </li>
        ))}
      </ul>

        { ingredients.length > 3 && <div className="get-recipe-container">
            <div ref={recipeSection}>
                <h3>Ready for a recipe</h3>
                <p>Generate a recipe from your list of ingredients.</p>
            </div>
            <button onClick={getRecipe}>Get a recipe</button>
        </div>}

        </section>
    )
}
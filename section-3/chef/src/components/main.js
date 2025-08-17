import { useState, useRef, useEffect } from "react"
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromMistral } from '../recipe-ai';

export default function Main () {
    const [ingredients, setIngredients] = useState([])
    const [recipe, setRecipe] = useState(false)
    const [message, setMessage] = useState("");
    const messageTimeoutRef = useRef(null);

    async function getRecipe(){
        const recipeaMarkdown = await getRecipeFromMistral(ingredients)
        setRecipe(recipeaMarkdown)
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient").trim()
        // Capitalize first letter, rest lowercase
        const capNewIngredient = newIngredient.charAt(0).toUpperCase() + newIngredient.slice(1).toLowerCase();
        
        // Clear any old timeout
        if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
        }

        if (capNewIngredient === "") {
        setMessage("");
        return;
        }

        if (ingredients.includes(capNewIngredient)) {
        setMessage(`${capNewIngredient} is already in the ingredient list.`);
        // Message to be cleared after 20 Seconds
        messageTimeoutRef.current = setTimeout(() => setMessage(""), 20000);
        } else {
        // Adds the Ingredient to the list
        setIngredients(prevIngredients => [...prevIngredients, capNewIngredient]);
        setMessage(""); 
        }

    }

    // Handler to remove an ingredient
    function removeIngredient(val) {
    setIngredients(prev => prev.filter(item => item !== val));
    }

    useEffect(() => {
    if (ingredients.length < 4 && recipe) {
    setRecipe(false);
    }
    }, [ingredients, recipe]);
    

    return (
        <main>
            <form action={addIngredient}
            className="add-ingredient-form">
            <input type="text" placeholder="e.g. oregano" aria-label="Add ingredient" name="ingredient" required/>
            <button >Add ingredient</button>
            </form>

        <div className="ingredient-counter">
             { ingredients.length > 0 && <p>You currently have {ingredients.length} ingredient in your list</p>}
        </div>

        <div className="message-box">
            {message && <p>{message}</p>}
        </div>

      {ingredients.length > 0 && (
        <IngredientsList 
          ingredients={ingredients} 
          removeIngredient={removeIngredient} 
          getRecipe={getRecipe} 
        />
      )}

     {recipe && ingredients.length >= 4 && <ClaudeRecipe recipe={recipe} />}


        </main>
    )
}
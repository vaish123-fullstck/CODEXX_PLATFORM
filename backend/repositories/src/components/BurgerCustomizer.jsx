import React, { useState } from "react";
import "../styles/BurgerCustomizer.css";
import { menuCategories } from "../components/menuData.js";

export default function BurgerCustomizer() {
  const allIngredients = Array.from(
    new Map(
      Object.values(menuCategories)
        .flatMap(category =>
          category.items.flatMap(item => item.ingredients || [])
        )
        .map((ingredient) => [ingredient.name, ingredient])
    ).values()
  );

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientCount, setIngredientCount] = useState({});

  const ingredientPrices = {
    topbun: 2,
    bottombun: 2,
    lettuce: 1,
    tomato: 1,
    cheese: 1.5,
    patty: 3,
    bacon: 2.5
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) => {
      const existingIngredient = prev.find(item => item.name === ingredient.name);
      if (existingIngredient) {
        setIngredientCount({ ...ingredientCount, [ingredient.name]: (ingredientCount[ingredient.name] || 1) + 1 });
        return [...prev];
      } else {
        setIngredientCount({ ...ingredientCount, [ingredient.name]: 1 });
        return [...prev, ingredient];
      }
    });
  };

  const removeIngredient = (ingredient) => {
    setIngredientCount((prevCount) => {
      const newCount = { ...prevCount };
      if (newCount[ingredient.name] > 1) {
        newCount[ingredient.name] -= 1;
      } else {
        delete newCount[ingredient.name];
        setSelectedIngredients(selectedIngredients.filter(item => item.name !== ingredient.name));
      }
      return newCount;
    });
  };

  const calculateTotalPrice = () => {
    return selectedIngredients.reduce((total, ingredient) => {
      return total + (ingredientPrices[ingredient.name] || 0) * (ingredientCount[ingredient.name] || 1);
    }, 0).toFixed(2);
  };

  const resetBurger = () => {
    setSelectedIngredients([]);
    setIngredientCount({});
  };

  return (
    <div className="burger-customizer">
      <div className="ingredients-container">
        <h2>Choose Ingredients</h2>
        <div className="ingredients-list">
          {allIngredients.map((ingredient) => (
            <div
              key={ingredient.name}
              className={`ingredient ${selectedIngredients.some(item => item.name === ingredient.name) ? "selected" : ""}`}
              onClick={() => toggleIngredient(ingredient)}
            >
              <img src={ingredient.image} alt={ingredient.name} />
              <span>{ingredient.name} ({ingredientCount[ingredient.name] || 0})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="burger-preview">
        <h2>Your Burger</h2>
        <div className="burger-stack">
          {[...selectedIngredients]
            .sort((a, b) => {
              if (a.name === "topbun") return 1;
              if (b.name === "topbun") return -1;
              if (a.name === "bottombun") return -1;
              if (b.name === "bottombun") return 1;
              return 0;
            })
            .map((ingredient, index) => (
              <div className="stacked-container" key={ingredient.name}>
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className={`stacked-ingredient ${
                    ingredient.name === "topbun" ? "top-bun" : ingredient.name === "bottombun" ? "bottom-bun" : "ingredient"
                  }`}
                  style={{
                    zIndex: ingredient.name === "topbun" ? 100 : selectedIngredients.length - index
                  }}
                />
                <span className="ingredient-count">x{ingredientCount[ingredient.name]}</span>
                <button className="remove-ingredient" onClick={() => removeIngredient(ingredient)}>-</button>
              </div>
            ))}
        </div>

        <h3>Total Price: ${calculateTotalPrice()}</h3>
        <button className="add-to-cart-button">Add to Cart</button>
        <button className="reset-button" onClick={resetBurger}>Reset</button>
      </div>
    </div>
  );
}

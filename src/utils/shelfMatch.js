// utils/shelfMatch.js — matches drink ingredients against shelf items
export function getShelfNames(shelf) {
  return shelf.map(i => (typeof i === "object" ? i.name : i).toLowerCase().trim());
}

export function ingredientOnShelf(ingredient, shelfNames) {
  const ing = ingredient.toLowerCase().replace(/\d+ml|\d+oz|\d+tsp|\d+tbsp|\d+cl/gi, "").trim();
  return shelfNames.some(s => ing.includes(s) || s.includes(ing.split(" ").pop()));
}

export function getMissingIngredients(drink, shelf) {
  const names = getShelfNames(shelf);
  return (drink.ingredients || []).filter(ing => !ingredientOnShelf(ing, names));
}

export function calcMatchPct(drink, shelf) {
  const ings = drink.ingredients || [];
  if (!ings.length) return 0;
  const names = getShelfNames(shelf);
  const have = ings.filter(ing => ingredientOnShelf(ing, names)).length;
  return Math.round((have / ings.length) * 100);
}

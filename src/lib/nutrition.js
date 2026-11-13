import { modalityKeyFor } from "./programs.js";
import { workbookMealPlans } from "./workbookMeals.js";

// Valores de referência aproximados por porção indicada. São estimativas educativas,
// não prescrição clínica. Imagens só são usadas quando correspondem ao alimento.
export const foodLibrary = [
  {
    id: "oats",
    name: "Aveia",
    portion: "40 g",
    kcal: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    fiber: 4,
    group: "Carboidrato e fibra",
    emoji: "🥣",
    image: "/assets/food/aveia-simples.jpg",
  },
  {
    id: "banana",
    name: "Banana",
    portion: "1 unidade",
    kcal: 105,
    protein: 1,
    carbs: 27,
    fat: 0,
    fiber: 3,
    group: "Fruta",
    emoji: "🍌",
    image: "/assets/food/reference-crops/banana.webp",
  },
  {
    id: "eggs",
    name: "Ovos",
    portion: "2 unidades",
    kcal: 140,
    protein: 12,
    carbs: 1,
    fat: 10,
    fiber: 0,
    group: "Proteína",
    emoji: "🥚",
    image: "/assets/food/ovos-cozidos.jpg",
  },
  {
    id: "milk",
    name: "Leite",
    portion: "250 ml",
    kcal: 120,
    protein: 8,
    carbs: 12,
    fat: 5,
    fiber: 0,
    group: "Proteína",
    emoji: "🥛",
    image: "/assets/food/leite-copo.jpg",
  },
  {
    id: "yogurt",
    name: "Iogurte natural",
    portion: "170 g",
    kcal: 110,
    protein: 9,
    carbs: 12,
    fat: 3,
    fiber: 0,
    group: "Proteína",
    emoji: "🥣",
    image: "/assets/food/recipes/yogurt-fruit-bowl.webp",
  },
  {
    id: "fresh-cheese",
    name: "Queijo fresco",
    portion: "40 g",
    kcal: 110,
    protein: 7,
    carbs: 2,
    fat: 8,
    fiber: 0,
    group: "Proteína",
    emoji: "🧀",
  },
  {
    id: "chicken",
    name: "Frango grelhado",
    portion: "120 g",
    kcal: 200,
    protein: 37,
    carbs: 0,
    fat: 5,
    fiber: 0,
    group: "Proteína",
    emoji: "🍗",
  },
  {
    id: "fish",
    name: "Peixe grelhado",
    portion: "150 g",
    kcal: 220,
    protein: 32,
    carbs: 0,
    fat: 9,
    fiber: 0,
    group: "Proteína",
    emoji: "🐟",
    image: "/assets/food/peixe-grelhado.jpg",
  },
  {
    id: "beef",
    name: "Carne magra",
    portion: "120 g",
    kcal: 250,
    protein: 32,
    carbs: 0,
    fat: 13,
    fiber: 0,
    group: "Proteína",
    emoji: "🥩",
  },
  {
    id: "tuna",
    name: "Atum",
    portion: "1 lata escorrida",
    kcal: 160,
    protein: 34,
    carbs: 0,
    fat: 2,
    fiber: 0,
    group: "Proteína",
    emoji: "🐟",
  },
  {
    id: "rice",
    name: "Arroz cozido",
    portion: "1 chávena",
    kcal: 205,
    protein: 4,
    carbs: 45,
    fat: 0,
    fiber: 1,
    group: "Carboidrato",
    emoji: "🍚",
    image: "/assets/food/reference-crops/rice.webp",
  },
  {
    id: "sweet-potato",
    name: "Batata-doce",
    portion: "1 média",
    kcal: 180,
    protein: 4,
    carbs: 41,
    fat: 0,
    fiber: 6,
    group: "Carboidrato",
    emoji: "🍠",
    image: "/assets/food/batata-doce-assada.jpg",
  },
  {
    id: "cassava",
    name: "Mandioca",
    portion: "150 g",
    kcal: 240,
    protein: 2,
    carbs: 58,
    fat: 0,
    fiber: 3,
    group: "Carboidrato",
    emoji: "🥔",
  },
  {
    id: "pasta",
    name: "Massa integral",
    portion: "1 chávena",
    kcal: 200,
    protein: 8,
    carbs: 39,
    fat: 2,
    fiber: 5,
    group: "Carboidrato",
    emoji: "🍝",
    image: "/assets/food/reference-crops/spaghetti.webp",
  },
  {
    id: "whole-bread",
    name: "Pão integral",
    portion: "2 fatias",
    kcal: 150,
    protein: 6,
    carbs: 26,
    fat: 2,
    fiber: 4,
    group: "Carboidrato",
    emoji: "🍞",
  },
  {
    id: "xima",
    name: "Xima",
    portion: "1 porção",
    kcal: 220,
    protein: 4,
    carbs: 48,
    fat: 1,
    fiber: 2,
    group: "Carboidrato local",
    emoji: "🍚",
  },
  {
    id: "beans",
    name: "Feijão cozido",
    portion: "1 concha",
    kcal: 180,
    protein: 12,
    carbs: 30,
    fat: 1,
    fiber: 10,
    group: "Proteína e fibra",
    emoji: "🫘",
    image: "/assets/food/feijao-cozido.jpg",
  },
  {
    id: "cowpea",
    name: "Feijão-nhemba",
    portion: "1 concha",
    kcal: 190,
    protein: 13,
    carbs: 32,
    fat: 1,
    fiber: 9,
    group: "Proteína e fibra",
    emoji: "🫘",
    image: "/assets/food/catalog/cowpea.webp",
  },
  {
    id: "peanut",
    name: "Amendoim",
    portion: "25 g",
    kcal: 145,
    protein: 6,
    carbs: 5,
    fat: 12,
    fiber: 2,
    group: "Gordura e proteína",
    emoji: "🥜",
  },
  {
    id: "avocado",
    name: "Abacate",
    portion: "1/2 unidade",
    kcal: 160,
    protein: 2,
    carbs: 8,
    fat: 15,
    fiber: 7,
    group: "Gordura saudável",
    emoji: "🥑",
    image: "/assets/food/catalog/avocado.webp",
  },
  {
    id: "papaya",
    name: "Papaia",
    portion: "1 chávena",
    kcal: 60,
    protein: 1,
    carbs: 15,
    fat: 0,
    fiber: 3,
    group: "Fruta",
    emoji: "🍈",
    image: "/assets/food/reference-crops/mamao.webp",
  },
  {
    id: "orange",
    name: "Laranja",
    portion: "1 unidade",
    kcal: 70,
    protein: 1,
    carbs: 18,
    fat: 0,
    fiber: 4,
    group: "Fruta",
    emoji: "🍊",
    image: "/assets/food/reference-crops/laranja.webp",
  },
  {
    id: "mango",
    name: "Manga",
    portion: "1 chávena",
    kcal: 100,
    protein: 1,
    carbs: 25,
    fat: 1,
    fiber: 3,
    group: "Fruta",
    emoji: "🥭",
    image: "/assets/food/recipes/mango-pineapple-bowl.webp",
  },
  {
    id: "apple",
    name: "Maçã",
    portion: "1 unidade",
    kcal: 95,
    protein: 0,
    carbs: 25,
    fat: 0,
    fiber: 4,
    group: "Fruta",
    emoji: "🍎",
    image: "/assets/food/reference-crops/maca.webp",
  },
  {
    id: "strawberry",
    name: "Morangos",
    portion: "1 chávena",
    kcal: 50,
    protein: 1,
    carbs: 12,
    fat: 0,
    fiber: 3,
    group: "Fruta",
    emoji: "🍓",
    image: "/assets/food/recipes/yogurt-fruit-bowl.webp",
  },
  {
    id: "greens",
    name: "Couve e tomate",
    portion: "2 chávenas",
    kcal: 55,
    protein: 3,
    carbs: 10,
    fat: 1,
    fiber: 4,
    group: "Vegetais",
    emoji: "🥬",
    image: "/assets/food/reference-crops/couve-tomate.webp",
  },
  {
    id: "cabbage",
    name: "Couve",
    portion: "1 chávena",
    kcal: 33,
    protein: 2,
    carbs: 7,
    fat: 0,
    fiber: 3,
    group: "Vegetais",
    emoji: "🥬",
  },
  {
    id: "tomato",
    name: "Tomate",
    portion: "1 unidade",
    kcal: 22,
    protein: 1,
    carbs: 5,
    fat: 0,
    fiber: 1,
    group: "Vegetais",
    emoji: "🍅",
  },
  {
    id: "lettuce",
    name: "Alface",
    portion: "1 chávena",
    kcal: 15,
    protein: 1,
    carbs: 3,
    fat: 0,
    fiber: 1,
    group: "Vegetais",
    emoji: "🥬",
  },
  {
    id: "cucumber",
    name: "Pepino",
    portion: "1/2 unidade",
    kcal: 16,
    protein: 1,
    carbs: 4,
    fat: 0,
    fiber: 1,
    group: "Vegetais",
    emoji: "🥒",
  },
  {
    id: "pumpkin",
    name: "Abóbora",
    portion: "1 chávena",
    kcal: 50,
    protein: 2,
    carbs: 12,
    fat: 0,
    fiber: 3,
    group: "Vegetais",
    emoji: "🎃",
    image: "/assets/food/catalog/pumpkin.webp",
  },
  {
    id: "matapa",
    name: "Matapa",
    portion: "1 porção",
    kcal: 260,
    protein: 8,
    carbs: 12,
    fat: 20,
    fiber: 6,
    group: "Prato moçambicano",
    emoji: "🥬",
    image: "/assets/food/matapa.jpg",
    imageSource: "Fotografia pesquisada de matapa",
  },
  {
    id: "mucapata",
    name: "Mucapata",
    portion: "1 porção",
    kcal: 280,
    protein: 9,
    carbs: 45,
    fat: 7,
    fiber: 8,
    group: "Prato moçambicano",
    emoji: "🍲",
    image: "/assets/food/recipes/rice-and-beans.webp",
  },
  {
    id: "zambeziana",
    name: "Frango à zambeziana",
    portion: "1 porção",
    kcal: 300,
    protein: 30,
    carbs: 8,
    fat: 17,
    fiber: 2,
    group: "Prato moçambicano",
    emoji: "🍗",
    image: "/assets/food/recipes/R19.webp",
  },
  {
    id: "sardine",
    name: "Sardinha",
    portion: "120 g",
    kcal: 210,
    protein: 25,
    carbs: 0,
    fat: 12,
    fiber: 0,
    group: "Proteína",
    emoji: "🐟",
    image: "/assets/food/catalog/sardine.webp",
  },
  {
    id: "fish-curry",
    name: "Caril de peixe",
    portion: "1 porção",
    kcal: 260,
    protein: 28,
    carbs: 10,
    fat: 12,
    fiber: 3,
    group: "Prato moçambicano",
    emoji: "🐟",
    image: "/assets/food/catalog/fish-curry.webp",
  },
  {
    id: "peanut-curry",
    name: "Caril de amendoim",
    portion: "1 porção",
    kcal: 320,
    protein: 18,
    carbs: 24,
    fat: 18,
    fiber: 6,
    group: "Prato moçambicano",
    emoji: "🥜",
    image: "/assets/food/caril-amendoim.jpg",
    imageSource: "Fotografia pesquisada de caril de amendoim",
  },
  {
    id: "spaghetti-tuna",
    name: "Esparguete com atum e tomate",
    portion: "1 prato",
    kcal: 390,
    protein: 29,
    carbs: 55,
    fat: 7,
    fiber: 6,
    group: "Prato simples",
    emoji: "🍝",
    image: "/assets/food/recipes/tuna-pasta-salad.webp",
    imageSource: "Fotografia pesquisada de esparguete com atum e tomate",
  },
  {
    id: "cozido-caseiro",
    name: "Cozido caseiro de ovo, couve e frango",
    portion: "1 prato",
    kcal: 340,
    protein: 34,
    carbs: 28,
    fat: 10,
    fiber: 6,
    group: "Prato simples",
    emoji: "🍲",
    image: "/assets/food/recipes/chicken-vegetable-soup.webp",
  },
  {
    id: "chicken-peanut",
    name: "Frango com molho de amendoim",
    portion: "1 porção",
    kcal: 360,
    protein: 34,
    carbs: 18,
    fat: 17,
    fiber: 4,
    group: "Prato moçambicano",
    emoji: "🍗",
    image: "/assets/food/catalog/peanut-chicken.webp",
  },
  {
    id: "boiled-potato-salad",
    name: "Salada cozida de ovo, couve, frango, batata e cenoura",
    portion: "1 prato",
    kcal: 350,
    protein: 30,
    carbs: 34,
    fat: 10,
    fiber: 7,
    group: "Prato simples",
    emoji: "🥔",
    image: "/assets/food/recipes/R09.webp",
  },
  {
    id: "carapau",
    name: "Carapau grelhado",
    portion: "150 g",
    kcal: 230,
    protein: 32,
    carbs: 0,
    fat: 10,
    fiber: 0,
    group: "Proteína",
    emoji: "🐟",
    image: "/assets/food/catalog/carapau.webp",
  },
  {
    id: "tilapia",
    name: "Tilápia grelhada",
    portion: "150 g",
    kcal: 190,
    protein: 36,
    carbs: 0,
    fat: 4,
    fiber: 0,
    group: "Proteína",
    emoji: "🐟",
    image: "/assets/food/catalog/tilapia.webp",
  },
  {
    id: "lentils",
    name: "Lentilhas cozidas",
    portion: "1 concha",
    kcal: 170,
    protein: 12,
    carbs: 29,
    fat: 1,
    fiber: 8,
    group: "Proteína e fibra",
    emoji: "🫘",
    image: "/assets/food/catalog/lentils.webp",
  },
  {
    id: "potato",
    name: "Batata cozida",
    portion: "1 média",
    kcal: 160,
    protein: 4,
    carbs: 36,
    fat: 0,
    fiber: 3,
    group: "Carboidrato",
    emoji: "🥔",
  },
  {
    id: "corn-porridge",
    name: "Papa de milho",
    portion: "1 tigela",
    kcal: 190,
    protein: 4,
    carbs: 38,
    fat: 2,
    fiber: 2,
    group: "Carboidrato local",
    emoji: "🥣",
    image: "/assets/food/recipes/banana-oatmeal.webp",
  },
  {
    id: "pineapple",
    name: "Ananás",
    portion: "1 chávena",
    kcal: 80,
    protein: 1,
    carbs: 21,
    fat: 0,
    fiber: 2,
    group: "Fruta",
    emoji: "🍍",
    image: "/assets/food/catalog/pineapple.webp",
  },
  {
    id: "watermelon",
    name: "Melancia",
    portion: "2 fatias",
    kcal: 70,
    protein: 1,
    carbs: 18,
    fat: 0,
    fiber: 1,
    group: "Fruta",
    emoji: "🍉",
    image: "/assets/food/catalog/watermelon.webp",
  },
  {
    id: "guava",
    name: "Goiaba",
    portion: "1 unidade",
    kcal: 68,
    protein: 3,
    carbs: 14,
    fat: 1,
    fiber: 5,
    group: "Fruta",
    emoji: "🟢",
    image: "/assets/food/catalog/guava.webp",
  },
  {
    id: "lettuce-cucumber",
    name: "Alface e pepino",
    portion: "2 chávenas",
    kcal: 35,
    protein: 2,
    carbs: 7,
    fat: 0,
    fiber: 2,
    group: "Vegetais",
    emoji: "🥬",
  },
  {
    id: "carrot",
    name: "Cenoura",
    portion: "1 unidade",
    kcal: 40,
    protein: 1,
    carbs: 10,
    fat: 0,
    fiber: 3,
    group: "Vegetais",
    emoji: "🥕",
    image: "/assets/food/reference-crops/carrot.webp",
  },
  {
    id: "okra",
    name: "Quiabo",
    portion: "1 chávena",
    kcal: 33,
    protein: 2,
    carbs: 7,
    fat: 0,
    fiber: 3,
    group: "Vegetais",
    emoji: "🥬",
  },
];
const byName = Object.fromEntries(foodLibrary.map((food) => [food.name, food]));
const recipeFoodNames = {
  R01: ["Aveia", "Banana", "Leite"],
  R02: ["Ovos", "Pão integral"],
  R03: ["Xima", "Leite", "Papaia"],
  R04: ["Iogurte natural", "Aveia", "Ananás"],
  R05: ["Aveia", "Banana", "Ovos", "Leite"],
  R06: ["Pão integral", "Queijo fresco", "Laranja"],
  R07: ["Batata-doce", "Ovos"],
  R08: ["Iogurte natural", "Manga", "Amendoim"],
  R09: ["Frango grelhado", "Arroz cozido", "Couve e tomate", "Cenoura"],
  R10: ["Carapau grelhado", "Xima", "Couve e tomate"],
  R11: ["Carne magra", "Mandioca", "Couve e tomate"],
  R12: ["Feijão cozido", "Arroz cozido", "Ovos", "Couve e tomate"],
  R13: ["Massa integral", "Frango grelhado", "Couve e tomate", "Cenoura"],
  R14: ["Peixe grelhado", "Batata-doce", "Couve e tomate"],
  R15: ["Carne magra", "Pão integral", "Batata cozida", "Couve e tomate"],
  R16: ["Carne magra", "Arroz cozido", "Couve e tomate"],
  R17: ["Matapa", "Peixe grelhado", "Xima"],
  R18: ["Mucapata", "Peixe grelhado", "Couve e tomate"],
  R19: ["Frango grelhado", "Arroz cozido", "Couve e tomate"],
  R20: ["Atum", "Batata cozida", "Ovos", "Couve e tomate"],
  R21: ["Feijão cozido", "Frango grelhado", "Abóbora", "Cenoura"],
  R22: ["Ovos", "Queijo fresco", "Couve e tomate", "Pão integral"],
  R23: ["Pão integral", "Atum", "Couve e tomate"],
  R24: ["Banana", "Amendoim", "Leite"],
  R25: ["Laranja", "Queijo fresco"],
  R26: ["Papaia", "Iogurte natural"],
  R27: ["Ovos", "Pão integral"],
  R28: ["Leite", "Banana", "Aveia"],
  R29: ["Frango grelhado", "Abacate", "Couve e tomate", "Pão integral"],
  R30: ["Peixe grelhado", "Mandioca", "Cenoura", "Couve e tomate"],
};
const recipeImages = {
  R01: "/assets/food/recipes/banana-oatmeal.webp",
  R02: "/assets/food/recipes/R02.webp",

  R04: "/assets/food/recipes/yogurt-fruit-bowl.webp",
  R05: "/assets/food/recipes/banana-pancakes.webp",
  R06: "/assets/food/recipes/cheese-on-toast.webp",
  R07: "/assets/food/batata-doce-assada.jpg",
  R08: "/assets/food/recipes/mango-pineapple-bowl.webp",
  R09: "/assets/food/recipes/R09.webp",
  R10: "/assets/food/catalog/carapau.webp",
  R11: "/assets/food/recipes/beef-stew-rice.webp",
  R12: "/assets/food/recipes/rice-and-beans.webp",
  R13: "/assets/food/recipes/chicken-spaghetti.webp",
  R14: "/assets/food/peixe-grelhado.jpg",
  R15: "/assets/food/recipes/hamburger-plate.webp",

  R17: "/assets/food/matapa.jpg",

  R19: "/assets/food/recipes/R19.webp",

  R21: "/assets/food/recipes/chicken-vegetable-soup.webp",
  R22: "/assets/food/recipes/omelette-spinach.webp",
  R23: "/assets/food/recipes/tuna-salad-sandwich.webp",



  R27: "/assets/food/recipes/R27.webp",

};
const ingredientAliases = [
  [/aveia/i, "Aveia"], [/banana/i, "Banana"], [/ovo/i, "Ovos"],
  [/iogurte/i, "Iogurte natural"], [/leite/i, "Leite"], [/queijo/i, "Queijo fresco"],
  [/frango/i, "Frango grelhado"], [/peixe/i, "Peixe grelhado"],
  [/atum/i, "Atum"], [/sardinha/i, "Sardinha"], [/cabrito|vaca|carne/i, "Carne magra"],
  [/arroz/i, "Arroz cozido"], [/batata-doce/i, "Batata-doce"], [/batata(?!-doce)/i, "Batata cozida"], [/mandioca/i, "Mandioca"],
  [/esparguete|massa/i, "Massa integral"], [/p[aã]o/i, "Pão integral"], [/xima|farinha de milho/i, "Xima"],
  [/feij[aã]o/i, "Feijão cozido"], [/amendoim/i, "Amendoim"], [/abacate/i, "Abacate"],
  [/papaia/i, "Papaia"], [/laranja/i, "Laranja"], [/manga/i, "Manga"], [/anan[aá]s/i, "Ananás"],
  [/ab[oó]bora/i, "Abóbora"], [/cenoura/i, "Cenoura"], [/couve/i, "Couve"], [/tomate/i, "Tomate"],
  [/alface/i, "Alface"], [/pepino/i, "Pepino"], [/salada/i, "Couve e tomate"],
];
function foodNamesFromIngredients(text, fallback = []) {
  let source = String(text || "");
  const names = [];
  // Termos compostos são resolvidos primeiro para não serem confundidos
  // com ingredientes genéricos (ex.: feijão-nhemba não é feijão comum).
  const specificAliases = [
    [/feij[aã]o[\s-]*nhemba/gi, "Feijão-nhemba"],
    [/caril de amendoim/gi, "Caril de amendoim"],
    [/caril de peixe/gi, "Caril de peixe"],
    [/frango à zambeziana/gi, "Frango à zambeziana"],
    [/mucapata/gi, "Mucapata"],
    [/matapa/gi, "Matapa"],
  ];
  for (const [pattern, name] of specificAliases) {
    if (pattern.test(source)) {
      names.push(name);
      source = source.replace(pattern, " ");
    }
  }
  const detected = ingredientAliases
    .filter(([pattern]) => pattern.test(source))
    .map(([, name]) => name);
  const unique = Array.from(new Set([...names, ...detected].filter((name) => byName[name])));
  return unique.length ? unique : Array.from(new Set(fallback));
}
function workbookKeyFor(modality) {
  if (modality === "definicao") return "cutting";
  if (modality === "musculacao") return "manutencao";
  if (modality === "massa") return "bulking";
  if (["futsal", "karate", "natacao", "condicionamento", "casa"].includes(modality))
    return "manutencao";
  return ["emagrecimento", "bulking", "cutting", "manutencao"].includes(modality)
    ? modality
    : "manutencao";
}

const recipeNutritionPer100 = {
  Aveia:{kcal:389,protein:16.9,carbs:66.3,fat:6.9,fiber:10.6},
  Leite:{kcal:61,protein:3.2,carbs:4.8,fat:3.3,fiber:0},
  Banana:{kcal:89,protein:1.1,carbs:22.8,fat:0.3,fiber:2.6},
  Canela:{kcal:247,protein:4,carbs:81,fat:1.2,fiber:53},
  Ovos:{kcal:143,protein:12.6,carbs:0.7,fat:9.5,fiber:0},
  "Pão integral":{kcal:247,protein:13,carbs:41,fat:4.2,fiber:7},
  Tomate:{kcal:18,protein:0.9,carbs:3.9,fat:0.2,fiber:1.2},
  "Farinha de milho":{kcal:365,protein:9.4,carbs:76.9,fat:4.7,fiber:7.3},
  Papaia:{kcal:43,protein:0.5,carbs:10.8,fat:0.3,fiber:1.7},
  "Iogurte natural":{kcal:61,protein:3.5,carbs:4.7,fat:3.3,fiber:0},
  Ananás:{kcal:50,protein:0.5,carbs:13.1,fat:0.1,fiber:1.4},
  "Queijo fresco":{kcal:98,protein:11.1,carbs:3.4,fat:4.3,fiber:0},
  Laranja:{kcal:47,protein:0.9,carbs:11.8,fat:0.1,fiber:2.4},
  "Batata-doce":{kcal:86,protein:1.6,carbs:20.1,fat:0.1,fiber:3},
  Manga:{kcal:60,protein:0.8,carbs:15,fat:0.4,fiber:1.6},
  Amendoim:{kcal:567,protein:25.8,carbs:16.1,fat:49.2,fiber:8.5},
  Frango:{kcal:120,protein:22.5,carbs:0,fat:2.6,fiber:0},
  Arroz:{kcal:365,protein:7.1,carbs:80,fat:0.7,fiber:1.3},
  Alface:{kcal:15,protein:1.4,carbs:2.9,fat:0.2,fiber:1.3},
  Cenoura:{kcal:41,protein:0.9,carbs:9.6,fat:0.2,fiber:2.8},
  Azeite:{kcal:884,protein:0,carbs:0,fat:100,fiber:0},
  Carapau:{kcal:158,protein:19.5,carbs:0,fat:8.5,fiber:0},
  Cebola:{kcal:40,protein:1.1,carbs:9.3,fat:0.1,fiber:1.7},
  "Carne magra":{kcal:170,protein:21,carbs:0,fat:9,fiber:0},
  Mandioca:{kcal:160,protein:1.4,carbs:38,fat:0.3,fiber:1.8},
  Couve:{kcal:35,protein:2.9,carbs:4.4,fat:1.5,fiber:4.1},
  Feijão:{kcal:127,protein:8.7,carbs:22.8,fat:0.5,fiber:6.4},
  Esparguete:{kcal:371,protein:13,carbs:75,fat:1.5,fiber:3.2},
  Tilápia:{kcal:96,protein:20.1,carbs:0,fat:1.7,fiber:0},
  Batata:{kcal:87,protein:1.9,carbs:20.1,fat:0.1,fiber:1.8},
  Cabrito:{kcal:143,protein:27,carbs:0,fat:3,fiber:0},
  Matapa:{kcal:210,protein:6,carbs:12,fat:16,fiber:4},
  Mucapata:{kcal:160,protein:5,carbs:28,fat:3,fiber:4},
  Atum:{kcal:116,protein:25.5,carbs:0,fat:0.8,fiber:0},
  Abóbora:{kcal:26,protein:1,carbs:6.5,fat:0.1,fiber:0.5},
  Pepino:{kcal:15,protein:0.7,carbs:3.6,fat:0.1,fiber:0.5},
  Abacate:{kcal:160,protein:2,carbs:8.5,fat:14.7,fiber:6.7},
};
const recipeLibraryName = {
  "Farinha de milho":"Xima", Arroz:"Arroz cozido", Frango:"Frango grelhado",
  Carapau:"Carapau grelhado", "Carne magra":"Carne magra", Cabrito:"Carne magra",
  Esparguete:"Massa integral", Tilápia:"Peixe grelhado", Peixe:"Peixe grelhado",
  Batata:"Batata cozida", Couve:"Couve e tomate", Feijão:"Feijão cozido",
};
const recipeGramPerUnit = {
  Banana:118, Ovos:50, Laranja:130, "Pão integral":30, Tomate:80,
  Pepino:100, Alface:50, Cebola:70, Cenoura:60, Couve:60,
};
function normalizeRecipeIngredient(value) {
  const key=String(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
  if(key.includes("peito de frango")||key.includes("frango sem pele")||key.includes("frango cozido")||key==="frango")return "Frango";
  if(key.includes("vaca")||key.includes("carne magra")||key.includes("carne picada"))return "Carne magra";
  if(key.includes("cabrito"))return "Cabrito";
  if(key.includes("tilapia"))return "Tilápia";
  if(key.includes("carapau"))return "Carapau";
  if(key.includes("peixe"))return "Peixe";
  if(key.includes("farinha de milho"))return "Farinha de milho";
  if(key.includes("esparguete")||key.includes("massa"))return "Esparguete";
  if(key.includes("arroz"))return "Arroz";
  if(key.includes("batata doce"))return "Batata-doce";
  if(key.includes("batata"))return "Batata";
  if(key.includes("mandioca"))return "Mandioca";
  if(key.includes("feijao"))return "Feijão";
  if(key.includes("ovo"))return "Ovos";
  if(key.includes("pao"))return "Pão integral";
  if(key.includes("queijo"))return "Queijo fresco";
  if(key.includes("iogurte"))return "Iogurte natural";
  if(key.includes("leite"))return "Leite";
  if(key.includes("aveia"))return "Aveia";
  if(key.includes("banana"))return "Banana";
  if(key.includes("papaia"))return "Papaia";
  if(key.includes("manga"))return "Manga";
  if(key.includes("ananas"))return "Ananás";
  if(key.includes("laranja"))return "Laranja";
  if(key.includes("amendoim"))return "Amendoim";
  if(key.includes("atum"))return "Atum";
  if(key.includes("tomate"))return "Tomate";
  if(key.includes("alface"))return "Alface";
  if(key.includes("cenoura"))return "Cenoura";
  if(key.includes("couve"))return "Couve";
  if(key.includes("cebola"))return "Cebola";
  if(key.includes("pepino"))return "Pepino";
  if(key.includes("azeite"))return "Azeite";
  if(key.includes("canela"))return "Canela";
  if(key.includes("abobora"))return "Abóbora";
  if(key.includes("abacate"))return "Abacate";
  if(key.includes("matapa"))return "Matapa";
  if(key.includes("mucapata"))return "Mucapata";
  return null;
}
function splitGroupedRecipeIngredient(name) {
  const normalized=String(name||"").trim();
  if(/^salada$/i.test(normalized))return ["Alface","Tomate","Pepino"];
  const parts=normalized.split(/,\s*|\s+e\s+/i).map((part)=>part.trim()).filter(Boolean);
  return parts.length>1?parts:[normalized];
}
export function parseRecipeIngredients(text) {
  const parts=String(text||"").split(/[;·]/).map((part)=>part.trim()).filter(Boolean);
  const result=[];
  for(const part of parts){
    let name=part,quantity=1,unit="un",matched=false;
    let match=part.match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|unidades?|un|ovos?|fatias?|colheres?|colher)?\s*(.*)$/i);
    if(match){
      matched=true;quantity=Number(match[1].replace(",","."));unit=(match[2]||"un").toLowerCase();name=match[3].trim();
      if(!name&&/ovos?/i.test(unit)){name="ovo";unit="un";}
      else if(!name){name=unit;unit="un";}
    }else{
      match=part.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|unidades?|un|ovos?|fatias?|colheres?|colher|m[eé]dia|m[eé]dio|pequeno|pequena|grande)?\b.*$/i);
      if(match){matched=true;name=match[1].trim();quantity=Number(match[2].replace(",","."));unit=(match[3]||"un").toLowerCase();}
    }
    if(/kg/.test(unit)){quantity*=1000;unit="g";}
    else if(unit==="g")unit="g";
    else if(unit==="l"){quantity*=1000;unit="ml";}
    else if(unit==="ml")unit="ml";
    else if(/colher/.test(unit)){quantity*=15;unit="g";}
    else unit="un";
    if(!matched){
      const key=normalizeRecipeIngredient(name);
      if(key==="Canela"){quantity=1;unit="g";}
      else if(key==="Tomate"||key==="Pepino"){quantity=1;unit="un";}
      else if(key==="Alface"||key==="Couve"||key==="Cenoura"){quantity=100;unit="g";}
    }
    const grouped=splitGroupedRecipeIngredient(name);
    if(grouped.length>1){
      const total=unit==="g"||unit==="ml"?quantity:quantity*100;
      const divided=total/grouped.length;
      for(const groupName of grouped){
        const canonical=normalizeRecipeIngredient(groupName);
        if(canonical)result.push({name:canonical,libraryName:recipeLibraryName[canonical]||canonical,quantity:divided,unit:"g"});
      }
    }else{
      const canonical=normalizeRecipeIngredient(name);
      if(canonical)result.push({name:canonical,libraryName:recipeLibraryName[canonical]||canonical,quantity,unit});
    }
  }
  return result;
}
function recipeIngredientGrams(item) {
  if(item.unit==="g")return item.quantity;
  if(item.unit==="ml")return item.quantity*(item.name==="Azeite"?0.91:1);
  return item.quantity*(recipeGramPerUnit[item.name]||100);
}
function roundMacro(value,places=1){const factor=10**places;return Math.round((Number(value)||0)*factor)/factor;}
function recipeIngredientMacros(item,scale=1){
  const source=recipeNutritionPer100[item.name]||{kcal:0,protein:0,carbs:0,fat:0,fiber:0};
  const factor=recipeIngredientGrams(item)*scale/100;
  return {kcal:source.kcal*factor,protein:source.protein*factor,carbs:source.carbs*factor,fat:source.fat*factor,fiber:source.fiber*factor};
}
function recipeFoodItems(items,scale=1,allergy=""){
  return items.map((item)=>{
    const library=byName[item.libraryName]||byName[item.name]||{};
    const macros=recipeIngredientMacros(item,scale);
    const quantity=roundMacro(item.quantity*scale,1);
    const portion= item.unit==="g"||item.unit==="ml"
      ? Math.round(quantity)+" "+item.unit
      : quantity+" un";
    return {
      id:library.id||("recipe-"+item.name.toLowerCase().replace(/\s+/g,"-")),
      name:item.libraryName||item.name,
      sourceIngredient:item.name,
      portion,
      kcal:Math.round(macros.kcal),
      protein:roundMacro(macros.protein),
      carbs:roundMacro(macros.carbs),
      fat:roundMacro(macros.fat),
      fiber:roundMacro(macros.fiber),
      group:library.group||"Ingrediente",
      image:library.image||null,
      restricted:isRestrictedFood(item.libraryName||item.name,allergy),
    };
  });
}
function sumRecipeFoods(foods){
  const keys=["kcal","protein","carbs","fat","fiber"];
  return Object.fromEntries(keys.map((key)=>[key,roundMacro(foods.reduce((sum,food)=>sum+(Number(food[key])||0),0),key==="kcal"?0:1)]));
}

export const supplementCatalog = [
  { id:"usn-pure-creatine-200g",brand:"USN",name:"Pure Creatine Monohydrate",format:"200 g",priceMzn:900,pricePer100g:450,retailer:"Kratos Empire",image:"https://kratosempire.co.mz/cdn/shop/files/USNPURECREATINE300GRBag_800x800_881d7050-1ec1-4c41-84be-08c4b3f85768.jpg?v=1769620230",url:"https://kratosempire.co.mz/products/pure-creatine-monohydrate",availability:"Preço observado em 13/11/2026; confirmar variante e stock na loja." },
  { id:"usn-pure-creatine-410g",brand:"USN",name:"Pure Creatine Monohydrate",format:"410 g",priceMzn:1600,pricePer100g:390,retailer:"Kratos Empire",image:"https://kratosempire.co.mz/cdn/shop/files/USNPURECREATINE300GRBag_800x800_881d7050-1ec1-4c41-84be-08c4b3f85768.jpg?v=1769620230",url:"https://kratosempire.co.mz/products/pure-creatine-monohydrate",availability:"Preço observado em 13/11/2026; confirmar variante e stock na loja." },
  { id:"npl-creatine-150g",brand:"NPL",name:"Creatine Monohydrate",format:"150 g",priceMzn:1000,pricePer100g:667,retailer:"IR Fitness",image:"https://irfitnessshop.co.mz/wp-content/uploads/2026/02/NPL-Creatine-Monohydrate-150g.png.png",url:"https://irfitnessshop.co.mz/product/npl-creatine-monohydrate-150g/",availability:"Preço observado em 13/11/2026; confirmar stock e entrega." },
  { id:"evolve-creatine-300g",brand:"Evolve",name:"Creatine Mono",format:"300 g",priceMzn:1550,pricePer100g:517,retailer:"IR Fitness",image:null,url:"https://irfitnessshop.co.mz/product-category/creatinas/",availability:"Preço observado em 13/11/2026 na categoria de creatinas; confirmar produto e stock." },
  { id:"biogen-creatine-500g",brand:"Biogen",name:"Creatine Monohydrate",format:"500 g",priceMzn:2130,pricePer100g:426,retailer:"Krolyc",image:null,url:"https://krolyc.co.mz/product/biogen-creatine-monohydrate-500g/",availability:"Preço observado em 13/11/2026; confirmar stock e entrega." },
];
const menu30 = [
  [
    ["Aveia", "Banana", "Leite", "Ovos"],
    ["Iogurte natural", "Papaia"],
    ["Arroz cozido", "Frango grelhado", "Couve e tomate"],
    ["Peixe grelhado", "Batata-doce", "Couve e tomate"],
  ],
  [
    ["Ovos", "Queijo fresco", "Pão integral"],
    ["Banana", "Amendoim"],
    ["Massa integral", "Frango grelhado", "Couve e tomate"],
    ["Carne magra", "Arroz cozido", "Couve e tomate"],
  ],
  [
    ["Aveia", "Banana", "Ovos"],
    ["Iogurte natural", "Laranja"],
    ["Arroz cozido", "Feijão cozido", "Peixe grelhado"],
    ["Frango grelhado", "Mandioca", "Couve e tomate"],
  ],
  [
    ["Pão integral", "Ovos", "Papaia"],
    ["Queijo fresco", "Maçã"],
    ["Caril de amendoim", "Arroz cozido", "Couve e tomate"],
    ["Carne magra", "Batata-doce", "Couve e tomate"],
  ],
  [
    ["Aveia", "Leite", "Manga"],
    ["Banana", "Iogurte natural"],
    ["Caril de amendoim", "Xima", "Couve e tomate"],
    ["Frango grelhado", "Arroz cozido", "Couve e tomate"],
  ],
  [
    ["Batata-doce", "Ovos"],
    ["Aveia", "Iogurte natural"],
    ["Salada cozida de ovo, couve, frango, batata e cenoura", "Arroz cozido"],
    ["Feijão-nhemba", "Frango grelhado", "Couve e tomate"],
  ],
  [
    ["Ovos", "Pão integral", "Abacate"],
    ["Papaia", "Amendoim"],
    ["Cozido caseiro de ovo, couve e frango", "Arroz cozido"],
    ["Peixe grelhado", "Mandioca", "Couve e tomate"],
  ],
  [
    ["Iogurte natural", "Aveia", "Banana"],
    ["Laranja", "Queijo fresco"],
    ["Arroz cozido", "Carne magra", "Couve e tomate"],
    ["Xima", "Peixe grelhado", "Couve e tomate"],
  ],
  [
    ["Ovos", "Pão integral", "Abacate"],
    ["Manga", "Iogurte natural"],
    ["Batata-doce", "Frango grelhado", "Couve e tomate"],
    ["Arroz cozido", "Feijão cozido", "Peixe grelhado"],
  ],
  [
    ["Aveia", "Leite", "Banana"],
    ["Banana", "Amendoim"],
    ["Esparguete com atum e tomate", "Couve e tomate"],
    ["Frango grelhado", "Mandioca", "Couve e tomate"],
  ],
  [
    ["Aveia", "Ovos", "Laranja"],
    ["Iogurte natural", "Papaia"],
    ["Arroz cozido", "Peixe grelhado", "Abóbora"],
    ["Feijão cozido", "Batata-doce", "Frango grelhado"],
  ],
  [
    ["Aveia", "Banana", "Amendoim"],
    ["Banana", "Queijo fresco"],
    ["Mucapata", "Frango grelhado", "Couve e tomate"],
    ["Peixe grelhado", "Arroz cozido", "Couve e tomate"],
  ],
  [
    ["Batata-doce", "Ovos"],
    ["Manga", "Iogurte natural"],
    ["Xima", "Frango à zambeziana", "Couve e tomate"],
    ["Arroz cozido", "Feijão cozido", "Peixe grelhado"],
  ],
  [
    ["Pão integral", "Queijo fresco", "Maçã"],
    ["Laranja", "Amendoim"],
    ["Arroz cozido", "Sardinha", "Couve e tomate"],
    ["Mandioca", "Ovos", "Couve e tomate"],
  ],
  [
    ["Aveia", "Leite", "Banana"],
    ["Iogurte natural", "Manga"],
    ["Xima", "Matapa", "Peixe grelhado"],
    ["Frango grelhado", "Arroz cozido", "Couve e tomate"],
  ],
  [
    ["Ovos", "Pão integral", "Abacate"],
    ["Papaia", "Amendoim"],
    ["Arroz cozido", "Feijão-nhemba", "Peixe grelhado"],
    ["Batata-doce", "Frango grelhado", "Couve e tomate"],
  ],
  [
    ["Iogurte natural", "Aveia", "Manga"],
    ["Banana", "Queijo fresco"],
    ["Mucapata", "Peixe grelhado", "Couve e tomate"],
    ["Xima", "Feijão-nhemba", "Couve e tomate"],
  ],
  [
    ["Ovos", "Pão integral", "Laranja"],
    ["Maçã", "Amendoim"],
    ["Arroz cozido", "Frango grelhado", "Abóbora"],
    ["Peixe grelhado", "Mandioca", "Couve e tomate"],
  ],
  [
    ["Batata-doce", "Iogurte natural"],
    ["Banana", "Ovos"],
    ["Xima", "Caril de peixe", "Couve e tomate"],
    ["Arroz cozido", "Frango grelhado", "Couve e tomate"],
  ],
  [
    ["Aveia", "Banana", "Ovos"],
    ["Manga", "Iogurte natural"],
    ["Feijão cozido", "Arroz cozido", "Peixe grelhado"],
    ["Frango grelhado", "Batata-doce", "Couve e tomate"],
  ],
  [
    ["Pão integral", "Ovos", "Abacate"],
    ["Papaia", "Amendoim"],
    ["Frango à zambeziana", "Couve e tomate"],
    ["Xima", "Peixe grelhado", "Couve e tomate"],
  ],
  [
    ["Aveia", "Leite", "Banana"],
    ["Banana", "Iogurte natural"],
    ["Arroz cozido", "Sardinha", "Feijão-nhemba"],
    ["Mandioca", "Frango grelhado", "Couve e tomate"],
  ],
  [
    ["Aveia", "Ovos", "Manga"],
    ["Laranja", "Amendoim"],
    ["Xima", "Matapa", "Peixe grelhado"],
    ["Arroz cozido", "Feijão cozido", "Couve e tomate"],
  ],
  [
    ["Batata-doce", "Ovos"],
    ["Iogurte natural", "Manga"],
    ["Arroz cozido", "Frango grelhado", "Couve e tomate"],
    ["Peixe grelhado", "Batata-doce", "Couve e tomate"],
  ],
  [
    ["Pão integral", "Ovos", "Papaia"],
    ["Banana", "Amendoim"],
    ["Mucapata", "Peixe grelhado", "Couve e tomate"],
    ["Xima", "Frango grelhado", "Couve e tomate"],
  ],
  [
    ["Aveia", "Leite", "Banana"],
    ["Maçã", "Iogurte natural"],
    ["Arroz cozido", "Feijão-nhemba", "Frango grelhado"],
    ["Peixe grelhado", "Mandioca", "Couve e tomate"],
  ],
  [
    ["Ovos", "Pão integral", "Manga"],
    ["Papaia", "Amendoim"],
    ["Xima", "Caril de peixe", "Couve e tomate"],
    ["Arroz cozido", "Ovos", "Abóbora"],
  ],
  [
    ["Aveia", "Banana", "Manga"],
    ["Iogurte natural", "Papaia"],
    ["Frango grelhado", "Arroz cozido", "Couve e tomate"],
    ["Feijão cozido", "Batata-doce", "Peixe grelhado"],
  ],
  [
    ["Aveia", "Ovos", "Manga"],
    ["Banana", "Iogurte natural"],
    ["Mandioca", "Peixe grelhado", "Couve e tomate"],
    ["Arroz cozido", "Frango grelhado", "Couve e tomate"],
  ],
  [
    ["Pão integral", "Ovos", "Papaia"],
    ["Amendoim", "Banana"],
    ["Xima", "Matapa", "Frango à zambeziana"],
    ["Arroz cozido", "Feijão cozido", "Peixe grelhado"],
  ],
];
const labels = {
  emagrecimento: "Emagrecimento",
  definicao: "Definição (cutting)",
  bulking: "Bulking (ganho de massa)",
  musculacao: "Musculação normal / manutenção",
  condicionamento: "Alimentação equilibrada",
};
const objectives = {
  emagrecimento: { calorie: -300, portion: 0.88, protein: 1.8 },
  definicao: { calorie: -250, portion: 0.9, protein: 2 },
  bulking: { calorie: 300, portion: 1.15, protein: 1.8 },
  musculacao: { calorie: 0, portion: 1, protein: 1.6 },
  condicionamento: { calorie: 0, portion: 1, protein: 1.4 },
};
const modalAdjust = {
  corrida: 120,
  cardio: 120,
  natacao: 100,
  futsal: 140,
  karate: 100,
  bodybuilding: 150,
  musculacao: 40,
};
function ageFrom(profile) {
  if (profile.birth_date) {
    const d = new Date(profile.birth_date),
      now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age--;
    return age;
  }
  return Number(profile.age) || null;
}
function complete(profile) {
  return (
    Number(profile.current_weight) > 0 &&
    Number(profile.height) > 0 &&
    ageFrom(profile) >= 12
  );
}
function activityFactor(profile) {
  return (
    {
      sedentary: 1.2,
      light: 1.35,
      moderate: 1.5,
      active: 1.65,
      very_active: 1.8,
    }[profile.daily_activity] ||
    { beginner: 1.35, intermediate: 1.5, advanced: 1.65 }[
      profile.training_level
    ] ||
    1.35
  );
}
function scaleFood(food, scale) {
  return {
    ...food,
    kcal: Math.round(food.kcal * scale),
    protein: Math.round(food.protein * scale * 10) / 10,
    carbs: Math.round(food.carbs * scale * 10) / 10,
    fat: Math.round(food.fat * scale * 10) / 10,
    fiber: Math.round(food.fiber * scale * 10) / 10,
  };
}
function hydration(profile, calories) {
  const weight = Number(profile.current_weight) || 0,
    age = ageFrom(profile) || 0,
    activity = activityFactor(profile),
    duration = Number(profile.training_duration) || 45,
    intensity = profile.training_intensity || "moderate",
    heat = Number(profile.heat_level) || 0;
  let ml =
    weight * 30 +
    (activity - 1.2) * weight * 12 +
    Math.max(0, duration - 30) * 5 +
    heat * 200 +
    (intensity === "hard" ? 250 : 0);
  if (age >= 65) ml *= 0.95;
  return Math.round(Math.max(0, ml + calories * 0.2));
}
function ageCategory(age) {
  if (age === null || Number.isNaN(age)) return "idade não informada";
  if (age < 18) return "adolescente";
  if (age <= 30) return "adulto jovem";
  if (age <= 50) return "adulto";
  if (age <= 64) return "adulto 51–64";
  return "65+ cuidados especiais";
}
const allergenMatchers = {
  lactose: ["Leite", "Iogurte natural", "Queijo fresco"],
  leite: ["Leite", "Iogurte natural", "Queijo fresco"],
  laticinios: ["Leite", "Iogurte natural", "Queijo fresco"],
  ovos: [
    "Ovos",
    "Cozido caseiro de ovo, couve e frango",
    "Salada cozida de ovo, couve, frango, batata e cenoura",
  ],
  amendoim: ["Amendoim", "Caril de amendoim", "Frango com molho de amendoim"],
  gluten: [
    "Aveia",
    "Massa integral",
    "Pão integral",
    "Esparguete com atum e tomate",
  ],
  peixe: [
    "Peixe grelhado",
    "Atum",
    "Sardinha",
    "Carapau grelhado",
    "Tilápia grelhada",
    "Caril de peixe",
  ],
};
function isRestrictedFood(name, allergyText) {
  const terms = String(allergyText || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[,;]+/)
    .map((term) => term.trim())
    .filter(Boolean);
  if (!terms.length || terms.includes("nenhuma")) return false;
  return terms.some(
    (term) =>
      String(name).toLowerCase().includes(term) ||
      (allergenMatchers[term] || []).includes(name),
  );
}
function hydrationReminders(profile) {
  return [
    "Ao acordar",
    "Durante a manhã",
    "Antes do almoço",
    "À tarde",
    "Antes do treino",
    "Durante sessões prolongadas",
    "Depois do treino",
  ].map((label, index) => ({
    label,
    enabled: profile.reminders_enabled !== false,
    order: index,
  }));
}
function objectiveMenu(modality, day) {
  const base = menu30[(day - 1) % menu30.length].map((items) => [...items]);
  const swaps = {
    emagrecimento: [
      ["Arroz cozido", "Arroz cozido", "Couve e tomate"],
      ["Massa integral", "Peixe grelhado", "Couve e tomate"],
    ],
    definicao: [
      ["Massa integral", "Peixe grelhado", "Couve e tomate"],
      ["Mandioca", "Frango grelhado", "Couve e tomate"],
    ],
    bulking: [
      ["Arroz cozido", "Feijão cozido", "Frango grelhado"],
      ["Xima", "Matapa", "Peixe grelhado"],
      ["Esparguete com atum e tomate", "Ovos", "Couve e tomate"],
      ["Batata-doce", "Frango grelhado", "Feijão cozido"],
    ],
    musculacao: [
      ["Batata-doce", "Frango grelhado", "Feijão cozido"],
      ["Arroz cozido", "Peixe grelhado", "Ovos"],
    ],
    condicionamento: [["Couve e tomate", "Carapau grelhado", "Batata cozida"]],
  };
  const pool = swaps[modality] || swaps.condicionamento;
  const selected = pool[(day - 1) % pool.length];
  // Mantém os almoços específicos da modalidade, mas preserva a rotação do
  // calendário de 30 dias em vez de repetir apenas quatro pratos.
  if (modality !== "condicionamento" && day % 3 === 0) base[2] = selected;
  return base;
}
export function nutritionPlan(profile = {}) {
  const age = ageFrom(profile),
    modality = modalityKeyFor(profile),
    baseObjective = objectives[modality] || objectives.condicionamento,
    objective =
      age !== null && age < 18
        ? { ...baseObjective, calorie: 0, portion: 1, protein: 1.2 }
        : baseObjective;
  if (!complete(profile)) {
    if (profile._fallback)
      return {
        incomplete: true,
        modalityLabel: labels[modality] || labels.condicionamento,
        message:
          "Complete idade/data de nascimento, peso e altura no Perfil para personalizar este plano.",
        meals: [],
        dayNumber: 1,
        calories: null,
        waterMl: null,
      };
    const fallback = nutritionPlan({
      ...profile,
      _fallback: true,
      age: age || 30,
      current_weight: Number(profile.current_weight) || 70,
      height: Number(profile.height) || 170,
    });
    return {
      ...fallback,
      incomplete: true,
      message:
        "Mostramos um plano recomendado provisório. Complete os seus dados no Perfil para ajustar calorias, água e porções.",
    };
  }
  const weight = Number(profile.current_weight),
    height = Number(profile.height),
    sex = String(profile.sex || "").toLowerCase();
  const bmr =
    10 * weight +
    6.25 * height -
    5 * age +
    (sex.includes("fem") ? -161 : sex.includes("masc") ? 5 : 0);
  const base =
    bmr * activityFactor(profile) +
    (modalAdjust[String(profile.modality || "").toLowerCase()] || 0);
  const calories = Math.max(
    age < 18 ? Math.round(base) : 1400,
    Math.round(
      base +
        objective.calorie +
        (profile.training_intensity === "hard"
          ? 120
          : profile.training_intensity === "easy"
            ? -80
            : 0),
    ),
  );
  const dayNumber = Math.min(
      30,
      Math.max(1, Number(profile.nutrition_day) || 1),
    ),
    day = workbookMealPlans[workbookKeyFor(modality)]?.[dayNumber] || workbookMealPlans.emagrecimento[dayNumber],
    training = String(profile.training_time || "18:00").slice(0, 5),
    [h, m] = training.split(":").map(Number);
  const at = (hour, minute = 0) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const shift = (offset) => {
    const d = new Date();
    d.setHours(Number(h) || 18, (Number(m) || 0) + offset, 0, 0);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const ageNote =
    ageCategory(age) === "adolescente"
      ? "Para menores de 18 anos: plano equilibrado, sem défice automático ou recomendações de doses de suplementos. Procure um profissional qualificado."
      : age >= 65
        ? "Priorize hidratação, mastigação confortável e avaliação individual quando necessário."
        : "";
  const preferred = String(profile.available_foods || "")
    .split(",")
    .map((value) => value.trim())
    .filter((name) => byName[name]);
  const allergy = String(
    [profile.allergies, profile.dietary_restrictions, profile.foods_to_avoid, profile.food_dislikes]
      .filter(Boolean)
      .join(","),
  ).toLowerCase();
  const adaptItems = (items) =>
    items.map((name) => {
      const original = byName[name];
      if (!original) return name;
      if (isRestrictedFood(name, allergy))
        return (
          preferred.find(
            (value) =>
              byName[value]?.group === original.group &&
              !isRestrictedFood(value, allergy),
          ) ||
          foodLibrary.find(
            (food) =>
              food.group === original.group &&
              !isRestrictedFood(food.name, allergy),
          )?.name ||
          foodLibrary.find((food) => !isRestrictedFood(food.name, allergy))
            ?.name ||
          name
        );
      // As preferências podem filtrar alimentos proibidos, mas não devem
      // substituir a banana por laranja (ou outro alimento) numa receita
      // que já foi definida para o dia.
      return name;
    });
  const shiftForMeal = (row) => {
    if (String(row.meal).toLowerCase().includes("pré-treino")) return shift(-90);
    if (String(row.meal).toLowerCase().includes("pós-treino")) return shift(75);
    return row.time;
  };
  const rawMeals = (day || []).map((row) => ({
    row,
    ingredients: parseRecipeIngredients(row.ingredients),
  }));
  const rawDayCalories = rawMeals.reduce((total, meal) =>
    total + sumRecipeFoods(recipeFoodItems(meal.ingredients,1,allergy)).kcal, 0);
  const targetScale = Math.min(1.35,Math.max(0.7,calories/(rawDayCalories||calories)));
  const meals = rawMeals.map(({row,ingredients}) => {
    const foods = recipeFoodItems(ingredients,targetScale,allergy);
    const totals = sumRecipeFoods(foods);
    const allergyWarning = foods.some((food)=>food.restricted);
    return {
      time: shiftForMeal(row),
      title: row.meal,
      recipeName: row.recipe,
      recipeId: row.recipeId,
      items: [row.recipe],
      foods,
      image: recipeImages[row.recipeId] || null,
      ingredients: foods.map((food)=>food.name+" ("+food.portion+")"),
      recipeIngredients: row.ingredients,
      nutrition: totals,
      purpose: row.purpose,
      preparation: row.preparation,
      adjustment: row.adjustment,
      recipe: row.preparation,
      kcal: totals.kcal,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      fiber: totals.fiber,
      allergyWarning,
    };
  });
  const finalMeals = meals;
  const trainingModality = String(profile.modality || "").toLowerCase();
  const resistanceFocused = ["bulking","definicao","musculacao"].includes(modality) || /muscul|calisten|futsal|karat/.test(trainingModality);
  const supplementAdvice = age < 18
    ? { show: false, title: "Suplementos", detail: "Para menores, o aplicativo não recomenda suplementos automaticamente. Fale com um profissional qualificado e com o responsável." }
    : resistanceFocused
      ? { show: true, title: "Creatina monohidratada · opcional", detail: "Pode fazer sentido apenas como complemento de treino de força ou esforços intensos repetidos. Priorize refeições, sono, hidratação e técnica." }
      : { show: false, title: "Base para cardio", detail: "Para corrida e cardio, a prioridade é alimentação suficiente, líquidos e carboidratos adequados ao tempo de treino; creatina não é recomendada automaticamente para resistência." };
  return {
    incomplete: false,
    dayNumber,
    calories,
    bmr: Math.round(bmr),
    waterMl: hydration(profile, calories),
    meals: finalMeals,
    portionScale: roundMacro(targetScale,2),
    estimatedMealCalories: finalMeals.reduce((sum,meal)=>sum+meal.kcal,0),
    training,
    modalityLabel: labels[modality] || labels.condicionamento,
    modalityNote:
      ageNote ||
      "Estimativa ajustada ao seu objetivo, atividade, modalidade e intensidade.",
    ageCategory: ageCategory(age),
    ageNote: ageNote,
    proteinTarget:
      age !== null && age < 18 ? null : Math.round(weight * objective.protein),
    carbsTarget: Math.round((calories * 0.45) / 4),
    fatTarget: Math.round((calories * 0.3) / 9),
    fiberTarget: Math.round(Math.max(25, (calories / 1000) * 14)),
    hydrationReminders: hydrationReminders(profile),
    budgetNote:
      profile.food_budget === "low"
        ? "Priorize feijão, ovos, aveia, arroz, hortaliças da época e peixe local; compare preços e use substituições."
        : "Combine alimentos locais e internacionais conforme disponibilidade e orçamento.",
    eligibleForSupplement: age >= 18 && resistanceFocused,
    supplementAdvice,
    creatine:
      age < 18
        ? "O JL Trainer não apresenta ofertas nem sugere doses de creatina para menores. Converse com um profissional de saúde e com o responsável."
        : "Creatina monohidratada é opcional. Em adultos saudáveis, estudos frequentemente usam 3–5 g/dia como manutenção; não é dose individual, não é calculada pelo peso e não substitui avaliação profissional.",
    creatineSourceUrl:"https://link.springer.com/article/10.1186/s12970-017-0173-z",
  };
}

const shoppingName = (value) => String(value || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/\([^)]*\)/g, "")
  .replace(/\s+/g, " ")
  .trim();

function formatShoppingQuantity(quantity,unit) {
  const value=Math.round(quantity*10)/10;
  if(unit==="g"&&value>=1000)return (Math.round(value/100)/10)+" kg";
  if(unit==="ml"&&value>=1000)return (Math.round(value/100)/10)+" L";
  if(unit==="un")return value+" "+(value===1?"unidade":"unidades");
  return value+" "+unit;
}
export function buildShoppingList(profile = {}, days = 30, portionScale = null) {
  const people = Math.min(12, Math.max(1, Number(profile.household_size || profile.people_count) || 1));
  const totalDays = Math.min(30, Math.max(1, Number(days) || 30));
  const modality = modalityKeyFor(profile);
  const plan = workbookMealPlans[workbookKeyFor(modality)] || workbookMealPlans.emagrecimento;
  const scale = Math.min(1.35,Math.max(0.7,Number(portionScale)||1));
  const totals = new Map();
  for (let day = 1; day <= totalDays; day += 1) {
    for (const row of plan[day] || []) {
      for (const ingredient of parseRecipeIngredients(row.ingredients)) {
        const quantity=ingredient.quantity*people*scale;
        const key = shoppingName(ingredient.name)+"|"+ingredient.unit;
        const current = totals.get(key) || { key, name: ingredient.name, quantity: 0, unit: ingredient.unit };
        current.quantity += quantity;
        totals.set(key, current);
      }
    }
  }
  return Array.from(totals.values())
    .filter((item) => item.name && item.quantity > 0)
    .map((item) => ({
      ...item,
      quantity: Math.round(item.quantity * 10) / 10,
      display: formatShoppingQuantity(item.quantity,item.unit),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt"));
}

export function estimateWorkoutKcal(
  profile = {},
  minutes = 35,
  intensity = "moderate",
) {
  const weight = Number(profile.current_weight) || 0;
  if (!weight) return 0;
  const met = intensity === "hard" ? 8 : intensity === "easy" ? 3.5 : 5.5;
  return Math.round(((met * 3.5 * weight) / 200) * minutes);
}
export function foodSubstitutions(name, profile = {}) {
  const groups = {
    frango: ["Peixe grelhado", "Ovos", "Sardinha", "Feijão cozido"],
    peixe: ["Frango grelhado", "Ovos", "Sardinha", "Atum"],
    carne: ["Frango grelhado", "Peixe grelhado", "Ovos", "Feijão cozido"],
    ovo: ["Frango grelhado", "Peixe grelhado", "Iogurte natural", "Feijão cozido"],
    arroz: ["Batata-doce", "Mandioca", "Xima", "Massa integral"],
    batata: ["Arroz cozido", "Mandioca", "Xima", "Massa integral"],
    mandioca: ["Arroz cozido", "Batata-doce", "Xima"],
    xima: ["Arroz cozido", "Batata-doce", "Mandioca"],
    iogurte: ["Leite", "Queijo fresco", "Ovos"],
    fruta: ["Banana", "Papaia", "Laranja", "Maçã", "Ananás"],
    banana: ["Papaia", "Laranja", "Maçã", "Ananás"],
    laranja: ["Papaia", "Banana", "Maçã", "Ananás"],
    papaia: ["Banana", "Laranja", "Maçã", "Ananás"],
    feij: ["Feijão cozido", "Feijão-nhemba", "Lentilhas", "Ovos"],
  };
  const key = String(name || "").toLowerCase();
  const matched = Object.entries(groups).find(([group]) => key.includes(group));
  if (!matched) return [];
  const candidates = matched[1].map((label) => foodLibrary.find((food) => food.name === label))
    .filter((food) => food && food.image);
  const original = foodLibrary.find((food) => food.name === name);
  const goal = String(profile.goal || profile.modality || "").toLowerCase();
  // Prefer substitutions with a similar role and nearby protein/carbohydrate profile.
  return candidates.sort((a, b) => {
    const score = (food) => {
      const protein = Math.abs((food.protein || 0) - (original?.protein || 0));
      const carbs = Math.abs((food.carbs || 0) - (original?.carbs || 0));
      const kcal = (food.kcal || 0) - (original?.kcal || 0);
      const energyBias = goal.includes("bulking") || goal.includes("massa")
        ? Math.max(0, -kcal) * 0.08
        : goal.includes("emag") || goal.includes("cut") || goal.includes("defini")
          ? Math.max(0, kcal) * 0.08
          : 0;
      return protein * 1.2 + carbs * 0.35 + Math.abs(kcal) * 0.06 + energyBias;
    };
    return score(a) - score(b);
  }).slice(0, 4).map((food) => food.name);
}

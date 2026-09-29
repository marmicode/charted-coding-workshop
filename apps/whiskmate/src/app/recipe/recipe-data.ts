import { createIngredient, createQuantity, createRecipe } from './recipe';

export const RECIPES = [
  createRecipe({
    id: 'shakshuka',
    name: 'Shakshuka',
    description:
      'Eggs poached in a rich, spiced tomato and pepper sauce — a classic Ottolenghi brunch dish.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/shakshuka-6_1_1.jpg?v=1708090280',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({ name: '1 large onion, finely chopped' }),
      createIngredient({ name: '2 red peppers, sliced' }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: 'cloves' }),
        name: 'garlic, crushed',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'cumin',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'smoked paprika',
      }),
      createIngredient({ name: '800g tinned chopped tomatoes' }),
      createIngredient({
        quantity: createQuantity({ amount: 6, unit: '' }),
        name: 'large eggs',
      }),
      createIngredient({ name: 'fresh coriander, to serve' }),
    ],
    steps: [
      'Heat the olive oil in a large frying pan over medium heat.',
      'Add the onion and peppers and cook for 10 minutes until soft.',
      'Stir in the garlic, cumin and paprika and cook for 2 minutes.',
      'Pour in the tomatoes, season well and simmer for 15 minutes.',
      'Make six wells in the sauce and crack an egg into each.',
      'Cover and cook for 5–8 minutes until the whites are set.',
      'Scatter with coriander and serve straight from the pan.',
    ],
  }),
  createRecipe({
    id: 'burnt-aubergine-salad',
    name: 'Burnt Aubergine with Tahini and Pomegranate',
    description:
      'Smoky charred aubergine dressed with tahini, lemon and pomegranate seeds.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Mutabal.jpg?v=1716838425',
    ingredients: [
      createIngredient({ name: '2 large aubergines' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'tahini',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'lemon juice',
      }),
      createIngredient({ name: '1 pomegranate, seeds removed' }),
      createIngredient({ name: 'fresh parsley, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Char the aubergines directly over a gas flame or under a hot grill until blackened and collapsed.',
      'Cool slightly, then scoop the flesh into a colander to drain for 30 minutes.',
      'Mix the tahini with lemon juice and enough water to make a pourable sauce.',
      'Roughly chop the aubergine flesh and arrange on a serving plate.',
      'Drizzle with tahini sauce, olive oil and scatter with pomegranate and parsley.',
    ],
  }),
  createRecipe({
    id: 'sweet-potato-filo-pie',
    name: 'Sweet Potato and Feta Filo Pie',
    description:
      'Layers of crisp filo filled with spiced sweet potato, feta and fresh herbs.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Curried_cauliflower_and_cheese_filo_pie.jpg?v=1717600155',
    ingredients: [
      createIngredient({ name: '800g sweet potatoes, peeled and cubed' }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'feta, crumbled',
      }),
      createIngredient({ name: '6 sheets filo pastry' }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'butter, melted',
      }),
      createIngredient({ name: '2 spring onions, sliced' }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'ground cumin',
      }),
      createIngredient({ name: '2 eggs, beaten' }),
      createIngredient({ name: 'fresh dill, chopped' }),
    ],
    steps: [
      'Roast the sweet potato at 200°C for 25 minutes until tender.',
      'Mash with cumin, spring onions, dill and most of the feta.',
      'Stir in the eggs and season well.',
      'Layer filo sheets in a greased tin, brushing each with butter.',
      'Spread the filling over the filo and top with remaining sheets.',
      'Brush the top with butter and bake for 35 minutes until golden.',
    ],
  }),
  createRecipe({
    id: 'courgette-fritters',
    name: 'Courgette and Herb Fritters',
    description:
      'Crisp golden fritters packed with grated courgette, mint and parsley.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Courgette_chickpea_and_herb_pancakes.jpg?v=1716187803',
    ingredients: [
      createIngredient({ name: '3 medium courgettes, coarsely grated' }),
      createIngredient({ name: '3 eggs' }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'plain flour',
      }),
      createIngredient({ name: 'fresh mint, chopped' }),
      createIngredient({ name: 'fresh parsley, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'feta, crumbled',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Salt the grated courgette and leave for 15 minutes, then squeeze out excess moisture.',
      'Mix the courgette with eggs, flour, herbs and feta.',
      'Heat olive oil in a frying pan over medium-high heat.',
      'Drop spoonfuls of the mixture into the pan and flatten slightly.',
      'Fry for 3 minutes per side until golden and crisp.',
      'Serve warm with a dollop of yogurt.',
    ],
  }),
  createRecipe({
    id: 'harissa-chicken',
    name: 'Harissa-Roasted Chicken',
    description:
      'Whole chicken rubbed with fiery harissa paste and roasted until juicy.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/orange_harissa_chicken_2.jpg?v=1782900912',
    ingredients: [
      createIngredient({ name: '1 whole chicken, about 1.5kg' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'harissa paste',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({ name: '1 lemon, halved' }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: 'cloves' }),
        name: 'garlic, crushed',
      }),
      createIngredient({ name: 'sea salt and black pepper' }),
    ],
    steps: [
      'Heat the oven to 200°C.',
      'Mix harissa, olive oil and garlic into a paste.',
      'Rub the paste all over the chicken, inside and out.',
      'Place the lemon halves inside the cavity and season generously.',
      'Roast for 1 hour 15 minutes until the juices run clear.',
      'Rest for 10 minutes before carving.',
    ],
  }),
  createRecipe({
    id: 'cauliflower-cake',
    name: 'Cauliflower Cake',
    description:
      'A savoury cake of roasted cauliflower, parmesan and fresh herbs.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Crispy_cheese_and_mustard_cauliflower_bites.jpg?v=1716838407',
    ingredients: [
      createIngredient({ name: '1 large cauliflower, broken into florets' }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'parmesan, grated',
      }),
      createIngredient({ name: '6 eggs' }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'breadcrumbs',
      }),
      createIngredient({ name: 'fresh rosemary, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Roast the cauliflower at 200°C with olive oil for 25 minutes until golden.',
      'Whisk the eggs with parmesan, breadcrumbs and rosemary.',
      'Fold in the roasted cauliflower and season well.',
      'Pour into a lined 23cm cake tin.',
      'Bake at 180°C for 35 minutes until set and golden on top.',
      'Cool slightly before slicing and serving.',
    ],
  }),
  createRecipe({
    id: 'lemon-ricotta-cheesecake',
    name: 'Lemon and Ricotta Cheesecake',
    description:
      'A light, creamy cheesecake with fresh lemon zest and a biscuit base.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Lemon_and_labneh_mascarpone_layer_cake_cf3e8ada-946e-49c2-816d-6a5d6daa59fa.jpg?v=1718365412',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'digestive biscuits, crushed',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 100, unit: 'g' }),
        name: 'butter, melted',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 500, unit: 'g' }),
        name: 'ricotta',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'cream cheese',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 150, unit: 'g' }),
        name: 'caster sugar',
      }),
      createIngredient({ name: 'zest of 2 lemons' }),
      createIngredient({ name: '3 eggs' }),
    ],
    steps: [
      'Mix the biscuit crumbs with melted butter and press into a springform tin.',
      'Chill the base while you make the filling.',
      'Beat the ricotta, cream cheese and sugar until smooth.',
      'Add the lemon zest and eggs one at a time, mixing well.',
      'Pour over the base and bake at 160°C for 50 minutes.',
      'Cool completely, then chill for at least 4 hours before serving.',
    ],
  }),
  createRecipe({
    id: 'lamb-kofte',
    name: 'Lamb Kofte with Yogurt and Sumac',
    description:
      'Spiced lamb kofte served with a cooling yogurt sauce and sumac onions.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/lamb_kofte_2_1.jpg?v=1782907842',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 500, unit: 'g' }),
        name: 'minced lamb',
      }),
      createIngredient({ name: '1 small onion, grated' }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tsp' }),
        name: 'ground cumin',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'ground coriander',
      }),
      createIngredient({ name: 'fresh parsley, chopped' }),
      createIngredient({
        quantity: createQuantity({ amount: 200, unit: 'g' }),
        name: 'Greek yogurt',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'sumac',
      }),
    ],
    steps: [
      'Mix the lamb with onion, cumin, coriander, parsley, salt and pepper.',
      'Shape into small oval kofte and chill for 30 minutes.',
      'Grill or pan-fry the kofte for 8–10 minutes, turning regularly.',
      'Mix the yogurt with a pinch of sumac and season.',
      'Slice red onion and toss with sumac and lemon juice.',
      'Serve the kofte with yogurt sauce and sumac onions.',
    ],
  }),
  createRecipe({
    id: 'hummus-ful',
    name: 'Hummus with Ful',
    description:
      'Creamy hummus topped with warm spiced fava beans — a Ottolenghi pantry favourite.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Creamy_dreamy_hummus_621c0cf1-fdb9-4e5e-a6e6-93b60a523eac.jpg?v=1716187271',
    ingredients: [
      createIngredient({
        quantity: createQuantity({ amount: 400, unit: 'g' }),
        name: 'tinned chickpeas, drained',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 400, unit: 'g' }),
        name: 'tinned fava beans, drained',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'tahini',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'lemon juice',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'cloves' }),
        name: 'garlic',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tsp' }),
        name: 'ground cumin',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'olive oil',
      }),
    ],
    steps: [
      'Blend the chickpeas with tahini, lemon juice, garlic and cumin until smooth.',
      'Add enough water to reach a creamy consistency and season well.',
      'Warm the fava beans in a pan with a splash of olive oil and cumin.',
      'Spread the hummus on a shallow plate and create a well in the centre.',
      'Spoon the warm ful into the well and drizzle with olive oil.',
    ],
  }),
  createRecipe({
    id: 'roasted-aubergine-tahini',
    name: 'Roasted Aubergine with Tahini and Pine Nuts',
    description:
      'Silky roasted aubergine slices with tahini dressing and toasted pine nuts.',
    pictureUri:
      'https://ottolenghi.co.uk/cdn/shop/files/Roasted_aubergine_with_saffron_yoghurt.jpg?v=1716561356',
    ingredients: [
      createIngredient({ name: '2 large aubergines, sliced lengthways' }),
      createIngredient({
        quantity: createQuantity({ amount: 4, unit: 'tbsp' }),
        name: 'olive oil',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 3, unit: 'tbsp' }),
        name: 'tahini',
      }),
      createIngredient({
        quantity: createQuantity({ amount: 2, unit: 'tbsp' }),
        name: 'pine nuts, toasted',
      }),
      createIngredient({ name: 'fresh mint leaves' }),
      createIngredient({
        quantity: createQuantity({ amount: 1, unit: 'tbsp' }),
        name: 'pomegranate molasses',
      }),
    ],
    steps: [
      'Brush aubergine slices with olive oil and season well.',
      'Roast at 200°C for 25 minutes until soft and golden.',
      'Mix tahini with lemon juice and water to make a sauce.',
      'Arrange the aubergine on a platter and drizzle with tahini.',
      'Scatter with pine nuts, mint and pomegranate molasses.',
    ],
  }),
];

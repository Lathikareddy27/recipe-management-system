import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';
import Recipe from '../models/recipeModel.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    await Recipe.deleteMany();
    await User.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@recipe.com',
      password: 'password123',
      role: 'admin',
    });

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@recipe.com',
      password: 'password123',
    });

    const sampleRecipes = [
      {
        name: 'Classic Pancakes',
        category: 'Breakfast',
        ingredients: ['2 cups flour', '2 eggs', '1 cup milk', '2 tbsp sugar', '2 tsp baking powder', 'Pinch of salt'],
        instructions: 'Mix dry ingredients. Add eggs and milk. Whisk until smooth. Cook on a greased pan over medium heat until bubbles form, then flip.',
        prepTime: 10,
        cookTime: 15,
        difficulty: 'Easy',
        servings: 4,
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
        user: user._id,
      },
      {
        name: 'Grilled Chicken Salad',
        category: 'Lunch',
        ingredients: ['2 chicken breasts', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil', 'Balsamic vinegar'],
        instructions: 'Season and grill chicken until cooked through. Slice and serve over greens with tomatoes and cucumber. Drizzle with olive oil and balsamic.',
        prepTime: 15,
        cookTime: 20,
        difficulty: 'Easy',
        servings: 2,
        image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
        user: user._id,
      },
      {
        name: 'Spaghetti Bolognese',
        category: 'Dinner',
        ingredients: ['400g spaghetti', '500g ground beef', '1 onion', '2 garlic cloves', '400g canned tomatoes', 'Oregano', 'Olive oil'],
        instructions: 'Saute onion and garlic. Add beef and brown. Stir in tomatoes and oregano, simmer 30 min. Cook pasta and toss with sauce.',
        prepTime: 10,
        cookTime: 40,
        difficulty: 'Medium',
        servings: 4,
        image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
        user: user._id,
      },
      {
        name: 'Chocolate Lava Cake',
        category: 'Desserts',
        ingredients: ['100g dark chocolate', '100g butter', '2 eggs', '50g sugar', '30g flour'],
        instructions: 'Melt chocolate and butter. Whisk in eggs and sugar, then fold in flour. Bake at 200C for 8-10 minutes until edges are set but center is soft.',
        prepTime: 15,
        cookTime: 10,
        difficulty: 'Medium',
        servings: 2,
        image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg',
        user: user._id,
      },
      {
        name: 'Fresh Mango Smoothie',
        category: 'Drinks',
        ingredients: ['1 ripe mango', '1 banana', '1 cup yogurt', '1/2 cup milk', '1 tbsp honey'],
        instructions: 'Add all ingredients to a blender and blend until smooth. Serve chilled.',
        prepTime: 5,
        cookTime: 0,
        difficulty: 'Easy',
        servings: 2,
        image: 'https://images.pexels.com/photos/518255/pexels-photo-518255.jpeg',
        user: user._id,
      },
      {
        name: 'Vegetable Stir Fry',
        category: 'Vegetarian',
        ingredients: ['Broccoli', 'Bell pepper', 'Carrot', 'Soy sauce', 'Ginger', 'Garlic', 'Sesame oil'],
        instructions: 'Heat sesame oil, saute ginger and garlic. Add vegetables and stir fry on high heat. Season with soy sauce and serve.',
        prepTime: 10,
        cookTime: 10,
        difficulty: 'Easy',
        servings: 3,
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
        user: user._id,
      },
    ];

    await Recipe.insertMany(sampleRecipes);
    console.log('Seed data inserted successfully!');
    console.log('Admin login: admin@recipe.com / password123');
    console.log('User login: demo@recipe.com / password123');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();

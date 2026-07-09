import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Snacks',
        'Desserts',
        'Drinks',
        'Vegetarian',
        'Non-Vegetarian',
      ],
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one ingredient is required',
      },
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    prepTime: {
      type: Number,
      required: [true, 'Preparation time is required'],
      min: 0,
    },
    cookTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: 0,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: 1,
      max: 100,
    },
    image: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

recipeSchema.virtual('totalTime').get(function () {
  return this.prepTime + this.cookTime;
});

recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;

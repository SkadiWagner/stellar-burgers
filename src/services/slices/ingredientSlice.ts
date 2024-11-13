import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';
import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchIngredients = createAsyncThunk(
  'ingredietns/fetchIngredients',
  async (_) => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

export interface IngredientsState {
  ingredients: TIngredient[];
  selectedIngredientId: string | null;
  error: string | null;
  status: 'success' | 'failed' | 'loading' | 'idle';
}

const initialState: IngredientsState = {
  selectedIngredientId: null,
  ingredients: [],
  status: 'idle',
  error: null
};

const IngredientsSlice = createSlice({
  name: 'ingredients',
  reducers: {
    setIngredient: (state, action: PayloadAction<string>) => {
      state.selectedIngredientId = action.payload;
    }
  },
  selectors: {
    getIngredient: (state, id: string) =>
      state.ingredients.find((item) => {
        item._id = id;
      }),
    getIngredients: (state) => state.ingredients
  },
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.status = 'success';
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { reducer: ingredientsReducer } = IngredientsSlice;
export const selectIngredients = (state: RootState) => state.ingredients;
export const { setIngredient } = IngredientsSlice.actions;
export const { getIngredient, getIngredients } = IngredientsSlice.selectors;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { v4 } from 'uuid';

export interface BurgerConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderModalData: TOrder | null;
}

const initialState: BurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderModalData: null
};

const constructorSlice = createSlice({
  name: 'constructorSlice',
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: v4()
          }
        };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },

    changeIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = {
          ...action.payload,
          id: v4()
        };
      }
    },
    cleanConstructorItems(state) {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    upIngredient: (state, action: PayloadAction<string>) => {
      for (let i = 1; i < state.constructorItems.ingredients.length; i++)
        if (state.constructorItems.ingredients[i].id === action.payload) {
          const temp = state.constructorItems.ingredients[i - 1];
          state.constructorItems.ingredients[i - 1] =
            state.constructorItems.ingredients[i];
          state.constructorItems.ingredients[i] = temp;
          break;
        }
    },
    downIngredient: (state, action: PayloadAction<string>) => {
      for (let i = 0; i < state.constructorItems.ingredients.length - 1; i++)
        if (state.constructorItems.ingredients[i].id === action.payload) {
          const temp = state.constructorItems.ingredients[i + 1];
          state.constructorItems.ingredients[i + 1] =
            state.constructorItems.ingredients[i];
          state.constructorItems.ingredients[i] = temp;
          break;
        }
    }

    // changeIngredient: (
    //   state,
    //   action: PayloadAction<TConstructorIngredient>
    // ) => {}
  },
  initialState: initialState
});

export const { reducer: ConstructorReducer } = constructorSlice;
export const {
  addIngredient,
  removeIngredient,
  changeIngredient,
  cleanConstructorItems,
  downIngredient,
  upIngredient
} = constructorSlice.actions;

import { RootState, rootReducer } from './store';
import { initialState as ingredientInitialState } from './slices/ingredientSlice';
import { initialState as userInitialState } from './slices/userSlice';
import { initialState as orderInitialState } from './slices/orderSlice';
import { initialState as constructorInitialState } from './slices/constructorSlice';

export const initialStates = {
  ingredients: ingredientInitialState,
  constructorBurger: constructorInitialState,
  user: userInitialState,
  orders: orderInitialState
};

describe('rootReducer', () => {
  it('Тест rootReducer - инициализация с данными по умолчанию', () => {
    const action = { type: '@@INIT' };
    const state: RootState = rootReducer(undefined, action);
    expect(state).toEqual(initialStates);
  });
});

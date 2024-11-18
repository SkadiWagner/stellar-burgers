import {
  userReducer,
  initialState,
  changeUser,
  resetPassword,
  setAuthChecked,
  setUser,
  registerUser,
  logoutUser,
  loginUser
} from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'mail@mail.com',
  name: 'User Name'
};

describe('user slice reducers', () => {
  it('Проверка initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Тест для редьюсера setAuthChecked', () => {
    const actualState = userReducer(initialState, setAuthChecked(true));
    expect(actualState.isAuth).toEqual(true);
  });

  it('Тест для редьюсера setUser', () => {
    const user = mockUser;
    const actualState = userReducer(initialState, setUser(user));
    expect(actualState.user).toEqual({ ...user, key: expect.any(String) });
  });

  it('Тест для registerUser.fulfilled', () => {
    const user = mockUser;
    const action = { type: registerUser.fulfilled.type, payload: user };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('success');
    expect(actualState.user).toEqual(user);
  });

  it('Тест для registerUser.rejected', () => {
    const error = { message: 'Неудачная регистрация' };
    const action = { type: registerUser.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });

  it('Тест для loginUser.fulfilled', () => {
    const user = mockUser;
    const action = { type: loginUser.fulfilled.type, payload: user };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('success');
    expect(actualState.user).toEqual(user);
  });

  it('Тест для loginUser.rejected', () => {
    const error = { message: 'Неудачный логин' };
    const action = { type: loginUser.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });

  it('Тест для changeUser.fulfilled', () => {
    const user = mockUser;
    const action = { type: changeUser.fulfilled.type, payload: user };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('success');
    expect(actualState.user).toEqual(user);
  });

  it('Тест для changeUser.rejected', () => {
    const error = { message: 'Неудачное изменение данных юзера' };
    const action = { type: changeUser.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });

  it('Тест для logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('success');
    expect(actualState.user).toEqual(null);
  });

  it(' Тест для logoutUser.rejected', () => {
    const error = { message: 'Неудачный логаут' };
    const action = { type: logoutUser.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });

  it('Тест для resetPassword.fulfilled', () => {
    const action = { type: resetPassword.fulfilled.type };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('success');
  });

  it('Тест для resetPassword.rejected', () => {
    const error = { message: 'Неудачное восстановление пароля' };
    const action = { type: resetPassword.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });
});

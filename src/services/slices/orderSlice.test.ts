import { configureStore } from '@reduxjs/toolkit';

import {
  ordersReducer,
  getFeed,
  getCurrentOrder,
  getUsersOrders,
  setOrder,
  setOrderModalData,
  initialState
} from './orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '669ea1ed119d45001b4fae96',
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0943',
    '643d69a5c3f7b9001cfa093c'
  ],
  status: 'done',
  name: 'Краторный space люминесцентный бургер',
  createdAt: '2024-07-22T18:16:13.171Z',
  updatedAt: '2024-07-22T18:16:13.632Z',
  number: 46954
};

describe('Редьюсеры для orderSlice', () => {
  it('Проверка initial state', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Проверка установки данных модалки (setOrderModalData)', () => {
    const order = mockOrder;
    const actual = ordersReducer(initialState, setOrderModalData(order));
    expect(actual.orderModalData).toEqual(order);
  });

  describe('extra reducers', () => {
    it('Тест для setOrder.fulfilled', () => {
      const order = mockOrder;
      const action = { type: setOrder.fulfilled.type, payload: order };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('success');
      expect(state.order).toEqual(order);
      expect(state.orderModalData).toEqual(order);
    });

    it('Тест для setOrder.pending', () => {
      const action = { type: setOrder.pending.type };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('loading');
      expect(state.orderRequest).toBeTruthy();
    });

    it('Тест для setOrder.rejected', () => {
      const error = { message: 'Failed to order' };
      const action = { type: setOrder.rejected.type, error };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('failed');
      expect(state.error).toEqual(error.message);
      expect(state.orderRequest).toBeFalsy();
    });

    it('Тест для getCurrentOrder.fulfilled', () => {
      const orders = { orders: [mockOrder] };
      const action = { type: getCurrentOrder.fulfilled.type, payload: orders };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('success');
      console.log('rweqr', JSON.stringify(orders));
      expect(state.currentOrder).toEqual(orders.orders[0]);
    });

    it('Тест для getCurrentOrder.rejected', () => {
      const error = { message: 'Ошибка при получении данных заказа' };
      const action = { type: getCurrentOrder.rejected.type, error };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('failed');
      expect(state.error).toEqual(error.message);
    });

    it('Тест для getUserOrders.pending', () => {
      const action = { type: getUsersOrders.pending.type };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('loading');
    });

    it('Тест для getUserOrders.fulfilled', () => {
      const orders = [mockOrder];
      const action = { type: getUsersOrders.fulfilled.type, payload: orders };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('success');
      expect(state.orders).toEqual(orders);
    });

    it('Тест для getUserOrders.rejected', () => {
      const error = { message: 'Ошибка при получении заказов пользователя' };
      const action = { type: getUsersOrders.rejected.type, error };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('failed');
      expect(state.error).toEqual(error.message);
    });

    it('Тест для getFeed.pending', () => {
      const action = { type: getFeed.pending.type };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('loading');
    });

    it('Тест для getFeed.fulfilled', () => {
      const feedData = { orders: [mockOrder], total: 100, totalToday: 10 };
      const action = { type: getFeed.fulfilled.type, payload: feedData };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('success');
      expect(state.feed).toEqual(feedData.orders);
      expect(state.total).toEqual(feedData.total);
      expect(state.totalToday).toEqual(feedData.totalToday);
    });

    it('Тест для getFeed.rejected', () => {
      const error = { message: 'Ошибка при получении feed' };
      const action = { type: getFeed.rejected.type, error };
      const state = ordersReducer(initialState, action);
      expect(state.status).toEqual('failed');
      expect(state.error).toEqual(error.message);
    });
  });
});

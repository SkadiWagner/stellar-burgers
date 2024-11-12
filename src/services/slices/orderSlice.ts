import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const setOrder = createAsyncThunk(
  'orders/setOrders',
  async (orderIngredients: string[], { rejectWithValue }) => {
    try {
      const result = await orderBurgerApi(orderIngredients);
      return result.order;
    } catch (error) {
      return rejectWithValue('failed fetch');
    }
  }
);

export const getUsersOrders = createAsyncThunk(
  'orders/getUsersOrders',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getOrdersApi();
      return result;
    } catch (error) {
      return rejectWithValue('failed fetch');
    }
  }
);

export const getCurrentOrder = createAsyncThunk(
  'orders/getCurrentOrder',
  async (orderNum: number, { rejectWithValue }) => {
    try {
      const result = await getOrderByNumberApi(orderNum);
      return result;
    } catch (error) {
      return rejectWithValue('failed fetch');
    }
  }
);

export const getFeed = createAsyncThunk(
  'orders/getFeed',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getFeedsApi();
      return result;
    } catch (error) {
      return rejectWithValue('failed fetch');
    }
  }
);

export interface OrdersState {
  status: 'success' | 'failed' | 'loading' | 'idle';
  error: string | null;
  orderRequest: boolean;
  orderId: string;
  total: number;
  totalToday: number;
  selectedOrder: string | null;
  orders?: TOrder[];
  order?: TOrder | null;
  feed?: TOrder[];
  orderModalData?: TOrder | null;
  currentOrder?: TOrder | null;
}

const initialState: OrdersState = {
  status: 'idle',
  error: null,
  orders: [],
  orderRequest: false,
  orderId: '',
  order: null,
  feed: [],
  total: 0,
  totalToday: 0,
  selectedOrder: null,
  currentOrder: null,
  orderModalData: null
};

const OrdersSlice = createSlice({
  name: 'orders',
  reducers: {
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    }
  },
  selectors: {
    selectOrders: (state) => state.orders ?? [],
    selectFeed: (state) => state.feed ?? [],
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectCurrenOrder: (state) => state.currentOrder,
    selectStatus: (state) => state.status,
    selectOrderModalData: (state) => state.orderModalData
  },
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(setOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(setOrder.fulfilled, (state, action) => {
        state.status = 'success';
        state.error = null;
        state.order = action.payload;
        state.orderModalData = action.payload;
      })
      .addCase(setOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.orderRequest = false;
      })

      .addCase(getCurrentOrder.fulfilled, (state, action) => {
        state.status = 'success';
        state.error = null;
        state.currentOrder = action.payload.orders[0];
      })
      .addCase(getCurrentOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(getUsersOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUsersOrders.fulfilled, (state, action) => {
        state.status = 'success';
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(getUsersOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(getFeed.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.status = 'success';
        state.error = null;
        state.feed = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { reducer: ordersReducer } = OrdersSlice;
export const {
  selectOrders,
  selectFeed,
  selectTotal,
  selectTotalToday,
  selectCurrenOrder,
  selectStatus,
  selectOrderModalData
} = OrdersSlice.selectors;

export const { setOrderModalData } = OrdersSlice.actions;
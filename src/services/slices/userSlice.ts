import {
  createSlice,
  PayloadAction,
  prepareAutoBatched
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { v4 } from 'uuid';

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => {
          dispatch(setUser(res.user));
        })
        .catch(() => {
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
        })
        .finally(() => dispatch(setAuthChecked(true)));
    } else {
      dispatch(setAuthChecked(true));
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getUserApi();
      return user;
    } catch (error) {
      return rejectWithValue('failed fetch');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (registerData: TRegisterData) => {
    const res = await registerUserApi(registerData);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    loginUser: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await loginUserApi(loginUser as unknown as TLoginData);
      setCookie('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      return result.user;
    } catch (error) {
      return rejectWithValue('failed fetch');
    }
  }
);

// logoutUser

// export const logoutUser = createAsyncThunk(
//   'user/logoutUser',
//   async (logoutUser, { rejectWithValue }) => {
//     try {
//       await logoutApi();
//       deleteCookie('accessToken');
//       localStorage.removeItem('refreshToken');
//     } catch (error) {
//       return rejectWithValue('failed fetch');
//     }
//   }
// );

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkApi) => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const resault = await resetPasswordApi(data);
      return resault;
    } catch (error) {
      return rejectWithValue('failed fetch');
    }
  }
);

export const changeUser = createAsyncThunk(
  'user/changeUser',
  async (newData: TUser) => {
    const res = await updateUserApi(newData);
    return res.user;
  }
);

export interface userState {
  user: TUser | null;
  error: string | null;
  status: 'success' | 'failed' | 'loading' | 'idle';
  isAuth: boolean;
}

const initialState: userState = {
  user: null,
  error: null,
  status: 'idle',
  isAuth: false
};

const userSlice = createSlice({
  name: 'user',
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUser: {
      reducer: (
        state,
        action: PayloadAction<(TUser & { key: string }) | null>
      ) => {
        state.user = action.payload;
      },
      prepare: (user) => ({ payload: { ...user, key: v4() } })
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getAuthChecked: (state) => state.isAuth
  },
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = 'success';
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'success';
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload as TUser;
        state.status = 'success';
      })

      .addCase(changeUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.user = action.payload;
      })
      .addCase(changeUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'success';
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { reducer: userReducer } = userSlice;
export const { setUser, setAuthChecked } = userSlice.actions;
export const { getUser, getAuthChecked } = userSlice.selectors;

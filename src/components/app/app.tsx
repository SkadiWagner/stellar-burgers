import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  OrderInfoPage
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch,
  BrowserRouter
} from 'react-router-dom';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { RequireAuth } from '../requared-auth/requared-auth';
import { checkUserAuth, getUser } from '@slices';
import { useEffect } from 'react';
import { title } from 'process';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const matchFeed = useMatch('/feed/:number');
  const matchProfileOrders = useMatch('/profile/orders/:number');

  const number = matchFeed?.params.number || matchProfileOrders?.params.number;

  const background = location.state?.background;

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <RequireAuth authOnly={false}>
              <Login />
            </RequireAuth>
          }
        />
        <Route
          path='/register'
          element={
            <RequireAuth authOnly={false}>
              <Register />
            </RequireAuth>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RequireAuth authOnly={false}>
              <ForgotPassword />
            </RequireAuth>
          }
        />
        <Route
          path='/reset-password'
          element={
            <RequireAuth authOnly={false}>
              <ResetPassword />
            </RequireAuth>
          }
        />
        <Route
          path='/profile'
          element={
            <RequireAuth authOnly>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <RequireAuth authOnly>
              <ProfileOrders />
            </RequireAuth>
          }
        />
        <Route path='/feed/:number' element={<OrderInfoPage />} />
        <Route
          path='/ingredients/:id'
          element={
            <>
              <h2
                className={'text text_type_main-large'}
                style={{ textAlign: 'center', marginTop: '100px' }}
              >
                Ингредиент подробно
              </h2>
              <IngredientDetails />
            </>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <RequireAuth authOnly>
              <OrderInfo />
            </RequireAuth>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Ингредиент подробно'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${number}`} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <RequireAuth authOnly>
                <Modal title={`#${number}`} onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </RequireAuth>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

import { getUsersOrders, selectOrders } from '@slices';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';

export const ProfileOrders: FC = () => {
  const ordersState = useSelector(selectOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={ordersState} />;
};

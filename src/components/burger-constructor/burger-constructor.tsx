import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  cleanConstructorItems,
  getUser,
  selectIngredients,
  selectOrderModalData,
  selectOrders,
  selectStatus,
  setOrder,
  setOrderModalData
} from '@slices';
import { useSelector } from '../../services/store';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const { ingredients } = useSelector(selectIngredients);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUser);

  const constructorItems = useSelector(
    (state) => state.constructorBurger.constructorItems
  );

  const orderRequest = useSelector(
    (state) => selectStatus(state) === 'loading'
  );

  const orderModalData = useSelector(selectOrderModalData) || null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
    } else {
      const ids = [
        constructorItems.bun._id!,
        ...constructorItems.ingredients.map((a) => a._id),
        constructorItems.bun._id!
      ];
      dispatch(setOrder(ids));
    }
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
    dispatch(cleanConstructorItems());
  };

  const ingredientsPrice: number = constructorItems.ingredients.reduce<number>(
    (s: number, v: TConstructorIngredient) => s + v.price,
    0
  );

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      ingredientsPrice,
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

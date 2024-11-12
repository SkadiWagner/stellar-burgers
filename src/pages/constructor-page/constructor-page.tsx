import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  IngredientsState,
  selectIngredients
} from 'src/services/slices/ingredientSlice';
import { TIngredient } from '@utils-types';
import { fetchIngredients } from '@slices';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector<IngredientsState>(
    (state) => state.ingredients
  );

  const isIngredientsLoading = ingredients.status === 'loading';

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};

import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients, selectIngredients, setIngredient } from '@slices';

type TIngredientParams = {
  id: string | undefined;
};

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.ingredients.find(
    (ingredient) => ingredient._id === id
  );

  useEffect(() => {
    if (!ingredients.ingredients.length) {
      dispatch(fetchIngredients());
    }
    if (id) {
      dispatch(setIngredient(id));
    }
  }, [dispatch, ingredients, id]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

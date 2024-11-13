import { OrderInfo } from '@components';
import { useParams } from 'react-router-dom';

export const OrderInfoPage = () => {
  const { number } = useParams();
  return (
    <>
      <h2
        className={'text text_type_main-large'}
        style={{ textAlign: 'center', marginTop: '100px' }}
      >
        #{number}
      </h2>
      <OrderInfo />
    </>
  );
};

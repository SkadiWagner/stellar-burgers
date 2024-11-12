import { getFeed, selectFeed, selectOrders, selectStatus } from '@slices';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const feed = useSelector(selectFeed);
  const status = useSelector(selectStatus);

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeed());
  };

  if (status === 'loading') {
    return <Preloader />;
  }

  return <FeedUI orders={feed} handleGetFeeds={handleGetFeeds} />;
};

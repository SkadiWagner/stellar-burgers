import { getAuthChecked, getUser } from '@slices';
import { Preloader } from '@ui';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

type RequireAuthProps = {
  authOnly: boolean;
  children: ReactNode;
};

export const RequireAuth = (props: RequireAuthProps) => {
  const { authOnly, children } = props;
  const user = useSelector(getUser);
  const location = useLocation();
  const isAutchCheked = useSelector(getAuthChecked);

  if (!isAutchCheked) {
    return <Preloader />;
  }

  if (!authOnly && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  // if (authOnly && !user) {
  //   const from = location.state?.from || { pathname: '/' };
  //   return <Navigate to={from} />;
  // } else if (authOnly && !user) {
  //   return <Navigate to={'/login'} state={{ from: location }} />;
  // }

  if (authOnly && !user) {
    return <Navigate to={'/login'} state={{ from: location }} />;
  }
  return children;
};

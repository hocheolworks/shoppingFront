import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';

import Menu from '../Menu/Menu';
import Contacts from '../Contacts/Contacts';
import Footer from '../../component/Footer/Footer';
import HomePage from '../HomePage/HomePage';
import NavBar from '../../component/NavBar/NavBar';
import Login from '../Login/Login';
import Registration from '../Registration/Registration';
import Account from '../Account/Account';
import Order from '../Order/OrderPage';
import OrderSuccess from '../Order/OrderFinalize/OrderSuccess';
import OrderFail from '../Order/OrderFinalize/OrderFail';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import ResetPassword from '../ResetPassword/ResetPassword';
import Cart from '../Cart/Cart';
import ProductDetail from '../Product/ProductDetail';
import OAuth2RedirectHandler from '../../utils/oauth2/OAuth2RedirectHandler';

const App: FC = () => {
  return (
    <>
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/registration" component={Registration} />
        <Route exact path="/forgot" component={ForgotPassword} />
        <Route exact path="/reset/:code" component={ResetPassword} />
        <Route exact path="/activate/:code" component={Login} />
        <Route exact path="/menu" component={Menu} />
        <Route exact path="/product/:id" component={ProductDetail} />
        <Route exact path="/contacts" component={Contacts} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/order" component={Order} />
        <Route exact path="/order/success" component={OrderSuccess} />
        <Route exact path="/order/fail" component={OrderFail} />
        <Route path="/oauth2/redirect" component={OAuth2RedirectHandler} />
        <Route
          path="/account"
          render={() =>
            sessionStorage.getItem('token') ? (
              <Route component={Account} />
            ) : (
              <Route component={Registration} />
            )
          }
        />
        <Route path="*" component={HomePage} />
      </Switch>
      <Footer />
    </>
  );
};

export default App;

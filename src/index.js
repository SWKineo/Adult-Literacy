import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet'
import './index.css';
import LoginFrame from './screens/user/login/LoginFrame';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import WebFont from 'webfontloader'
import registerServiceWorker from './registerServiceWorker';
import AdminLoginFrame from './screens/admin/login/LoginFrame';
import UserViewFrame from './screens/admin/user/view/UserViewFrame';
import WordViewFrame from './screens/admin/word/view/WordViewFrame';
import UserCreateFrame from './screens/admin/user/create/UserCreateFrame';
import AdminCreateFrame from './screens/admin/user/create/AdminCreateFrame';
import WordCreateFrame from './screens/admin/word/create/WordCreateFrame';
import UserUpdateFrame from './screens/admin/user/update/UserUpdateFrame';
import WordUpdateFrame from './screens/admin/word/update/WordUpdateFrame';
import ProgressViewFrame from './screens/admin/progress/view/ProgressViewFrame';
import AttemptViewFrame from './screens/admin/progress/attempt/AttemptViewFrame';
import ProgressFrame from './screens/user/progress/ProgressFrame';
import QuizFrame from './screens/user/quiz/QuizFrame';

// Import fonts
WebFont.load({
    google: {
        families: ['Quicksand:500,700',
                   'Arvo:700']
    }
})

class Site {
    constructor() {
        this.words = []

    }

    render() {
        ReactDOM.render(
            <BrowserRouter>
                <div>
                    {/* Set page title */}
                    <Helmet>
                        <title>Responsive Reading</title>
                    </Helmet>
                    {/* Set routes for different addresses */}
                    <Route exact path="/" component={LoginFrame} />
                    <Route exact path="/admin" component={AdminLoginFrame} />

                    <PrivateRoute exact path="/admin/word" component={WordViewFrame} userType="admin" />
                    <PrivateRoute exact path="/admin/user" component={UserViewFrame} userType="admin" />
                    <PrivateRoute path="/admin/word/create" component={WordCreateFrame} userType="admin" />
                    <PrivateRoute path="/admin/user/create" component={UserCreateFrame} userType="admin" />
                    <PrivateRoute path="/admin/admin/create" component={AdminCreateFrame} userType="admin" />
                    <PrivateRoute path="/admin/word/update/:id" component={WordUpdateFrame} userType="admin" />
                    <PrivateRoute path="/admin/user/update/:id" component={UserUpdateFrame} userType="admin" />
                    <PrivateRoute path="/admin/progress/:id" component={ProgressViewFrame} userType="admin" />
                    <PrivateRoute path="/admin/attempt/:id" component={AttemptViewFrame} userType="admin" />
                    <PrivateRoute exact path="/student" component={ProgressFrame} userType="user" />
                    <PrivateRoute path="/practice/:id" component={QuizFrame} userType="user" />
                </div>
            </BrowserRouter>,
          document.getElementById('root'));
        registerServiceWorker();
    }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    sessionStorage.getItem('token') !== null && sessionStorage.getItem('userType') !== props.userType
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

new Site().render()

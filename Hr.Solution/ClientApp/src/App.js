import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';

import './custom.css'
import { EmployeeListing } from './components/employees/listing/EmployeeListing';
import { EmployeeCreate } from './components/employees/Create/EmployeeCreate';
import { EmployeeContract } from './components/employee.constract/EmployeeContract';
import { CategoryListing } from './components/administration/administration.category/Category.list';
import { DepartmentConfig } from './components/administration/administration.category/department/department.config';
import { AppRoute } from './components/AppRoute';
import AuthorizationComponent from './components/AuthorizationComponent';
import { NotFound404 } from './components/NotFound404';


import { Redirect, Switch } from 'react-router-dom';
import { Login } from './components/auth/Login';
require('./custom.css');

export default class App extends Component {
  static displayName = App.name;

  render =() => {
    return (
      <Switch>
        <Route exact path="/login" component={Login}/>

        <Layout>
            <Switch>
              <Route exact path={[AppRoute.EMPLOYEE_MANAGEMENT.path]} component={EmployeeListing} />
              <Route exact path={[AppRoute.EMPLOYEE_CREATE.path]} component={EmployeeCreate} />
              <Route exact path={[AppRoute.EMPLOYEE_CONTRACT.path]} component={EmployeeContract} />
              <Route exact path={[AppRoute.CATEGORY_LIST.path]} component={CategoryListing} />
              <Route exact path={[AppRoute.CONFIG_DEPARTMENT.path]} component={DepartmentConfig} />
              <Route exact path={[AppRoute.HOME.path]} component={Home} />
            </Switch>
          </Layout>

          <Route component={NotFound404}/>
        
      </Switch>
    )
  }

  render_() {
    return (
      <Switch>

        <Route path={AppRoute.ALL.map((item) => item)}>
          
        </Route>

        <Route path={['/not-found']} component={NotFound404} />

      </Switch>
    );
  }
}

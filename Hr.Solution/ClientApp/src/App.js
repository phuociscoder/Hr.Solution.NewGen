import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';

import './custom.css'
import { RoutePath } from './components/Common/Constants';
import { EmployeeListing } from './components/employees/listing/EmployeeListing';
import { EmployeeCreate } from './components/employees/Create/EmployeeCreate';
import { EmployeeContract } from './components/employee.constract/EmployeeContract';
require('./custom.css');

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path={RoutePath.HOME} component={Home} />
        <Route exact path={RoutePath.EMPLOYEE_MANAGEMENT} component={EmployeeListing}/>
        <Route exact path={RoutePath.EMPLOYEE_CREATE} component={EmployeeCreate}/>
        <Route exact path={RoutePath.EMPLOYEE_CONTRACT} component={EmployeeContract}/>
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
      </Layout>
    );
  }
}

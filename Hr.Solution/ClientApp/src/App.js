import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';

import './custom.css'
import { EmployeeListing } from './components/employees/listing/EmployeeListing';
import { EmployeeContract } from './components/employee.constract/EmployeeContract';
import { CategoryListing } from './components/administration/administration.category/Category.list';
import { AppRoute } from './components/AppRoute';
import AuthorizationComponent from './components/AuthorizationComponent';
import WrapperCategoryDetail from './components/administration/administration.category/WrapperCategoryDetail';
import { NotFound404 } from './components/NotFound404';



import { Switch } from 'react-router-dom';
import { Login } from './components/auth/Login';
import { MaintainPage } from './components/Maintaince';
import { AccountListing } from './components/administration/admin.account';
import { SystemRoleManagement } from './components/administration/admin.roles/admin.sysRole';
import { DataRoleManagement } from './components/administration/admin.roles/admin.dataRole';
import { CategoryDetail } from './components/administration/administration.category/Category.detail';
import { Function } from './components/Common/Constants';
import { DepartmentConfig } from './components/administration/administration.category/department';
import { EmployeeCreateEdit } from './components/employees/CreateAndEdit';
import { WorkType } from './components/administration/administration.category/work/work.type';
import { WorkMonth } from './components/administration/administration.category/work/work.month';
import { WorkShift } from './components/administration/administration.category/work/work.shift';
require('./custom.css');

export default class App extends Component {
  static displayName = App.name;
  state = {
    loading: true
  }

  componentDidMount = () => {
     this.setState({ loading: false });
  }

  render = () => {
    const { loading } = this.state;
    if (loading) {
      return null;
    } else {
      return (

        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/maintain" component={MaintainPage} />

          <Layout>
            <Switch>
              <Route exact path={[AppRoute.EMPLOYEE_MANAGEMENT.path]} component={AuthorizationComponent(EmployeeListing, Function.EMP000)} />
              <Route exact path={[AppRoute.EMPLOYEE_CONTRACT.path]} component={EmployeeContract} />
              <Route exact path={[AppRoute.EMPLOYEE_CREATE.path]} component={AuthorizationComponent(EmployeeCreateEdit, Function.EMP001)} />
              <Route exact path={[AppRoute.CATEGORY_LIST.path]} component={AuthorizationComponent(CategoryListing, Function.LS000)} />
              <Route exact path={[AppRoute.CATEGORY_DETAIL.path]} component={WrapperCategoryDetail(CategoryDetail)}/>
              <Route exact path={[AppRoute.CONFIG_DEPARTMENT.path]} component={AuthorizationComponent(DepartmentConfig)} />

              <Route exact path={[AppRoute.ADMIN_ACOUNT.path]} component={AuthorizationComponent(AccountListing, Function.ADM001)} />
              <Route exact path={[AppRoute.ADMIN_SYSTEM_ROLE.path]} component={AuthorizationComponent(SystemRoleManagement, Function.ADM002)} />
              <Route exact path={[AppRoute.ADMIN_DATA_ROLE.path]} component={AuthorizationComponent(DataRoleManagement, Function.ADM003)} />

              <Route exact path={[AppRoute.WORK_TYPE.path]} component={AuthorizationComponent(WorkType, Function.ADM003)} />
              <Route exact path={[AppRoute.WORK_MONTH.path]} component={AuthorizationComponent(WorkMonth, Function.ADM003)} />
              <Route exact path={[AppRoute.WORK_SHIFT.path]} component={AuthorizationComponent(WorkShift, Function.ADM003)} />

              <Route exact path={[AppRoute.HOME.path]} component={AuthorizationComponent(Home)} />
              <Route component={NotFound404} />
            </Switch> 
          </Layout>
        </Switch>
      )
    }
  }

}

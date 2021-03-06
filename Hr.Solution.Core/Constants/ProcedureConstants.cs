using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Core.Constants
{
   public static class ProcedureConstants
    {
        public static string SP_SYSTEM_ROLE_GET_ALL = "spGelAllSystemRolesByName";
        public static string SP_SYSTEM_ROLE_GET_BY_ID = "spSysRole_GetById";
        public static string SP_SYSTEM_ROLE_INSERT = "spSysRole_Insert";
        public static string SP_SYSTEM_ROLE_UPDATE = "spSysRole_Update";
        public static string SP_SYSTEM_ROLE_ADD_USER = "spSysRole_AddUser";
        public static string SP_SYSTEM_ROLE_DELETE = "spSysRole_Delete";
        public static string SP_SYSTEM_ROLE_GET_USERS = "spSysRole_GetUsers";
        public static string SP_SYSTEM_ROLE_REMOVE_USER = "spSysRole_RemoveUser";
        public static string SP_SYSTEM_ROLE_GET_FUNCTIONS = "spSysRole_GetFunctions";
        public static string SP_SYSTEM_ROLE_GET_ROLE_PERMISSIONS = "spSysRole_GetRolePermissions";
        public static string SP_SYSTEM_ROLE_UPDATE_PERMISSION = "spSysRole_UpdatePermission";

        //ExportTemplate
        public static string SP_SYSTEM_ROLE_GET_COLUMNS_BY_TABLE_NAME = "spSystem_GetColumnsbyTableName";

        //Data Roles
        public static string SP_DATA_ROLE_GETS = "spSysDataRole_GetList";
        public static string SP_DATA_ROLE_ADD = "spSysDataRole_Add";
        public static string SP_DATA_ROLE_UPDATE = "spSysDataRole_Update";
        public static string SP_DATA_ROLE_DELETE = "spSysDataRole_Delete";
        public static string SP_DATA_ROLE_GET_SYS_ROLES = "spSysDataRole_GetSysRoleMembers";
        public static string SP_DATA_ROLE_REMOVE_SYS_ROLE = "spSysDataRole_RemoveSysRoleMember";
        public static string SP_DATA_ROLE_ADD_SYS_ROLE = "spSysDataRole_AddSysRoleMember";
        public static string SP_DATA_ROLE_GET_DEPARTMENTS = "spSysDomain_GetDomainDepartments";
        public static string SP_DATA_ROLE_REMOVE_DEPARTMENTS = "spSysDomain_RemoveAllDomainDepartments";
        public static string SP_DATA_ROLE_UPDATE_DEPARMENT = "spSysDomain_UpdateDomainDepartments";

        //Category
        public static string SP_CATEGORY_GET_LIST = "sysCategory_GetCategory";
        public static string SP_CATEGORY_GET_BY_ID = "spCategory_GetById";
        public static string SP_CATEGORY_GET_ITEMS = "spCategory_GetItems";
        public static string SP_CATEGORY_ADD_ITEM = "spCategory_AddItem";
        public static string SP_CATEGORY_UPDATE_ITEM = "spCategory_UpdateItem";
        public static string SP_CATEGORY_DELETE_ITEM = "spCategory_DeleteItem";

        public static string SP_CATEGORY_NATION_GETALL = "spCategoryNation_GetAll";

        //LsInsurance
        public static string SP_LSINSURANCE_GET_ALL = "spLsInsurance_GetList";
        public static string SP_LSINSURANCE_GET_BY_ID = "spLsInsurance_GetByID";
        public static string SP_LSINSURANCE_UPDATE = "spLsInsurance_Update";
        public static string SP_LSINSURACE_INSERT = "spLsInsurance_Insert";
        public static string SP_LSINSURANCE_DELETE = "spLsInsurance_Delete";

        //AllowanceGrade
        public static string SP_ALLOWANCEGRADE_GET_LIST = "spLsAllGrade_GetList";
        public static string SP_ALLOWANCEGRADE_GET_BY_ID = "spLsAllGrade_GetById";
        public static string SP_ALLOWANCEGRADE_GET_INSERT = "spLsAllGrade_Insert";
        public static string SP_ALLOWANCEGRADE_GET_UPDATE = "spLsAllGrade_Update";
        public static string SP_ALLOWANCEGRADE_GET_DELETE = "spLsAllGrade_Delete";


        //User
        public static string SP_USER_GET = "spUser_GetByName";
        public static string SP_USER_GET_LIST = "spUser_GetList";
        public static string SP_USER_DELETE = "spUser_Delete";
        public static string SP_USER_GET_SYS_ROLES = "spUser_GetSysRoles";
        public static string SP_USER_GET_SYS_FUNC_PERMISSIONS = "spUser_GetFuncPermissions";


        //department
        public static string SP_DEPARTMENT_GETALL = "spDepartment_GetbyFreetext";
        public static string SP_DEPARTMENT_GET_BY_ID = "spDepartment_GetById";
        public static string SP_DEPARTMENT_CREATE = "spDepartment_Create";
        public static string SP_DEPARTMENT_CHECKEXISTING = "sp_Department_CheckExisting";
        public static string SP_DEPARTMENT_DELETE = "spDepartment_Delete";
        public static string SP_DEPARTMENT_UPDATE = "spDepartment_Edit";
        public static string SP_DEPARTMENT_GET_BY_USER_ROLES = "spDepartment_GetByUserRoles";

        //Employees
        public static string spEmployees_spGetAll = "spEmployees_spGetAll";
        public static string SP_EMPLOYEE_GET_MANAGERS = "spEmployee_GetManagers";
        public static string SP_EMPLOYEE_GET_BY_DEPTS = "spEmployee_GetByDepts";
        public static string SP_EMPLOYEE_GET_BY_ID = "spEmployee_GetById";
        public static string SP_EMPLOYEE_INFORMATION_ADD = "spEmployee_AddGeneraInfomation";
        public static string SP_EMPLOYEES_CREATE_GENERAL_INFO = "spEmployee_CreateGeneralInfo";
        public static string SP_EMPLOYEES_CHECK_EXISTING = "spEmployees_CheckExisting";
        public static string SP_EMPLOYEES_GET_BY_ID = "spEmployee_GetById";
        public static string SP_EMPLOYEES_UPDATE = "spEmployee_Update";
        public static string SP_EMPLOYEE_ALLOWANCE_CUD = "spEmployeeAllowance_CUD";
        public static string SP_EMPLOYEE_DEPENDANTS_CUD = "spEmployeeDependants_CUD";
        public static string SP_EMPLOYEE_CONTRACT_CUD = "spEmployeeContract_CUD";
        public static string SP_EMPLOYEE_BASIC_SALARY_PROCESS_CUD = "spEmpBasicSalProcess_CUD";
        public static string SP_EMPLOYEE_INSURANCES_UPDATE = "spEmployeeInsuranceUpdate";
        public static string SP_EMPLOYEE_GET_PHOTO = "spEmployeeGetPhoto";

        //EmployeesBasicSalary
        public static string SP_EMPLOYEES_BASIC_SALARY_UPDATE = "spEmployeesBasicSalary_Update";
        public static string SP_EMPLOYEES_BASIC_SALARY_GET_BY_ID = "spEmployeeBasicSalary_GetByID";

        
    }
}

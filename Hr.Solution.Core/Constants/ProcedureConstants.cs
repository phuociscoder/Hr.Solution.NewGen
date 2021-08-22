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
        public static string SP_SYSTEM_ROLE_GET_USERS = "spSysRole_GetUsers";
        public static string SP_SYSTEM_ROLE_REMOVE_USER = "spSysRole_RemoveUser";
        public static string SP_SYSTEM_ROLE_GET_FUNCTIONS = "spSysRole_GetFunctions";
        public static string SP_SYSTEM_ROLE_GET_ROLE_PERMISSIONS = "spSysRole_GetRolePermissions";
        public static string SP_SYSTEM_ROLE_UPDATE_PERMISSION = "spSysRole_UpdatePermission";

        //Data Roles
        public static string SP_DATA_ROLE_GETS = "spSysDataRole_GetList";
        public static string SP_DATA_ROLE_ADD = "spSysDataRole_Add";
        public static string SP_DATA_ROLE_UPDATE = "spSysDataRole_Update";
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

        //User
        public static string SP_USER_GET = "spUser_GetByName";
        public static string SP_USER_GET_LIST = "spUser_GetList";
        public static string SP_USER_DELETE = "spUser_Delete";
        public static string SP_USER_GET_SYS_ROLES = "spUser_GetSysRoles";
        public static string SP_USER_GET_SYS_FUNC_PERMISSIONS = "spUser_GetFuncPermissions";


        //department
        public static string SP_DEPARTMENT_GETALL = "spDepartment_GetbyFreetext";

        //Employees
        public static string spEmployees_spGetAll = "spEmployees_spGetAll";
    }
}

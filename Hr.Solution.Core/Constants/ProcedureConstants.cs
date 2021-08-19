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

        //User
        public static string SP_USER_GET = "spUser_GetByName";

        //department
        public static string SP_DEPARTMENT_GETALL = "spDepartment_GetbyFreetext";
    }
}

ALTER TABLE [dbo].[SYS_FunctionList]
ALTER COLUMN Sorting INT NULL

GO

CREATE PROC spSysRole_GetFunctions
AS
BEGIN
	SELECT 
		FunctionID as FunctionId,
		FunctionType,
		DefaultName as FunctionName,
		ParentID as ParentId,
		Module,
		[Level],
		Sorting
	FROM SYS_FunctionList
	WHERE IsActive =1 
	ORDER BY Sorting, FunctionID ASC
END

GO
CREATE PROC spSysRole_GetRolePermissions @RoleId uniqueidentifier
AS
BEGIN
	SELECT * FROM SYS_Permissions WHERE RoleID = @RoleId
END

GO
ALTER PROC spSysRole_GetUsers @roleId nvarchar(450) , @freeText nvarchar(200)  
AS  
BEGIN  
 SELECT 
 ur.RecID as [Id], 
 ur.RoleID as RoleId,
 u.id as UserId,
 u.UserName, 
 u.FullName, 
 u.Avatar, 
 u.Email, 
 u.code as Usercode 
 FROM sys_UserRoles ur JOIN aspnetusers u on u.id = ur.UserID
 where ur.RoleID = @roleId 
 AND (u.FullName like N'%'+ISNULL(@freeText, '')+'%' OR u.UserName like N'%'+ISNULL(@freeText, '')+'%' OR u.Code like N'%'+ISNULL(@freeText, '')+'%' or u.Email like N'%'+ISNULL(@freeText, '')+'%')
 and u.isactive=1  
END


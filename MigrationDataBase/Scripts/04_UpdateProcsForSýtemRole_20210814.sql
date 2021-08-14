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
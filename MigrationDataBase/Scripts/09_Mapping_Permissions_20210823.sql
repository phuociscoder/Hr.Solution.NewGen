GO
CREATE PROC spUser_GetSysRoles @userId nvarchar(450)
AS
BEGIN
	SELECT 
	R.RecID as Id,
	R.RoleID as Code,
	R.RoleName as [Name],
	R.RoleSubName as SubName,
	R.IsAdmin
	FROM sys_Roles R
	JOIN sys_UserRoles UR ON UR.RoleID = R.RecID
	WHERE R.Lock =0  AND UR.UserID = @userId

END
GO
CREATE PROC spUser_GetFuncPermissions @userId nvarchar(250)
AS
BEGIN
	
	SELECT FunctionID as FunctionId, FunctionType, ParentID as ParentId, [Level],
	dbo.fnGetUserFunctionPermission(@userId, F.FunctionID, 'view') as [View],
	dbo.fnGetUserFunctionPermission(@userId, F.FunctionID, 'add') as [Add],
	dbo.fnGetUserFunctionPermission(@userId, F.FunctionID, 'edit') as [Edit],
	dbo.fnGetUserFunctionPermission(@userId, F.FunctionID, 'delete') as [Delete],
	dbo.fnGetUserFunctionPermission(@userId, F.FunctionID, 'import') as [Import],
	dbo.fnGetUserFunctionPermission(@userId, F.FunctionID, 'export') as [Export] 
	FROM SYS_FunctionList F WHERE IsActive =1 

END
GO
CREATE FUNCTION fnGetUserFunctionPermission(@userId nvarchar(250), @functionId nvarchar(20), @type varchar(10))
RETURNS BIT
BEGIN
	DECLARE @result bit =0
	SELECT
		@result = (
		CASE @type 
		WHEN 'view' THEN Max( CAST(ISNULL(P.[View],0) AS INT))
		WHEN 'add' THEN Max( CAST(ISNULL(P.[Add],0) AS INT))
		WHEN 'edit' THEN Max( CAST(ISNULL(P.[Edit],0) AS INT))
		WHEN 'delete' THEN Max( CAST(ISNULL(P.[Delete],0) AS INT))
		WHEN 'import' THEN Max( CAST(ISNULL(P.[Import],0) AS INT))
		ELSE Max( CAST(ISNULL(P.[Export],0) AS INT)) END
		) 
	FROM SYS_Permissions P
	JOIN SYS_FunctionList F ON P.FunctionID = F.FunctionID
	WHERE F.IsActive =1 AND 
	P.RoleID IN (
	SELECT 
	R.RecID
	FROM sys_Roles R
	JOIN sys_UserRoles UR ON UR.RoleID = R.RecID
	WHERE R.Lock =0  AND UR.UserID = @userId AND F.FunctionID = @functionId
	)

return @result

END
GO

ALTER PROC spSysDataRole_Update  
@id int,   
@code nvarchar(20),  
@name nvarchar(450),  
@name2 nvarchar(450),  
@lock bit ,  
@active bit,  
@description nvarchar(max),  
@ModifiedBy nvarchar(20)  
AS  
BEGIN  
 UPDATE [dbo].[SYS_DataDomains]  
 SET   
  DDName = @name,  
  DDName2 =@name2,  
  Lock =@lock,  
  [Description] = @description,  
  Active = @active,  
  ModifiedBy = @ModifiedBy,  
  ModifiedOn = GETDATE()  
 WHERE DDID = @id  
  
 SELECT   
 DD.DDID as Id,  
 DD.DDCode as Code,  
 DD.DDName as [Name],  
 DD.DDName2 as [Name2],  
 DD.AccessMode,  
 DD.Description,  
 DD.[Level],  
 DD.LevelCode,  
 DD.ParentID as ParentId,  
 DD.ParentCode,  
 DD.Lock,  
 0 AS RoleCount  
 FROM SYS_DataDomains DD  WHERE DD.DDID = @id  
      
END
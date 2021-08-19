GO
CREATE PROC spGelAllSystemRolesByName @name nvarchar(100)
AS
BEGIN
	SELECT * FROM sys_Roles WHERE RoleName like N'%'+ISNULL(@name, '')+'%' OR  RoleSubName like N'%'+ISNULL(@name, '')+'%' OR  RoleID like N'%'+ISNULL(@name, '')+'%'
END

GO
CREATE PROC spSysRole_Insert 
            @RoleID nvarchar(20)
           ,@RoleName nvarchar(100)
           ,@Description nvarchar(500)
           ,@Lock bit
           ,@IsSystem bit
           ,@IsAdmin bit
           ,@Note nvarchar(1000)
           ,@IsEmpGroup bit
           ,@RoleSubName nvarchar(100)
		   ,@CurrentUser nvarchar(450)
AS
BEGIN
	Declare @RecId uniqueidentifier = newId()
INSERT INTO [dbo].[sys_Roles]
           ([RecID]
           ,[RoleID]
           ,[RoleName]
           ,[Description]
           ,[Lock]
           ,[IsSystem]
           ,[IsAdmin]
           ,[Note]
           ,[CreatedOn]
           ,[CreatedBy]
           ,[IsEmpGroup]
           ,[RoleSubName])
     VALUES
           (@RecId,
			@RoleID,
			@RoleName,
			@Description,
			@Lock,
			@IsSystem,
			@IsAdmin,
			@Note,
			GETDATE(),
			@CurrentUser,
			@IsEmpGroup,
			@RoleSubName)

SELECT TOP 1 * From sys_Roles where RecID = @RecId
END
GO

CREATE PROC spSysRole_Update
@RecID uniqueidentifier, 
@RoleName nvarchar(100),
@Description nvarchar(500),
@Lock bit,
@IsAdmin bit,
@ModifiedBy nvarchar(20),
@RoleSubName nvarchar(100)
AS
BEGIN
UPDATE [dbo].[sys_Roles]
   SET 
       [RoleName] = @RoleName
      ,[Description] = @Description
      ,[Lock] = @Lock
      ,[IsAdmin] = @IsAdmin
      ,[ModifiedOn] = GETDATE()
      ,[ModifiedBy] = @ModifiedBy
      ,[RoleSubName] = @RoleSubName
 WHERE RecID =@RecID

 SELECT TOP 1 * FROM sys_Roles where RecID =@RecID
END
GO

CREATE PROC spSysRole_GetById @id uniqueidentifier
AS
BEGIN
	SELECT TOP 1 * FROM sys_Roles WHERE RecID = @id
END
GO

CREATE PROC spUser_GetByName
@FreeText nvarchar(100)
AS
BEGIN
SELECT * FROM [dbo].[AspNetUsers] WHERE IsActive =1 AND( UserName like '%'+@FreeText+'%' OR FullName like N'%'+@FreeText+'%' OR Email like '%'+@FreeText+'%')
END
GO

ALTER TABLE sys_userRoles
ALTER COLUMN userId nvarchar(450)
ALTER TABLE sys_userRoles
ALTER COLUMN roleId nvarchar(450)
ALTER TABLE sys_userRoles
ALTER COLUMN CreatedBy nvarchar(450)
ALTER TABLE sys_userRoles
ALTER COLUMN ModifiedBy nvarchar(450)


GO
ALTER PROC spSysRole_AddUser @UserId NVARCHAR(450), @RoleId uniqueidentifier, @createdBy nvarchar(25)
AS
BEGIN
	declare @recId uniqueidentIfier = NewId()

	INSERT INTO [dbo].[sys_UserRoles]
           ([RecID]
           ,[UserID]
           ,[RoleID]
           ,[CreatedOn]
           ,[CreatedBy])
     VALUES
           (@recId
           ,@UserId
           ,@RoleId
           ,Getdate()
           ,@createdBy)

SELECT ur.RecID as [Id], ur.RoleID as RoleId, u.id as UserId, u.UserName, u.FullName, u.Avatar, u.Email, u.code as Usercode FROM sys_UserRoles ur JOIN aspnetusers u on u.id = ur.UserID where ur.RecID =@recId and u.isactive=1

END
GO

CREATE PROC spSysRole_GetUsers @roleId nvarchar(450)
AS
BEGIN
	SELECT ur.RecID as [Id], ur.RoleID as RoleId, u.id as UserId, u.UserName, u.FullName, u.Avatar, u.Email, u.code as Usercode FROM sys_UserRoles ur JOIN aspnetusers u on u.id = ur.UserID where ur.RoleID = @roleId and u.isactive=1
END

GO
CREATE Proc spSysRole_RemoveUser @UserRoleId uniqueidentifier
AS
BEGIN
	DELETE FROM sys_UserRoles where RecID =@UserRoleId
END

GO
ALTER TABLE Sys_permissions
ADD COLUMN Edit bit not null

ALTER TABLE Sys_permissions
ADD Constraint df_edit
DEFAULT 0 FOR [Edit]

ALTER TABLE sys_permissions
ALTER COLUMN RoleID uniqueidentifier

GO

CREATE PROC spSysRole_GetPermissions @RoleId uniqueidentifier
AS
BEGIN
SELECT 
	P.RoleID AS RoleId,
	FL.FunctionID AS FunctionId,
	FL.FunctionType,
	FL.DefaultName AS FunctionName,
	FL.ParentID AS ParentId,
	FL.Module,
	FL.[Level],
	ISNULL(P.[View], 0) AS [View],
	ISNULL(P.[Add], 0) AS [Add],
	ISNULL(P.[Edit],0) AS [Edit],
	ISNULL(P.[Delete], 0) AS [Delete],
	ISNULL(P.Import, 0) AS [Import],
	ISNULL(P.Export,0) AS [Export]
FROM SYS_FunctionList FL 
LEFT JOIN SYS_Permissions P ON FL.FunctionID = P.FunctionID

WHERE P.RoleID = @RoleId OR P.RoleID IS NULL
ORDER BY FunctionID, [level] ASC
END


GO
CREATE PROC spSysRole_UpdatePermission 
@RoleId uniqueidentifier,
@FunctionId nvarchar(20),
@view bit, @add bit, @edit bit, @delete bit, @import bit, @export bit,
@user nvarchar(50)
AS
BEGIN
DECLARE @existing int =0

SELECT @existing = COUNT(*) FROM SYS_Permissions WHERE RoleID =@RoleId AND FunctionID =@FunctionId

IF @existing =0 
BEGIN
	INSERT INTO SYS_Permissions (RoleID, FunctionID, [View], [Add], [Edit], [Delete], [Import], [Export], CreatedBy, CreatedOn)
	VALUES (@RoleId, @FunctionId, @view, @add, @edit, @delete, @import, @export, @user, GETDATE())
END
ELSE
BEGIN
	UPDATE SYS_Permissions 
	SET [View] =@view,
		[Add] =@add,
		[Edit] =@edit,
		[Delete] =@delete,
		[Import] =@import,
		[Export] =@export,
		ModifiedBy =@user,
		ModifiedOn =GETDATE()
	WHERE RoleID =@RoleId AND FunctionID =@FunctionId
END
END





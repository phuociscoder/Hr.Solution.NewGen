GO
CREATE PROC spGelAllSystemRolesByName @name nvarchar(100)
AS
BEGIN
	SELECT * FROM sys_Roles WHERE RoleName like N'%'+ISNULL(@name, '')+'%' OR  RoleSubName like N'%'+ISNULL(@name, '')+'%'
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



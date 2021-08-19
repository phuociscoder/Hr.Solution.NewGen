GO
CREATE PROC spDepartment_GetbyFreetext @freeText nvarchar(50)
AS
BEGIN
SELECT 
ID as Id,
DepartmentCode,
DepartmentName,
DepartmentName2,
ParentID as ParentId,
ParentCode,
[Level],
IsCompany,
RegionCode
FROM Departments
WHERE 
DepartmentCode like N'%'+ISNULL(@freeText,'')+'%' 
OR DepartmentName like N'%'+ISNULL(@freeText, '')+'%'
OR DepartmentName2 like N'%'+ISNULL(@freeText, '')+'%'
END
GO

ALTER TABLE Sys_DataDomains
ADD Lock BIT NULL
ALTER TABLE Sys_DataDomains
ADD DDName2 nvarchar(450) NULL
ALTER TABLE Sys_DataDomains
ADD Active bit NULL
ALTER TABLE Sys_DataDomains
ADD Constraint df_active
DEFAULT 1 FOR [Active]

GO
CREATE PROC spSysDataRole_GetList @freeText nvarchar(50)
AS
BEGIN
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
	(SELECT COUNT(*)
	FROM SYS_DataDomains D 
	JOIN SYS_DataDomain_Roles DR ON DD.DDCode = DR.DDCode
	JOIN sys_Roles R ON DR.RoleID = R.RoleID WHERE D.DDID = DD.DDID) as RoleCount
	FROM SYS_DataDomains DD 
	WHERE DD.Active =1 AND (DD.DDCode like '%'+ISNULL(@freeText, '')+'%' OR DD.DDName like '%'+ISNULL(@freeText, '')+'%' OR DD.DDName2 like '%'+ISNULL(@freeText, '')+'%') 
	ORDER BY DD.CreatedOn, DD.ModifiedOn DESC
END

GO

CREATE PROC spSysDataRole_Add
@code nvarchar(20),
@name nvarchar(450),
@name2 nvarchar(450),
@lock bit ,
@description nvarchar(max),
@createdBy nvarchar(20)
AS
BEGIN
	INSERT INTO [dbo].[SYS_DataDomains](DDCode, DDName, DDName2, AccessMode, [Description], lock, CreatedOn, CreatedBy)
	VALUES (@code, @name, @name2, 0, @description, @lock, GETDATE(), @createdBy )

	Declare @newId int = @@IDENTITY
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
	(SELECT COUNT(*) FROM SYS_DataDomain_Roles WHERE RoleID = DD.DDID) AS RoleCount
	FROM SYS_DataDomains DD  WHERE DD.DDID = @newId
END
GO
--exec spSysDataRole_Update 4, 'TestEditcode', 'TestEdit01', 'Test Edit 01', 1, 1, 'Test Edit 01', 'phuoc.nguyen'
CREATE PROC spSysDataRole_Update
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
	(SELECT COUNT(*) FROM SYS_DataDomain_Roles WHERE RoleID = DD.DDID) AS RoleCount
	FROM SYS_DataDomains DD  WHERE DD.DDID = @id
	   
END
GO

ALTER PROC spSysDataRole_GetSysRoleMembers @domainId int, @freeText nvarchar(100)
AS
BEGIN
	SELECT DR.ID as Id,
	DD.DDID as DataDomainId,
	DD.DDCode as DataDomainCode,
	R.RecID AS RoleId,
	R.RoleID as RoleCode,
	R.RoleName ,
	R.RoleSubName,
	R.Lock
	FROM SYS_DataDomains DD 
	JOIN SYS_DataDomain_Roles DR ON DD.DDCode = DR.DDCode
	JOIN sys_Roles R ON DR.RoleID = R.RoleID
	WHERE DD.DDID = @domainId 
	AND (R.RoleID LIKE N'%'+ISNULL(@freeText, '')+'%' OR R.RoleName LIKE N'%'+ISNULL(@freeText, '')+'%' OR R.RoleSubName LIKE N'%'+ISNULL(@freeText, '')+'%')
END
GO

CREATE PROC spSysDataRole_RemoveSysRoleMember @id int
AS
BEGIN 
	DELETE FROM SYS_DataDomain_Roles WHERE ID =@id
END

GO
ALTER PROC spSysDataRole_AddSysRoleMember @domainId int, @roleId uniqueidentifier, @createdBy nvarchar(20)
AS
BEGIN
    DECLARE @roleCode nvarchar(20)
	DECLARE @domainCode nvarchar(20)

	SELECT @roleCode = roleId FROM sys_Roles WHERE RecID = @roleId
	SELECT @domainCode = DDCode FROM SYS_DataDomains WHERE DDID =@domainId
	INSERT INTO SYS_DataDomain_Roles (RoleID, DDCode, CreatedBy, CreatedOn)
	VALUES (@roleCode, @domainCode, @createdBy, GETDATE())

	DECLARE @newId int = @@Identity
	SELECT DR.ID as Id,
	DD.DDID as DataDomainId,
	DD.DDCode as DataDomainCode,
	R.RecID AS RoleId,
	R.RoleID as RoleCode,
	R.RoleName ,
	R.RoleSubName,
	R.Lock
	FROM SYS_DataDomains DD 
	JOIN SYS_DataDomain_Roles DR ON DD.DDCode = DR.DDCode
	JOIN sys_Roles R ON DR.RoleID = R.RoleID
	WHERE DR.ID = @newId
END






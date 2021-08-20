GO
ALTER TABLE Departments
ADD Active bit 
ALTER TABLE Departments
ADD CONSTRAINT df_department_active
DEFAULT 1 FOR Active

ALTER TABLE sys_DataDomainDetails
DROP COLUMN DepartmentCode
ALTER TABLE sys_DataDomainDetails
ADD DepartmentId int 

ALTER TABLE sys_DataDomainDetails
DROP COLUMN DDCode
ALTER TABLE sys_DataDomainDetails
ADD DDID int 

ALTER TABLE sys_DataDomainDetails
ALTER COLUMN [Owner] nvarchar(20) NULL

GO
CREATE PROC spSysDomain_GetDomainDepartments @domainId int
AS
BEGIN
	SELECT DDT.DepartmentId 
	FROM SYS_DataDomainDetails DDT 
	JOIN SYS_DataDomains DD ON DDT.DDID = DD.DDID
	JOIN Departments D ON DDT.DepartmentId = D.ID
	WHERE DD.DDID = @domainId
END

GO
CREATE PROC spSysDomain_RemoveAllDomainDepartments @domainId int
AS
BEGIN
	DELETE FROM SYS_DataDomainDetails WHERE DDID =@domainId
END

GO
CREATE PROC spSysDomain_UpdateDomainDepartments @domainId int , @departmentId int
AS
BEGIN
	INSERT INTO SYS_DataDomainDetails (DDID, DepartmentId, CreatedBy, CreatedOn)
	VALUES(@domainId, @departmentId, 'admin', GETDATE())
END

GO
ALTER PROC spEmployee_GetManagers
AS
BEGIN
select E.ID as Id,
	   E.EmployeeCode as Code, 
	   E.FirstName ,
	   E.LastName,
	   (E.LastName+ ' '+ E.FirstName) as FullName,
	   E.Email,
	   E.DepartmentCode,
	   PHOTO.[Content] as [Image]
from Employees E
LEFT JOIN EmployeePhoto PHOTO ON E.PhotoID =PHOTO.Id
WHERE E.IsActive =1 AND E.IsManager =1
END

GO
ALTER PROC spDepartment_Create 
@departmentCode nvarchar(20), 
@departmentName nvarchar(200), 
@departmentName2 nvarchar(200),
@parentId int, 
@departmentTel varchar(200),
@departmentFax varchar(200),
@departmentEmail varchar(200),
@departmentAddress nvarchar(200),
@isCompany bit,
@active bit,
@taxCode nvarchar(50),
@logoImage nvarchar(max),
@managerId int, 
@ordinal int,
@note nvarchar(500),
@createdBy nvarchar(20)
AS
BEGIN
DECLARE @parentLevel int 
SELECT @parentLevel = [Level] FROM Departments WHERE ID = ISNULL(@parentId, -1) AND IsDeleted =0

INSERT INTO Departments (DepartmentCode, DepartmentName, DepartmentName2, ParentID, [Level], DepartmentTel, DepartmentAddress, DepartmentEmail, DepartmentFax, TaxCode, IsCompany,
Active, LogoImage, ManagerId, Ordinal, Note, CreatedBy, CreatedOn)
VALUES (@departmentCode, @departmentName, @departmentName2, @parentId, @parentLevel +1, @departmentTel, @departmentAddress, @departmentEmail, @departmentFax, @taxCode, @isCompany,
@active, @logoImage, @managerId, @ordinal, @note, @createdBy, GETDATE())
	
END

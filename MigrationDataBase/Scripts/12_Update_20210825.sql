CREATE PROC spEmployee_GetByDepts 
@departmentIds TVP_DepartmentIds READONLY,
@freeText nvarchar(300)
AS
BEGIN

SELECT 
		E.Id as Id, 
		E.EmployeeCode as Code, 
		E.LastName,
		E.FirstName,
		E.DepartmentId,
		D.DepartmentName,
		E.JobPosId as JobPositionId,
		JobPos.Name as JobPositionName,
		E.Birthday as DoB,
		E.JoinDate,
		E.Gender as IsMale,
		E.IsActive,
		E.PhoneNumber,
		E.Fax,
		E.Email,
		E.TaxID,
		E.IDCardNo, E.IDCardNoDate, E.IDCardNoPlace,
		E.Passport, E.PassportDate, E.PassportPlace,
		E.Note, 
		Photo.Content as Photo,
		E.MaritalId as MaritalId,
		Marial.Name as MaritalName,
		E.IsManager 
	FROM Employees E
	LEFT JOIN Departments D ON D.ID = E.DepartmentId
	LEFT JOIN SYS_FunctionKeyValue JobPos ON E.JobPosId = JobPos.Id AND FunctionId ='LSEM142'
	LEFT JOIN SYS_FunctionKeyValue Marial ON E.MaritalCode = Marial.Id AND Marial.FunctionId ='LSEM121'
	LEFT JOIN EmployeePhoto Photo ON Photo.Id = E.PhotoId
	WHERE E.IsDeleted = 0 AND E.DepartmentId IN (@departmentIds)
	AND (E.FirstName like N'%'+ISNULL(@freeText, '')+'%' OR E.LastName like N'%'+ISNULL(@freeText, '')+'%' Or E.Email like N'%'+ISNULL(@freeText, '')+'%'   )

END

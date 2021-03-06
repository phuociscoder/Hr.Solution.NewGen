USE [EmployeeManagement]
GO
/****** Object:  StoredProcedure [dbo].[spEmployee_CreateGeneralInfo]    Script Date: 9/16/2021 10:46:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[spEmployee_CreateGeneralInfo]
	 @code VARCHAR(20)
	,@lastName NVARCHAR(100)
	,@firstName NVARCHAR(50)
	,@isMale BIT
	,@doB DATETIME
	,@tAddress NVARCHAR(150)
	,@pAddress NVARCHAR(150)
	,@educationId INT
	,@educationNote NVARCHAR(200)
	,@departmentId INT
	,@jobPosId INT
	,@isManager BIT
	,@nationId INT
	,@religionId INT
	,@marialStatusId INT
	,@phoneNumber NVARCHAR(25)
	,@faxNumber NVARCHAR(25)
	,@email	NVARCHAR(50)
	,@isActive BIT
	,@idCardNo NVARCHAR(50)
	,@idCardNoDate DATETIME
	,@idCardNoPlace NVARCHAR(500)
	,@passPortNo NVARCHAR(20)
	,@passPortNoDate DATETIME
	,@passPortNoPlace NVARCHAR(250)
	,@taxNo NVARCHAR(50)
	,@taxNoDate DATETIME
	,@taxNoPlace NVARCHAR(250)
	,@note NVARCHAR(500)
	,@photo VARCHAR(MAX)
	,@createdBy NVARCHAR(100) 

AS
BEGIN
	declare @photoId uniqueidentifier
	SET @photoId = NEWID()

	INSERT INTO EmployeePhoto
		(Id, Content)
	VALUES(@photoId, @photo)

	INSERT INTO	Employees
		(
			EmployeeCode,
			LastName,
			FirstName,
			Gender,
			Birthday,
			TAddress,
			PAddress,
			EducationId,
			EducationNote,
			DepartmentId,
			JobPosId,
			IsManager,
			NationId,
			ReligionId,
			MaritalId,
			PhoneNumber,
			Fax,
			Email,
			IsActive,
			IDCardNo,
			IDCardNoDate,
			IDCardNoPlace,
			Passport,
			PassportDate,
			PassportPlace,
			CodeTax,
			CodeTaxDate,
			CodeTaxPlace,
			Note,
			PhotoId,
			CreatedBy,
			CreatedOn
		)
	VALUES 
		(
			@code,
			@lastName,
			@firstName,
			@isMale,
			@doB,
			@tAddress,
			@pAddress,
			@educationId,
			@educationNote,
			@departmentId,
			@jobPosId,
			@isManager,
			@nationId,
			@religionId,
			@marialStatusId,
			@phoneNumber,
			@faxNumber,
			@email,
			@isActive,
			@idCardNo,
			@idCardNoDate,
			@idCardNoPlace,
			@passPortNo,
			@passPortNoDate,
			@passPortNoPlace,
			@taxNo,
			@taxNoDate,
			@taxNoPlace,
			@note,
			@photoId,
			@createdBy,
			GETDATE()
		)

	SELECT ID
	FROM Employees
	WHERE ID = @@IDENTITY
END

go

ALTER PROC	[dbo].[spEmployees_CheckExisting]
	@employeeCode NVARCHAR(20)
AS
BEGIN
	SELECT employeeCode
	FROM Employees
	WHERE employeeCode = @employeeCode AND IsDeleted = 0 
END

go

alter PROC spEmployee_GetById
	@id BIGINT
AS
BEGIN
	SELECT
		E.ID,
		EmployeeCode AS [Code],
			LastName,
			FirstName,
			Gender AS [IsMale],
			Birthday AS [DoB],
			TAddress,
			PAddress,
			EducationId,
			EducationNote,
			DepartmentId,
			JobPosId,
			IsManager,
			NationId,
			ReligionId,
			MaritalId AS [MarialStatusId],
			PhoneNumber,
			Fax AS [FaxNumber],
			Email,
			IsActive,
			IDCardNo,
			IDCardNoDate,
			IDCardNoPlace,
			Passport AS [PassPortNo],
			PassportDate AS [PassPortNoDate],
			PassportPlace AS [PassPortNoPlace],
			CodeTax AS [TaxNo],
			CodeTaxDate AS [TaxNoDate],
			CodeTaxPlace AS [TaxNoPlace],
			Note,
			EP.Content AS [Photo],
			CreatedBy,
			CreatedOn,
			ModifiedBy,
			ModifiedOn
		FROM Employees AS E
		INNER  JOIN EmployeePhoto EP
		ON E.PhotoId = EP.Id
		WHERE E.ID = @id AND IsDeleted = 0
END

Go

alter PROC spEmployee_Update
	@id BIGINT
	,@lastName NVARCHAR(100)
	,@firstName NVARCHAR(50)
	,@isMale BIT
	,@doB DATETIME
	,@tAddress NVARCHAR(150)
	,@pAddress NVARCHAR(150)
	,@educationId INT
	,@educationNote NVARCHAR(200)
	,@departmentId INT
	,@jobPosId INT
	,@isManager BIT
	,@nationId INT
	,@religionId INT
	,@marialStatusId INT
	,@phoneNumber NVARCHAR(25)
	,@faxNumber NVARCHAR(25)
	,@email	NVARCHAR(50)
	,@isActive BIT
	,@idCardNo NVARCHAR(50)
	,@idCardNoDate DATETIME
	,@idCardNoPlace NVARCHAR(500)
	,@passPortNo NVARCHAR(20)
	,@passPortNoDate DATETIME
	,@passPortNoPlace NVARCHAR(250)
	,@taxNo NVARCHAR(50)
	,@taxNoDate DATETIME
	,@taxNoPlace NVARCHAR(250)
	,@note NVARCHAR(500)
	,@photo VARCHAR(MAX)
	,@modifiedBy NVARCHAR(100)
AS
BEGIN

	DECLARE @photoId UNIQUEIDENTIFIER
	
	SELECT @photoId = PhotoId
	FROM Employees
	WHERE ID = @id

	UPDATE EmployeePhoto
	SET
		Content = @photo
	WHERE Id = @photoId

	UPDATE Employees
	SET 
		LastName = @lastName,
		FirstName = @firstName,
		Gender = @isMale,
		Birthday = @doB,
		TAddress = @tAddress,
		PAddress = @pAddress,
		EducationId = @educationId,
		EducationNote = @educationNote,
		DepartmentId = @departmentId,
		JobPosId = @jobPosId,
		IsManager = @isManager,
		NationId = @nationId,
		ReligionId = @religionId,
		MaritalId = @marialStatusId,
		PhoneNumber = @phoneNumber,
		Fax = @faxNumber,
		Email = @email,
		IsActive = @isActive,
		IDCardNo = @idCardNo,
		IDCardNoDate = @idCardNoDate,
		IDCardNoPlace = @idCardNoPlace,
		Passport = @passPortNo,
		PassportDate = @passPortNoDate,
		PassportPlace = @passPortNoPlace,
		CodeTax = @taxNo,
		CodeTaxDate = @taxNoDate,
		CodeTaxPlace = @taxNoPlace,
		Note = @note,
		ModifiedBy = @modifiedBy,
		ModifiedOn = GETDATE()
	WHERE ID = @id AND IsDeleted = 0

	SELECT
		E.ID,
		EmployeeCode AS [Code],
			LastName,
			FirstName,
			Gender AS [IsMale],
			Birthday AS [DoB],
			TAddress,
			PAddress,
			EducationId,
			EducationNote,
			DepartmentId,
			JobPosId,
			IsManager,
			NationId,
			ReligionId,
			MaritalId AS [marialStatusId],
			PhoneNumber,
			Fax AS [FaxNumber],
			Email,
			IsActive,
			IDCardNo,
			IDCardNoDate,
			IDCardNoPlace,
			Passport AS [PassPortNo],
			PassportDate AS [PassPortNoDate],
			PassportPlace AS [PassPortNoPlace],
			CodeTax AS [TaxNo],
			CodeTaxDate AS [TaxNoDate],
			CodeTaxPlace AS [TaxNoPlace],
			Note,
			EP.Content AS [Photo],
			CreatedBy,
			CreatedOn,
			ModifiedBy,
			ModifiedOn
		FROM Employees AS E
		INNER  JOIN EmployeePhoto EP
		ON E.PhotoId = EP.Id
		WHERE E.ID = @id AND IsDeleted = 0
END



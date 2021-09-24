use EmployeeManagement
go

ALTER PROC spLsAllGrade_GetList
	@freeText NVARCHAR(100)
AS
BEGIN
	SELECT 
		id,
		AlloGradeCode as [code],
		AlloGradeName as [name],
		AlloGradeName2 as [name2],
		Lock as [isActive],
		AlloType as [type],
		SalaryType as [parentId],
		Ordinal,
		Note,
		IsMonthAmount as [isAllowanceMonth],
		IsCumulative as [isAddSalary],
		IsSI as [isSocialInsurance],
		IsHI as [isHealthInsurance],
		IsUI as [isUnemploymentInsurance],
		CreatedBy,
		CreatedOn,
		ModifiedBy,
		ModifiedOn
	FROM dbo.LsAlloGrade
	WHERE IsDeleted = 0 AND (
		  AlloGradeCode LIKE '%'+ ISNULL(@freeText,'') +'%'
		  OR AlloGradeName LIKE '%'+ ISNULL(@freeText,'') +'%'
		  OR AlloGradeName2 LIKE '%'+ ISNULL(@freeText,'') +'%'
	)
END

GO

alter PROC spLsAllGrade_GetById
	@id INT
AS
BEGIN
	SELECT 
		id,
		AlloGradeCode as [code],
		AlloGradeName as [name],
		AlloGradeName2 as [name2],
		Lock as [isActive],
		AlloType as [type],
		SalaryType as [parentId],
		Ordinal,
		Note,
		IsMonthAmount as [isAllowanceMonth],
		IsCumulative as [isAddSalary],
		IsSI as [isSocialInsurance],
		IsHI as [isHealthInsurance],
		IsUI as [isUnemploymentInsurance],
		CreatedBy,
		CreatedOn,
		ModifiedBy,
		ModifiedOn
	FROM dbo.LsAlloGrade
	WHERE IsDeleted = 0 AND id = @id
END

GO
alter PROC spLsAllGrade_Insert
	@code VARCHAR(20),
	@name NVARCHAR(100),
	@name2 NVARCHAR(100),
	@isActive BIT,
	@type SMALLINT,
	@parentId SMALLINT,	
	@ordinal INT,
	@note NVARCHAR(200),
	@isAllowanceMonth BIT,
	@isAddSalary BIT,
	@isSocialInsurance BIT,
	@isHealthInsurance BIT,
	@isUnemploymentInsurance BIT,
	@createdBy NVARCHAR(100)
AS
BEGIN
	DECLARE @countExist INT
	SELECT @countExist = COUNT(*) 
	FROM dbo.LsAlloGrade
	WHERE AlloGradeCode = @code AND IsDeleted = 0

	IF @countExist > 0
		BEGIN
			SELECT 0 AS id
		END
	ELSE
		BEGIN
			INSERT INTO dbo.LsAlloGrade
				(
					AlloGradeCode,
					AlloGradeName,
					AlloGradeName2,
					Lock,
					AlloType,
					SalaryType,
					Ordinal,
					Note,
					IsMonthAmount,
					IsCumulative,
					IsSI,
					IsHI,
					IsUI,
					CreatedBy,
					CreatedOn
				)
			VALUES
				(
					@code,
					@name,
					@name2,
					@isActive,
					@type,
					@parentId,
					@ordinal,
					@note,
					@isAllowanceMonth,
					@isAddSalary,
					@isSocialInsurance,
					@isHealthInsurance,
					@isUnemploymentInsurance,
					@createdBy,
					GETDATE()
				)
			SELECT 
				id,
				AlloGradeCode as [code],
				AlloGradeName as [name],
				AlloGradeName2 as [name2],
				Lock as [isActive],
				AlloType as [type],
				SalaryType as [parentId],
				Ordinal,
				Note,
				IsMonthAmount as [isAllowanceMonth],
				IsCumulative as [isAddSalary],
				IsSI as [isSocialInsurance],
				IsHI as [isHealthInsurance],
				IsUI as [isUnemploymentInsurance],
				CreatedBy,
				CreatedOn
			FROM dbo.LsAlloGrade
			WHERE id = @@IDENTITY
		END
END

Go
ALTER PROC spLsAllGrade_Update
	@id INT,
	@name NVARCHAR(100),
	@name2 NVARCHAR(100),
	@isActive BIT,
	@type SMALLINT,
	@parentId SMALLINT,	
	@ordinal INT,
	@note NVARCHAR(200),
	@isAllowanceMonth BIT,
	@isAddSalary BIT,
	@isSocialInsurance BIT,
	@isHealthInsurance BIT,
	@isUnemploymentInsurance BIT,
	@modifiedBy NVARCHAR(100)
AS
BEGIN
	UPDATE dbo.LsAlloGrade
	SET AlloGradeName = @name,
		AlloGradeName2 = @name2,
		Lock = @isActive,
		AlloType = @type,
		SalaryType = @parentId,
		Ordinal = @ordinal,
		Note = @note,
		IsMonthAmount = @isAllowanceMonth,
		IsCumulative = @isAddSalary,
		IsSI = @isSocialInsurance,
		IsHI = @isHealthInsurance,
		IsUI = @isUnemploymentInsurance,
		ModifiedBy = @modifiedBy,
		ModifiedOn = GETDATE()
	WHERE id = @id And IsDeleted = 0
	
	SELECT 
		id,
		AlloGradeCode as [code],
		AlloGradeName as [name],
		AlloGradeName2 as [name2],
		Lock as [isActive],
		AlloType as [type],
		SalaryType as [parentId],
		Ordinal,
		Note,
		IsMonthAmount as [isAllowanceMonth],
		IsCumulative as [isAddSalary],
		IsSI as [isSocialInsurance],
		IsHI as [isHealthInsurance],
		IsUI as [isUnemploymentInsurance],
		ModifiedBy,
		ModifiedOn
	FROM dbo.LsAlloGrade
	WHERE id = @id
END

GO
alter PROC spLsAllGrade_Delete
	@id INT
AS
BEGIN
	UPDATE dbo.LsAlloGrade
		SET IsDeleted = 1
	WHERE id = @id and IsDeleted = 0
END


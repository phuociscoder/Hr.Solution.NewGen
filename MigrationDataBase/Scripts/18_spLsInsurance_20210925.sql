USE EmployeeManagement
GO

CREATE PROC spLsInsurance_GetByID
	@id INT
AS
BEGIN
	SELECT 
		Id,
		SICode,
		SIName,
		SIName2,
		Ordinal,
		InsType,
		Lock,
		Note,
		DepartmentCode,
		RateEmp,
		RateCo,
		IsDefault,
		BUCodes,
		MinSalary,
		MaxSalary,
		EffectDate,
		BasicSalary,
		BasicSalary1,
		BasicSalary2,
		BasicSalary3,
		BasicSalary4,
		CreatedOn,
		CreatedBy,
		ModifiedOn,
		ModifiedBy	
	FROM LsInsurance
	WHERE Id = @id AND IsDeleted = 0
END
GO

ALTER PROC spLsInsurance_Insert
	@SICode nvarchar(20),
	@SIName	nvarchar(100),
	@SIName2	nvarchar(100),
	@Ordinal	int,
	@InsType	int,
	@Lock	bit,
	@Note	nvarchar(100),
	@DepartmentCode	nvarchar(20),
	@RateEmp	float,
	@RateCo	float,
	@IsDefault	bit,
	@BUCodes	nvarchar(20),
	@MinSalary	money,
	@MaxSalary	money,
	@EffectDate	datetime,
	@BasicSalary float,
	@BasicSalary1 float,
	@BasicSalary2 float,
	@BasicSalary3 float,
	@BasicSalary4 float,
	@CreatedBy	nvarchar(20)	
AS
BEGIN
	DECLARE @countExist INT
	SELECT @countExist = COUNT(*)
	FROM LsInsurance
	WHERE SICode = @SICode AND IsDeleted = 0

	IF @countExist > 0
		BEGIN
			SELECT 0 AS Id
		END
	ELSE
	BEGIN
		INSERT INTO LsInsurance
		(
			SICode,
			SIName,
			SIName2,
			Ordinal,
			InsType,
			Lock,
			Note,
			DepartmentCode,
			RateEmp,
			RateCo,
			IsDefault,
			BUCodes,
			MinSalary,
			MaxSalary,
			EffectDate,
			BasicSalary,
			BasicSalary1,
			BasicSalary2,
			BasicSalary3,
			BasicSalary4,
			CreatedOn,
			CreatedBy	
		)
		VALUES
		(
			@SICode,
			@SIName,
			@SIName2,
			@Ordinal,
			@InsType,
			@Lock,
			@Note,
			@DepartmentCode,
			@RateEmp,
			@RateCo,
			@IsDefault,
			@BUCodes,
			@MinSalary,
			@MaxSalary,
			@EffectDate,
			@BasicSalary,
			@BasicSalary1,
			@BasicSalary2,
			@BasicSalary3,
			@BasicSalary4,
			GETDATE(),
			@CreatedBy	
		)
		SELECT 
		Id,
		SICode,
		SIName,
		SIName2,
		Ordinal,
		InsType,
		Lock,
		Note,
		DepartmentCode,
		RateEmp,
		RateCo,
		IsDefault,
		BUCodes,
		MinSalary,
		MaxSalary,
		EffectDate,
		BasicSalary,
		BasicSalary1,
		BasicSalary2,
		BasicSalary3,
		BasicSalary4,
		CreatedOn,
		CreatedBy	
		FROM LsInsurance 
		WHERE Id = @@IDENTITY
	END
END
GO

alter PROC	spLsInsurance_Update
	@id int,
	@SIName	nvarchar(100),
	@SIName2	nvarchar(100),
	@Ordinal	int,
	@InsType	int,
	@Lock	bit,
	@Note	nvarchar(100),
	@DepartmentCode	nvarchar(20),
	@RateEmp	float,
	@RateCo	float,
	@IsDefault	bit,
	@BUCodes	nvarchar(20),
	@MinSalary	money,
	@MaxSalary	money,
	@EffectDate	datetime,
	@BasicSalary float,
	@BasicSalary1 float,
	@BasicSalary2 float,
	@BasicSalary3 float,
	@BasicSalary4 float,
	@ModifiedBy	nvarchar(20)
AS
BEGIN
	UPDATE LsInsurance
	SET 
		SIName	= @SIName,
		SIName2	= @SIName2,
		Ordinal	= @Ordinal,
		InsType	= @InsType,
		Lock	= @Lock,
		Note	= @Note,
		DepartmentCode = @DepartmentCode,
		RateEmp		= @RateEmp,
		RateCo		= @RateCo,
		IsDefault	= @IsDefault,
		BUCodes		= @BUCodes,
		MinSalary	= @MinSalary,
		MaxSalary	= @MaxSalary,
		EffectDate	= @EffectDate,
		BasicSalary	= @BasicSalary,
		BasicSalary1= @BasicSalary1,
		BasicSalary2= @BasicSalary2,
		BasicSalary3= @BasicSalary3,
		BasicSalary4= @BasicSalary4,
		ModifiedOn	= GETDATE(),
		ModifiedBy	= @ModifiedBy
	WHERE Id = @id AND IsDeleted = 0

	SELECT 
		Id,
		SICode,
		SIName,
		SIName2,
		Ordinal,
		InsType,
		Lock,
		Note,
		DepartmentCode,
		RateEmp,
		RateCo,
		IsDefault,
		BUCodes,
		MinSalary,
		MaxSalary,
		EffectDate,
		BasicSalary,
		BasicSalary1,
		BasicSalary2,
		BasicSalary3,
		BasicSalary4,
		CreatedOn,
		CreatedBy	
	FROM LsInsurance 
	WHERE Id = @id AND IsDeleted = 0
END
GO

CREATE PROC spLsInsurance_Delete
	@id INT
AS
BEGIN
	UPDATE LsInsurance
	SET IsDeleted = 1
	WHERE Id = @id
END
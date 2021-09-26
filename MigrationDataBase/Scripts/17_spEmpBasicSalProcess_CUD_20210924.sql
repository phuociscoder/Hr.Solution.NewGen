USE EmployeeManagement
GO

CREATE TYPE	TVP_EmployeeBasicSalProcess AS TABLE	
(
	Id	int	NULL,
	DecideNo nvarchar(20) NULL,
	ValidFromDate datetime NULL,
	ValidToDate	datetime NULL,
	BasicSal bigint	NULL,
	SISal bigint NULL,
	AdjustTypeId int NULL,
	OTRate bigint NULL,
	FixSal bigint NULL,
	SignateDate	datetime NULL,
	SignatorId int NULL,
	IsActive bit NULL,
	Note nvarchar(max) NULL,
	CreatedBy nvarchar(100)	NULL,
	CreatedOn datetime NULL,
	ModifiedBy nvarchar(100) NULL,
	ModifiedOn datetime	NULL
);
GO

CREATE PROC spEmpBasicSalProcess_CUD
	@type VARCHAR(10),
	@empBasicSalProcess TVP_EmployeeBasicSalProcess READONLY
AS
BEGIN
	IF @type = 'ADD'
	BEGIN
		INSERT INTO EmpBasicSalProcess
			(
				DecideNo,
				ValidFromDate,
				ValidToDate,
				BasicSal,
				SISal,
				AdjustTypeId,
				OTRate,
				FixSal,
				SignateDate,
				SignatorId,
				IsActive,
				Note,
				CreatedBy,
				CreatedOn
			)
		SELECT
			DecideNo,
			ValidFromDate,
			ValidToDate,
			BasicSal,
			SISal,
			AdjustTypeId,
			OTRate,
			FixSal,
			SignateDate,
			SignatorId,
			IsActive,
			Note,
			CreatedBy,
			GETDATE()
		FROM @empBasicSalProcess
		RETURN
	END

	IF @type = 'EDIT'
	BEGIN
		UPDATE EBS
		SET
			EBS.Id = EB.Id	,
			EBS.DecideNo = EB.DecideNo,
			EBS.ValidFromDate =	EB.ValidFromDate,
			EBS.ValidToDate	= EB.ValidToDate,
			EBS.BasicSal =	EB.BasicSal,
			EBS.SISal = EB.SISal,
			EBS.AdjustTypeId = EB.AdjustTypeId,
			EBS.OTRate = EB.OTRate,
			EBS.FixSal = EB.FixSal,
			EBS.SignateDate	= EB.SignateDate,
			EBS.SignatorId = EB.SignatorId,
			EBS.IsActive = EB.IsActive,
			EBS.Note = EB.Note,
			EBS.ModifiedBy = EB.ModifiedBy,
			EBS.ModifiedOn	= GETDATE()	
		FROM EmpBasicSalProcess AS EBS
		INNER JOIN @empBasicSalProcess AS EB
		ON EBS.Id = EB.Id
		RETURN
	END

	IF @type = 'DELETE'
	BEGIN
		DELETE FROM EmpBasicSalProcess
		WHERE Id IN (SELECT Id FROM @empBasicSalProcess)
	END
END
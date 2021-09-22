use EmployeeManagement
Go

CREATE TYPE	TVP_EmployeeDependants AS TABLE	
(
	id BIGINT NULL,
	EmployeeId INT NULL,
	DependantCode VARCHAR(20),
	RelationTypeId INT NULL,
	Phone NCHAR(15) NULL,
	FullName NVARCHAR(MAX) NULL,
	[Address] NVARCHAR(MAX) NULL,
	DayOfBirth DATETIME NULL,
	IsTax BIT NULL,
	Note NVARCHAR(MAX) NULL,
	CreatedOn DATETIME NULL,
	ModifiedOn DATETIME NULL,
	CreatedBy NVARCHAR(20) NULL,
	ModifiedBy NVARCHAR(20) NULL,
	IsDeleted BIT NULL,
	DeletedDate DATETIME NULL,
	DeletedBy INT NULL,
	FromMonth VARCHAR(7) NULL,
	ToMonth VARCHAR(7) NULL,
	IsSub BIT NULL
);
GO

CREATE PROC spEmployeeDependants_CUD 
	@type VARCHAR(10),
	@employeeDependants TVP_EmployeeDependants READONLY
AS
BEGIN
	IF @type = 'ADD'
	BEGIN
		INSERT INTO employeeDependants
			(
				[Address],
				[DependantCode],
				DayOfBirth,
				id,
				IsTax,
				FullName,
				Note,
				Phone,
				RelationTypeId,
				CreatedBy,
				CreatedOn
			)
		SELECT 
			[Address],
			DependantCode,
			DayOfBirth,
			id,
			IsTax,
			FullName,
			Note,
			Phone,
			RelationTypeId,
			CreatedBy,
			GETDATE()
		FROM @employeeDependants
		RETURN
	END

	IF @type = 'EDIT'
	BEGIN
		UPDATE ED
		SET	
			ED.Address = EDT.Address,
			ED.DependantCode = EDT.DependantCode,
			ED.DayOfBirth = EDT.DayOfBirth,
			ED.IsTax = EDT.IsTax,
			ED.FullName = EDT.FullName,
			ED.Note = EDT.Note,
			ED.Phone = EDT.Phone,
			ED.RelationTypeId = EDT.RelationTypeId,
			ED.ModifiedBy = EDT.ModifiedBy,
			ED.ModifiedOn = GETDATE()
		FROM EmployeeDependants AS ED
		INNER JOIN @employeeDependants AS EDT
		ON ED.id = EDT.id
		RETURN
	END

	IF @type = 'DELETE'
	BEGIN
		DELETE FROM EmployeeDependants
		WHERE id IN (
						SELECT id
						FROM @employeeDependants
					);
	END
END


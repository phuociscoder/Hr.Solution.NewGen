SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Trần Tú Văn
-- Create date: Sept 20, 2021
-- Description:	Insert into thông tin CB tính công với param ID (BigInt)
-- =============================================
use EmployeeManagement
GO

alter PROCEDURE spEmployeesBasicSalary_Update
	@id	BIGINT,
	@JoinDate DATETIME,
	@DateFormal DATETIME,
	@EmployeeType INT,
	@LaborType INT,
	@BarCode NVARCHAR(250),
	@ShiftCode NVARCHAR(30),
	@AltShift BIT,
	@IsNotLateEarly BIT,
	@IsNotScan BIT,
	@IsNotOTKow BIT,
	@LeaveGroupId INT,
	@RegionId INT,
	@ModifiedBy NVARCHAR(100)
AS
BEGIN
	UPDATE Employees
	SET
		JoinDate = @JoinDate,
		DateFormal = @DateFormal,
		EmployeeType = @EmployeeType,
		LabourType = @LaborType,
		BarCode = @BarCode,
		ShiftCode = @ShiftCode,
		Alt_Shift = @AltShift,
		IsNotLateEarly = @IsNotLateEarly,
		IsNotScan = @IsNotScan,
		IsNotOTKow = @IsNotOTKow,
		LeaveGroupId = @LeaveGroupId,
		RegionId = @RegionId,
		ModifiedBy = @ModifiedBy,
		ModifiedOn = GETDATE()
	WHERE ID = @id AND IsDeleted = 0

	SELECT
		ID,
		JoinDate,
		DateFormal,
		EmployeeType,
		LabourType as [LaborType],
		BarCode,
		ShiftCode,
		Alt_Shift as [AltShift],
		IsNotLateEarly,
		IsNotScan,
		IsNotOTKow,
		LeaveGroupId,
		RegionId,
		ModifiedBy,
		ModifiedOn
	FROM Employees
	WHERE ID = @id AND IsDeleted = 0
END

GO

alter PROC spEmployeeBasicSalary_GetByID
	@id BIGINT
AS
BEGIN
	SELECT
		ID,
		JoinDate,
		DateFormal,
		EmployeeType,
		LabourType as [LaborType],
		BarCode,
		ShiftCode,
		Alt_Shift as [AltShift],
		IsNotLateEarly,
		IsNotScan,
		IsNotOTKow,
		LeaveGroupId,
		RegionId,
		CreatedBy,
		CreatedOn,
		ModifiedBy,
		ModifiedOn
	FROM Employees
	WHERE ID = @id AND IsDeleted = 0
END


select *
from Employees
where ID = 527

exec spEmployeeBasicSalary_GetByID 546
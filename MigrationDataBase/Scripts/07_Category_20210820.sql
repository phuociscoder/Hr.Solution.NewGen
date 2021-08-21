GO
CREATE PROC sysCategory_GetCategory 
AS
BEGIN
	SELECT 
		FunctionID as Id,
		FunctionType as [Type],
		DefaultName as [Name],
		ParentID as ParentId,
		Module,
		[Level],
		Sorting
	from SYS_FunctionList 
	WHERE ParentID = 'LS000' And IsActive =1
END
GO

CREATE PROC spCategory_GetById @id nvarchar(20)
AS
BEGIN
		SELECT 
		FunctionID as Id,
		FunctionType as [Type],
		DefaultName as [Name],
		ParentID as ParentId,
		Module,
		[Level],
		Sorting
	FROM SYS_FunctionList 
	WHERE FunctionID =@id
END
GO

ALTER TABLE SysValueList
ALTER COLUMN ID INT NOT NULL

GO

CREATE PROC spCategory_GetItems @id nvarchar(20)
AS
BEGIN
	SELECT * 
	FROM SYS_FunctionKeyValue WHERE FunctionId =@id AND IsDeleted =0
END

GO

ALTER PROC spCategory_AddItem 
@code nvarchar(20),
@name nvarchar(200),
@name2 nvarchar(200),
@functionId nvarchar(20),
@ordinal int,
@isActive bit,
@note nvarchar(max),
@createdBy nvarchar(20)
AS
BEGIN
	INSERT INTO SYS_FunctionKeyValue(Code, [Name], [Name2], Ordinal, Note, FunctionId, CreatedBy, CreatedOn, IsActive )
	VALUES(@code, @name, @name2, @ordinal, @note, @functionId, @createdBy, GETDATE(), @isActive)

	DECLARE @newId int = @@Identity
	SELECT * FROM SYS_FunctionKeyValue WHERE Id =@newId
END

GO

alter PROC spCategory_UpdateItem
@id int,
@code nvarchar(20),
@name nvarchar(200),
@name2 nvarchar(200),
@functionId nvarchar(20),
@ordinal int,
@note nvarchar(max),
@modifiedBy nvarchar(20),
@isActive bit
AS
BEGIN
	UPDATE SYS_FunctionKeyValue
	SET Code = @code,
	[Name] = @name,
	Name2 = @name2,
	FunctionId = @functionId,
	Ordinal = @ordinal,
	Note =@note,
	ModifiedOn = GETDATE(),
	IsActive =@isActive,
	ModifiedBy = @modifiedBy
	WHERE Id=@id

	SELECT * FROM SYS_FunctionKeyValue WHERE Id=@id
END

GO

CREATE PROC spCategory_DeleteItem @id int, @deletedBy nvarchar(20)
AS
BEGIN
	UPDATE SYS_FunctionKeyValue 
	SET IsDeleted = 1,
	DeletedOn =Getdate(),
	DeletedBy = @deletedBy
	WHERE Id = @id
END


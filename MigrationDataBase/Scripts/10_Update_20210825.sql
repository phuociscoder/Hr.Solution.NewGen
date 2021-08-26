GO
ALTER PROC spGelAllSystemRolesByName @name nvarchar(100)  
AS  
BEGIN  
 SELECT * , 
 (SELECT COUNT(*) FROM sys_UserRoles UR
 JOIN AspNetUsers U ON UR.UserID = U.Id 
 WHERE RoleID = R.RecID AND U.isDeleted = 0) as UserCount
 FROM sys_Roles R WHERE RoleName like N'%'+ISNULL(@name, '')+'%' OR  RoleSubName like N'%'+ISNULL(@name, '')+'%' OR  RoleID like N'%'+ISNULL(@name, '')+'%'  
END
GO
CREATE PROC spDepartment_getById @id int
AS
BEGIN
	SELECT * FROM Departments Where ID = @id
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
  DECLARE @existingOrdinal int =0
 SELECT @existingOrdinal = COUNT(*) FROM SYS_FunctionKeyValue WHERE FunctionId =@functionId AND Ordinal =@ordinal AND IsDeleted =0

 IF @existingOrdinal >1
 BEGIN
 UPDATE SYS_FunctionKeyValue 
 SET Ordinal =Ordinal +1
 WHERE Ordinal >= @ordinal AND Id<>@newId AND FunctionId = @functionId
 END

 SELECT * FROM SYS_FunctionKeyValue WHERE Id =@newId  
END

GO
ALTER PROC spCategory_UpdateItem  
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

 DECLARE @existingOrdinal int =0
 SELECT @existingOrdinal = COUNT(*) FROM SYS_FunctionKeyValue WHERE FunctionId =@functionId AND Ordinal =@ordinal AND IsDeleted =0

 IF @existingOrdinal >1
 BEGIN
  UPDATE SYS_FunctionKeyValue 
 SET Ordinal =Ordinal +1
 WHERE Ordinal >= @ordinal AND Id<>@id AND FunctionId = @functionId
 END
  
 SELECT * FROM SYS_FunctionKeyValue WHERE Id=@id  
END

GO
ALTER PROC spCategory_DeleteItem @id int, @deletedBy nvarchar(20)  
AS  
BEGIN  
 UPDATE SYS_FunctionKeyValue   
 SET IsDeleted = 1,  
 DeletedOn =Getdate(),  
 DeletedBy = @deletedBy  
 WHERE Id = @id  

 DECLARE @ordinal INT
 DECLARE @functionId NVARCHAR(20)
 SELECT @ordinal = Ordinal, @functionId =FunctionId FROM SYS_FunctionKeyValue WHERE Id =@id
 UPDATE SYS_FunctionKeyValue
 SET Ordinal = Ordinal -1
 WHERE FunctionId = @functionId AND Ordinal > @ordinal
END

GO
SP_HELPTEXT 'spDepartment_GetbyFreetext'
SELECT * FROM Departments
GO
ALTER PROC spUser_GetByName @freeText nvarchar(100)
AS
BEGIN
	SELECT Id,
			UserName,
			Email,
			Code,
			FullName,
			IsActive,
			IsLock,
			LockAfter,
			IsNeverLock,
			IsDomain,
			ValidDate
	FROM AspNetUsers 
	WHERE 
	(UserName LIKE N'%'+ISNULL(@freeText, '')+'%' 
	OR FullName LIKE N'%'+ISNULL(@freeText, '')+'%' 
	OR Email LIKE N'%'+ISNULL(@freeText, '')+'%' 
	OR Code LIKE N'%'+ISNULL(@freeText, '')+'%') AND IsDeleted =0
END

GO
ALTER PROC spUser_GetList @freeText nvarchar(100)  
AS  
BEGIN  
 SELECT Id,  
   UserName,  
   Email,  
   Code,  
   FullName,  
   IsActive,  
   IsLock,
   Avatar,
   LockAfter,  
   IsNeverLock,  
   IsDomain,
   IsAdmin,
   ValidDate,
   dbo.fn_GetUserRoleNames(u.Id) AS SystemRoles,
   dbo.fn_GetUserDataDomain(u.id) AS DataDomains
 FROM AspNetUsers U
 WHERE U.IsDeleted = 0 AND 
 (UserName LIKE N'%'+ISNULL(@freeText, '')+'%'   
 OR FullName LIKE N'%'+ISNULL(@freeText, '')+'%'   
 OR Email LIKE N'%'+ISNULL(@freeText, '')+'%'   
 OR Code LIKE N'%'+ISNULL(@freeText, '')+'%')  
END
GO
ALTER FUNCTION fn_GetUserRoleNames 
(@userId nvarchar(50))
RETURNS nvarchar(max)
AS
BEGIN
Declare @result nvarchar(max)
SELECT @result = STUFF((SELECT ', ' + userRoles.RoleName
            FROM (
			SELECT DISTINCT R.RoleName,
			(SELECT Count(*) FROM SYS_Permissions WHERE RoleID = r.RecID) as PermissionCount
			FROM sys_UserRoles ur 
			JOIN sys_Roles r on r.RecID = ur.RoleID 
			WHERE ur.UserID = @userId
			) userRoles
			ORDER BY userRoles.PermissionCount DESC
            FOR XML PATH('')) ,1,1,'')

RETURN @result
END

GO
ALTER FUNCTION fn_GetUserDataDomain (@userId nvarchar(50))
RETURNS nvarchar(max)
AS
BEGIN
	DECLARE @result nvarchar(max)

	SELECT @result = STUFF((SELECT ', ' + userDomain.DDName
            FROM (
			SELECT DISTINCT DD.DDName, (SELECT COUNT(*) FROM SYS_DataDomainDetails DDD WHERE DDD.DDID = DD.DDID ) as DepartmentCount
			FROM SYS_DataDomains DD
			JOIN SYS_DataDomain_Roles DR ON DD.DDCode = DR.DDCode
			JOIN sys_Roles R ON DR.RoleID = R.RoleID
			JOIN sys_UserRoles UR ON R.RecID = UR.RoleID
			WHERE UR.UserID =@userId
			) userDomain
			ORDER BY userDomain.DepartmentCount DESC
            FOR XML PATH('')) ,1,1,'')
	return @result
END
GO
CREATE PROC spUser_Delete @userId nvarchar(450)
AS
BEGIN
	UPDATE AspNetUsers
	SET IsDeleted = 1
	WHERE Id =@userId
END

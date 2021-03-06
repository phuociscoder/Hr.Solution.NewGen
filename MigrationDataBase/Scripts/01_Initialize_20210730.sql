USE [EmployeeManagement]
GO
/****** Object:  UserDefinedFunction [dbo].[fnGet_HolidayDetails]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[fnGet_HolidayDetails]
(	
	@BeginDate datetime,
	@EndDate datetime,
	@IsSubHoliday bit, -- tính ngày nghỉ lễ
	@IsSubWeek bit, --tính ngày nghỉ tuần (nghỉ khác,thứ 7, cn).
	@IsSubSunDay bit, --Tru ngay chu nhat
	@EmployeeCode NVARCHAR(20)
)
RETURNS @RtnValue TABLE 
(
    Date_Off DATETIME,
	LeavePeriod SMALLINT
) 
AS
BEGIN
		DECLARE @i DateTime, @WLeaveDayValue int
		DECLARE @RegisterDayOff TABLE (DayOff DATETIME, LeavePeriod SMALLINT)
		DECLARE @view_atd_kind_of_Vacation TABLE (Date_ID datetime)
		set @WLeaveDayValue = 0
		set @i = @BeginDate
		-- tạo bảng tam chứa DayOff
		insert into @RegisterDayOff(DayOff,LeavePeriod)
		SELECT WorkDate DayOff,LeavePeriod from dbo.EmployeeWeekOffs S with (nolock) where S.EmployeeCode = @EmployeeCode and WorkDate between @BeginDate and @EndDate
		-- tạo bảng tạm chứa ngày nghỉ
		insert into @view_atd_kind_of_Vacation(Date_ID)
		SELECT V.VacationDay as DateID FROM dbo.LsVacationDays V with (nolock) 

		IF @IsSubWeek = 1 -- nghỉ tuần theo quy định cty
		BEGIN
			SELECT @WLeaveDayValue = G.LeaveType FROM dbo.Employees E 
			INNER JOIN dbo.lsLeaveGroups G ON G.LeaveGroupCode = E.LeaveGroupCode
			WHERE E.EmployeeCode = @EmployeeCode
		END

		WHILE(@i<=@EndDate)
		BEGIN
			-- Nghi le
			IF @IsSubHoliday=1
			BEGIN
				if exists (SELECT TOP(1) 1 FROM @view_atd_kind_of_Vacation where Date_ID = @i)
				BEGIN
					INSERT INTO @RtnValue(Date_Off, LeavePeriod)
					SELECT Date_ID, 1 FROM @view_atd_kind_of_Vacation where Date_ID = @i
					GoTo NEXT_DATE
				end
			end
		
			if @IsSubSunDay  = 1  --tính nghỉ CN
			begin
				If (datepart(Dw,@i) = 1)
				BEGIN
					INSERT INTO @RtnValue(Date_Off, LeavePeriod) VALUES (@i, 1)
					GOTO NEXT_DATE
				END
			end

			if @IsSubWeek=0  GoTo NEXT_DATE
		
			-- Nghỉ theo quy định				
			if exists (SELECT TOP(1) 1 FROM @RegisterDayOff WHERE DayOff = @i)
			begin
				INSERT INTO @RtnValue(Date_Off, LeavePeriod)
				SELECT TOP(1) DayOff,	CASE WHEN LeavePeriod = 1 
											OR (LeavePeriod = 2 AND @WLeaveDayValue IN (3,5) AND datepart(Dw,@i) = 7)
											OR (@WLeaveDayValue IN (1,2,3) AND datepart(Dw,@i) = 1)
											OR (@WLeaveDayValue = 1 AND datepart(Dw,@i) = 7) THEN 1
										WHEN @WLeaveDayValue IN (3,5) AND datepart(Dw,@i) = 7 THEN 3
										ELSE LeavePeriod end
				FROM @RegisterDayOff 
				WHERE DayOff = @i
				GoTo NEXT_DATE
			END
            
			If ((@WLeaveDayValue=1) And ((datepart(Dw,@i) = 7) Or (datepart(Dw,@i) = 1)))	
			begin
				INSERT INTO @RtnValue(Date_Off, LeavePeriod) VALUES (@i, 1)
				GoTo NEXT_DATE
			end
			If (((@WLeaveDayValue=2) Or (@WLeaveDayValue=3)) And (datepart(Dw,@i) = 1)) -- nghỉ CN hoặc T7
			begin
				INSERT INTO @RtnValue(Date_Off, LeavePeriod) VALUES (@i, 1)
				GoTo NEXT_DATE
			end
			If ((@WLeaveDayValue IN (3,5)) And (datepart(Dw,@i) = 7)) --Neu quy dinh nghi nua ngay thu bay va ngay chu nhat thi khi nghi ngay thu 7 nhan vien bi tru nua cong
			BEGIN
				--nghi buoi chieu T7
				INSERT INTO @RtnValue(Date_Off, LeavePeriod) VALUES (@i, 3)
				GoTo NEXT_DATE
			end	
			
			NEXT_DATE:
			set @i = DATEADD(day, 1, @i)
		END
	RETURN	
END

GO
/****** Object:  UserDefinedFunction [dbo].[fnGetValueList]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	select * from fnGetValueList('','')
*/
CREATE function [dbo].[fnGetValueList]
(
	@Language nvarchar(10),
	@ListName nvarchar(60)
	
)
RETURNS 
@ret TABLE 
(
	ID int,
	Value nvarchar(20),
	Caption nvarchar(250)
)
AS
BEGIN
	Declare @retData nvarchar(max)
	select @retData= CASE WHEN CustomValues IS NOT NULL AND CustomValues <> '' THEN CustomValues ELSE DefaultValues END
	from dbo.SysValueList
	where [Language]=@Language and ListName=@ListName
	insert into @ret
	select * from fnValueListSplit( @retData,';') 
	RETURN 
END
GO
/****** Object:  UserDefinedFunction [dbo].[fnSelectFromTODate]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[fnSelectFromTODate] 
(     
      @FromDate datetime,
      @ToDate datetime
)
RETURNS @RtnValue TABLE 
(
    mDate datetime
) 
AS
BEGIN 
      
      DECLARE @i datetime set @i = @FromDate
      
      While ( @i <= @ToDate)
      BEGIN
            INSERT INTO @RtnValue(mDate) Values(@i)   
            SET @i = dateadd(d,1,@i)
      END
    RETURN
END
GO
/****** Object:  UserDefinedFunction [dbo].[SYS_ClearStress]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- User Defined Function

CREATE FUNCTION [dbo].[SYS_ClearStress]
(
	@Text nvarchar(MAX)
)
RETURNS nvarchar(MAX)
AS
BEGIN
	declare @ret nvarchar(MAX), @i int, @chr nvarchar(1), @len int

	set @i=1
	set @ret=''
	set @Text=ltrim(rtrim(Lower(@text)))
	set @len = len(@Text)

	while @i<=@len
	begin
		set @chr=cast(SUBSTRING (@Text,@i,1) as nvarchar(1))

		if(Unicode(@chr)=769) set @chr= N'' /*ký tự á (kí tự này là 2 ký tự a và dấu sắc)*/
		else if(Unicode(@chr)=768) set @chr= N'' /*ký tự ầ (kí tự này là 2 ký tự â và dấu huyền)*/
		else if(Unicode(@chr)=777) set @chr= N'' /* dấu hỏi*/
		else if(Unicode(@chr)=771) set @chr= N'' /* dấu ngã*/
		else if(Unicode(@chr)=803) set @chr= N''	/*ký tự ậ (kí tự này là 2 ký tự â và dấu nặng)*/					
		else if(Unicode(@chr)=240) set @chr= N'd' /* đ */									

		else if @chr= N'đ'set @chr= N'd'
        else if @chr= N'á'set @chr= N'a'
        else if @chr= N'à'set @chr= N'a'
        else if @chr= N'ả'set @chr= N'a' --7843
        else if @chr= N'ã'set @chr= N'a'
        else if @chr= N'ạ'set @chr= N'a' -- 7841

        else if @chr= N'ă'set @chr= N'a'
        else if @chr= N'ắ'set @chr= N'a' -- 7855
        else if @chr= N'ằ'set @chr= N'a' -- 7857
        else if @chr= N'ẳ'set @chr= N'a' -- 7859
        else if @chr= N'ẵ'set @chr= N'a' -- 7861
        else if @chr= N'ặ'set @chr= N'a' -- 7863

        else if @chr= N'â'set @chr= N'a'
        else if @chr= N'ấ'set @chr= N'a' -- 7845
        else if @chr= N'ầ'set @chr= N'a' --7847
        else if(@chr= N'ầ')set @chr= N'a'
        else if @chr= N'ẩ'set @chr= N'a' -- 7849
        else if @chr= N'ẫ'set @chr= N'a' -- 7851
        else if @chr= N'ậ'set @chr= N'a' -- 7853

        else if @chr= N'é'set @chr= N'e'
        else if @chr= N'è'set @chr= N'e'
        else if @chr= N'ẻ'set @chr= N'e' -- 7867
        else if @chr= N'ẽ'set @chr= N'e' -- 7869
        else if @chr= N'ẹ'set @chr= N'e' -- 7865

        else if @chr= N'ê'set @chr= N'e'
        else if @chr= N'ế'set @chr= N'e' -- 7871
        else if @chr= N'ề'set @chr= N'e' -- 7873
        else if @chr= N'ể'set @chr= N'e' -- 7875
        else if @chr= N'ễ'set @chr= N'e' -- 7877
        else if @chr= N'ệ'set @chr= N'e' -- 7879


        else if @chr= N'í'set @chr= N'i'
        else if @chr= N'ì'set @chr= N'i'
        else if @chr= N'ỉ'set @chr= N'i' -- 7881
        else if @chr= N'ĩ'set @chr= N'i'
        else if @chr= N'ị'set @chr= N'i' -- 7883

        else if @chr= N'ó'set @chr= N'o'
        else if @chr= N'ỏ'set @chr= N'o' -- 7887
        else if @chr= N'õ'set @chr= N'o'
        else if @chr= N'ọ'set @chr= N'o' -- 7885
        else if @chr= N'ò'set @chr= N'o'

        else if @chr= N'ô'set @chr= N'o'
        else if @chr= N'ố'set @chr= N'o' -- 7889
        else if @chr= N'ồ'set @chr= N'o' -- 7891
        else if @chr= N'ổ'set @chr= N'o' -- 7893
        else if @chr= N'ỗ'set @chr= N'o' -- 7895
        else if @chr= N'ộ'set @chr= N'o' -- 7897

        else if @chr= N'ơ'set @chr= N'o'
        else if @chr= N'ớ'set @chr= N'o' -- 7899
        else if @chr= N'ờ'set @chr= N'o' -- 7901
        else if @chr= N'ở'set @chr= N'o' -- 7903
        else if @chr= N'ỡ'set @chr= N'o' -- 7905
        else if @chr= N'ợ'set @chr= N'o' -- 7907

        else if @chr= N'ú'set @chr= N'u'
        else if @chr= N'ù'set @chr= N'u'
        else if @chr= N'ủ'set @chr= N'u' -- 7911
        else if @chr= N'ũ'set @chr= N'u'
        else if @chr= N'ụ'set @chr= N'u' -- 7909

        else if @chr= N'ư'set @chr= N'u'
        else if @chr= N'ứ'set @chr= N'u' -- 7913
        else if @chr= N'ừ'set @chr= N'u' -- 7915
        else if @chr= N'ử'set @chr= N'u' -- 7917
        else if @chr= N'ữ'set @chr= N'u' -- 7919
        else if @chr= N'ự'set @chr= N'u' -- 7921

        else if @chr= N'ý'set @chr= N'y'
        else if @chr= N'ỳ'set @chr= N'y' -- 7923
        else if @chr= N'ỷ'set @chr= N'y' -- 7927
        else if @chr= N'ỹ'set @chr= N'y' -- 7929
        else if @chr= N'ỵ'set @chr= N'y' -- 7925

		set @ret=@ret+cast(@chr as nvarchar(1))
		set @i=@i+1
	end

	RETURN @ret
END
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Departments]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Departments](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[DepartmentCode] [nvarchar](20) NOT NULL,
	[DepartmentName] [nvarchar](200) NOT NULL,
	[DepartmentName2] [nvarchar](200) NULL,
	[ParentID] [int] NULL,
	[ParentCode] [nvarchar](20) NULL,
	[Level] [int] NOT NULL,
	[LevelCode] [varchar](250) NULL,
	[LevelCode2] [varchar](250) NULL,
	[DepartmentTel] [varchar](200) NULL,
	[DepartmentFax] [varchar](200) NULL,
	[DepartmentEmail] [varchar](200) NULL,
	[DepartmentAddress] [nvarchar](200) NULL,
	[IsCompany] [int] NULL,
	[EffectDate] [datetime] NULL,
	[TaxCode] [nvarchar](50) NULL,
	[LockDate] [datetime] NULL,
	[LogoImage] [uniqueidentifier] NULL,
	[ManagerCode] [nvarchar](20) NULL,
	[Ordinal] [int] NULL,
	[Lock] [bit] NULL,
	[Note] [nvarchar](500) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[RegionCode] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpKowDays]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpKowDays](
	[Id] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[WorkDay] [datetime2](7) NOT NULL,
	[KowCode] [nvarchar](20) NOT NULL,
	[DayNum] [real] NOT NULL,
	[IsPay] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[Note] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_EmpKowDays] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpKowDays_Layer]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpKowDays_Layer](
	[Id] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[WorkDay] [datetime2](7) NOT NULL,
	[KowCode] [nvarchar](20) NOT NULL,
	[DayNum] [real] NOT NULL,
	[IsPay] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[Note] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[Layer] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpKowDays_test]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpKowDays_test](
	[Id] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[WorkDay] [datetime2](7) NOT NULL,
	[KowCode] [nvarchar](20) NOT NULL,
	[DayNum] [real] NOT NULL,
	[IsPay] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[Note] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpKowDsLastPayroll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpKowDsLastPayroll](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [nvarchar](20) NOT NULL,
	[WorkDate] [datetime] NOT NULL,
	[KowCode] [varchar](20) NOT NULL,
	[DayNum] [float] NOT NULL,
	[IsNoon] [bit] NOT NULL,
	[DowCode] [varchar](7) NOT NULL,
	[IsPay] [smallint] NULL,
	[Ordinal] [smallint] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[IsCheckedPay] [bit] NULL,
	[SystemNote] [nvarchar](max) NULL,
 CONSTRAINT [PK_EmpKowDsLastPayroll] PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpKowLateEarly]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpKowLateEarly](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [nvarchar](20) NOT NULL,
	[DowCode] [varchar](7) NOT NULL,
	[WorkDate] [datetime] NOT NULL,
	[TimeInEarly] [float] NULL,
	[TimeInLate] [float] NULL,
	[TimeOutEarly] [float] NULL,
	[TimeOutLate] [float] NULL,
	[TimeOutEarlyS] [float] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[In1] [float] NULL,
	[Out1] [float] NULL,
	[In2] [float] NULL,
	[Out2] [float] NULL,
	[TongSoMoc] [int] NULL,
	[NumMissing] [int] NULL,
	[ShiftCode] [varchar](20) NULL,
	[MaxTimes] [int] NULL,
	[MissTimes] [int] NULL,
	[SystemNote] [nvarchar](max) NULL,
	[gSGMC] [float] NULL,
	[Vacation] [int] NULL,
	[MinMaxAllowLateInMonth] [float] NULL,
 CONSTRAINT [PK_HCSPR_KowLateEarly] PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpKowLateEarly_sub]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpKowLateEarly_sub](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [nvarchar](20) NOT NULL,
	[WorkDate] [datetime] NOT NULL,
	[Late] [float] NULL,
	[Early] [float] NULL,
	[ShiftCode] [nvarchar](30) NULL,
	[RI] [datetime] NULL,
	[RO] [datetime] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
 CONSTRAINT [PK__HCSTS_KowLateEar__3BA83CFF] PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeAllowances]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeAllowances](
	[Id] [uniqueidentifier] NOT NULL,
	[DecisionNo] [varchar](100) NULL,
	[ValidDate] [datetime2](7) NULL,
	[ExpiredDate] [datetime2](7) NULL,
	[FreeTaxAmount] [bigint] NULL,
	[Signator] [nvarchar](30) NULL,
	[AllowanceTypeId] [uniqueidentifier] NULL,
	[AllowanceTypeLevelId] [uniqueidentifier] NULL,
	[CurrencyId] [uniqueidentifier] NULL,
	[Rate] [float] NULL,
	[Amount] [bigint] NULL,
	[Note] [nvarchar](max) NULL,
	[IsActived] [bit] NULL,
	[CreatedDate] [datetime2](7) NULL,
	[CreateBy] [nvarchar](30) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [nvarchar](30) NULL,
	[IsDeleted] [bit] NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [nvarchar](30) NULL,
 CONSTRAINT [PK_EmployeeAllowances] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeContracts]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeContracts](
	[Id] [uniqueidentifier] NOT NULL,
	[ContractNo] [varchar](100) NULL,
	[ConTypeCode] [varchar](20) NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[SalaryBase] [int] NOT NULL,
	[StartDate] [datetime2](7) NULL,
	[EndDate] [datetime2](7) NULL,
	[Note] [nvarchar](250) NULL,
	[ContractNumber] [nvarchar](150) NULL,
	[SocialSalary] [int] NOT NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_EmployeeContracts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeDayOffs]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeDayOffs](
	[Id] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[BegDate] [datetime2](7) NOT NULL,
	[EndDate] [datetime2](7) NOT NULL,
	[KowCode] [nvarchar](20) NOT NULL,
	[LeavePeriod] [int] NOT NULL,
	[DayNum] [real] NOT NULL,
	[Reasion] [nvarchar](max) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[IsSubHoliday] [bit] NULL,
	[IsSubWeek] [bit] NULL,
	[IsSubSunday] [bit] NULL,
	[DayNum_SubHoliday] [real] NULL,
	[DayNum_SubWeek] [real] NULL,
	[DayNum_SubSunDay] [real] NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[Note] [nvarchar](max) NULL,
 CONSTRAINT [PK_EmployeeDayOffs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeDayOffs_detailDay]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeDayOffs_detailDay](
	[RefID] [bigint] IDENTITY(1,1) NOT NULL,
	[RecordID] [uniqueidentifier] NULL,
	[EmployeeCode] [nvarchar](30) NULL,
	[WorkDate] [datetime] NULL,
	[DayNum] [float] NULL,
	[LeavePeriod] [smallint] NULL,
	[CreateBy] [nvarchar](250) NULL,
	[CreateDate] [datetime] NULL,
	[Note] [nvarchar](250) NULL,
	[IsRemainCalKowds] [smallint] NULL,
	[FromTime] [datetime] NULL,
	[ToTime] [datetime] NULL,
	[ProjectCode] [nvarchar](30) NULL,
	[KowCode] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[RefID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeDependants]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeDependants](
	[Id] [uniqueidentifier] NOT NULL,
	[EmployeeId] [nvarchar](30) NOT NULL,
	[FullName] [nvarchar](max) NULL,
	[RelationTypeId] [uniqueidentifier] NOT NULL,
	[Address] [nvarchar](max) NULL,
	[Note] [nvarchar](max) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[FromMonth] [varchar](7) NULL,
	[ToMonth] [varchar](7) NULL,
	[IsSub] [bit] NOT NULL,
	[IsTax] [bit] NULL,
	[Phone] [nchar](15) NULL,
 CONSTRAINT [PK_EmployeeDependants] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeFilters]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeFilters](
	[EmployeeCode] [nvarchar](20) NOT NULL,
	[UserID] [nvarchar](20) NOT NULL,
	[FunctionID] [nvarchar](20) NOT NULL,
	[CreatedOn] [datetime] NULL,
	[ID] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employees](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [varchar](20) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[DepartmentCode] [varchar](20) NOT NULL,
	[JobPosCode] [varchar](20) NULL,
	[JobWCode] [varchar](20) NULL,
	[Birthday] [datetime] NOT NULL,
	[JoinDate] [datetime] NOT NULL,
	[Gender] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[TAddress] [nvarchar](150) NULL,
	[PAddress] [nvarchar](150) NULL,
	[PhoneNumber] [nvarchar](25) NULL,
	[Fax] [nvarchar](25) NULL,
	[Email] [nvarchar](50) NULL,
	[Description] [nvarchar](200) NULL,
	[LastEditDate] [datetime] NULL,
	[CreationDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[TaxID] [varchar](20) NULL,
	[GroupSalID] [varchar](20) NULL,
	[DateFormal] [datetime] NULL,
	[IsSI] [bit] NOT NULL,
	[IsMI] [bit] NOT NULL,
	[IsUnemployed] [bit] NOT NULL,
	[IDCardNo] [nvarchar](50) NULL,
	[CodeTax] [nvarchar](50) NULL,
	[Meta] [nvarchar](450) NULL,
	[Alt_Shift] [bit] NULL,
	[ShiftCode] [nvarchar](30) NULL,
	[IsScan] [bit] NULL,
	[IsNotLateEarly] [bit] NULL,
	[BarCode] [nvarchar](250) NULL,
	[LeavePeriod] [int] NULL,
	[ObjVacaCode] [nvarchar](20) NULL,
	[ContractType] [nvarchar](20) NULL,
	[IsPrivateSiRate] [bit] NULL,
	[SiPrivate] [money] NULL,
	[SiCompany] [money] NULL,
	[IsPrivateMiRate] [bit] NULL,
	[MiPrivate] [money] NULL,
	[MiCompany] [money] NULL,
	[IsPrivateUnRate] [bit] NULL,
	[UnPrivate] [money] NULL,
	[UnCompany] [money] NULL,
	[LuongUng] [float] NULL,
	[ImageItem] [image] NULL,
	[EmployeeIDOld] [varchar](20) NULL,
	[IDCardNoPlace] [nvarchar](max) NULL,
	[IDCardNoDate] [datetime2](7) NULL,
	[TrinhDo] [nvarchar](150) NULL,
	[Note] [nvarchar](max) NULL,
	[NguyenQuang] [nvarchar](max) NULL,
	[MaHoSo] [nvarchar](200) NULL,
	[ContractNo] [nvarchar](200) NULL,
	[LeaveGroupCode] [varchar](20) NULL,
	[IsNotScan] [bit] NOT NULL,
	[IsNotOTKow] [bit] NOT NULL,
 CONSTRAINT [PK__Employee__3214EC2744137256] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeShifts]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeShifts](
	[Id] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[WorkDate] [datetime2](7) NOT NULL,
	[ShiftCode] [nvarchar](20) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bigint] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_EmployeeShifts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeShifts_tmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeShifts_tmp](
	[Id] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[WorkDate] [datetime2](7) NOT NULL,
	[ShiftCode] [nvarchar](20) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bigint] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[UserID] [nvarchar](100) NOT NULL,
	[IsSelected] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeWeekOffs]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeWeekOffs](
	[Id] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NULL,
	[WorkDate] [datetime2](7) NOT NULL,
	[LeavePeriod] [int] NOT NULL,
	[Note] [nvarchar](150) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_EmployeeWeekOffs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeWeekOffs_tmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeWeekOffs_tmp](
	[Id] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NULL,
	[WorkDate] [datetime2](7) NOT NULL,
	[LeavePeriod] [int] NOT NULL,
	[Note] [nvarchar](150) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[UserID] [nvarchar](100) NULL,
	[IsSelected] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmployeeWorkingShifts]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmployeeWorkingShifts](
	[Id] [uniqueidentifier] NOT NULL,
	[Day] [int] NOT NULL,
	[Month] [int] NOT NULL,
	[Year] [int] NOT NULL,
	[Description] [nvarchar](150) NULL,
	[EmployeeId] [uniqueidentifier] NOT NULL,
	[WorkingShiftId] [uniqueidentifier] NOT NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_EmployeeWorkingShifts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpOverTimeReg]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpOverTimeReg](
	[ID] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[WorkDate] [datetime] NOT NULL,
	[FromTime] [datetime] NULL,
	[ToTime] [datetime] NULL,
	[HourNum] [float] NULL,
	[IsUnPaid] [smallint] NULL,
	[Note] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
 CONSTRAINT [PK__EmpOverT__3214EC273DD18070] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpOverTimeReg_tmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpOverTimeReg_tmp](
	[ID] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[WorkDate] [datetime] NOT NULL,
	[FromTime] [datetime] NULL,
	[ToTime] [datetime] NULL,
	[HourNum] [float] NULL,
	[IsUnPaid] [smallint] NULL,
	[Note] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[UserID] [nvarchar](100) NULL,
	[IsSelected] [bit] NULL,
 CONSTRAINT [PK__EmpOverT__3214EC2790B0C4C8] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpRegisterExtraWorkDay]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpRegisterExtraWorkDay](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [nvarchar](20) NOT NULL,
	[WorkDate] [datetime] NOT NULL,
	[ForDate] [datetime] NULL,
	[HourNum] [float] NULL,
	[Note] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[refPortalID] [uniqueidentifier] NULL,
	[RealHourNum] [float] NULL,
 CONSTRAINT [PK__HCSTS_RegisterEx__3A8FC51D] PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpRegLateEarly]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpRegLateEarly](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [nvarchar](20) NOT NULL,
	[WorkDate] [datetime] NOT NULL,
	[LateIn] [float] NULL,
	[EarlyOut] [float] NULL,
	[LateInMid] [float] NULL,
	[EarlyOutMid] [float] NULL,
	[DTFrom] [nvarchar](5) NULL,
	[DTTo] [nvarchar](5) NULL,
	[VSFrom] [nvarchar](5) NULL,
	[VSTo] [nvarchar](5) NULL,
	[Note] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[Kind] [smallint] NOT NULL,
	[ID] [uniqueidentifier] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpRegLateEarly_tmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpRegLateEarly_tmp](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [nvarchar](20) NOT NULL,
	[WorkDate] [datetime] NOT NULL,
	[LateIn] [float] NULL,
	[EarlyOut] [float] NULL,
	[LateInMid] [float] NULL,
	[EarlyOutMid] [float] NULL,
	[DTFrom] [nvarchar](5) NULL,
	[DTTo] [nvarchar](5) NULL,
	[VSFrom] [nvarchar](5) NULL,
	[VSTo] [nvarchar](5) NULL,
	[Note] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[Kind] [smallint] NOT NULL,
	[UserID] [nvarchar](100) NULL,
	[IsSelected] [bit] NOT NULL,
	[ID] [uniqueidentifier] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpScanCodes]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpScanCodes](
	[Id] [uniqueidentifier] NOT NULL,
	[RecID] [uniqueidentifier] NOT NULL,
	[BarCode] [nvarchar](30) NOT NULL,
	[ScanTime] [nvarchar](20) NULL,
	[ReaderID] [nvarchar](50) NULL,
	[In1Out0] [bit] NOT NULL,
	[WorkDate] [datetime2](7) NOT NULL,
	[Note] [nvarchar](200) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[IsManual] [bit] NOT NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_EmpScanCodes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmpScanTimes]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmpScanTimes](
	[Id] [uniqueidentifier] NOT NULL,
	[RecID] [uniqueidentifier] NOT NULL,
	[EmployeeCode] [nvarchar](30) NOT NULL,
	[ScanTime] [nvarchar](20) NOT NULL,
	[ReaderID] [nvarchar](50) NULL,
	[In1Out0] [bit] NOT NULL,
	[WorkDate] [datetime2](7) NOT NULL,
	[Note] [nvarchar](200) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[IsManual] [bit] NOT NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_EmpScanTimes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsAcadame]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsAcadame](
	[TrainLevelCode] [varchar](20) NOT NULL,
	[TrainLevelName] [nvarchar](450) NOT NULL,
	[Range] [int] NOT NULL,
	[Ordinal] [int] NOT NULL,
	[Note] [nvarchar](60) NULL,
	[TrainCof] [float] NULL,
	[IsFix] [smallint] NOT NULL,
	[Coeff] [float] NULL,
	[BeginDateCal] [smallint] NOT NULL,
	[Lock] [bit] NOT NULL,
	[TrainLevelName2] [nvarchar](450) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
 CONSTRAINT [PK_HCSLS_Acadames] PRIMARY KEY CLUSTERED 
(
	[TrainLevelCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsAlloGrade]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsAlloGrade](
	[AlloGradeCode] [varchar](20) NOT NULL,
	[AlloGradeName] [nvarchar](100) NOT NULL,
	[AlloGradeName2] [nvarchar](100) NULL,
	[AlloType] [smallint] NOT NULL,
	[IsMonthAmount] [bit] NOT NULL,
	[IsLawSalary] [bit] NOT NULL,
	[IsInPayroll] [bit] NOT NULL,
	[IsManual] [bit] NOT NULL,
	[IsNotInUnitPrice] [bit] NOT NULL,
	[IsSI] [bit] NOT NULL,
	[IsHI] [bit] NOT NULL,
	[IsUI] [bit] NOT NULL,
	[IsFixAmount] [bit] NOT NULL,
	[FixAmount] [money] NOT NULL,
	[CurrencyCode] [varchar](10) NULL,
	[SalaryType] [smallint] NOT NULL,
	[SalaryInclude] [smallint] NOT NULL,
	[SalaryRate] [float] NOT NULL,
	[IsCumulative] [bit] NOT NULL,
	[KowRule] [smallint] NOT NULL,
	[KowRuleMinDay] [float] NOT NULL,
	[IsKowRuleMonth] [bit] NOT NULL,
	[IsKowRuleHour] [bit] NOT NULL,
	[KowRuleHourNotDeduct] [float] NULL,
	[KowRuleDayOff] [float] NULL,
	[IsByCoeffKow] [bit] NOT NULL,
	[IsByShift] [bit] NOT NULL,
	[TaxType] [smallint] NOT NULL,
	[BeginDateCal] [smallint] NOT NULL,
	[TaxFreeAmount] [money] NOT NULL,
	[IsInTaxableIncome] [bit] NOT NULL,
	[IsNotInHouseAllo] [bit] NOT NULL,
	[IsEnterAccount] [bit] NOT NULL,
	[DebitAccountCode] [varchar](20) NULL,
	[CreditAccountCode] [varchar](20) NULL,
	[FundCode] [varchar](20) NULL,
	[IsByDetailLevel] [bit] NOT NULL,
	[IsUserFormula] [bit] NOT NULL,
	[IsAllo1] [bit] NOT NULL,
	[IsAllo2] [bit] NOT NULL,
	[IsAllo3] [bit] NOT NULL,
	[IsAllo4] [bit] NOT NULL,
	[IsAllo5] [bit] NOT NULL,
	[Lock] [bit] NOT NULL,
	[Ordinal] [int] NOT NULL,
	[Note] [nvarchar](200) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[BUCodes] [nvarchar](200) NULL,
	[IsTaxFreeAmountByYear] [bit] NOT NULL,
 CONSTRAINT [PK_LsAlloGrades] PRIMARY KEY CLUSTERED 
(
	[AlloGradeCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsBank]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsBank](
	[ID] [uniqueidentifier] NOT NULL,
	[BankCode] [varchar](20) NOT NULL,
	[BankName] [nvarchar](100) NOT NULL,
	[BankName2] [nvarchar](100) NULL,
	[BankAddress] [nvarchar](200) NULL,
	[TelNumber] [nvarchar](50) NULL,
	[Fax] [nvarchar](50) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsCertificate]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsCertificate](
	[CerCode] [varchar](20) NOT NULL,
	[CerName] [nvarchar](450) NULL,
	[CerName2] [nvarchar](450) NULL,
	[GroupCerCode] [varchar](20) NOT NULL,
	[CersTimeLimit] [float] NULL,
	[ScerCode] [varchar](20) NULL,
	[EquivalentCourseCode] [nvarchar](500) NULL,
	[Ordinal] [int] NOT NULL,
	[Note] [nvarchar](60) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[CertificateForm] [bigint] NULL,
	[BUCodes] [nvarchar](250) NULL,
 CONSTRAINT [PK_HCSLS_Certificates] PRIMARY KEY CLUSTERED 
(
	[CerCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsContractType]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsContractType](
	[ID] [uniqueidentifier] NOT NULL,
	[ConTypeCode] [varchar](20) NOT NULL,
	[ConTypeName] [nvarchar](50) NOT NULL,
	[ConTypeName2] [nvarchar](50) NULL,
	[GroupType] [int] NOT NULL,
	[Ordinal] [int] NOT NULL,
	[Note] [nvarchar](100) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsContractTypeTime]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsContractTypeTime](
	[ID] [uniqueidentifier] NOT NULL,
	[TimeCode] [varchar](20) NOT NULL,
	[TimeAmount] [int] NOT NULL,
	[IsDay] [bit] NOT NULL,
	[ConTypeCode] [varchar](20) NOT NULL,
	[Ordinal] [int] NOT NULL,
	[Note] [nvarchar](100) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsCurrency]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsCurrency](
	[CurrencyCode] [varchar](10) NOT NULL,
	[CurrencyName] [nvarchar](30) NOT NULL,
	[CurrencyName2] [nvarchar](30) NULL,
	[TempRate] [float] NULL,
	[Multiply] [bit] NOT NULL,
	[ConsCode] [varchar](3) NULL,
	[Note] [ntext] NULL,
	[Ordinal] [int] NULL,
	[Lock] [bit] NOT NULL,
	[DecPlace] [int] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[BUCodes] [nvarchar](200) NULL,
 CONSTRAINT [PK_HCSLS_Currencies] PRIMARY KEY CLUSTERED 
(
	[CurrencyCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsDistrict]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsDistrict](
	[ID] [uniqueidentifier] NOT NULL,
	[DistrictCode] [varchar](20) NOT NULL,
	[DistrictName] [nvarchar](100) NOT NULL,
	[DistrictName2] [nvarchar](100) NULL,
	[ProvinceCode] [varchar](20) NOT NULL,
	[Ordinal] [int] NULL,
	[Note] [nvarchar](100) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsDowLists]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsDowLists](
	[Id] [uniqueidentifier] NOT NULL,
	[DowCode] [varchar](7) NOT NULL,
	[BegDate] [datetime] NOT NULL,
	[EndDate] [datetime] NOT NULL,
	[NCC] [real] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_LsDowLists] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsEthnic]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsEthnic](
	[ID] [uniqueidentifier] NOT NULL,
	[EthnicCode] [varchar](20) NOT NULL,
	[EthnicName] [nvarchar](60) NOT NULL,
	[EthnicName2] [nvarchar](60) NULL,
	[Ordinal] [int] NULL,
	[Note] [nvarchar](60) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsGroupCertificate]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsGroupCertificate](
	[GroupCerCode] [varchar](20) NOT NULL,
	[GroupCerName] [nvarchar](1000) NOT NULL,
	[GroupCerType] [int] NULL,
	[GroupCerBy] [varchar](20) NULL,
	[GroupCerName2] [nvarchar](1000) NULL,
	[Ordinal] [int] NULL,
	[Lock] [bit] NOT NULL,
	[Note] [nvarchar](200) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
 CONSTRAINT [PK_HCSLS_Groupcertificates] PRIMARY KEY CLUSTERED 
(
	[GroupCerCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsGroupsalary]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsGroupsalary](
	[GroupSalCode] [varchar](20) NOT NULL,
	[GroupSalName] [nvarchar](100) NOT NULL,
	[GroupSalName2] [nvarchar](100) NULL,
	[GroupType] [int] NOT NULL,
	[IsUserFormula] [bit] NOT NULL,
	[FormulaLevel] [smallint] NOT NULL,
	[Ordinal] [int] NOT NULL,
	[Note] [nvarchar](250) NULL,
	[Lock] [bit] NOT NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[PayslipTemplateID] [nvarchar](100) NULL,
	[BUCodes] [nvarchar](200) NULL,
	[IncentiveTemplateID] [int] NULL,
	[PayslipMobileTemplateID] [nvarchar](300) NULL,
	[IsGrossupNotSocialIns] [bit] NOT NULL,
 CONSTRAINT [PK_LsGroupsalarys] PRIMARY KEY CLUSTERED 
(
	[GroupSalCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsHospital]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsHospital](
	[HospitalCode] [varchar](20) NOT NULL,
	[HospitalName] [nvarchar](100) NOT NULL,
	[HospitalAdd] [nvarchar](100) NULL,
	[Hospitaltel] [nvarchar](20) NULL,
	[Ordinal] [int] NULL,
	[ProvinceCode] [varchar](20) NOT NULL,
	[Lock] [bit] NOT NULL,
	[HospitalName2] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[OrgHospitalCode] [nvarchar](20) NULL,
 CONSTRAINT [PK_LsHospitals] PRIMARY KEY CLUSTERED 
(
	[HospitalCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsInsurance]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsInsurance](
	[SICode] [varchar](20) NOT NULL,
	[SIName] [nvarchar](100) NOT NULL,
	[SIName2] [nvarchar](100) NULL,
	[Ordinal] [int] NOT NULL,
	[InsType] [int] NOT NULL,
	[Lock] [bit] NOT NULL,
	[Note] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[RateEmp] [float] NOT NULL,
	[RateCo] [float] NOT NULL,
	[IsDefault] [bit] NOT NULL,
	[BUCodes] [nvarchar](200) NULL,
	[MinSalary] [money] NULL,
	[MaxSalary] [money] NULL,
	[EffectDate] [datetime] NULL,
	[BasicSalary] [float] NOT NULL,
	[BasicSalary1] [float] NOT NULL,
	[BasicSalary2] [float] NOT NULL,
	[BasicSalary3] [float] NOT NULL,
	[BasicSalary4] [float] NOT NULL,
 CONSTRAINT [PK_LsInsurances] PRIMARY KEY CLUSTERED 
(
	[SICode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lsJobWorking]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lsJobWorking](
	[JobWCode] [varchar](20) NOT NULL,
	[JobWName] [nvarchar](300) NOT NULL,
	[JobWName2] [nvarchar](300) NULL,
	[GJWCode] [varchar](20) NOT NULL,
	[Ordinal] [smallint] NOT NULL,
	[Note] [nvarchar](60) NULL,
	[Lock] [bit] NOT NULL,
	[ReportToJobW] [varchar](20) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsKows]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsKows](
	[Id] [uniqueidentifier] NOT NULL,
	[KowCode] [nvarchar](20) NOT NULL,
	[KowName] [nvarchar](100) NOT NULL,
	[KowType] [int] NOT NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[Ratio_Company] [real] NOT NULL,
	[Ratio_Si] [real] NOT NULL,
	[IsSubHoliday] [bit] NOT NULL,
	[IsSubWeek] [bit] NOT NULL,
	[IsSubSunDay] [bit] NOT NULL,
	[RealTime] [nvarchar](8) NULL,
	[FShiftCodeK] [nvarchar](20) NULL,
	[InOut] [nvarchar](8) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[Ordinal] [int] NULL,
	[BasicSalRate] [float] NULL,
 CONSTRAINT [PK_LsKows] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lsLeaveGroups]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lsLeaveGroups](
	[Id] [uniqueidentifier] NOT NULL,
	[LeaveGroupCode] [nvarchar](20) NULL,
	[LeaveGroupName] [nvarchar](100) NULL,
	[LeaveType] [int] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_lsLeaveGroups] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsNation]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsNation](
	[ID] [uniqueidentifier] NOT NULL,
	[NationCode] [varchar](20) NOT NULL,
	[NationName] [nvarchar](30) NOT NULL,
	[NationName2] [nvarchar](30) NULL,
	[Ordinal] [int] NULL,
	[Note] [nvarchar](60) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
 CONSTRAINT [PK_LsNation] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsPosition]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsPosition](
	[JobPosCode] [varchar](20) NOT NULL,
	[JobPosName] [nvarchar](250) NOT NULL,
	[JobPosName2] [nvarchar](250) NULL,
	[ManLevel] [float] NOT NULL,
	[Ordinal] [int] NOT NULL,
	[Note] [nvarchar](max) NULL,
	[IsFix] [smallint] NULL,
	[Coeff] [float] NULL,
	[BeginDateCal] [smallint] NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[BUCodes] [nvarchar](200) NULL,
	[ObjVacaCode] [varchar](20) NULL,
 CONSTRAINT [PK_HCSLS_Positions] PRIMARY KEY CLUSTERED 
(
	[JobPosCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsProvince]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsProvince](
	[ID] [uniqueidentifier] NOT NULL,
	[ProvinceCode] [varchar](20) NOT NULL,
	[ProvinceName] [nvarchar](100) NOT NULL,
	[ProvinceName2] [nvarchar](100) NULL,
	[NationCode] [varchar](20) NULL,
	[Ordinal] [int] NULL,
	[Note] [nvarchar](100) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsRegion]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsRegion](
	[RegionCode] [varchar](20) NOT NULL,
	[RegionName] [nvarchar](60) NOT NULL,
	[RegionName2] [nvarchar](60) NULL,
	[Ordinal] [int] NULL,
	[Note] [nvarchar](60) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[DistrictCode] [varchar](20) NULL,
	[ProvinceCode] [varchar](20) NULL,
	[Mobile] [nvarchar](100) NULL,
	[Fax] [nvarchar](100) NULL,
 CONSTRAINT [PK_HCSLS_Region] PRIMARY KEY CLUSTERED 
(
	[RegionCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsRelationship]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsRelationship](
	[RelCode] [varchar](20) NOT NULL,
	[RelName] [nvarchar](60) NOT NULL,
	[Ordinal] [int] NULL,
	[Note] [nvarchar](100) NULL,
	[IsMarital] [bit] NOT NULL,
	[IsChildren] [bit] NOT NULL,
	[IsParent] [bit] NOT NULL,
	[IsParentinlaw] [bit] NOT NULL,
	[IsOther] [bit] NOT NULL,
	[Lock] [bit] NOT NULL,
	[IsIncentives] [bit] NOT NULL,
	[RelName2] [nvarchar](60) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[OrgRelCode] [nvarchar](20) NULL,
 CONSTRAINT [PK_LsRelationships] PRIMARY KEY CLUSTERED 
(
	[RelCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsReligion]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsReligion](
	[ID] [uniqueidentifier] NOT NULL,
	[ReligionCode] [varchar](20) NOT NULL,
	[ReligionName] [nvarchar](60) NOT NULL,
	[ReligionName2] [nvarchar](60) NULL,
	[Ordinal] [int] NULL,
	[Note] [nvarchar](60) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsShiftPeriod]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsShiftPeriod](
	[PeriodCode] [varchar](20) NOT NULL,
	[PeriodName] [nvarchar](100) NOT NULL,
	[PeriodName2] [nvarchar](60) NULL,
	[PeriodType] [bit] NOT NULL,
	[Note] [nvarchar](100) NULL,
	[Lock] [bit] NOT NULL,
	[Ordinal] [int] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[BUCodes] [nvarchar](200) NULL,
 CONSTRAINT [PK_LsShiftPeriods] PRIMARY KEY CLUSTERED 
(
	[PeriodCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsShiftperioddetail]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsShiftperioddetail](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[PeriodCode] [varchar](20) NOT NULL,
	[DateOrder] [int] NOT NULL,
	[ShiftCode] [varchar](20) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[Description] [nvarchar](250) NULL,
	[WeekFilter] [nvarchar](20) NULL,
 CONSTRAINT [PK_LsShiftperioddetail] PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsShifts]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsShifts](
	[Id] [uniqueidentifier] NOT NULL,
	[ShiftCode] [nvarchar](20) NULL,
	[ShiftName] [nvarchar](100) NULL,
	[TotalDays] [int] NOT NULL,
	[SGMC] [real] NOT NULL,
	[Ordinal] [int] NULL,
	[Lock] [bit] NOT NULL,
	[FromTime] [nvarchar](8) NULL,
	[ToTime] [nvarchar](8) NULL,
	[InFrom] [nvarchar](8) NULL,
	[InTo] [nvarchar](8) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[KowCode] [nvarchar](20) NULL,
	[RealTime] [nvarchar](8) NULL,
	[ShiftCode_1] [nvarchar](20) NULL,
	[InOut] [nvarchar](8) NULL,
	[ShiftCode_1_1] [nvarchar](20) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[IsLock] [bit] NOT NULL,
 CONSTRAINT [PK_LsShifts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsShiftsDetail_FullDays]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsShiftsDetail_FullDays](
	[Id] [uniqueidentifier] NOT NULL,
	[ShiftCode] [nvarchar](20) NOT NULL,
	[InOut] [nvarchar](8) NOT NULL,
	[RealTime] [nvarchar](8) NOT NULL,
	[KowCode] [nvarchar](20) NOT NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[WorkingHours] [float] NULL,
	[NextDate] [int] NULL,
 CONSTRAINT [PK_LsShiftsDetail_FullDays] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsShiftsDetail_HaftDays]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsShiftsDetail_HaftDays](
	[Id] [uniqueidentifier] NOT NULL,
	[ShiftCode] [nvarchar](20) NULL,
	[InOut] [nvarchar](8) NULL,
	[RealTime] [nvarchar](8) NULL,
	[KowCode] [nvarchar](20) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[WorkingHours] [float] NULL,
	[NextDate] [int] NULL,
 CONSTRAINT [PK_LsShiftsDetail_HaftDays] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsUnit]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsUnit](
	[UnitCode] [varchar](20) NOT NULL,
	[UnitName] [nvarchar](60) NOT NULL,
	[UnitName2] [nvarchar](60) NULL,
	[IsDefault] [bit] NULL,
	[DataType] [int] NOT NULL,
	[DecPlace] [int] NULL,
	[Note] [nvarchar](60) NULL,
	[Ordinal] [int] NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
 CONSTRAINT [PK__LsUnits__6F7569AA] PRIMARY KEY CLUSTERED 
(
	[UnitCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsVacationDays]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsVacationDays](
	[Id] [uniqueidentifier] NOT NULL,
	[VacationDay] [datetime2](7) NOT NULL,
	[VacationName] [nvarchar](50) NULL,
	[Note] [nvarchar](50) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
	[VacationGroupCode] [varchar](20) NULL,
 CONSTRAINT [PK_LsVacationDays] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lsVacationGroup]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lsVacationGroup](
	[VacationGroupCode] [varchar](20) NOT NULL,
	[VacationGroupName] [varchar](250) NOT NULL,
	[Note] [nvarchar](max) NULL,
	[Ordinal] [int] NULL,
	[Lock] [bit] NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime2](7) NULL,
	[ModifiedBy] [nvarchar](50) NULL,
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LsWard]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LsWard](
	[ID] [uniqueidentifier] NOT NULL,
	[WardCode] [varchar](20) NOT NULL,
	[WardName] [nvarchar](100) NOT NULL,
	[WardName2] [nvarchar](100) NULL,
	[DistrictCode] [varchar](20) NOT NULL,
	[Ordinal] [int] NULL,
	[Note] [nvarchar](100) NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MAllowanceTypeLevels]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MAllowanceTypeLevels](
	[Id] [uniqueidentifier] NOT NULL,
	[MAllowanceTypeId] [uniqueidentifier] NULL,
	[Level] [nchar](10) NULL,
	[Note] [nvarchar](max) NULL,
 CONSTRAINT [PK_MAllowanceTypeLevels] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MAllowanceTypes]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MAllowanceTypes](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [int] NOT NULL,
	[Description] [nvarchar](100) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_MAllowanceTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MContractTypes]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MContractTypes](
	[Id] [varchar](20) NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](250) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_MContractTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MDependantRelations]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MDependantRelations](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
	[Descriptions] [nvarchar](max) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_MDependantRelations] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MDesignaions]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MDesignaions](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [int] NOT NULL,
	[DepartmentCode] [uniqueidentifier] NOT NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_MDesignaions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Positions]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Positions](
	[Id] [uniqueidentifier] NOT NULL,
	[Code] [nvarchar](50) NULL,
	[Name] [nvarchar](150) NULL,
	[Description] [nvarchar](250) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_Positions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SYS_DataDomain_Roles]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SYS_DataDomain_Roles](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[RoleID] [nvarchar](20) NOT NULL,
	[DDCode] [nvarchar](20) NOT NULL,
	[Description] [nvarchar](500) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SYS_DataDomainDetails]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SYS_DataDomainDetails](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[DDCode] [nvarchar](20) NOT NULL,
	[DepartmentCode] [nvarchar](20) NOT NULL,
	[Owner] [nvarchar](20) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SYS_DataDomains]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SYS_DataDomains](
	[DDID] [int] IDENTITY(1,1) NOT NULL,
	[DDCode] [nvarchar](20) NOT NULL,
	[DDName] [nvarchar](450) NOT NULL,
	[AccessMode] [int] NOT NULL,
	[Description] [nvarchar](max) NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ParentID] [bigint] NULL,
	[ParentCode] [nvarchar](20) NULL,
	[Level] [int] NULL,
	[LevelCode] [nvarchar](250) NULL,
PRIMARY KEY CLUSTERED 
(
	[DDID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SYS_FunctionList]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SYS_FunctionList](
	[FunctionID] [nvarchar](20) NOT NULL,
	[FunctionType] [nvarchar](1) NULL,
	[DefaultName] [nvarchar](200) NOT NULL,
	[ParentID] [nvarchar](20) NOT NULL,
	[Module] [nvarchar](20) NULL,
	[Url] [varchar](450) NULL,
	[Background] [nvarchar](200) NULL,
	[Icon] [nvarchar](100) NULL,
	[Style] [nvarchar](100) NULL,
	[DisplayMode] [varchar](50) NOT NULL,
	[Width] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[Level] [smallint] NOT NULL,
	[Sorting] [varchar](50) NULL,
	[LevelCode] [nvarchar](max) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[Note] [nvarchar](200) NULL,
	[TableName] [nvarchar](max) NULL,
	[FieldKey] [nvarchar](100) NULL,
	[SQLView] [nvarchar](max) NULL,
 CONSTRAINT [PK__SYS_Func__31ABF91855A0C76B] PRIMARY KEY CLUSTERED 
(
	[FunctionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SYS_FunctionListLabel]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SYS_FunctionListLabel](
	[FunctionID] [nvarchar](20) NOT NULL,
	[Language] [varchar](5) NOT NULL,
	[DefaultName] [nvarchar](200) NULL,
	[CustomName] [nvarchar](200) NULL,
	[Description] [nvarchar](200) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SYS_Modules]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SYS_Modules](
	[ModuleCode] [nvarchar](20) NOT NULL,
	[ModuleName] [nvarchar](200) NULL,
	[ModuleType] [nvarchar](20) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[Url] [nvarchar](200) NULL,
	[RedirectUrl] [nvarchar](200) NULL,
	[Style] [nvarchar](400) NULL,
	[IsActive] [bit] NOT NULL,
	[Sorting] [varchar](10) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SYS_Permissions]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SYS_Permissions](
	[RoleID] [nvarchar](20) NOT NULL,
	[FunctionID] [nvarchar](20) NOT NULL,
	[View] [bit] NOT NULL,
	[Add] [bit] NOT NULL,
	[Delete] [bit] NOT NULL,
	[Export] [bit] NOT NULL,
	[Import] [bit] NOT NULL,
	[Upload] [bit] NOT NULL,
	[Download] [bit] NOT NULL,
	[Copy] [bit] NOT NULL,
	[Print] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sys_Roles]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_Roles](
	[RecID] [uniqueidentifier] NOT NULL,
	[RoleID] [nvarchar](20) NOT NULL,
	[RoleName] [nvarchar](100) NOT NULL,
	[RoleType] [nvarchar](1) NOT NULL,
	[Description] [nvarchar](500) NULL,
	[Lock] [bit] NOT NULL,
	[IsSystem] [bit] NOT NULL,
	[IsAdmin] [bit] NOT NULL,
	[Note] [nvarchar](1000) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[IsEmpGroup] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sys_UserRoles]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_UserRoles](
	[RecID] [uniqueidentifier] NOT NULL,
	[UserID] [nvarchar](20) NOT NULL,
	[RoleID] [nvarchar](20) NOT NULL,
	[Ordinal] [int] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sys_Users]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sys_Users](
	[RecID] [uniqueidentifier] NOT NULL,
	[UserID] [nvarchar](20) NOT NULL,
	[UserName] [nvarchar](200) NOT NULL,
	[Email] [nvarchar](150) NULL,
	[Mobile] [nvarchar](100) NULL,
	[IsSystem] [bit] NOT NULL,
	[IsAdmin] [bit] NOT NULL,
	[Password] [nvarchar](128) NULL,
	[NeverExpire] [bit] NOT NULL,
	[FirstChange] [bit] NOT NULL,
	[SessionID] [nvarchar](256) NULL,
	[LastLogin] [datetime] NULL,
	[LastPWChange] [datetime] NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sysConfigTS]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sysConfigTS](
	[RecID] [int] IDENTITY(1,1) NOT NULL,
	[TSDecPlaceWD] [smallint] NULL,
	[TSDecPlaceLateEarly] [smallint] NULL,
	[TSIsOTByHour] [bit] NULL,
	[TSIsNightByHour] [bit] NULL,
	[TSIsNextDayOfNightShift] [bit] NULL,
	[TSIsRoundingFinalDigit] [bit] NULL,
	[TSIsImportTimeSheetByTime] [bit] NULL,
	[TSNotALIfStopBeforeDay] [smallint] NULL,
	[TSMaxOTHourPerD] [float] NULL,
	[TSMaxOTHourPerW] [float] NULL,
	[TSMaxOTHourPerM] [float] NULL,
	[TSMaxOTHourPerY] [float] NULL,
	[TSMaxChildSickLeavePerY] [float] NULL,
	[TSStandardWDOfOT] [float] NULL,
	[TSIsExactKowOnHoliday] [bit] NULL,
	[TSIsSubLateEarlyOnHoliday] [bit] NULL,
	[TSIsChangeHoursPerWDByShift] [bit] NULL,
	[TSHoursPerWD] [float] NULL,
	[TSIsHoursPerWDChange] [bit] NULL,
	[TSSysVacationTypeCode] [varchar](20) NULL,
	[TSIsSysVacationTypeChange] [bit] NULL,
	[TSWLeaveDayCode] [varchar](20) NULL,
	[TSIsWLeaveDayChange] [bit] NULL,
	[TSIsStandardWDChange] [bit] NULL,
	[TSIsCKowUseFund] [bit] NULL,
	[TSCKowBy] [smallint] NULL,
	[TSIsExpireStandardAL] [bit] NULL,
	[TSIsOTHourAllowByLaw] [bit] NULL,
	[TSOTHourAllowByLaw] [float] NULL,
	[TSHoursPerWDChangeObject] [smallint] NULL,
	[TSSysVacationTypeChangeObject] [smallint] NULL,
	[TSWLeaveDayChangeObject] [smallint] NULL,
	[TSStandardWDChangeObject] [smallint] NULL,
	[TSIsLate] [bit] NULL,
	[TSIsLateChange] [bit] NULL,
	[TSLateChangeObject] [smallint] NULL,
	[TSIsEarly] [bit] NULL,
	[TSIsEarlyChange] [bit] NULL,
	[TSEarlyChangeObject] [smallint] NULL,
	[TSIsWLeaveNight] [bit] NULL,
	[TSIsWLeaveRegOT] [bit] NULL,
	[TSIsWLeaveChange] [bit] NULL,
	[TSWLeaveChangeObject] [smallint] NULL,
	[TSIsHolidayNight] [bit] NULL,
	[TSIsHolidayRegOT] [bit] NULL,
	[TSIsHolidayKow] [bit] NULL,
	[TSHolidayKowCode] [varchar](20) NULL,
	[TSIsHolidayChange] [bit] NULL,
	[TSHolidayChangeObject] [smallint] NULL,
	[TSIsCalOTByRegister] [bit] NULL,
	[TSIsCalOTByConfirm] [bit] NULL,
	[TSCalOT] [smallint] NULL,
	[TSOTMinShift] [smallint] NULL,
	[TSIsCalOTChange] [bit] NULL,
	[TSCalOTChangeObject] [int] NULL,
	[TSIsRegOTByFromTo] [bit] NULL,
	[TSIsSelectOTType] [bit] NULL,
	[TSIsOTExtraToAlloGrade] [bit] NULL,
	[TSOTExtraToAlloGradeCode] [varchar](20) NULL,
	[TSOTNightKowBefore] [nvarchar](250) NULL,
	[TSOTNightKowDefault] [nvarchar](250) NULL,
	[TSOTNightKowAdjust] [varchar](20) NULL,
	[TSIsCLeaveRegNegative] [bit] NULL,
	[TSIsCLeaveByHour] [bit] NULL,
	[TSCLeavePayRate] [smallint] NULL,
	[TSCLeaveMaxKowToNextYear] [float] NULL,
	[TSCLeaveKowToNextYear] [float] NULL,
	[TSCLeavePaid] [int] NULL,
	[TSCLeaveKowCode] [varchar](20) NULL,
	[TSIsCLeavePaidByOTReg] [bit] NULL,
	[TSIsMealScanTimes] [bit] NULL,
	[TSMealMaxScanTimesPerDay] [int] NULL,
	[TSMealMinHourBetweenScanTimes] [float] NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[TSIsLateEarly] [bit] NULL,
	[TSIsLateEarlyChange] [bit] NULL,
	[TSLateEarlyChangeObject] [smallint] NULL,
	[TSIsRegisterMidShift] [bit] NULL,
	[TSIsMinusAL] [bit] NULL,
	[TSMinusALMin] [int] NULL,
	[TSMinusALCalType] [int] NULL,
	[TSMinusALBlock] [int] NULL,
	[TSMinusALKowCode] [nvarchar](20) NULL,
	[TSMinusALKowCodeSub] [nvarchar](20) NULL,
	[BUCode] [nvarchar](20) NULL,
	[IsChanged] [bit] NULL,
	[TSIsCLeaveUsePriority] [bit] NULL,
	[TSIsCLeaveUserPriority] [bit] NULL,
	[TSCLeaveTimePoint] [varchar](5) NULL,
	[TSIsKowChange] [bit] NULL,
	[TSKowChangeObject] [int] NULL,
	[TSLockData] [int] NULL,
	[TSIsLateEarlyAllowShift] [bit] NULL,
	[TSIsCalOTAlloRegis] [bit] NULL,
	[IsTransDayOffToKowds] [bit] NULL,
	[TSIsLateEarlyAllowDistinct] [bit] NULL,
	[IsApplyBlockOTWithHoliday] [bit] NULL,
	[isTSHolidayAuTo2] [bit] NULL,
	[TSHolidayCodeAuTo2] [nvarchar](20) NULL,
	[TSOTKowCodeWhenRegOT] [varchar](20) NULL,
	[TSLateNum] [float] NULL,
	[TSEarlyNum] [float] NULL,
	[CalExactChangeObjVacaCode] [bit] NULL,
	[IsAutoUpdateFundEmp] [bit] NULL,
	[IsCalLateWithMonth] [bit] NULL,
	[MinMaxAllowLateInMonth] [float] NULL,
	[NumMaxAllowLateInMonth] [float] NULL,
	[MaxOtOfDay_BT] [float] NULL,
	[MaxOtOfDay_Nghi] [float] NULL,
	[MaxOtOfDay_Le] [float] NULL,
	[MaxOtOfWeek] [float] NULL,
	[MaxOtOfMonth] [float] NULL,
 CONSTRAINT [PK_sysConfigTS] PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sysConfigTSEmpDayOff]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sysConfigTSEmpDayOff](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[IsHoliday] [smallint] NOT NULL,
	[KowCode] [varchar](20) NOT NULL,
	[CKowCode] [varchar](20) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
 CONSTRAINT [PK_sysConfigTSEmpDayOff] PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sysConfigTSEmpOT]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sysConfigTSEmpOT](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[EmployeeCode] [nvarchar](20) NOT NULL,
	[TSCalOT] [smallint] NOT NULL,
	[TSMinShift] [smallint] NULL,
	[MinFrom] [float] NULL,
	[MinTo] [float] NULL,
	[MinCal] [float] NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[TSIsRegOTByFromTo] [bit] NULL,
 CONSTRAINT [PK_sysConfigTSEmpOT] PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sysConfigTSSubLateEarly]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sysConfigTSSubLateEarly](
	[RecID] [int] IDENTITY(1,1) NOT NULL,
	[IsLate] [smallint] NOT NULL,
	[MinFrom] [float] NOT NULL,
	[MinTo] [float] NOT NULL,
	[MinCal] [float] NOT NULL,
	[Note] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SysFunctionList]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SysFunctionList](
	[ID] [uniqueidentifier] NOT NULL,
	[Application] [varchar](20) NOT NULL,
	[FunctionID] [nvarchar](20) NOT NULL,
	[FunctionType] [nvarchar](1) NULL,
	[DefaultName] [nvarchar](200) NOT NULL,
	[ParentID] [nvarchar](20) NOT NULL,
	[Module] [nvarchar](20) NULL,
	[Url] [varchar](450) NULL,
	[Background] [nvarchar](200) NULL,
	[Icon] [nvarchar](100) NULL,
	[IsActive] [bit] NOT NULL,
	[Sorting] [varchar](50) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[Note] [nvarchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sysJobIntegration]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sysJobIntegration](
	[CustumerID] [nvarchar](100) NOT NULL,
	[JobID] [nvarchar](100) NOT NULL,
	[JobName] [nvarchar](250) NOT NULL,
	[ExecuteDate] [datetime] NULL,
	[CreateDate] [datetime] NULL,
	[LastRunTime] [datetime] NULL,
	[Note] [nvarchar](max) NULL,
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](500) NULL,
	[Subject] [nvarchar](max) NULL,
	[Body] [nvarchar](max) NULL,
	[ServerName] [nvarchar](120) NULL,
	[DBName] [nvarchar](120) NULL,
	[TableCheckInOut] [nvarchar](max) NULL,
	[TableCheckInOut_IsQuery] [bit] NOT NULL,
	[Field_BarCode] [varchar](100) NULL,
	[Field_WorkDate] [varchar](100) NULL,
	[Field_Scantime] [varchar](100) NULL,
	[Field_In1Out0] [varchar](100) NULL,
	[In1Value] [nvarchar](100) NULL,
	[Field_ReaderID] [nvarchar](100) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sysTsConfigs]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sysTsConfigs](
	[Id] [uniqueidentifier] NOT NULL,
	[FileScanType] [int] NOT NULL,
	[SGMC] [real] NOT NULL,
	[txtBarcode] [int] NOT NULL,
	[txtYYYY] [int] NOT NULL,
	[txtMM] [int] NOT NULL,
	[txtHH] [int] NOT NULL,
	[txtMinute] [int] NOT NULL,
	[txtSS] [int] NOT NULL,
	[txtInOut] [int] NOT NULL,
	[txtDD] [int] NOT NULL,
	[ExcelBarcode] [int] NOT NULL,
	[ExcelYYYY] [int] NOT NULL,
	[ExcelMM] [int] NOT NULL,
	[ExcelDD] [int] NOT NULL,
	[ExcelHH] [int] NOT NULL,
	[ExcelMinute] [int] NOT NULL,
	[ExcelSS] [int] NOT NULL,
	[ExcelInOut] [int] NOT NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_sysTsConfigs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sysUsers]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sysUsers](
	[RecID] [uniqueidentifier] NOT NULL,
	[UserID] [nvarchar](20) NOT NULL,
	[UserName] [nvarchar](200) NOT NULL,
	[Email] [nvarchar](150) NULL,
	[Mobile] [nvarchar](100) NULL,
	[IsSystem] [bit] NOT NULL,
	[IsAdmin] [bit] NOT NULL,
	[Password] [nvarchar](128) NULL,
	[NeverExpire] [bit] NOT NULL,
	[FirstChange] [bit] NOT NULL,
	[SessionID] [nvarchar](256) NULL,
	[LastLogin] [datetime] NULL,
	[LastPWChange] [datetime] NULL,
	[Lock] [bit] NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SysValueList]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SysValueList](
	[ID] [uniqueidentifier] NOT NULL,
	[Language] [nvarchar](2) NOT NULL,
	[ListName] [nvarchar](50) NOT NULL,
	[DefaultValues] [nvarchar](max) NOT NULL,
	[CustomValues] [nvarchar](max) NOT NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedBy] [nvarchar](20) NOT NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[MultiSelect] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tmp](
	[Id] [uniqueidentifier] NOT NULL,
	[Code] [varchar](50) NOT NULL,
	[Name] [nvarchar](150) NOT NULL,
	[ParentId] [uniqueidentifier] NULL,
	[Level] [int] NULL,
	[LevelCode] [varchar](100) NULL,
	[Description] [nvarchar](max) NULL,
	[HeadEmpID] [uniqueidentifier] NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_Departments] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserLockData]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserLockData](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[Kind] [nvarchar](100) NOT NULL,
	[KindCode] [varchar](20) NULL,
	[DepartmentCode] [nvarchar](20) NOT NULL,
	[DowCode] [varchar](20) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
	[LockID] [int] NULL,
	[BegDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[SystemNote] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserLockData_DeptUnlock]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserLockData_DeptUnlock](
	[RecID] [bigint] IDENTITY(1,1) NOT NULL,
	[FunctionID] [nvarchar](100) NULL,
	[DepartmentCode] [nvarchar](20) NULL,
	[BegDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[Locked] [bit] NOT NULL,
	[ExpiredDate] [datetime] NULL,
	[Note] [nvarchar](200) NULL,
	[CreatedOn] [datetime] NOT NULL,
	[CreatedBy] [nvarchar](20) NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[RecID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WorkingShifts]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WorkingShifts](
	[Id] [uniqueidentifier] NOT NULL,
	[Code] [nvarchar](50) NULL,
	[Name] [nvarchar](150) NULL,
	[StartTime] [time](7) NOT NULL,
	[EndTime] [time](7) NOT NULL,
	[Description] [nvarchar](150) NULL,
	[CreatedDate] [datetime2](7) NULL,
	[UpdatedDate] [datetime2](7) NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
	[DeletedDate] [datetime2](7) NULL,
	[DeletedBy] [int] NULL,
 CONSTRAINT [PK_WorkingShifts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[fnSplitString]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fnSplitString]
( 
    @str NVARCHAR(MAX),  
    @separator CHAR(1)
) 
RETURNS TABLE 
AS 
	RETURN (
		WITH tokens(p, a, b) AS (
			SELECT CAST(1 AS BIGINT), CAST(1 AS BIGINT), CHARINDEX(@separator, @str)
			UNION ALL
			SELECT p + 1, b + 1, CHARINDEX(@separator, @str, b + 1) FROM tokens WHERE b > 0
		)
		SELECT p-1 AS zeroBasedOccurance, SUBSTRING(@str, a, CASE WHEN b > 0 THEN b-a ELSE LEN(@str) END) AS data
		FROM tokens  
	)
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetChildDepartment]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	select * from fnGetChildDepartment('DEVHR')
	select * from Departments
*/
CREATE FUNCTION [dbo].[fnGetChildDepartment]
(
	@DeptCode nvarchar(max) = ''
)
RETURNS TABLE
AS
	RETURN
	with subnodes
	as
	( 
		SELECT S.DepartmentCode AS DepartmentCode,S.DepartmentName AS DepartmentName,S.ID, S.ParentID, S.Level, S.LevelCode
		FROM dbo.Departments S 
		INNER JOIN  FNSplitString(@DeptCode,'') D ON S.DepartmentCode = D.data
		union all 
		select S.DepartmentCode AS DepartmentCode,S.DepartmentName AS DepartmentName,S.ID, S.ParentID, S.Level, S.LevelCode
		from Departments S inner join subnodes sn on  S.ParentID = sn.ID 
	)
	select distinct S.ID, S.DepartmentCode,S.DepartmentName, S.ParentID, L.DepartmentCode AS ParentCode, L.DepartmentName AS ParentName, 
				S.Level, S.LevelCode
	FROM subnodes S
	LEFT JOIN Departments L ON L.ID =S.ParentID
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetEmpFilter]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fnGetEmpFilter]
(	
	@UserID nvarchar(100),
	@Function NVARCHAR(100)
)
RETURNS TABLE 
AS
RETURN 
(
	SELECT EmployeeCode,UserID,FunctionID, ID FROM EmployeeFilters WHERE UserID = @UserID AND FunctionID = @Function
)
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetEmpRegLateEarly]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[fnGetEmpRegLateEarly](
	@UserID NVARCHAR(20),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max)
)
returns table
as
return(
	with tblEmp as(
		SELECT EmployeeCode,ROW_NUMBER()OVER(ORDER BY EmployeeCode) AS RowIndex FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)
	)

	select A.RecID,A.EmployeeCode, E.LastName+' ' + E.FirstName AS EmpName,A.WorkDate,DAY(A.WorkDate) dd,MONTH(A.WorkDate) MM,YEAR(A.WorkDate) yyyy,
		A.LateIn,A.EarlyOut
	from dbo.EmpRegLateEarly A with(nolock)
	INNER join tblEmp B  on B.EmployeeCode=A.EmployeeCode
	LEFT JOIN dbo.Employees E with(nolock) ON E.EmployeeCode = A.EmployeeCode
	WHERE A.WorkDate BETWEEN @BegDate AND @EndDate
		AND B.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)
)
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetEmpOverTimeReg]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[fnGetEmpOverTimeReg](
	@UserID NVARCHAR(20),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max)
)
returns table
as
return(
	with tblEmp as(
		SELECT EmployeeCode,ROW_NUMBER()OVER(ORDER BY EmployeeCode) AS RowIndex FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)
	)

	select A.Id,A.EmployeeCode, E.LastName+' ' + E.FirstName AS EmpName,A.WorkDate,DAY(A.WorkDate) dd,MONTH(A.WorkDate) MM,YEAR(A.WorkDate) yyyy,A.FromTime,A.ToTime,A.HourNum
	from dbo.EmpOverTimeReg A with(nolock)
	INNER join tblEmp B  on B.EmployeeCode=A.EmployeeCode
	LEFT JOIN dbo.Employees E with(nolock) ON E.EmployeeCode = A.EmployeeCode
	WHERE A.WorkDate BETWEEN @BegDate AND @EndDate
		AND B.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)
)
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetEmployeeWeekOffs]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[fnGetEmployeeWeekOffs](
	@UserID NVARCHAR(20),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max)
)
returns table
as
return(
	with tblEmp as(
		SELECT EmployeeCode,ROW_NUMBER()OVER(ORDER BY EmployeeCode) AS RowIndex FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)
	)

	select A.Id,A.EmployeeCode, E.LastName+' ' + E.FirstName AS EmpName,A.WorkDate,DAY(A.WorkDate) dd,MONTH(A.WorkDate) MM,YEAR(A.WorkDate) yyyy,
		A.LeavePeriod
	from dbo.EmployeeWeekOffs A with(nolock)
	INNER join tblEmp B  on B.EmployeeCode=A.EmployeeCode
	LEFT JOIN dbo.Employees E with(nolock) ON E.EmployeeCode = A.EmployeeCode
	WHERE A.WorkDate BETWEEN @BegDate AND @EndDate
		AND B.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)
)
GO
/****** Object:  UserDefinedFunction [dbo].[fnCheckLockDataTimeSheet_WithEmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
CREATE function [dbo].[fnCheckLockDataTimeSheet_WithEmp]
(	
	@FunctionID NVARCHAR(20),
	@strEmp NVARCHAR(max),
	@DowCode varchar(7),
	@BegDate DATETIME,
	@EndDate DATETIME
)
RETURNS TABLE 
AS
RETURN 
(
	WITH tblDepWithEmp AS (
		SELECT E.DepartmentCode as DepartmentCode FROM FNSplitString(@strEmp,',') S
		INNER JOIN Employees E WITH(NOLOCK) ON E.EmployeeCode = S.data
		GROUP BY E.DepartmentCode
	),
		tblLock AS (SELECT DepartmentCode, DowCode, BegDate, EndDate 
						FROM (
								SELECT S.DepartmentCode, S.DowCode, ISNULL(S.BegDate, P.BegDate) AS BegDate, ISNULL(S.EndDate,p.EndDate) AS EndDate 
								FROM UserLockData S LEFT JOIN dbo.LsDowLists P ON P.DowCode = S.DowCode
						) T WHERE (ISNULL(@DowCode,'') = '' and BegDate <= ISNULL(@EndDate,BegDate) AND EndDate >= ISNULL(@BegDate,EndDate))
								OR (ISNULL(@DowCode,'') <> ''  AND DowCode= @DowCode) GROUP  BY DepartmentCode, DowCode, BegDate, EndDate),
		tblUnLock AS (
			SELECT P.DepartmentCode AS DepartmentCode
			FROM (
				SELECT DepartmentCode FROM UserLockData_DeptUnlock WITH(NOLOCK) 
				WHERE Locked = 0 AND FunctionID = ISNULL(@FunctionID,FunctionID) AND (ExpiredDate IS NULL OR (ExpiredDate IS NOT NULL AND GETDATE() <= ExpiredDate))
						AND @BegDate IS NOT NULL AND @EndDate IS NOT NULL
						AND @BegDate BETWEEN BegDate AND EndDate AND @EndDate BETWEEN BegDate AND EndDate
			) S CROSS APPLY fnGetChildDepartment(S.DepartmentCode) P
			GROUP BY P.DepartmentCode
		)

	SELECT E.DepartmentCode, L.BegDate, L.EndDate 
	FROM tblDepWithEmp E
	INNER JOIN tblLock L ON L.DepartmentCode = E.DepartmentCode
	LEFT JOIN tblUnLock R ON R.DepartmentCode = E.DepartmentCode
	WHERE R.DepartmentCode IS NULL
	GROUP BY E.DepartmentCode, L.BegDate, L.EndDate
)
GO
/****** Object:  UserDefinedFunction [dbo].[fnGetEmployeeShifts]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[fnGetEmployeeShifts](
	@UserID NVARCHAR(20),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max)
)
returns table
as
return(
	with tblEmp as(
		SELECT EmployeeCode,ROW_NUMBER()OVER(ORDER BY EmployeeCode) AS RowIndex FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)
	)

	select A.Id,A.EmployeeCode, E.LastName+' ' + E.FirstName AS EmpName,A.WorkDate,DAY(A.WorkDate) dd,MONTH(A.WorkDate) MM,YEAR(A.WorkDate) yyyy,A.ShiftCode
	from dbo.EmployeeShifts A with(nolock)
	INNER join tblEmp B  on B.EmployeeCode=A.EmployeeCode
	LEFT JOIN dbo.Employees E with(nolock) ON E.EmployeeCode = A.EmployeeCode
	WHERE A.WorkDate BETWEEN @BegDate AND @EndDate
		AND B.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)
)

GO
/****** Object:  UserDefinedFunction [dbo].[fnGetEmpKowDays]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[fnGetEmpKowDays](
	@UserID NVARCHAR(20),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max)
)
returns table
as
return(
	with tblEmp as(
		SELECT *
		FROM (
			SELECT EmployeeCode,ROW_NUMBER()OVER(ORDER BY EmployeeCode) AS RowIndex FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)
		) S WHERE S.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)
	),
	tblKow AS (
	select A.Id,A.EmployeeCode, E.LastName+' ' + E.FirstName AS EmpName,A.WorkDay,DAY(A.WorkDay) dd,MONTH(A.WorkDay) MM,YEAR(A.WorkDay) yyyy,
		A.KowCode, A.DayNum, CASE WHEN ISNULL(E.Alt_Shift,0)=1 THEN S.ShiftCode ELSE E.ShiftCode END AS ShiftCode
	from dbo.EmpKowDays A with(nolock)
	INNER join tblEmp B  on B.EmployeeCode=A.EmployeeCode
	LEFT JOIN dbo.Employees E with(nolock) ON E.EmployeeCode = A.EmployeeCode
	LEFT JOIN dbo.EmployeeShifts S ON S.EmployeeCode = E.EmployeeCode AND S.WorkDate = A.WorkDay
	WHERE A.WorkDay BETWEEN @BegDate AND @EndDate),
	tblScanTime AS (
		SELECT S.EmployeeCode,S.WorkDate,CAST(S.In1Out0 AS INT) AS In1Out0,S.ScanTime
		FROM dbo.EmpScanTimes S WITH(NOLOCK)
		INNER join tblEmp A  on A.EmployeeCode=A.EmployeeCode
		WHERE S.WorkDate BETWEEN @BegDate AND @EndDate
	), tblInOut AS (
		SELECT P.EmployeeCode,P.WorkDate,[1] AS RI, [0] AS RO  
			FROM  
			(SELECT S.EmployeeCode,S.WorkDate,S.In1Out0,S.ScanTime  
				FROM tblScanTime S) AS SourceTable  
			PIVOT  
			(  
				max(ScanTime)  
				FOR In1Out0 IN ([0], [1])  
			) AS P
	)
	, kowds AS (
	Select A.EmployeeCode,A.EmpName,A.WorkDay, A.ShiftCode,
		Replace(Replace((Select ';' + CONVERT(NVARCHAR(10),B.DayNum) + ',' + B.KowCode
		From tblKow B Where B.EmployeeCode = A.EmployeeCode AND B.WorkDay=A.WorkDay
		ORDER BY B.KowCode For XML Path('')),'&lt;','<'),'&gt;','>') As KowCode 
	From tblKow A  
	GROUP BY A.EmployeeCode,A.EmpName,A.WorkDay, A.ShiftCode)


	SELECT K.EmployeeCode,K.EmpName,K.WorkDay, K.ShiftCode, LEFT(RIGHT(S.RI,8),5) AS RI, LEFT(RIGHT(S.RO,8),5) AS RO, K.KowCode
	FROM kowds K
	LEFT JOIN tblInOut S ON S.EmployeeCode = K.EmployeeCode AND S.WorkDate = K.WorkDay
)
GO
/****** Object:  View [dbo].[VWShiftDetail_haftDay]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[VWShiftDetail_haftDay]
as
	select S.ShiftCode, S.KowCode, L.KowType, isnull(S.WorkingHours,0)  WorkingHours, S.RealTime, S.NextDate, S.InOut, L.Ordinal,
		case when L.KowType = 3 Or L.KowType > 5 then 2 when L.KowType < 5 then 1 else 0 end as OrdinalForKowDs,
		P.TotalDays TotalDate, isnull(P.SGMC,8) as HoursPerWD,
		ROW_NUMBER() OVER(PARTITION BY S.ShiftCode ORDER BY S.NextDate, S.RealTime ASC , S.InOut DESC) as RowIndex
	from dbo.LsShiftsDetail_HaftDays S inner join dbo.LsKows L ON L.KowCode = S.KowCode
	inner JOIN dbo.LsShifts P on P.ShiftCode = S.ShiftCode
GO
/****** Object:  View [dbo].[VWShiftDetail_In_Out_haftDay]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[VWShiftDetail_In_Out_haftDay]
as
SELECT        S1.RealTime as Real_Time_In, S2.RealTime AS Real_Time_Out, S1.KowCode, S1.ShiftCode,
				(S1.NextDate - 1) NextIn, (S2.NextDate - 1) NextOut, S1.KowType, isnull(S1.WorkingHours,0) + isnull(S2.WorkingHours,0) as WorkingHours,
				S1.OrdinalForKowDs, S1.HoursPerWD
FROM 
(
	SELECT ShiftCode,NextDate,RealTime,InOut,KowCode,RowIndex as RowIn, S.KowType, S.WorkingHours,
				OrdinalForKowDs, HoursPerWD
	from VWShiftDetail_haftDay S 
	where InOut = 'SI'
) AS S1  
INNER JOIN 
(
	SELECT ShiftCode,NextDate,RealTime,InOut,KowCode,RowIndex as RowIn, S.WorkingHours
	from VWShiftDetail_haftDay S 
	where InOut = 'SO'
) AS S2 ON S1.ShiftCode = S2.ShiftCode AND S1.KowCode = S2.KowCode AND S2.RowIn - S1.RowIn = 1
GO
/****** Object:  View [dbo].[VWShiftDetail]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[VWShiftDetail]
AS
	SELECT S.ShiftCode, S.KowCode, L.KowType, ISNULL(S.WorkingHours,0)  WorkingHours, S.RealTime, S.NextDate, S.InOut, L.Ordinal,
		CASE WHEN L.KowType = 3 OR L.KowType > 5 THEN 2 WHEN L.KowType < 5 THEN 1 ELSE 0 END AS OrdinalForKowDs,
		P.TotalDays as TotalDate, ISNULL(P.SGMC,8) AS HoursPerWD, ROW_NUMBER() OVER(PARTITION BY S.ShiftCode ORDER BY S.NextDate, S.RealTime ASC , S.InOut DESC) AS RowIndex
	FROM dbo.LsShiftsDetail_FullDays S INNER JOIN dbo.LsKows L ON L.KowCode = S.KowCode
	INNER JOIN dbo.LsShifts P ON P.ShiftCode = S.ShiftCode
GO
/****** Object:  View [dbo].[VWShiftDetail_In_Out]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[VWShiftDetail_In_Out]
AS
	SELECT        S1.RealTime AS Real_Time_In, S2.RealTime AS Real_Time_Out, S1.KowCode, S1.ShiftCode,
					(S1.NextDate - 1) NextIn, (S2.NextDate - 1) NextOut, S1.KowType, ISNULL(S1.WorkingHours,0) + ISNULL(S2.WorkingHours,0) AS WorkingHours,
					S1.OrdinalForKowDs, S1.HoursPerWD, 0 AS IsCaLinhHoat, 0 AS IsNoon
	FROM 
	(
		SELECT ShiftCode,NextDate,RealTime,InOut,KowCode,RowIndex AS RowIn, S.KowType, S.WorkingHours,
					OrdinalForKowDs, HoursPerWD
		FROM VWShiftDetail S 
		WHERE InOut = 'SI'
	) AS S1  
	INNER JOIN 
	(
		SELECT ShiftCode,NextDate,RealTime,InOut,KowCode,RowIndex AS RowIn, S.WorkingHours
		FROM VWShiftDetail S 
		WHERE InOut = 'SO'
	) AS S2 ON S1.ShiftCode = S2.ShiftCode AND S1.KowCode = S2.KowCode AND S2.RowIn - S1.RowIn = 1
GO
/****** Object:  UserDefinedFunction [dbo].[fnValueListSplit]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[fnValueListSplit]
(
    @String NVARCHAR(4000),
    @Delimiter NCHAR(1)
)
RETURNS TABLE
AS
RETURN
(
    WITH Split(stpos,endpos)
    AS(
	

        SELECT 0 AS stpos, CHARINDEX(@Delimiter,@String) AS endpos
        UNION ALL
        SELECT endpos+1, CHARINDEX(@Delimiter,@String,endpos+1)
            FROM Split
            WHERE endpos > 0
			
      
    )
	Select SQL2.ID  ,SQL1.Data Value,SQL2.Data Caption from (
    SELECT  ROW_NUMBER() OVER (ORDER BY (SELECT 1)) ID,
        cast( SUBSTRING(@String,stpos,COALESCE(NULLIF(endpos,0),LEN(@String)+1)-stpos) as nvarchar) Data
    FROM Split ) SQL1 ,
	(SELECT  ROW_NUMBER() OVER (ORDER BY (SELECT 1)) ID,
         SUBSTRING(@String,stpos,COALESCE(NULLIF(endpos,0),LEN(@String)+1)-stpos) Data
    FROM Split ) SQL2
	Where SQL1.ID+1=SQL2.ID  and SQL2.ID % 2=0
)
GO
/****** Object:  View [dbo].[vwShiftDetail_KowNormal]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vwShiftDetail_KowNormal]
as
	SELECT S.ShiftCode, S.KowCode,s.RealTime,S.InOut,S.NextDate, LS.SGMC,
	ROW_NUMBER()OVER(PARTITION BY S.ShiftCode ORDER BY S.NextDate, S.RealTime) AS RowIndex , S.WorkingHours
	FROM dbo.LsShiftsDetail_FullDays S 
	LEFT JOIN dbo.LsShifts LS ON LS.ShiftCode = S.ShiftCode
	INNER JOIN dbo.LsKows L ON L.KowCode = S.KowCode WHERE L.KowType IN (1,3)
GO
/****** Object:  View [dbo].[VWShiftDetail_Normal_haftDay]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VWShiftDetail_Normal_haftDay]
as
	SELECT S.ShiftCode,s.RealTime,S.InOut,S.NextDate, ROW_NUMBER()OVER(PARTITION BY S.ShiftCode ORDER BY S.NextDate, S.RealTime) AS RowIndex ,
				S.KowCode, LS.SGMC, S.WorkingHours
	FROM dbo.LsShiftsDetail_HaftDays S 
	LEFT JOIN dbo.LsShifts LS ON LS.ShiftCode = S.ShiftCode
	INNER JOIN dbo.LsKows L ON L.KowCode = S.KowCode WHERE L.KowType IN (1,3)
GO
ALTER TABLE [dbo].[Departments] ADD  CONSTRAINT [DF_HCSSYS_Departments_Level]  DEFAULT ((0)) FOR [Level]
GO
ALTER TABLE [dbo].[Departments] ADD  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[Departments] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Departments] ADD  DEFAULT (N'admin') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmpKowDays] ADD  CONSTRAINT [DF_EmpKowDays_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[EmpKowDays] ADD  CONSTRAINT [DF_EmpKowDays_IsPay]  DEFAULT ((0)) FOR [IsPay]
GO
ALTER TABLE [dbo].[EmpKowDays] ADD  CONSTRAINT [DF_EmpKowDays_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpKowDays] ADD  CONSTRAINT [DF_EmpKowDays_CreatedBy]  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmpKowDays] ADD  CONSTRAINT [DF_EmpKowDays_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmpKowDays_Layer] ADD  CONSTRAINT [DF_EmpKowDays_Layer_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[EmpKowDays_Layer] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpKowDays_Layer] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmpKowDays_Layer] ADD  DEFAULT ((0)) FOR [Layer]
GO
ALTER TABLE [dbo].[EmpKowDsLastPayroll] ADD  CONSTRAINT [DF__HCSTS_Kow__DayNu__5267570C]  DEFAULT ((0)) FOR [DayNum]
GO
ALTER TABLE [dbo].[EmpKowDsLastPayroll] ADD  CONSTRAINT [DF__HCSTS_Kow__IsNoo__535B7B45]  DEFAULT ((0)) FOR [IsNoon]
GO
ALTER TABLE [dbo].[EmpKowDsLastPayroll] ADD  CONSTRAINT [DF_EmpKowDsLastPayroll_Ordinal]  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[EmpKowDsLastPayroll] ADD  CONSTRAINT [DF__HCSTS_Kow__Creat__5543C3B7]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpKowDsLastPayroll] ADD  CONSTRAINT [DF__HCSTS_Kow__Creat__5637E7F0]  DEFAULT ('admin') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmpKowDsLastPayroll] ADD  CONSTRAINT [DF__HCSTS_Kow__IsChe__73170896]  DEFAULT ((0)) FOR [IsCheckedPay]
GO
ALTER TABLE [dbo].[EmpKowLateEarly] ADD  CONSTRAINT [DF_HCSPR_KowLateEarly_EmployeeID]  DEFAULT ((0)) FOR [EmployeeCode]
GO
ALTER TABLE [dbo].[EmpKowLateEarly] ADD  CONSTRAINT [DF_HCSPR_KowLateEarly_Dow_ID]  DEFAULT ((0)) FOR [DowCode]
GO
ALTER TABLE [dbo].[EmpKowLateEarly] ADD  CONSTRAINT [DF_HCSPR_KowLateEarly_Early]  DEFAULT ((0)) FOR [TimeInEarly]
GO
ALTER TABLE [dbo].[EmpKowLateEarly] ADD  CONSTRAINT [DF_HCSPR_KowLateEarly_Late]  DEFAULT ((0)) FOR [TimeInLate]
GO
ALTER TABLE [dbo].[EmpKowLateEarly] ADD  CONSTRAINT [DF_HCSPR_KowLateEarly_EarTime]  DEFAULT ((0)) FOR [TimeOutEarly]
GO
ALTER TABLE [dbo].[EmpKowLateEarly] ADD  CONSTRAINT [DF_HCSPR_KowLateEarly_LateTime]  DEFAULT ((0)) FOR [TimeOutLate]
GO
ALTER TABLE [dbo].[EmpKowLateEarly] ADD  CONSTRAINT [DF_HCSPR_KowLateEarly_EarTimeS]  DEFAULT ((0)) FOR [TimeOutEarlyS]
GO
ALTER TABLE [dbo].[EmpKowLateEarly] ADD  CONSTRAINT [DF_HCSPR_KowLateEarly_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpKowLateEarly] ADD  CONSTRAINT [DF_HCSPR_KowLateEarly_CreatedBy]  DEFAULT ('application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmpKowLateEarly_sub] ADD  CONSTRAINT [DF__HCSTS_Kow__Emplo__3C9C6138]  DEFAULT ((0)) FOR [EmployeeCode]
GO
ALTER TABLE [dbo].[EmpKowLateEarly_sub] ADD  CONSTRAINT [DF__HCSTS_KowL__Late__3D908571]  DEFAULT ((0)) FOR [Late]
GO
ALTER TABLE [dbo].[EmpKowLateEarly_sub] ADD  CONSTRAINT [DF__HCSTS_Kow__Early__3E84A9AA]  DEFAULT ((0)) FOR [Early]
GO
ALTER TABLE [dbo].[EmpKowLateEarly_sub] ADD  CONSTRAINT [DF__HCSTS_Kow__Creat__3F78CDE3]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpKowLateEarly_sub] ADD  CONSTRAINT [DF__HCSTS_Kow__Creat__406CF21C]  DEFAULT ('application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmployeeAllowances] ADD  CONSTRAINT [DF_EmployeeAllowances_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmployeeDayOffs] ADD  CONSTRAINT [DF_EmployeeDayOffs_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[EmployeeDayOffs] ADD  CONSTRAINT [DF_EmployeeDayOffs_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmployeeDayOffs] ADD  CONSTRAINT [DF_EmployeeDayOffs_IsSubHoliday]  DEFAULT ((0)) FOR [IsSubHoliday]
GO
ALTER TABLE [dbo].[EmployeeDayOffs] ADD  CONSTRAINT [DF_EmployeeDayOffs_IsSubWeek]  DEFAULT ((0)) FOR [IsSubWeek]
GO
ALTER TABLE [dbo].[EmployeeDayOffs] ADD  CONSTRAINT [DF_EmployeeDayOffs_IsSubSunday]  DEFAULT ((0)) FOR [IsSubSunday]
GO
ALTER TABLE [dbo].[EmployeeDayOffs] ADD  CONSTRAINT [DF_EmployeeDayOffs_DayNum_SubHoliday]  DEFAULT ((0)) FOR [DayNum_SubHoliday]
GO
ALTER TABLE [dbo].[EmployeeDayOffs] ADD  CONSTRAINT [DF_EmployeeDayOffs_DayNum_SubWeek]  DEFAULT ((0)) FOR [DayNum_SubWeek]
GO
ALTER TABLE [dbo].[EmployeeDayOffs] ADD  CONSTRAINT [DF_EmployeeDayOffs_DayNum_SubSunDay]  DEFAULT ((0)) FOR [DayNum_SubSunDay]
GO
ALTER TABLE [dbo].[EmployeeDayOffs] ADD  CONSTRAINT [DF_EmployeeDayOffs_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmployeeDayOffs_detailDay] ADD  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[EmployeeDayOffs_detailDay] ADD  DEFAULT ((0)) FOR [IsRemainCalKowds]
GO
ALTER TABLE [dbo].[EmployeeDependants] ADD  CONSTRAINT [DF_EmployeeDependants_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[EmployeeDependants] ADD  CONSTRAINT [DF_EmployeeDependants_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmployeeDependants] ADD  CONSTRAINT [DF_EmployeeDependants_IsSub]  DEFAULT ((0)) FOR [IsSub]
GO
ALTER TABLE [dbo].[EmployeeFilters] ADD  CONSTRAINT [DF__EmployeeF__Creat__1D66518C]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmployeeFilters] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__JoinD__59D0414E]  DEFAULT (getdate()) FOR [JoinDate]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__Gende__5AC46587]  DEFAULT ((1)) FOR [Gender]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF_BS_Employees_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__LastE__57E7F8DC]  DEFAULT (getutcdate()) FOR [LastEditDate]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__Creat__58DC1D15]  DEFAULT (getutcdate()) FOR [CreationDate]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__IsSI__5BB889C0]  DEFAULT ((1)) FOR [IsSI]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__IsMI__5CACADF9]  DEFAULT ((1)) FOR [IsMI]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__IsUne__5DA0D232]  DEFAULT ((1)) FOR [IsUnemployed]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__Alt_S__5E94F66B]  DEFAULT ((0)) FOR [Alt_Shift]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__IsSca__5F891AA4]  DEFAULT ((0)) FOR [IsScan]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__IsNot__607D3EDD]  DEFAULT ((0)) FOR [IsNotLateEarly]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__Leave__61716316]  DEFAULT ((0)) FOR [LeavePeriod]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__IsPri__6265874F]  DEFAULT ((0)) FOR [IsPrivateSiRate]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__IsPri__6359AB88]  DEFAULT ((0)) FOR [IsPrivateMiRate]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF__Employees__IsPri__644DCFC1]  DEFAULT ((0)) FOR [IsPrivateUnRate]
GO
ALTER TABLE [dbo].[Employees] ADD  DEFAULT ((0)) FOR [IsNotScan]
GO
ALTER TABLE [dbo].[Employees] ADD  DEFAULT ((0)) FOR [IsNotOTKow]
GO
ALTER TABLE [dbo].[EmployeeShifts] ADD  CONSTRAINT [DF_EmployeeShifts_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[EmployeeShifts] ADD  CONSTRAINT [DF_EmployeeShifts_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmployeeShifts] ADD  CONSTRAINT [DF_EmployeeShifts_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmployeeShifts_tmp] ADD  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[EmployeeShifts_tmp] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmployeeShifts_tmp] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmployeeShifts_tmp] ADD  DEFAULT ((0)) FOR [IsSelected]
GO
ALTER TABLE [dbo].[EmployeeWeekOffs_tmp] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmployeeWeekOffs_tmp] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmployeeWeekOffs_tmp] ADD  DEFAULT ((0)) FOR [IsSelected]
GO
ALTER TABLE [dbo].[EmpOverTimeReg] ADD  CONSTRAINT [DF__EmpOverTimeR__ID__5AB9788F]  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[EmpOverTimeReg] ADD  CONSTRAINT [DF__EmpOverTi__HourN__5BAD9CC8]  DEFAULT ((0)) FOR [HourNum]
GO
ALTER TABLE [dbo].[EmpOverTimeReg] ADD  CONSTRAINT [DF__EmpOverTi__Creat__5CA1C101]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpOverTimeReg] ADD  CONSTRAINT [DF__EmpOverTi__Creat__5D95E53A]  DEFAULT ('application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmpOverTimeReg_tmp] ADD  CONSTRAINT [DF__EmpOverTimeR__ID__711DBAFA]  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[EmpOverTimeReg_tmp] ADD  CONSTRAINT [DF__EmpOverTi__HourN__7211DF33]  DEFAULT ((0)) FOR [HourNum]
GO
ALTER TABLE [dbo].[EmpOverTimeReg_tmp] ADD  CONSTRAINT [DF__EmpOverTi__Creat__7306036C]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpOverTimeReg_tmp] ADD  CONSTRAINT [DF__EmpOverTi__Creat__73FA27A5]  DEFAULT ('application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmpOverTimeReg_tmp] ADD  DEFAULT ((0)) FOR [IsSelected]
GO
ALTER TABLE [dbo].[EmpRegisterExtraWorkDay] ADD  CONSTRAINT [DF__HCSTS_Reg__HourN__3B83E956]  DEFAULT ((0)) FOR [HourNum]
GO
ALTER TABLE [dbo].[EmpRegisterExtraWorkDay] ADD  CONSTRAINT [DF__HCSTS_Reg__Creat__3C780D8F]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpRegisterExtraWorkDay] ADD  CONSTRAINT [DF__HCSTS_Reg__Creat__3D6C31C8]  DEFAULT ('application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmpRegLateEarly] ADD  CONSTRAINT [DF_Table_1_HourNumF]  DEFAULT ((0)) FOR [LateIn]
GO
ALTER TABLE [dbo].[EmpRegLateEarly] ADD  CONSTRAINT [DF_Table_1_HourNumL]  DEFAULT ((0)) FOR [EarlyOut]
GO
ALTER TABLE [dbo].[EmpRegLateEarly] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpRegLateEarly] ADD  DEFAULT ('application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmpRegLateEarly] ADD  CONSTRAINT [DF_HCSTS_RegisterLateEarly_Kind]  DEFAULT ((0)) FOR [Kind]
GO
ALTER TABLE [dbo].[EmpRegLateEarly] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[EmpRegLateEarly_tmp] ADD  DEFAULT ((0)) FOR [LateIn]
GO
ALTER TABLE [dbo].[EmpRegLateEarly_tmp] ADD  DEFAULT ((0)) FOR [EarlyOut]
GO
ALTER TABLE [dbo].[EmpRegLateEarly_tmp] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpRegLateEarly_tmp] ADD  DEFAULT ('application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[EmpRegLateEarly_tmp] ADD  DEFAULT ((0)) FOR [Kind]
GO
ALTER TABLE [dbo].[EmpRegLateEarly_tmp] ADD  DEFAULT ((0)) FOR [IsSelected]
GO
ALTER TABLE [dbo].[EmpRegLateEarly_tmp] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[EmpScanCodes] ADD  CONSTRAINT [DF_EmpScanCodes_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[EmpScanCodes] ADD  CONSTRAINT [DF_EmpScanCodes_RecID]  DEFAULT (newid()) FOR [RecID]
GO
ALTER TABLE [dbo].[EmpScanCodes] ADD  CONSTRAINT [DF_EmpScanCodes_In1Out0]  DEFAULT ((0)) FOR [In1Out0]
GO
ALTER TABLE [dbo].[EmpScanCodes] ADD  CONSTRAINT [DF_EmpScanCodes_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpScanCodes] ADD  CONSTRAINT [DF_EmpScanCodes_IsManual]  DEFAULT ((0)) FOR [IsManual]
GO
ALTER TABLE [dbo].[EmpScanCodes] ADD  CONSTRAINT [DF_EmpScanCodes_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmpScanTimes] ADD  CONSTRAINT [DF_EmpScanTimes_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[EmpScanTimes] ADD  CONSTRAINT [DF_EmpScanTimes_RecID]  DEFAULT (newid()) FOR [RecID]
GO
ALTER TABLE [dbo].[EmpScanTimes] ADD  CONSTRAINT [DF_EmpScanTimes_In1Out0]  DEFAULT ((0)) FOR [In1Out0]
GO
ALTER TABLE [dbo].[EmpScanTimes] ADD  CONSTRAINT [DF_EmpScanTimes_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpScanTimes] ADD  CONSTRAINT [DF_EmpScanTimes_IsManual]  DEFAULT ((0)) FOR [IsManual]
GO
ALTER TABLE [dbo].[EmpScanTimes] ADD  CONSTRAINT [DF_EmpScanTimes_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[LsAcadame] ADD  CONSTRAINT [DF_HCSLS_Acadames_Range]  DEFAULT ((0)) FOR [Range]
GO
ALTER TABLE [dbo].[LsAcadame] ADD  CONSTRAINT [DF_HCSLS_Acadames_Ordinal]  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsAcadame] ADD  CONSTRAINT [DF_HCSLS_Acadames_IsFix]  DEFAULT ((0)) FOR [IsFix]
GO
ALTER TABLE [dbo].[LsAcadame] ADD  CONSTRAINT [DF_HCSLS_Acadame_BeginDateCal]  DEFAULT ((0)) FOR [BeginDateCal]
GO
ALTER TABLE [dbo].[LsAcadame] ADD  CONSTRAINT [DF_HCSLS_Acadames_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsAcadame] ADD  CONSTRAINT [DF_HCSLS_Acadames_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrades_KindAllo]  DEFAULT ((1)) FOR [AlloType]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsMonthAmount]  DEFAULT ((0)) FOR [IsMonthAmount]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsLawSalary]  DEFAULT ((0)) FOR [IsLawSalary]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsInPayroll]  DEFAULT ((0)) FOR [IsInPayroll]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsManual]  DEFAULT ((0)) FOR [IsManual]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsNotInUnitPrice]  DEFAULT ((0)) FOR [IsNotInUnitPrice]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsSI]  DEFAULT ((0)) FOR [IsSI]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsHI]  DEFAULT ((0)) FOR [IsHI]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsUI]  DEFAULT ((0)) FOR [IsUI]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrades_CFix]  DEFAULT ((0)) FOR [IsFixAmount]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_FixAmount]  DEFAULT ((0)) FOR [FixAmount]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_SalaryType]  DEFAULT ((1)) FOR [SalaryType]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_SalaryInclude]  DEFAULT ((0)) FOR [SalaryInclude]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_SalaryRate]  DEFAULT ((0)) FOR [SalaryRate]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsCumulative]  DEFAULT ((0)) FOR [IsCumulative]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrades_CKow]  DEFAULT ((0)) FOR [KowRule]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_KowRuleMinDay]  DEFAULT ((0)) FOR [KowRuleMinDay]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrades_IsminMonth]  DEFAULT ((1)) FOR [IsKowRuleMonth]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsKowRuleHour]  DEFAULT ((0)) FOR [IsKowRuleHour]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsKowRuleByCoeff]  DEFAULT ((0)) FOR [IsByCoeffKow]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsByCoeffKow1]  DEFAULT ((0)) FOR [IsByShift]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrades_CTax]  DEFAULT ((0)) FOR [TaxType]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrades_SeniorBasedOn]  DEFAULT ((1)) FOR [BeginDateCal]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_TaxFreeAmount]  DEFAULT ((0)) FOR [TaxFreeAmount]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsInTaxableIncome]  DEFAULT ((0)) FOR [IsInTaxableIncome]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsNotInHouseAllo]  DEFAULT ((0)) FOR [IsNotInHouseAllo]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsEnterAccount]  DEFAULT ((0)) FOR [IsEnterAccount]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsByLevel]  DEFAULT ((0)) FOR [IsByDetailLevel]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsUserFormula]  DEFAULT ((0)) FOR [IsUserFormula]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsAllo1]  DEFAULT ((0)) FOR [IsAllo1]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsAllo2]  DEFAULT ((0)) FOR [IsAllo2]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsAllo3]  DEFAULT ((0)) FOR [IsAllo3]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsAllo4]  DEFAULT ((0)) FOR [IsAllo4]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsAllo5]  DEFAULT ((0)) FOR [IsAllo5]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrades_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrades_Ordinal]  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrades_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_CreatedBy]  DEFAULT ('admin') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsAlloGrade] ADD  CONSTRAINT [DF_LsAlloGrade_IsTaxFreeAmountByYear]  DEFAULT ((0)) FOR [IsTaxFreeAmountByYear]
GO
ALTER TABLE [dbo].[LsBank] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[LsBank] ADD  CONSTRAINT [DF_LsBank_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsBank] ADD  CONSTRAINT [DF_HCSLS_Banks_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsBank] ADD  CONSTRAINT [DF_LsBank_CreatedBy]  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsCertificate] ADD  CONSTRAINT [DF_HCSLS_Certificates_Ordinal]  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsCertificate] ADD  CONSTRAINT [DF_HCSLS_Certificates_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsCertificate] ADD  CONSTRAINT [DF_HCSLS_Certificates_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsContractType] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[LsContractType] ADD  DEFAULT ((0)) FOR [GroupType]
GO
ALTER TABLE [dbo].[LsContractType] ADD  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsContractType] ADD  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsContractType] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsContractType] ADD  CONSTRAINT [DF_LsContractType_CreatedBy]  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsContractTypeTime] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[LsContractTypeTime] ADD  DEFAULT ((0)) FOR [IsDay]
GO
ALTER TABLE [dbo].[LsContractTypeTime] ADD  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsContractTypeTime] ADD  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsContractTypeTime] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsCurrency] ADD  CONSTRAINT [DF_LsCurrency_Multiply]  DEFAULT ((0)) FOR [Multiply]
GO
ALTER TABLE [dbo].[LsCurrency] ADD  CONSTRAINT [DF_HCSLS_Currencies_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsDistrict] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[LsDistrict] ADD  CONSTRAINT [DF_HCSLS_District_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsDistrict] ADD  CONSTRAINT [DF_HCSLS_Districts_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsDistrict] ADD  CONSTRAINT [DF_LsDistrict_CreatedBy]  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsDowLists] ADD  CONSTRAINT [DF_LsDowLists_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[LsDowLists] ADD  CONSTRAINT [DF_LsDowLists_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsDowLists] ADD  CONSTRAINT [DF_LsDowLists_CreatedBy]  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsEthnic] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[LsEthnic] ADD  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsEthnic] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsGroupCertificate] ADD  CONSTRAINT [DF_HCSLS_GroupCertificate_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsGroupCertificate] ADD  CONSTRAINT [DF_HCSLS_Groupcertificates_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsGroupsalary] ADD  CONSTRAINT [DF_LsGroupsalarys_GroupID]  DEFAULT ((0)) FOR [GroupType]
GO
ALTER TABLE [dbo].[LsGroupsalary] ADD  CONSTRAINT [DF_LsGroupsalarys_IsUserFomular]  DEFAULT ((0)) FOR [IsUserFormula]
GO
ALTER TABLE [dbo].[LsGroupsalary] ADD  CONSTRAINT [DF_LsGroupsalary_SFundLevel]  DEFAULT ((0)) FOR [FormulaLevel]
GO
ALTER TABLE [dbo].[LsGroupsalary] ADD  CONSTRAINT [DF_LsGroupsalarys_Ordinal]  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsGroupsalary] ADD  CONSTRAINT [DF_LsGroupsalarys_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsGroupsalary] ADD  CONSTRAINT [DF_LsGroupsalarys_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsGroupsalary] ADD  CONSTRAINT [DF__HCSLS_Gro__IsGro__502CF3B5]  DEFAULT ((0)) FOR [IsGrossupNotSocialIns]
GO
ALTER TABLE [dbo].[LsHospital] ADD  CONSTRAINT [DF_LsHospital_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsHospital] ADD  CONSTRAINT [DF_LsHospitals_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF_LsInsurances_Ordinal]  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF_LsInsurances_InsType]  DEFAULT ((1)) FOR [InsType]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF_LsInsurances_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF_LsInsurances_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF_LsInsurance_RateEmp]  DEFAULT ((0)) FOR [RateEmp]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF_LsInsurance_RateCo]  DEFAULT ((0)) FOR [RateCo]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF__HCSLS_Ins__IsDef__71E787D9]  DEFAULT ((0)) FOR [IsDefault]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF__HCSLS_Ins__Basic__455A5F87]  DEFAULT ((0)) FOR [BasicSalary]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF__HCSLS_Ins__Basic__464E83C0]  DEFAULT ((0)) FOR [BasicSalary1]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF__HCSLS_Ins__Basic__4742A7F9]  DEFAULT ((0)) FOR [BasicSalary2]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF__HCSLS_Ins__Basic__4836CC32]  DEFAULT ((0)) FOR [BasicSalary3]
GO
ALTER TABLE [dbo].[LsInsurance] ADD  CONSTRAINT [DF__HCSLS_Ins__Basic__492AF06B]  DEFAULT ((0)) FOR [BasicSalary4]
GO
ALTER TABLE [dbo].[lsJobWorking] ADD  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[lsJobWorking] ADD  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[lsJobWorking] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsKows] ADD  CONSTRAINT [DF_LsKows_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[LsKows] ADD  CONSTRAINT [DF_LsKows_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsKows] ADD  CONSTRAINT [DF_LsKows_CreatedBy]  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsKows] ADD  CONSTRAINT [DF_LsKows_Ratio_Company]  DEFAULT ((0)) FOR [Ratio_Company]
GO
ALTER TABLE [dbo].[LsKows] ADD  CONSTRAINT [DF_LsKows_Ratio_Si]  DEFAULT ((0)) FOR [Ratio_Si]
GO
ALTER TABLE [dbo].[LsKows] ADD  CONSTRAINT [DF_LsKows_IsSubHoliday]  DEFAULT ((0)) FOR [IsSubHoliday]
GO
ALTER TABLE [dbo].[LsKows] ADD  CONSTRAINT [DF_LsKows_IsSubWeek]  DEFAULT ((0)) FOR [IsSubWeek]
GO
ALTER TABLE [dbo].[LsKows] ADD  CONSTRAINT [DF_LsKows_IsSubSunDay]  DEFAULT ((0)) FOR [IsSubSunDay]
GO
ALTER TABLE [dbo].[LsKows] ADD  CONSTRAINT [DF_LsKows_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[lsLeaveGroups] ADD  CONSTRAINT [DF_lsLeaveGroups_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[lsLeaveGroups] ADD  CONSTRAINT [DF_lsLeaveGroups_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[lsLeaveGroups] ADD  CONSTRAINT [DF_lsLeaveGroups_CreatedBy]  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[lsLeaveGroups] ADD  CONSTRAINT [DF_lsLeaveGroups_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[LsNation] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[LsNation] ADD  CONSTRAINT [DF_LsNation_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsNation] ADD  CONSTRAINT [DF_HCSLS_Nations_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsNation] ADD  CONSTRAINT [DF_LsNation_CreatedBy]  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsPosition] ADD  CONSTRAINT [DF_HCSLS_Positions_ManLevel]  DEFAULT ((0)) FOR [ManLevel]
GO
ALTER TABLE [dbo].[LsPosition] ADD  CONSTRAINT [DF_HCSLS_Positions_Ordinal]  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsPosition] ADD  CONSTRAINT [DF_HCSLS_Positions_IsFix]  DEFAULT ((0)) FOR [IsFix]
GO
ALTER TABLE [dbo].[LsPosition] ADD  CONSTRAINT [DF_HCSLS_Positions_Coeff]  DEFAULT ((0)) FOR [Coeff]
GO
ALTER TABLE [dbo].[LsPosition] ADD  CONSTRAINT [DF_HCSLS_Positions_BeginDateCal]  DEFAULT ((0)) FOR [BeginDateCal]
GO
ALTER TABLE [dbo].[LsPosition] ADD  CONSTRAINT [DF_HCSLS_Positions_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsPosition] ADD  CONSTRAINT [DF_HCSLS_Positions_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsProvince] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[LsProvince] ADD  CONSTRAINT [DF_HCSLS_Province_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsProvince] ADD  CONSTRAINT [DF_HCSLS_Provinces_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsProvince] ADD  CONSTRAINT [DF_LsProvince_CreatedBy]  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsRegion] ADD  CONSTRAINT [DF_HCSLS_Region_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsRegion] ADD  CONSTRAINT [DF_HCSLS_Regions_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsRelationship] ADD  CONSTRAINT [DF_LsRelationship_IsMarital]  DEFAULT ((0)) FOR [IsMarital]
GO
ALTER TABLE [dbo].[LsRelationship] ADD  CONSTRAINT [DF_LsRelationship_IsChildren]  DEFAULT ((0)) FOR [IsChildren]
GO
ALTER TABLE [dbo].[LsRelationship] ADD  CONSTRAINT [DF_LsRelationship_IsParent]  DEFAULT ((0)) FOR [IsParent]
GO
ALTER TABLE [dbo].[LsRelationship] ADD  CONSTRAINT [DF_LsRelationship_IsParentinlaw]  DEFAULT ((0)) FOR [IsParentinlaw]
GO
ALTER TABLE [dbo].[LsRelationship] ADD  CONSTRAINT [DF_LsRelationship_IsOther]  DEFAULT ((0)) FOR [IsOther]
GO
ALTER TABLE [dbo].[LsRelationship] ADD  CONSTRAINT [DF_LsRelationship_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsRelationship] ADD  CONSTRAINT [DF_LsRelationship_IsIncentives]  DEFAULT ((0)) FOR [IsIncentives]
GO
ALTER TABLE [dbo].[LsRelationship] ADD  CONSTRAINT [DF_LsRelationships_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsRelationship] ADD  CONSTRAINT [DF_LsRelationship_CreatedBy]  DEFAULT ('admin') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsReligion] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[LsReligion] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsShiftPeriod] ADD  CONSTRAINT [DF_LsShiftPeriods_PeriodType]  DEFAULT ((0)) FOR [PeriodType]
GO
ALTER TABLE [dbo].[LsShiftPeriod] ADD  CONSTRAINT [DF_LsShiftPeriods_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsShiftPeriod] ADD  CONSTRAINT [DF_LsShiftPeriods_Ordinal]  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsShiftPeriod] ADD  CONSTRAINT [DF_LsShiftPeriods_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsShiftPeriod] ADD  CONSTRAINT [DF_LsShiftPeriods_CreatedBy]  DEFAULT (N'Admin') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsShiftperioddetail] ADD  CONSTRAINT [DF_LsShiftperioddetails_DateOrder]  DEFAULT ((0)) FOR [DateOrder]
GO
ALTER TABLE [dbo].[LsShiftperioddetail] ADD  CONSTRAINT [DF_LsShiftperioddetails_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsShiftperioddetail] ADD  CONSTRAINT [DF_LsShiftperioddetails_CreatedBy]  DEFAULT (N'Admin') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsShifts] ADD  CONSTRAINT [DF_LsShifts_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[LsShifts] ADD  CONSTRAINT [DF_LsShifts_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsShifts] ADD  CONSTRAINT [DF_LsShifts_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[LsShifts] ADD  CONSTRAINT [DF_LsShifts_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[LsShifts] ADD  DEFAULT ((0)) FOR [IsLock]
GO
ALTER TABLE [dbo].[LsShiftsDetail_FullDays] ADD  CONSTRAINT [DF_LsShiftsDetail_FullDays_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[LsShiftsDetail_FullDays] ADD  CONSTRAINT [DF_LsShiftsDetail_FullDays_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[LsShiftsDetail_FullDays] ADD  CONSTRAINT [DF_LsShiftsDetail_FullDays_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[LsUnit] ADD  CONSTRAINT [DF_LsUnit_DataType]  DEFAULT ((1)) FOR [DataType]
GO
ALTER TABLE [dbo].[LsUnit] ADD  CONSTRAINT [DF__HCSLS_Uni__Ordin__70698DE3]  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[LsUnit] ADD  CONSTRAINT [DF__LsUnit__Lock__715DB21C]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsUnit] ADD  CONSTRAINT [DF_LsUnits_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[lsVacationGroup] ADD  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[lsVacationGroup] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[lsVacationGroup] ADD  DEFAULT (N'app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[LsWard] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[LsWard] ADD  CONSTRAINT [DF_HCSLS_Ward_Lock]  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[LsWard] ADD  CONSTRAINT [DF_HCSLS_Ward_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SYS_DataDomain_Roles] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SYS_DataDomainDetails] ADD  DEFAULT ('') FOR [Owner]
GO
ALTER TABLE [dbo].[SYS_DataDomainDetails] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SYS_DataDomains] ADD  DEFAULT ((0)) FOR [AccessMode]
GO
ALTER TABLE [dbo].[SYS_DataDomains] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SYS_FunctionList] ADD  CONSTRAINT [DF__SYS_Funct__IsAct__18F6A22A]  DEFAULT ((0)) FOR [IsActive]
GO
ALTER TABLE [dbo].[SYS_FunctionList] ADD  CONSTRAINT [DF__SYS_Funct__Creat__19EAC663]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SYS_FunctionList] ADD  CONSTRAINT [DF__SYS_Funct__Creat__1ADEEA9C]  DEFAULT (N'application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[SYS_FunctionListLabel] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SYS_FunctionListLabel] ADD  DEFAULT (N'application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[SYS_Modules] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SYS_Modules] ADD  DEFAULT ('app') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[SYS_Modules] ADD  DEFAULT ((0)) FOR [IsActive]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT ((0)) FOR [View]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT ((0)) FOR [Add]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT ((0)) FOR [Delete]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT ((0)) FOR [Export]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT ((0)) FOR [Import]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT ((0)) FOR [Upload]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT ((0)) FOR [Download]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT ((0)) FOR [Copy]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT ((0)) FOR [Print]
GO
ALTER TABLE [dbo].[SYS_Permissions] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[sys_Roles] ADD  DEFAULT (newid()) FOR [RecID]
GO
ALTER TABLE [dbo].[sys_Roles] ADD  DEFAULT ('1') FOR [RoleType]
GO
ALTER TABLE [dbo].[sys_Roles] ADD  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[sys_Roles] ADD  DEFAULT ((0)) FOR [IsSystem]
GO
ALTER TABLE [dbo].[sys_Roles] ADD  DEFAULT ((0)) FOR [IsAdmin]
GO
ALTER TABLE [dbo].[sys_Roles] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[sys_Roles] ADD  DEFAULT ((0)) FOR [IsEmpGroup]
GO
ALTER TABLE [dbo].[sys_UserRoles] ADD  DEFAULT (newsequentialid()) FOR [RecID]
GO
ALTER TABLE [dbo].[sys_UserRoles] ADD  DEFAULT ((0)) FOR [Ordinal]
GO
ALTER TABLE [dbo].[sys_UserRoles] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[sys_Users] ADD  DEFAULT (newsequentialid()) FOR [RecID]
GO
ALTER TABLE [dbo].[sys_Users] ADD  DEFAULT ((0)) FOR [IsSystem]
GO
ALTER TABLE [dbo].[sys_Users] ADD  DEFAULT ((0)) FOR [IsAdmin]
GO
ALTER TABLE [dbo].[sys_Users] ADD  DEFAULT ((0)) FOR [NeverExpire]
GO
ALTER TABLE [dbo].[sys_Users] ADD  DEFAULT ((0)) FOR [FirstChange]
GO
ALTER TABLE [dbo].[sys_Users] ADD  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[sys_Users] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSDec__01F5A346]  DEFAULT ((0)) FOR [TSDecPlaceWD]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSDec__02E9C77F]  DEFAULT ((0)) FOR [TSDecPlaceLateEarly]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsO__03DDEBB8]  DEFAULT ((0)) FOR [TSIsOTByHour]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsN__04D20FF1]  DEFAULT ((0)) FOR [TSIsNightByHour]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsN__05C6342A]  DEFAULT ((0)) FOR [TSIsNextDayOfNightShift]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsR__06BA5863]  DEFAULT ((0)) FOR [TSIsRoundingFinalDigit]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsI__07AE7C9C]  DEFAULT ((0)) FOR [TSIsImportTimeSheetByTime]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSNot__08A2A0D5]  DEFAULT ((0)) FOR [TSNotALIfStopBeforeDay]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSMax__0996C50E]  DEFAULT ((0)) FOR [TSMaxOTHourPerD]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSMax__0A8AE947]  DEFAULT ((0)) FOR [TSMaxOTHourPerW]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSMax__0B7F0D80]  DEFAULT ((0)) FOR [TSMaxOTHourPerM]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSMax__0C7331B9]  DEFAULT ((0)) FOR [TSMaxOTHourPerY]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSMax__0D6755F2]  DEFAULT ((0)) FOR [TSMaxChildSickLeavePerY]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSSta__0E5B7A2B]  DEFAULT ((0)) FOR [TSStandardWDOfOT]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsE__0F4F9E64]  DEFAULT ((0)) FOR [TSIsExactKowOnHoliday]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsS__1043C29D]  DEFAULT ((0)) FOR [TSIsSubLateEarlyOnHoliday]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsC__1137E6D6]  DEFAULT ((0)) FOR [TSIsChangeHoursPerWDByShift]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSHou__122C0B0F]  DEFAULT ((0)) FOR [TSHoursPerWD]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsH__13202F48]  DEFAULT ((0)) FOR [TSIsHoursPerWDChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSSys__14145381]  DEFAULT ('') FOR [TSSysVacationTypeCode]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsS__150877BA]  DEFAULT ((0)) FOR [TSIsSysVacationTypeChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSWLe__15FC9BF3]  DEFAULT ('') FOR [TSWLeaveDayCode]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsW__16F0C02C]  DEFAULT ((0)) FOR [TSIsWLeaveDayChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsS__17E4E465]  DEFAULT ((0)) FOR [TSIsStandardWDChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsC__18D9089E]  DEFAULT ((0)) FOR [TSIsCKowUseFund]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSCKo__19CD2CD7]  DEFAULT ((0)) FOR [TSCKowBy]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsE__1AC15110]  DEFAULT ((0)) FOR [TSIsExpireStandardAL]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsO__1BB57549]  DEFAULT ((0)) FOR [TSIsOTHourAllowByLaw]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSOTH__1CA99982]  DEFAULT ((0)) FOR [TSOTHourAllowByLaw]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSHou__1D9DBDBB]  DEFAULT ((0)) FOR [TSHoursPerWDChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSSys__1E91E1F4]  DEFAULT ((0)) FOR [TSSysVacationTypeChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSWLe__1F86062D]  DEFAULT ((0)) FOR [TSWLeaveDayChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSSta__207A2A66]  DEFAULT ((0)) FOR [TSStandardWDChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsL__216E4E9F]  DEFAULT ((0)) FOR [TSIsLate]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsL__226272D8]  DEFAULT ((0)) FOR [TSIsLateChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSLat__23569711]  DEFAULT ((0)) FOR [TSLateChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsE__244ABB4A]  DEFAULT ((0)) FOR [TSIsEarly]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsE__253EDF83]  DEFAULT ((0)) FOR [TSIsEarlyChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSEar__263303BC]  DEFAULT ((0)) FOR [TSEarlyChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsW__272727F5]  DEFAULT ((0)) FOR [TSIsWLeaveNight]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsW__281B4C2E]  DEFAULT ((0)) FOR [TSIsWLeaveRegOT]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsW__290F7067]  DEFAULT ((0)) FOR [TSIsWLeaveChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSWLe__2A0394A0]  DEFAULT ((0)) FOR [TSWLeaveChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsH__2AF7B8D9]  DEFAULT ((0)) FOR [TSIsHolidayNight]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsH__2BEBDD12]  DEFAULT ((0)) FOR [TSIsHolidayRegOT]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsH__2CE0014B]  DEFAULT ((0)) FOR [TSIsHolidayKow]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSHol__2DD42584]  DEFAULT ('') FOR [TSHolidayKowCode]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsH__2EC849BD]  DEFAULT ((0)) FOR [TSIsHolidayChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSHol__2FBC6DF6]  DEFAULT ((0)) FOR [TSHolidayChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsC__30B0922F]  DEFAULT ((0)) FOR [TSIsCalOTByRegister]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsC__31A4B668]  DEFAULT ((0)) FOR [TSIsCalOTByConfirm]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSCal__3298DAA1]  DEFAULT ((0)) FOR [TSCalOT]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSOTM__338CFEDA]  DEFAULT ((0)) FOR [TSOTMinShift]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsC__3575474C]  DEFAULT ((0)) FOR [TSIsCalOTChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSCal__36696B85]  DEFAULT ((0)) FOR [TSCalOTChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsR__375D8FBE]  DEFAULT ((0)) FOR [TSIsRegOTByFromTo]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsS__3851B3F7]  DEFAULT ((0)) FOR [TSIsSelectOTType]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsO__3945D830]  DEFAULT ((0)) FOR [TSIsOTExtraToAlloGrade]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSOTE__3A39FC69]  DEFAULT ('') FOR [TSOTExtraToAlloGradeCode]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsC__3B2E20A2]  DEFAULT ((0)) FOR [TSIsCLeaveRegNegative]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsC__3C2244DB]  DEFAULT ((0)) FOR [TSIsCLeaveByHour]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSCLe__3D166914]  DEFAULT ((0)) FOR [TSCLeavePayRate]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSCLe__3E0A8D4D]  DEFAULT ((0)) FOR [TSCLeaveMaxKowToNextYear]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSCLe__3EFEB186]  DEFAULT ((0)) FOR [TSCLeaveKowToNextYear]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSCLe__3FF2D5BF]  DEFAULT ((0)) FOR [TSCLeavePaid]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSCLe__40E6F9F8]  DEFAULT ('') FOR [TSCLeaveKowCode]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsC__41DB1E31]  DEFAULT ((0)) FOR [TSIsCLeavePaidByOTReg]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSIsM__42CF426A]  DEFAULT ((0)) FOR [TSIsMealScanTimes]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSMea__43C366A3]  DEFAULT ((0)) FOR [TSMealMaxScanTimesPerDay]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__HCSSYS_Co__TSMea__44B78ADC]  DEFAULT ((0)) FOR [TSMealMinHourBetweenScanTimes]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF_sysConfigTS_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsL__3C54ED00]  DEFAULT ((0)) FOR [TSIsLateEarly]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsL__3D491139]  DEFAULT ((0)) FOR [TSIsLateEarlyChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSLat__3E3D3572]  DEFAULT ((0)) FOR [TSLateEarlyChangeObject]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsR__3F3159AB]  DEFAULT ((0)) FOR [TSIsRegisterMidShift]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsM__40257DE4]  DEFAULT ((0)) FOR [TSIsMinusAL]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSMin__4119A21D]  DEFAULT ((0)) FOR [TSMinusALCalType]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__IsCha__420DC656]  DEFAULT ((0)) FOR [IsChanged]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsC__4301EA8F]  DEFAULT ((0)) FOR [TSIsCLeaveUsePriority]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsC__43F60EC8]  DEFAULT ((0)) FOR [TSIsCLeaveUserPriority]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsK__44EA3301]  DEFAULT ((0)) FOR [TSIsKowChange]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSLoc__45DE573A]  DEFAULT ((0)) FOR [TSLockData]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsL__46D27B73]  DEFAULT ((0)) FOR [TSIsLateEarlyAllowShift]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsC__47C69FAC]  DEFAULT ((0)) FOR [TSIsCalOTAlloRegis]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__IsTra__48BAC3E5]  DEFAULT ((0)) FOR [IsTransDayOffToKowds]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__TSIsL__49AEE81E]  DEFAULT ((0)) FOR [TSIsLateEarlyAllowDistinct]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__IsApp__4AA30C57]  DEFAULT ((0)) FOR [IsApplyBlockOTWithHoliday]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__CalEx__4B973090]  DEFAULT ((0)) FOR [CalExactChangeObjVacaCode]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__IsAut__4C8B54C9]  DEFAULT ((0)) FOR [IsAutoUpdateFundEmp]
GO
ALTER TABLE [dbo].[sysConfigTS] ADD  CONSTRAINT [DF__sysConfig__IsCal__4D7F7902]  DEFAULT ((0)) FOR [IsCalLateWithMonth]
GO
ALTER TABLE [dbo].[sysConfigTSEmpDayOff] ADD  CONSTRAINT [DF_sysConfigTSEmpDayOff_IsHoliday]  DEFAULT ((0)) FOR [IsHoliday]
GO
ALTER TABLE [dbo].[sysConfigTSEmpDayOff] ADD  CONSTRAINT [DF_sysConfigTSEmpDayOff_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[sysConfigTSEmpOT] ADD  CONSTRAINT [DF_sysConfigTSEmpOT_TSCalOT]  DEFAULT ((1)) FOR [TSCalOT]
GO
ALTER TABLE [dbo].[sysConfigTSEmpOT] ADD  CONSTRAINT [DF_sysConfigTSEmpOT_TSMinShift]  DEFAULT ((0)) FOR [TSMinShift]
GO
ALTER TABLE [dbo].[sysConfigTSEmpOT] ADD  CONSTRAINT [DF_sysConfigTSEmpOT_MinFrom]  DEFAULT ((0)) FOR [MinFrom]
GO
ALTER TABLE [dbo].[sysConfigTSEmpOT] ADD  CONSTRAINT [DF_sysConfigTSEmpOT_MinTo]  DEFAULT ((0)) FOR [MinTo]
GO
ALTER TABLE [dbo].[sysConfigTSEmpOT] ADD  CONSTRAINT [DF_sysConfigTSEmpOT_MinCal]  DEFAULT ((0)) FOR [MinCal]
GO
ALTER TABLE [dbo].[sysConfigTSEmpOT] ADD  CONSTRAINT [DF_sysConfigTSEmpOT_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[sysConfigTSSubLateEarly] ADD  DEFAULT ((0)) FOR [IsLate]
GO
ALTER TABLE [dbo].[sysConfigTSSubLateEarly] ADD  DEFAULT ((0)) FOR [MinFrom]
GO
ALTER TABLE [dbo].[sysConfigTSSubLateEarly] ADD  DEFAULT ((0)) FOR [MinTo]
GO
ALTER TABLE [dbo].[sysConfigTSSubLateEarly] ADD  DEFAULT ((0)) FOR [MinCal]
GO
ALTER TABLE [dbo].[sysConfigTSSubLateEarly] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[sysConfigTSSubLateEarly] ADD  DEFAULT ('admin') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[SysFunctionList] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[SysFunctionList] ADD  CONSTRAINT [DF_HCSSYS_FunctionList_IsActive]  DEFAULT ((0)) FOR [IsActive]
GO
ALTER TABLE [dbo].[SysFunctionList] ADD  CONSTRAINT [DF_HCSSYS_FunctionList_CreatedOn]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[sysJobIntegration] ADD  DEFAULT (getdate()) FOR [CreateDate]
GO
ALTER TABLE [dbo].[sysJobIntegration] ADD  DEFAULT ((0)) FOR [TableCheckInOut_IsQuery]
GO
ALTER TABLE [dbo].[sysUsers] ADD  DEFAULT (newsequentialid()) FOR [RecID]
GO
ALTER TABLE [dbo].[sysUsers] ADD  DEFAULT ((0)) FOR [IsSystem]
GO
ALTER TABLE [dbo].[sysUsers] ADD  DEFAULT ((0)) FOR [IsAdmin]
GO
ALTER TABLE [dbo].[sysUsers] ADD  DEFAULT ((0)) FOR [NeverExpire]
GO
ALTER TABLE [dbo].[sysUsers] ADD  DEFAULT ((0)) FOR [FirstChange]
GO
ALTER TABLE [dbo].[sysUsers] ADD  DEFAULT ((0)) FOR [Lock]
GO
ALTER TABLE [dbo].[sysUsers] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SysValueList] ADD  DEFAULT (newid()) FOR [ID]
GO
ALTER TABLE [dbo].[SysValueList] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SysValueList] ADD  DEFAULT ((0)) FOR [MultiSelect]
GO
ALTER TABLE [dbo].[tmp] ADD  CONSTRAINT [DF_Departments_Id]  DEFAULT (newid()) FOR [Id]
GO
ALTER TABLE [dbo].[tmp] ADD  CONSTRAINT [DF_Departments_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[tmp] ADD  CONSTRAINT [DF_Departments_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[UserLockData] ADD  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[UserLockData] ADD  DEFAULT ('application') FOR [CreatedBy]
GO
ALTER TABLE [dbo].[UserLockData_DeptUnlock] ADD  CONSTRAINT [DF__HCSSYS_Us__Locke__775574B7]  DEFAULT ((0)) FOR [Locked]
GO
ALTER TABLE [dbo].[UserLockData_DeptUnlock] ADD  CONSTRAINT [DF__HCSSYS_Us__Creat__784998F0]  DEFAULT (getdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[EmpKowDays]  WITH CHECK ADD  CONSTRAINT [FK_EmpKowDays_LsKows] FOREIGN KEY([KowCode])
REFERENCES [dbo].[LsKows] ([KowCode])
GO
ALTER TABLE [dbo].[EmpKowDays] CHECK CONSTRAINT [FK_EmpKowDays_LsKows]
GO
ALTER TABLE [dbo].[EmployeeContracts]  WITH CHECK ADD  CONSTRAINT [FK_EmployeeContracts_LsContractType] FOREIGN KEY([ConTypeCode])
REFERENCES [dbo].[LsContractType] ([ConTypeCode])
GO
ALTER TABLE [dbo].[EmployeeContracts] CHECK CONSTRAINT [FK_EmployeeContracts_LsContractType]
GO
ALTER TABLE [dbo].[EmployeeDayOffs]  WITH CHECK ADD  CONSTRAINT [FK_EmployeeDayOffs_LsKows] FOREIGN KEY([KowCode])
REFERENCES [dbo].[LsKows] ([KowCode])
GO
ALTER TABLE [dbo].[EmployeeDayOffs] CHECK CONSTRAINT [FK_EmployeeDayOffs_LsKows]
GO
ALTER TABLE [dbo].[EmployeeShifts]  WITH CHECK ADD  CONSTRAINT [FK_EmployeeShifts_LsShifts] FOREIGN KEY([ShiftCode])
REFERENCES [dbo].[LsShifts] ([ShiftCode])
GO
ALTER TABLE [dbo].[EmployeeShifts] CHECK CONSTRAINT [FK_EmployeeShifts_LsShifts]
GO
ALTER TABLE [dbo].[LsContractTypeTime]  WITH CHECK ADD  CONSTRAINT [FK_LsContractTypeTime_LsContractType] FOREIGN KEY([ConTypeCode])
REFERENCES [dbo].[LsContractType] ([ConTypeCode])
GO
ALTER TABLE [dbo].[LsContractTypeTime] CHECK CONSTRAINT [FK_LsContractTypeTime_LsContractType]
GO
ALTER TABLE [dbo].[LsDistrict]  WITH CHECK ADD  CONSTRAINT [FK_LsDistrict_LsProvince] FOREIGN KEY([ProvinceCode])
REFERENCES [dbo].[LsProvince] ([ProvinceCode])
GO
ALTER TABLE [dbo].[LsDistrict] CHECK CONSTRAINT [FK_LsDistrict_LsProvince]
GO
ALTER TABLE [dbo].[LsInsurance]  WITH NOCHECK ADD  CONSTRAINT [FK_LsInsurance_LsInsurance] FOREIGN KEY([SICode])
REFERENCES [dbo].[LsInsurance] ([SICode])
GO
ALTER TABLE [dbo].[LsInsurance] CHECK CONSTRAINT [FK_LsInsurance_LsInsurance]
GO
ALTER TABLE [dbo].[LsProvince]  WITH CHECK ADD  CONSTRAINT [FK_LsProvince_LsProvince] FOREIGN KEY([NationCode])
REFERENCES [dbo].[LsNation] ([NationCode])
GO
ALTER TABLE [dbo].[LsProvince] CHECK CONSTRAINT [FK_LsProvince_LsProvince]
GO
ALTER TABLE [dbo].[LsShifts]  WITH CHECK ADD  CONSTRAINT [FK_LsShifts_LsKows] FOREIGN KEY([KowCode])
REFERENCES [dbo].[LsKows] ([KowCode])
GO
ALTER TABLE [dbo].[LsShifts] CHECK CONSTRAINT [FK_LsShifts_LsKows]
GO
ALTER TABLE [dbo].[LsShiftsDetail_FullDays]  WITH CHECK ADD  CONSTRAINT [FK_LsShiftsDetail_FullDays_LsKows] FOREIGN KEY([KowCode])
REFERENCES [dbo].[LsKows] ([KowCode])
GO
ALTER TABLE [dbo].[LsShiftsDetail_FullDays] CHECK CONSTRAINT [FK_LsShiftsDetail_FullDays_LsKows]
GO
ALTER TABLE [dbo].[LsShiftsDetail_FullDays]  WITH CHECK ADD  CONSTRAINT [FK_LsShiftsDetail_FullDays_LsShifts] FOREIGN KEY([ShiftCode])
REFERENCES [dbo].[LsShifts] ([ShiftCode])
GO
ALTER TABLE [dbo].[LsShiftsDetail_FullDays] CHECK CONSTRAINT [FK_LsShiftsDetail_FullDays_LsShifts]
GO
ALTER TABLE [dbo].[LsShiftsDetail_HaftDays]  WITH CHECK ADD  CONSTRAINT [FK_LsShiftsDetail_HaftDays_LsKows] FOREIGN KEY([KowCode])
REFERENCES [dbo].[LsKows] ([KowCode])
GO
ALTER TABLE [dbo].[LsShiftsDetail_HaftDays] CHECK CONSTRAINT [FK_LsShiftsDetail_HaftDays_LsKows]
GO
ALTER TABLE [dbo].[LsShiftsDetail_HaftDays]  WITH CHECK ADD  CONSTRAINT [FK_LsShiftsDetail_HaftDays_LsShifts] FOREIGN KEY([ShiftCode])
REFERENCES [dbo].[LsShifts] ([ShiftCode])
GO
ALTER TABLE [dbo].[LsShiftsDetail_HaftDays] CHECK CONSTRAINT [FK_LsShiftsDetail_HaftDays_LsShifts]
GO
ALTER TABLE [dbo].[LsWard]  WITH CHECK ADD  CONSTRAINT [FK_LsWard_LsDistrict] FOREIGN KEY([DistrictCode])
REFERENCES [dbo].[LsDistrict] ([DistrictCode])
GO
ALTER TABLE [dbo].[LsWard] CHECK CONSTRAINT [FK_LsWard_LsDistrict]
GO
ALTER TABLE [dbo].[MAllowanceTypeLevels]  WITH CHECK ADD  CONSTRAINT [FK_MAllowanceTypeLevels_MAllowanceTypes1] FOREIGN KEY([MAllowanceTypeId])
REFERENCES [dbo].[MAllowanceTypes] ([Id])
GO
ALTER TABLE [dbo].[MAllowanceTypeLevels] CHECK CONSTRAINT [FK_MAllowanceTypeLevels_MAllowanceTypes1]
GO
ALTER TABLE [dbo].[MDesignaions]  WITH CHECK ADD  CONSTRAINT [FK_MDesignaions_Departments_DepartmentCode] FOREIGN KEY([DepartmentCode])
REFERENCES [dbo].[tmp] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[MDesignaions] CHECK CONSTRAINT [FK_MDesignaions_Departments_DepartmentCode]
GO
ALTER TABLE [dbo].[EmpKowDsLastPayroll]  WITH NOCHECK ADD  CONSTRAINT [CK_EmpKowDsLastPayroll] CHECK  (([DayNum]<>(0)))
GO
ALTER TABLE [dbo].[EmpKowDsLastPayroll] CHECK CONSTRAINT [CK_EmpKowDsLastPayroll]
GO
/****** Object:  StoredProcedure [dbo].[GetLSNationList]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[GetLSNationList] 
AS
BEGIN 
SELECT * FROM LsNation where NationCode='VN'

select * from LsProvince where NationCode='VN'

END
GO
/****** Object:  StoredProcedure [dbo].[HasParameterTest]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      <Author, , Name>
-- Create Date: <Create Date, , >
-- Description: <Description, , >
-- =============================================
CREATE PROCEDURE [dbo].[HasParameterTest]
(
    @Emp NVARCHAR(20)
)
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON

    -- Insert statements for procedure here
    SELECT Id,LastName,FirstName from Employees where Id = @Emp
END
GO
/****** Object:  StoredProcedure [dbo].[LS_spDanhMuc_LoadData]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec LS_spDanhMuc_LoadData @FunctionID,@Lang,@UserID
	exec LS_spDanhMuc_LoadData 'LS0000','VN','admin'
	exec LS_spDanhMuc_LoadData 'LS0035','VN','admin'
*/
CREATE PROC [dbo].[LS_spDanhMuc_LoadData]
(
	@FunctionID VARCHAR(20),
	@Lang VARCHAR(10),
	@UserID VARCHAR(20)
)
AS
	DECLARE @TableName NVARCHAR(250), @SQLView NVARCHAR(max)
	SELECT @TableName=TableName,@SQLView=SQLView FROM dbo.SYS_FunctionList WHERE FunctionID = @FunctionID
	IF ISNULL(@SQLView,'') = '' 
    BEGIN
		SET @SQLView = N'select * from ' + @TableName + ' order by Ordinal'
	END	
	EXEC(@SQLView)
GO
/****** Object:  StoredProcedure [dbo].[NoParameterTest]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      <Author, , Name>
-- Create Date: <Create Date, , >
-- Description: <Description, , >
-- =============================================
CREATE PROCEDURE [dbo].[NoParameterTest]

AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON

    -- Insert statements for procedure here
    SELECT Id,LastName,FirstName from Employees
END
GO
/****** Object:  StoredProcedure [dbo].[spAutoCalTimeSheetEveryDaystandard]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	EXEC spAutoCalTimeSheetEveryDaystandard 'E000001','2021/05/01','2021/05/30',0,0
*/
CREATE PROC [dbo].[spAutoCalTimeSheetEveryDaystandard]
(
	@lstOfEmp NVARCHAR(max),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Auto INT,--1.auto tu dong chay hang ngay
	@IsSendMail bit
)
AS
BEGIN
	DECLARE @Now DATETIME SET @Now = CONVERT(NVARCHAR(10),GETDATE(),111)
	DECLARE @strNow NVARCHAR(10) SET @strNow = CONVERT(NVARCHAR(10),GETDATE(),111)
	DECLARE @WLeaveDayValue INT, @gSSLNC INT, @gSGMC FLOAT, @IsSGMC_AllowShift bit 
	set @gSSLNC = 2
	SET @gSGMC = 8
	--PRINT 'ffff'
	DECLARE @JobID NVARCHAR(100) SET @JobID = 'AutoCaculateWork_Standard_ScanStart'
	DECLARE @Email NVARCHAR(1000), @Subject NVARCHAR(max), @Body NVARCHAR(max)

	SELECT @gSSLNC = isnull(S.TSDecPlaceWD,0), @gSGMC = ISNULL(S.TSHoursPerWD,8),
			@IsSGMC_AllowShift = isnull(S.TSIsChangeHoursPerWDByShift,0)
	from dbo.sysConfigTS S with(NOLOCK)

	CREATE TABLE #jEmp(EmployeeCode NVARCHAR(30), BarCode NVARCHAR(250),DepartmentCode NVARCHAR(30), JobWCode NVARCHAR(30), IsNotScan BIT, IsNotLateEarly BIT, 
			Alt_Shift BIT, ShiftCode NVARCHAR(20), JoinDate DATETIME, EndDate DATETIME, 
			WLeaveDayValue INT, GroupSalCode NVARCHAR(30), IsNotOTKow BIT, EMail NVARCHAR(250), RowIndex INT)
	IF ISNULL(@Auto,0) = 1
	BEGIN
		
		IF NOT EXISTS (SELECT 1 FROM sysJobIntegration WITH(NOLOCK) WHERE JobID = @JobID)
		BEGIN
			INSERT INTO sysJobIntegration(CustumerID,JobID,JobName,ExecuteDate,CreateDate,LastRunTime,Note)
			VALUES ('default', @JobID, N'Tự động tính công hằng ngày-Ngày bắt đầu chạy cho lần tiếp theo', DATEADD(DAY,-1, @Now), GETDATE(), GETDATE(), N'Tự động tính công hằng ngày-Ngày bắt đầu chạy cho lần tiếp theo')
		END

		DECLARE @ExecuteDate DATETIME
		SELECT TOP(1) @ExecuteDate = ExecuteDate, @Email = Email, @Subject =Subject, @Body = Body
		FROM sysJobIntegration WITH(NOLOCK) WHERE  JobID = @JobID
		SET @BegDate = CONVERT(NVARCHAR(10),@ExecuteDate,111)
		SET @EndDate = DATEADD(DAY,-1, @Now)
	END

	--BEGIN TRY

		--SELECT @ExecuteDate AS '@ExecuteDate', @BegDate AS '@BegDate', @EndDate AS '@EndDate'
		--1. Get tap danh sach nhan vien can chay
		IF ISNULL(@lstOfEmp,'') <> ''
		BEGIN
			INSERT INTO #jEmp(EmployeeCode, BarCode, DepartmentCode, JobWCode, JoinDate, EndDate, GroupSalCode, 
					IsNotScan, IsNotLateEarly, Alt_Shift, ShiftCode, IsNotOTKow, RowIndex)
			SELECT E.EmployeeCode as EmployeeCode, E.BarCode, E.DepartmentCode as DepartmentCode, E.JobWCode as JobWCode, E.JoinDate, E.EndDate as EndDate, '' as GroupSalCode, 
					E.IsNotScan, E.IsNotLateEarly, isnull(E.Alt_Shift,0), E.ShiftCode, E.IsNotOTKow,
					ROW_NUMBER()OVER(ORDER BY E.EmployeeCode) AS RowIndex
			FROM dbo.Employees E with(NOLOCK)
			inner join dbo.fnSplitString(@lstOfEmp,',') F  on F.data = E.EmployeeCode
			where E.JoinDate <= @EndDate and (E.EndDate IS null	OR (E.EndDate IS NOT NULL AND E.EndDate > @BegDate))
			option (maxrecursion 0)
		END
		ELSE
		BEGIN
			INSERT INTO #jEmp(EmployeeCode, BarCode, DepartmentCode, JobWCode, JoinDate, EndDate, GroupSalCode, 
					IsNotScan, IsNotLateEarly, Alt_Shift, ShiftCode, IsNotOTKow, RowIndex)
			SELECT E.EmployeeCode EmployeeCode, E.BarCode, E.DepartmentCode DepartmentCode, E.JobWCode AS JobWCode, E.JoinDate, E.EndDate, '' as GroupSalCode, 
					E.IsNotScan, E.IsNotLateEarly, isnull(E.Alt_Shift,0), E.ShiftCode, E.IsNotOTKow,
					ROW_NUMBER()OVER(ORDER BY E.EmployeeCode) AS RowIndex
			FROM Employees E  with(NOLOCK)
			where E.JoinDate <= @EndDate and (E.EndDate IS null	OR (E.EndDate IS NOT NULL AND E.EndDate > @BegDate))
		END
		IF NOT EXISTS (SELECT 1 FROM #jEmp) RETURN

		--Danh sach Phan ca lam viec
		select EmployeeCode as EmployeeCode, WorkDate, ShiftCode into #jHCSTS_AssignShift 
		FROM dbo.EmployeeShifts with(NOLOCK) where WorkDate between @BegDate and @EndDate

		--PHAN TICH DANH MUC CA LAM VIEC THIET LAP NGHI SANG/CHIEU
		SELECT ShiftCode,FromTime as EarliestShiftTime,ToTime as LatestShiftTime,TotalDays as TotalDate,InFrom EarliestTimeIn,[InTo] LatestTimeIn, 
				0 AS IsAddDayRi
		INTO #jsLsShift
		FROM dbo.LsShifts WITH(NOLOCK)

		--TAP DANH SACH NGAY CAN TINH, TRU NGHI TUAN/LE
		select E.EmployeeCode, E.BarCode, D.mDate as WorkDate, CASE WHEN E.Alt_Shift = 1 THEN S.ShiftCode else E.ShiftCode end as ShiftCode
				, CONVERT(NVARCHAR(10),D.mDate,111) AS strWorkDate
		INTO #jEmp_days_d
		from #jEmp E CROSS APPLY dbo.fnSelectFromTODate(@BegDate, @EndDate) D
		left join #jHCSTS_AssignShift S on S.EmployeeCode = E.EmployeeCode and S.WorkDate = D.mDate
		WHERE E.JoinDate <= D.mDate AND (E.EndDate IS NULL OR (E.EndDate IS NOT NULL AND E.EndDate > D.mDate))
	
		----Lay Tap Scancode trong khoan thoi gian can tinh
		SELECT EmployeeCode, BarCode, WorkDate, ScanTime, In1Out0, ScanTime_Date
		INTO #jsScanCode
		FROM
		(
			select E.EmployeeCode, E.BarCode, S.WorkDate, S.ScanTime, S.In1Out0, cast(S.ScanTime AS DATETIME) as ScanTime_Date ,
						ROW_NUMBER()OVER(PARTITION BY E.EmployeeCode,S.ScanTime ORDER BY S.In1Out0) AS RowIndex
			from dbo.EmpScanCodes S WITH(NOLOCK) inner JOIN #jEmp E ON E.BarCode = S.BarCode 
			WHERE S.WorkDate between @BegDate AND dateadd(day,1,@EndDate) 
		) T WHERE T.RowIndex =1

		----Lay tap danh sach NV + thoi gian vào sớm nhất và ra trễ nhất theo ca làm việc
		SELECT        S.EmployeeCode, S.BarCode, S.WorkDate, S.ShiftCode,
				CONVERT(DateTime,strWorkDate + ' ' + L.EarliestShiftTime) AS D1, 
				CONVERT(DateTime, CONVERT(nvarchar(10), DATEADD(dd, L.TotalDate - 1, S.WorkDate), 111) + ' ' + L.LatestShiftTime) AS D2,
				CONVERT(DateTime,strWorkDate + ' ' + L.EarliestTimeIn) AS VaoTu, 
				CONVERT(DateTime, CONVERT(nvarchar(10), DATEADD(dd, L.IsAddDayRi, S.WorkDate), 111) + ' ' + L.LatestTimeIn) AS VaoDen
		into #jEmp_Permit_ShiftTime
		FROM #jEmp_days_d AS S 
		INNER JOIN #jsLsShift L ON S.ShiftCode = L.ShiftCode
	
		--SELECT * FROM #jEmp_Permit_ShiftTime ORDER BY EmployeeCode,WorkDate
		----Lay DS nhan vien và thời gian quét thẻ theo ca thực tế trong ngày
		--SELECT * FROM #jsScanCode
		--SELECT * FROM #jEmp_Permit_ShiftTime
		--RETURN
		select E.EmployeeCode,E.BarCode,E.WorkDate,E.ShiftCode,S.ScanTime,E.D1,E.D2, S.ScanTime_Date,
					CASE WHEN S.ScanTime_Date BETWEEN E.VaoTu AND E.VaoDen THEN 1 ELSE 0 END AS In1Out0,
					ROW_NUMBER()OVER(PARTITION BY E.EmployeeCode, E.WorkDate ORDER BY S.ScanTime_Date ASC) AS Index1,
					ROW_NUMBER()OVER(PARTITION BY E.EmployeeCode, E.WorkDate ORDER BY S.ScanTime_Date DESC) AS Index2
		into #jsScanTime_d
		from #jEmp_Permit_ShiftTime E 
		INNER JOIN #jsScanCode S on S.EmployeeCode = E.EmployeeCode and S.ScanTime_Date between E.D1 AND E.D2
	
		--count so dong quet the trong ngay
		SELECT EmployeeCode, WorkDate, COUNT(1) AS SoDongQT INTO #jsScanTime_d_CountRow 
		FROM #jsScanTime_d GROUP BY EmployeeCode, WorkDate

		SELECT S.EmployeeCode as EmployeeCode,S.WorkDate
		INTO #jsScanTime_manual
		FROM dbo.EmpScanTimes S WITH(NOLOCK) inner JOIN #jEmp E ON S.EmployeeCode = E.EmployeeCode
		where S.WorkDate between @BegDate and @EndDate AND ISNULL(S.IsManual,0) = 1
		GROUP BY S.EmployeeCode,S.WorkDate
	
		--TINH CONG DUA THEO QUET THE DAU CUOI(VAO Dau tien - RA cuoi cung)
		--******INSERT SCANTIME**************************************************************************************

		--SELECT * FROM #jsScanTime_d
		--RETURN
		--xu ly nhan dien inout, nhung ngay > 2 dong thi dau la vao, cuoi la ra, nguoc lai nhan vien gio in theo thiet lap trong ca
		SELECT S.EmployeeCode,S.WorkDate,S.ScanTime, CASE WHEN R.SoDongQT = 1 THEN S.In1Out0
														  WHEN S.Index1 = 1 THEN 1 ELSE 0 END In1Out0, S.BarCode, S.ShiftCode
		INTO #jHCSTS_ScanTime
		FROM #jsScanTime_d S
		INNER JOIN #jsScanTime_d_CountRow R ON R.EmployeeCode = S.EmployeeCode AND r.WorkDate = S.WorkDate
		WHERE R.SoDongQT = 1 OR S.Index1 = 1 OR S.Index2 = 1

		delete S FROM dbo.EmpScanTimes S inner JOIN #jEmp E ON S.EmployeeCode = E.EmployeeCode
		LEFT JOIN #jsScanTime_manual M ON M.EmployeeCode = S.EmployeeCode AND M.WorkDate = S.WorkDate
		where S.WorkDate between @BegDate and @EndDate AND isnull(S.IsManual,0) = 0 AND M.EmployeeCode IS NULL

		insert INTO EmpScanTimes(EmployeeCode, ScanTime, ReaderID, In1Out0, WorkDate, IsManual, CreatedOn, CreatedBy)
		SELECT S.EmployeeCode, S.ScanTime, '', S.In1Out0, S.WorkDate,0, GETDATE(), 'Auto'
		from #jHCSTS_ScanTime S
		LEFT JOIN #jsScanTime_manual M ON M.EmployeeCode  = S.EmployeeCode AND M.WorkDate = S.WorkDate --bo qua nhung ngay da dc bo sung inout
		WHERE M.EmployeeCode IS NULL
		--RETURN
		--TINH CONG CHO NGAY TRUOC DO
		DECLARE @TongSO INT SET @TongSO = 0
		SELECT @TongSO = COUNT(1) FROM #jEmp
		IF @TongSO = 0 RETURN
		DECLARE @SoLan INT SET @SoLan = @TongSO/20
		IF ISNULL(@SoLan,0) <= 0  SET @SoLan = 1

		SELECT S.EmployeeCode, S.RowIndex%@SoLan AS Rindex 
		INTO #jtmpEmp FROM #jEmp S 

		SELECT S.strEmployeeCode INTO #jlstOfCalWork
		FROM 
		(
			Select SUBSTRING((Select ',' + B.EmployeeCode
				From #jtmpEmp B Where B.Rindex = A.Rindex
				FOR XML Path('')),2, 4000)
					As strEmployeeCode  
			From #jtmpEmp A  
		) S
		GROUP BY S.strEmployeeCode

		--SELECT * FROM #jlstOfCalWork
		DECLARE @strEmployeeCode NVARCHAR(max), @Err NVARCHAR(max)

		DECLARE curtgJobTs CURSOR FOR
			SELECT strEmployeeCode FROM #jlstOfCalWork
		OPEN curtgJobTs
		FETCH NEXT FROM curtgJobTs into @strEmployeeCode
		WHILE @@FETCH_STATUS=0
		BEGIN
			SET @Err = ''
			exec spKowTimeSheet 'admin', @strEmployeeCode,@BegDate,@EndDate,@Err OUT
			NEXT_EMP:
			FETCH NEXT FROM curtgJobTs into @strEmployeeCode
		END
		CLOSE curtgJobTs
		DEALLOCATE curtgJobTs

		--exec HCSTS_spCaculateWork 'admin','HCSTS08', default,'2018/11/22','2018/11/26',null

		--*****END INSERT SCANTIME******************************************************************************
		IF ISNULL(@Auto,0) = 1
		BEGIN
			UPDATE sysJobIntegration set ExecuteDate = @Now, LastRunTime = GETDATE() FROM sysJobIntegration WITH(NOLOCK) 
			WHERE  JobID = @JobID
		END

	--END TRY
	--BEGIN CATCH
	--		DECLARE @ErrorMessage NVARCHAR(4000);
	--		DECLARE @ErrorSeverity INT;
	--		DECLARE @ErrorState INT;

	--		SELECT @ErrorMessage = ERROR_MESSAGE(),
	--			   @ErrorSeverity = ERROR_SEVERITY(),
	--			   @ErrorState = ERROR_STATE();

	--		declare @DBSchemaName nvarchar(50)
	--		SET    @DBSchemaName=SCHEMA_NAME()
	--		--IF ISNULL(@Email,'') <> '' AND ISNULL(@Subject,'') <> ''
	--		--BEGIN
	--		--	INSERT INTO HCSSYS_Mails (MailTo, Subject, MailContent, Module, ViewPath, UserName, CreateDate, ReadyToSend, DBSchema)
	--		--	VALUES        (@Email,@Subject,@Body,N'Job',N'HCSTS_spAutoGetScanCodeInfo','admin', GETDATE(), 1,@DBSchemaName)
	--		--END

	--		RAISERROR (@ErrorMessage,
	--				@ErrorSeverity, -- Severity.
	--				@ErrorState); -- Second substitution argument.
	--END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spCreateSimpleEmployee]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spCreateSimpleEmployee]
@id nvarchar(30),
@EmployeeCode nvarchar(30),
@firstName nvarchar(50),
@lastName nvarchar(50),
@DepartmentCode uniqueidentifier,
@JobWCode varchar(20),
@email nvarchar(max)
AS
BEGIN

Declare @isExisting int = 0
SELECT @isExisting = COUNT(*) FROM Employees WHERE Email = @email

IF @isExisting > 0 
BEGIN
SELECT 'ERR01' 
END
ELSE
BEGIN
 INSERT INTO Employees (Id, EmployeeCode, FirstName, LastName, DepartmentCode, JobWCode, Email )
 VALUES (@id, @EmployeeCode, @firstName, @lastName, @DepartmentCode, @JobWCode, @email )

 SELECT @@ROWCOUNT

END
END
GO
/****** Object:  StoredProcedure [dbo].[spEmpDayOff_detailDay_update]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spEmpDayOff_detailDay_update]
(
	@RecordID UNIQUEIDENTIFIER,
	@UserID NVARCHAR(250),
	@Kind INT,
	@EmployeeCode NVARCHAR(20),
	@BegDate DATETIME,@EndDate DATETIME,@LeavePeriod INT,@DayNum FLOAT,
	@WLeaveDayValue INT,
	@IsSubHoliday bit,@IsSubWeek BIT, @IsSunday BIT,@KowCode NVARCHAR(20)
)
AS
BEGIN
	declare  @Now DATETIME
	DECLARE @TSDecPlaceWD INT, @KowType int
	SET @Now = CONVERT(NVARCHAR(10),GETDATE(),111)
	
	DECLARE @YearNum FLOAT SET @YearNum = @DayNum
	
	DECLARE @gSGMC FLOAT
	SELECT @gSGMC = TSHoursPerWD FROM dbo.sysConfigTS WITH(NOLOCK) 
	SET @gSGMC = ISNULL(@gSGMC,8)

	SET @TSDecPlaceWD = ISNULL(@TSDecPlaceWD,2)

	CREATE TABLE #tblUpdateKowAddMoreds(RecordID BIGINT)
	IF ISNULL(@LeavePeriod,0) = 5 SET @LeavePeriod = 2
	DECLARE @sumHoliday float, @i DateTime, @temp int
	set @sumHoliday = 0
	DECLARE @WLeaveDayGroupCode VARCHAR(20)
	-- tạo bảng tam chứa DayOff
	SELECT WorkDate as DayOff, LeavePeriod INTO #EmployeeWeekOffs 
	FROM EmployeeWeekOffs with (nolock) WHERE EmployeeCode = @EmployeeCode and WorkDate between @BegDate and @EndDate

	-- tạo bảng tạm chứa ngày le
	SELECT V.VacationDay as DateID INTO #LsVacationDays
	FROM dbo.LsVacationDays V with (nolock) 
	
	SELECT D.mDate AS WorkDate, CASE WHEN ISNULL(H.LeavePeriod,0) IN (2,3) THEN 1 else 0 END AS NghiNuaNgay, H.LeavePeriod
	INTO #lstOfDayDetail
	FROM dbo.fnSelectFromTODate(@BegDate, @EndDate) D
	LEFT JOIN dbo.fnGet_HolidayDetails(@BegDate,@EndDate,@IsSubHoliday, @IsSubWeek,@IsSunday,@EmployeeCode) H ON H.Date_Off = D.mDate
	WHERE H.Date_Off IS NULL OR (H.Date_Off IS NOT NULL AND H.LeavePeriod <> 1)

	DECLARE @DailyTimeNum FLOAT
	SELECT S.WorkDate, CASE WHEN @LeavePeriod = 4 THEN 
								CASE WHEN S.NghiNuaNgay = 1 and @DailyTimeNum > 0.5 THEN 0.5 ELSE @DailyTimeNum END
							WHEN S.NghiNuaNgay = 1 THEN 0.5 ELSE 1 END AS DayNum, 
						CASE WHEN @LeavePeriod = 4 THEN @LeavePeriod 
							 WHEN S.NghiNuaNgay = 1 THEN CASE WHEN S.LeavePeriod = 2 THEN 3 ELSE 2 END
							 ELSE 1 END AS LeavePeriod,
			S.NghiNuaNgay, ROW_NUMBER()OVER(ORDER BY S.WorkDate) AS RowIndex
	INTO #lstOfDate
	FROM #lstOfDayDetail S 

	--SELECT * FROM #lstOfDate

	DECLARE @SumNN FLOAT 
	DECLARE @DayNumEndDate FLOAT

	IF @LeavePeriod = 4
	BEGIN
		PRINT ''
	END
	ELSE
    BEGIN	
		IF @LeavePeriod = 3--nếu nghỉ bắt đầu từ buổi chiều của từ ngày(@begdate)--> ngày đầu tiên là nghỉ buổi chiều.(các ngày còn lại nghỉ nguyên ngày)
		BEGIN
			--nếu ngày nghỉ tuần là loại nghỉ 1/2 sáng t7 và @begdate = Thứ 3--> T7 nghỉ sáng.
			--Ngược lại nếu @begdate ko là t7 thì trừ ngày nghỉ vào buổi chiều của @begdate
			UPDATE #lstOfDate SET DayNum = 0.5, LeavePeriod = 3 WHERE RowIndex = 1 AND NghiNuaNgay <> 1
			UPDATE #lstOfDate SET LeavePeriod = 2 WHERE RowIndex = 1 AND NghiNuaNgay = 1
		END
		
		--Tinh Tong so ngay nghi nam giua @begdate vs @Enddate để xem ngày cuối nghỉ 1/2 ngày hay nguyên ngày.
		IF @BegDate < @EndDate
		BEGIN
			SET @SumNN = 0
			SET @DayNumEndDate = 0
			SELECT @SumNN = SUM(DayNum) FROM #lstOfDate WHERE WorkDate < @EndDate
			SET @DayNumEndDate = @YearNum - ISNULL(@SumNN,0)
			--SELECT @DayNumEndDate,@YearNum,@SumNN
			IF @DayNumEndDate < 1--Ngay cuoi nghi buoi sang
			BEGIN
				if @DayNumEndDate > 0
				BEGIN
					UPDATE #lstOfDate SET DayNum = 0.5, LeavePeriod = 2 WHERE WorkDate = @EndDate
				END
				ELSE
                BEGIN
					--neu ngay cuoi tinh ra 0 ngay phep thi xoa
					delete from #lstOfDate WHERE WorkDate = @EndDate
				END
			END
			ELSE
			BEGIN
				--nghi nguyen ngay neu <> loai nghi 1/2 t7(neu la T7 and Loai nghi =1/2 T7 thi nghi sang)
				UPDATE #lstOfDate SET LeavePeriod = 1 WHERE WorkDate = @EndDate AND NghiNuaNgay <> 1
				UPDATE #lstOfDate SET LeavePeriod = 2 WHERE WorkDate = @EndDate AND NghiNuaNgay = 1
			END
		END
		ELSE
		BEGIN
			IF (@LeavePeriod = 2 OR @LeavePeriod = 1) AND @YearNum < 1
			BEGIN
				UPDATE #lstOfDate SET DayNum = 0.5, LeavePeriod = 2 WHERE WorkDate = @BegDate
			END
			ELSE
			BEGIN
				IF @LeavePeriod = 3 AND @YearNum < 1
				BEGIN
				   UPDATE #lstOfDate SET DayNum = 0.5, LeavePeriod = 3 WHERE WorkDate = @BegDate
				END
				ELSE
				BEGIN
					IF @YearNum >= 1
					BEGIN
						UPDATE #lstOfDate SET DayNum = 1, LeavePeriod = 1 WHERE WorkDate = @BegDate
					END
				END
			END
		END
	END
	DECLARE @FromDate DATETIME, @ToDate DATETIME
	SET @FromDate = DATEADD(DAY,-7,@BegDate)
	SET @ToDate = DATEADD(DAY,7,@EndDate)

	INSERT INTO dbo.EmployeeDayOffs_detailDay(RecordID, EmployeeCode, WorkDate, DayNum, LeavePeriod, CreateBy, KowCode)
	SELECT @RecordID, @EmployeeCode, S.WorkDate, S.DayNum, S.LeavePeriod, @UserID, @KowCode
	FROM #lstOfDate S
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployee_CreateSimple]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployee_CreateSimple]
@id nvarchar(30),
@EmployeeCode nvarchar(30),
@firstName nvarchar(50),
@lastName nvarchar(50),
@DepartmentCode uniqueidentifier,
@JobWCode varchar(20),
@email nvarchar(max)
AS
BEGIN

Declare @isExisting int = 0
SELECT @isExisting = COUNT(*) FROM Employees WHERE Email = @email

IF @isExisting > 0 
BEGIN
SELECT 'ERR01' 
END
ELSE
BEGIN
 INSERT INTO Employees (Id, EmployeeCode, FirstName, LastName, DepartmentCode, JobWCode, Email )
 VALUES (@id, @EmployeeCode, @firstName, @lastName, @DepartmentCode, @JobWCode, @email )

 SELECT 'SUCCESS'

END
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployee_SearchList]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployee_SearchList]
@freeText nvarchar(100),
@departments nvarchar(max)
AS
BEGIN
SELECT emp.Id,
	   emp.EmployeeCode,
	   emp.Email,
	   (emp.FirstName +' '+ emp.LastName) as FullName,
	   (Case emp.isMale when 0 THEN 'Female' ELSE 'Male' END) as Gender,
	   emp.DoB, 
	   emp.JoinDate,
	   dept.Name as DepartmentName,
	   jt.Name as JobTitle,
	   ct.ConTypeName  
FROM Employees emp
JOIN Departments dept ON emp.DepartmentCode = dept.Id
JOIN JobTitles jt ON emp.JobWCode = jt.Code
LEFT JOIN EmployeeContracts ec ON emp.id = ec.EmployeeCode
LEFT JOIN LsContractType ct ON ec.ConTypeCode = ct.ConTypeCode
WHERE
ISNULL(emp.IsDeleted,0) = 0
AND (@freeText <> '' and 
(CHARINDEX(@freeText, emp.EmployeeCode)>0 
or CHARINDEX(@freetext, emp.FirstName)> 0 
or CHARINDEX(@freetext, emp.LastName)>0 
or CHARINDEX(@freetext, emp.email)>0))
AND (@departments <>'' AND charindex(CONVERT(nvarchar(50),emp.DepartmentCode), @departments)>0)
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeDependant_Create]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeDependant_Create]
			@id uniqueidentifier
           ,@employeeId nvarchar(30)
           ,@fullName nvarchar(max)
           ,@relationTypeId uniqueidentifier
           ,@address nvarchar(max)
           ,@note nvarchar(max)
           ,@createdDate datetime2(7)
           ,@createdBy int
           ,@fromMonth varchar(7)
           ,@toMonth varchar(7)
           ,@IsSub bit
           ,@IsTax bit
		   ,@phone nchar(15)
AS
BEGIN
INSERT INTO [dbo].[EmployeeDependants]
           ([Id]
           ,[EmployeeId]
           ,[FullName]
           ,[RelationTypeId]
           ,[Address]
           ,[Note]
           ,[CreatedDate]
           ,[CreatedBy]
           ,[FromMonth]
           ,[ToMonth]
           ,[IsSub]
           ,[IsTax]
		   ,[Phone])
     VALUES
           (
			@id
           ,@employeeId
           ,@fullName
           ,@relationTypeId
           ,@address
           ,@note
           ,@createdDate
           ,@createdBy
           ,@fromMonth
           ,@toMonth
           ,@IsSub
           ,@IsTax
		   ,@phone
		   )
SELECT 'SUCCESS'
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeDependant_Delete]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeDependant_Delete]
			@id uniqueidentifier
		  
AS
BEGIN
	Update  [dbo].[EmployeeDependants]
    SET
		IsDeleted = 1
	Where Id = @id

SELECT 'SUCCESS'
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeDependant_GetById]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeDependant_GetById]
@id uniqueidentifier 
AS
BEGIN
	SELECT * FROM [dbo].[EmployeeDependants] where Id = @id
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeDependant_GetList]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeDependant_GetList]
			@employeeId nvarchar(30)
		  
AS
BEGIN
	SELECT ed.Id, ed.EmployeeId, ed.RelationTypeId, Mdr.[Name] as RelationType,  ed.Address, ed.Note, ed.IsTax, ed.Phone FROM employeeDependants ed
	LEFT JOIN [dbo].[MDependantRelations] Mdr ON ed.[RelationTypeId] = Mdr.Id
	Where [EmployeeId] = @employeeId


END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeDependant_Update]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeDependant_Update]
			@id uniqueidentifier
           ,@employeeId nvarchar(30)
           ,@fullName nvarchar(max)
           ,@relationTypeId uniqueidentifier
           ,@address nvarchar(max)
           ,@note nvarchar(max)
           ,@fromMonth varchar(7)
           ,@toMonth varchar(7)
           ,@IsSub bit
           ,@IsTax bit
		   ,@phone nchar(15)
		   ,@updatedDate datetime2(7)
		   ,@updatedBy nvarchar(30)
		  
AS
BEGIN
	Update  [dbo].[EmployeeDependants]
    SET FullName = @fullName,
		RelationTypeId = @relationTypeId,
		[Address] = @Address,
		Note = @note,
		FromMonth = @fromMonth,
		ToMonth = @ToMonth,
		IsSub = @isSub,
		IsTax = @isTax,
		Phone = @phone,
		UpdatedDate = @updatedDate,
		UpdatedBy = @updatedBy
	Where Id = @id

SELECT 'SUCCESS'
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeFilters_spDeleteAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeFilters_spDeleteAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100)
)
AS
	DELETE FROM EmployeeFilters WHERE UserID = @UserID AND FunctionID = @FunctionID
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeFilters_spDeleteID]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeFilters_spDeleteID]
(
	@ID UNIQUEIDENTIFIER
)
AS
	DELETE FROM EmployeeFilters WHERE ID = @ID
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeFilters_spGetAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeFilters_spGetAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max),
	@totalRow INT OUT
)
AS
	SELECT F.EmployeeCode, F.ID,ROW_NUMBER()OVER(ORDER BY F.EmployeeCode) AS RowIndex INTO #lstOFEmp
	FROM dbo.fnGetEmpFilter(@userID,@FunctionID) F

	SELECT E.EmployeeCode, E.LastName, E.FirstName, P.Name AS DeptName, F.ID
	FROM #lstOFEmp F
	INNER JOIN dbo.Employees E ON E.EmployeeCode = F.EmployeeCode
	LEFT JOIN dbo.Departments P ON P.Id = E.DepartmentCode
	WHERE F.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)

	SET @totalRow = 0
	SELECT @totalRow = COUNT(1) FROM #lstOFEmp
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeFilters_spInsertWithDept]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec spEmployeeFilters_spInsertWithDept 'admin','t02','D9C94470-E431-46E1-A9B6-218135E11A21'
*/
CREATE PROC [dbo].[spEmployeeFilters_spInsertWithDept]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@DepartmentCode VARCHAR(20)
)
AS
	DECLARE @DeptCode NVARCHAR(20)
	SELECT @DeptCode = DepartmentCode FROM dbo.Departments WHERE DepartmentCode = @DepartmentCode
	  
	INSERT INTO EmployeeFilters(FunctionID,UserID,EmployeeCode)
	SELECT @FunctionID,@UserID,E.EmployeeCode
	FROM dbo.fnGetChildDepartment(@DeptCode) S
	INNER JOIN dbo.Employees E ON E.DepartmentCode = S.DepartmentCode
	LEFT JOIN EmployeeFilters T ON T.EmployeeCode = E.EmployeeCode AND T.UserID=@UserID AND T.FunctionID=@FunctionID
	WHERE T.EmployeeCode IS NULL
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeShifts_CheckAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeShifts_CheckAll]
(
	@UserID NVARCHAR(50),
	@IsCheck BIT	
)
AS
BEGIN
	UPDATE dbo.EmployeeShifts_tmp SET IsSelected = @IsCheck WHERE UserID = @UserID
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeShifts_CheckOne]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeShifts_CheckOne]
(
	@EmployeeCode NVARCHAR(30),
	@UserID NVARCHAR(50),
	@IsCheck BIT	
)
AS
BEGIN
	UPDATE dbo.EmployeeShifts_tmp SET IsSelected = @IsCheck WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeShifts_CreateDataTmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeShifts_CreateDataTmp]
(
	@UserID NVARCHAR(50),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@ShiftCode NVARCHAR(20),
	@IsFillEmpty BIT,--chi gan cho nhung ngay ko co ca
	@Err NVARCHAR(max) OUT
)
AS
	
	SELECT E.EmployeeCode as EmployeeCode, E.DepartmentCode, E.JobWCode, E.JoinDate, E.EndDate, '' as GroupSalCode, 
			E.IsNotScan, E.IsNotLateEarly, E.IsNotOTKow, isnull(E.Alt_Shift,0) as  Alt_Shift, E.ShiftCode, 
			isnull(L.LeaveType, 0) as WLeaveDayValue
	INTO #Emp
	FROM dbo.Employees E  with(NOLOCK)
	inner join dbo.fnGetEmpFilter(@UserID,@FunctionID) F  on F.EmployeeCode = E.EmployeeCode
	left JOIN dbo.lsLeaveGroups L WITH(NOLOCK) on L.LeaveGroupCode = E.LeaveGroupCode
	where E.JoinDate <= @EndDate and (E.EndDate IS null	OR (E.EndDate IS NOT NULL AND E.EndDate > @BegDate))
	option (maxrecursion 0)

	select A.EmployeeCode as EmployeeCode, WorkDate, A.ShiftCode into #EmployeeShifts 
	FROM dbo.EmployeeShifts AS A with(NOLOCK) INNER JOIN #Emp AS E ON A.EmployeeCode = E.EmployeeCode 
	WHERE WorkDate between @BegDate and @EndDate


	select E.EmployeeCode, E.GroupSalCode, E.IsNotScan, E.IsNotLateEarly, E.IsNotOTKow, 
			S.ShiftCode as ShiftCode, D.mDate as WorkDate, 
			isnull(C.TSHoursPerWD,8) as gSGMC, 
			CASE WHEN Vs.VacationDay IS NOT NULL THEN 3
				WHEN (((E.WLeaveDayValue = 3 or E.WLeaveDayValue = 5) and ISNULL(F.LeavePeriod,0) NOT IN (1,2)) AND datepart(dw,D.mDate) = 7) or (ISNULL(F.LeavePeriod,0) IN (2,3)) THEN 1 
				WHEN ISNULL(F.LeavePeriod,0) = 1 
					or (E.WLeaveDayValue IN (3,5) and datepart(dw,D.mDate) = 7 and ISNULL(F.LeavePeriod,0) IN (1,2))
					OR (E.WLeaveDayValue IN (1,2,3) AND datepart(dw,D.mDate) = 1) 
					OR (E.WLeaveDayValue = 1 AND datepart(dw,D.mDate) = 7) THEN 2
				else 0 END as Vacation
	into #emp_days_d
	from #Emp E
	cross APPLY dbo.fnSelectFromTODate(@BegDate, @EndDate) D
	left join #EmployeeShifts S on S.EmployeeCode = E.EmployeeCode and S.WorkDate = D.mDate
	left JOIN dbo.sysConfigTS C with(NOLOCK) on 1=1
	left JOIN dbo.LsVacationDays Vs with(NOLOCK) on Vs.VacationDay = D.mDate 
	left JOIN dbo.EmployeeWeekOffs F with(NOLOCK) on F.EmployeeCode = E.EmployeeCode and F.WorkDate = D.mDate
	WHERE E.JoinDate<=D.mDate and (E.EndDate is null or (E.EndDate is not null and E.EndDate > D.mDate))
	
	DELETE FROM dbo.EmployeeShifts_tmp WHERE UserID=@UserID

	IF @IsFillEmpty = 1--chi gan cho nhung ngay ko co ca lam viec
	BEGIN
		INSERT INTO dbo.EmployeeShifts_tmp(EmployeeCode,WorkDate,ShiftCode,CreatedBy,UserID,IsDeleted)
		SELECT S.EmployeeCode,S.WorkDate,@ShiftCode AS ShiftCode, @UserID,@UserID,0
		FROM #emp_days_d S
		WHERE S.Vacation <= 1 AND S.ShiftCode IS NULL
		UNION ALL
		SELECT S.EmployeeCode,S.WorkDate,@ShiftCode AS ShiftCode
		FROM #emp_days_d S
		WHERE S.ShiftCode IS NOT NULL
	END
	ELSE
	BEGIN
		INSERT INTO dbo.EmployeeShifts_tmp(EmployeeCode,WorkDate,ShiftCode,CreatedBy,UserID,IsDeleted)
		SELECT S.EmployeeCode,S.WorkDate,@ShiftCode AS ShiftCode, @UserID,@UserID,0
		FROM #emp_days_d S
		WHERE S.Vacation <= 1
	END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeShifts_InsertTmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeShifts_InsertTmp]
(
	@EmployeeCode NVARCHAR(30),
	@WorkDate DATETIME,
	@ShiftCode NVARCHAR(20),
	@UserID NVARCHAR(50),
	@Err NVARCHAR(max) OUT
)
AS
BEGIN
	IF EXISTS (SELECT 1 FROM dbo.EmployeeShifts_tmp WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode AND WorkDate = @WorkDate)
	BEGIN
		UPDATE dbo.EmployeeShifts_tmp SET ShiftCode = @ShiftCode WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode AND WorkDate = @WorkDate
	END
	ELSE
	BEGIN
		INSERT INTO dbo.EmployeeShifts_tmp
		(EmployeeCode,WorkDate,ShiftCode,CreatedBy,UserID,IsDeleted)
		VALUES
		(  @EmployeeCode,@WorkDate,@ShiftCode,@UserID,@UserID,0)
	END
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeShifts_LoadCombobox]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeShifts_LoadCombobox]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@Lang NVARCHAR(10)
)
AS
	SELECT ShiftCode,ShiftName FROM dbo.LsShifts WHERE IsLock = 0
	SELECT DowCode,BegDate,EndDate FROM dbo.LsDowLists ORDER BY DowCode DESC
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeShifts_SaveData]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeShifts_SaveData]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Err NVARCHAR(max) OUT
)
AS
	SELECT EmployeeCode INTO #emp FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)
	SELECT EmployeeCode,WorkDate,ShiftCode INTO #shift FROM dbo.EmployeeShifts_tmp WHERE UserID = @UserID

	DELETE S FROM dbo.EmployeeShifts S INNER JOIN #emp E ON E.EmployeeCode = s.EmployeeCode
	WHERE s.WorkDate BETWEEN @BegDate AND @EndDate

	INSERT INTO EmployeeShifts(EmployeeCode,WorkDate,ShiftCode,CreatedOn,CreatedBy,IsDeleted)
	SELECT S.EmployeeCode,S.WorkDate,S.ShiftCode,GETDATE(),@UserID,0
	FROM #shift S
	WHERE ISNULL(S.ShiftCode,'') <> ''
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeShifts_setShiftDefault]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	xet ca mat dinh cho nhan vien
*/
CREATE PROC [dbo].[spEmployeeShifts_setShiftDefault]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@ShiftCode NVARCHAR(20),
	@IsSubWeekOff BIT,
	@IsSubHoliday BIT,
	@IsNotShift BIT
)
AS
BEGIN
	SELECT EmployeeCode INTO #lstOfEmp FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)

	SELECT E.EmployeeCode,D.mDate AS WorkDate,CASE WHEN (((G.LeaveType = 3 or G.LeaveType = 5) and ISNULL(W.LeavePeriod,0) NOT IN (1,2)) AND datepart(dw,D.mDate) = 7) or (ISNULL(W.LeavePeriod,0) IN (2,3)) THEN 1 
				WHEN ISNULL(G.LeaveType,0) = 1 
					or (G.LeaveType IN (3,5) and datepart(dw,D.mDate) = 7 and ISNULL(W.LeavePeriod,0) IN (1,2))
					OR (G.LeaveType IN (1,2,3) AND datepart(dw,D.mDate) = 1) 
					OR (G.LeaveType = 1 AND datepart(dw,D.mDate) = 7) THEN 2
				else 0 END as IsOffWeek,
				CASE WHEN Vs.VacationDay IS NOT NULL THEN 1 ELSE 0 END IsHoliday
	INTO #Emp
	FROM #lstOfEmp E
	CROSS APPLY dbo.fnSelectFromTODate(@BegDate,@EndDate) D
	LEFT JOIN dbo.EmployeeShifts S ON S.EmployeeCode = E.EmployeeCode AND S.WorkDate = D.mDate
	LEFT JOIN dbo.LsVacationDays Vs ON VS.VacationDay=D.mDate
	LEFT JOIN dbo.EmployeeWeekOffs w ON w.EmployeeCode = E.EmployeeCode AND w.WorkDate = d.mDate
	LEFT JOIN dbo.Employees F ON F.EmployeeCode = E.EmployeeCode
	LEFT JOIN dbo.lsLeaveGroups G ON G.LeaveGroupCode =F.LeaveGroupCode
	WHERE (@IsNotShift=1 AND S.ShiftCode IS NULL) OR (@IsNotShift=0)

	IF @IsSubWeekOff = 1
		DELETE FROM #Emp WHERE IsOffWeek=1
	IF @IsSubHoliday = 1
		DELETE FROM #Emp WHERE @IsSubHoliday=1

	IF @IsNotShift = 0
	BEGIN
		DELETE S FROM EmployeeShifts S INNER JOIN #lstOfEmp E ON E.EmployeeCode = S.EmployeeCode
	END	
	INSERT INTO dbo.EmployeeShifts(EmployeeCode,WorkDate,ShiftCode,CreatedOn,CreatedBy)
	SELECT EmployeeCode,WorkDate, @ShiftCode,GETDATE(), @UserID FROM #Emp
End
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeShifts_spDeleteAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeShifts_spDeleteAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME, 
	@EndDate DATETIME
)
AS
	DELETE S FROM dbo.EmployeeShifts S
	INNER JOIN dbo.fnGetEmpFilter(@UserID,@FunctionID) E ON E.EmployeeCode = S.EmployeeCode
	INNER JOIN (SELECT EmployeeCode FROM EmployeeShifts_tmp WHERE UserID=@UserID AND IsSelected=1) F ON F.EmployeeCode = S.EmployeeCode
	WHERE S.WorkDate BETWEEN @BegDate AND @EndDate

	DELETE FROM dbo.EmployeeShifts_tmp WHERE UserID = @UserID AND IsSelected=1
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeShifts_spGetAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec spEmployeeShifts_spGetAll 'admin','ts08',1,30,'',null
*/
CREATE PROC [dbo].[spEmployeeShifts_spGetAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max),
	@totalRow INT OUT
)
AS
	SELECT F.EmployeeCode, F.WorkDate, F.ShiftCode, F.Id --,ROW_NUMBER()OVER(ORDER BY F.EmployeeCode) AS RowIndex 
	INTO #lstOFEmp
	FROM dbo.EmployeeShifts_tmp F
	WHERE F.UserID = @UserID

	SELECT S.EmployeeCode, E.LastName,E.FirstName,E.DepartmentCode,ROW_NUMBER()OVER(ORDER BY S.EmployeeCode) AS RowIndex INTO #emp
	FROM #lstOFEmp S INNER JOIN dbo.Employees E ON E.EmployeeCode = S.EmployeeCode
	GROUP BY S.EmployeeCode, E.LastName,E.FirstName,E.DepartmentCode

	SELECT E.EmployeeCode, E.LastName, E.FirstName, P.Name AS DeptName, F.ID, F.WorkDate,F.ShiftCode
	FROM #lstOFEmp F
	INNER JOIN #emp E ON E.EmployeeCode = F.EmployeeCode
	LEFT JOIN dbo.Departments P ON P.Id = E.DepartmentCode
	WHERE E.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)

	SET @totalRow = 0
	SELECT @totalRow = COUNT(1) FROM #lstOFEmp
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeWeekOffs_CheckAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeWeekOffs_CheckAll]
(
	@UserID NVARCHAR(50),
	@IsCheck BIT	
)
AS
BEGIN
	UPDATE dbo.EmployeeWeekOffs_tmp SET IsSelected = @IsCheck WHERE UserID = @UserID
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeWeekOffs_CheckOne]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--GO
--CREATE PROC [dbo].[spEmployeeWeekOffs_CheckAll]
--(
--	@UserID NVARCHAR(50),
--	@IsCheck BIT	
--)
--AS
--BEGIN
--	UPDATE dbo.EmployeeWeekOffs_tmp SET IsSelected = @IsCheck WHERE UserID = @UserID
--END
--GO
CREATE PROC [dbo].[spEmployeeWeekOffs_CheckOne]
(
	@EmployeeCode NVARCHAR(30),
	@UserID NVARCHAR(50),
	@IsCheck BIT	
)
AS
BEGIN
	UPDATE dbo.EmployeeWeekOffs_tmp SET IsSelected = @IsCheck WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeWeekOffs_CreateDataTmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeWeekOffs_CreateDataTmp]
(
	@UserID NVARCHAR(50),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Err NVARCHAR(max) OUT
)
AS
	DELETE FROM EmployeeWeekOffs_tmp WHERE UserID=@UserID
	INSERT INTO EmployeeWeekOffs_tmp(UserID,EmployeeCode,WorkDate,LeavePeriod)
	SELECT @UserID,E.EmployeeCode, D.mDate, W.LeavePeriod
	FROM dbo.fnGetEmpFilter(@UserID,@FunctionID) E
	CROSS APPLY dbo.fnSelectFromTODate(@BegDate,@EndDate) D
	LEFT JOIN dbo.EmployeeWeekOffs W ON W.EmployeeCode = E.EmployeeCode AND W.WorkDate = D.mDate
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeWeekOffs_InsertTmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeWeekOffs_InsertTmp]
(
	@EmployeeCode NVARCHAR(30),
	@WorkDate DATETIME,
	@LeavePeriod NVARCHAR(20),
	@UserID NVARCHAR(50),
	@Err NVARCHAR(max) OUT
)
AS
BEGIN
	IF EXISTS (SELECT 1 FROM dbo.EmployeeWeekOffs_tmp WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode AND WorkDate = @WorkDate)
	BEGIN
		UPDATE dbo.EmployeeWeekOffs_tmp SET LeavePeriod = @LeavePeriod WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode AND WorkDate = @WorkDate
	END
	ELSE
	BEGIN
		INSERT INTO dbo.EmployeeWeekOffs_tmp
		(EmployeeCode,WorkDate,LeavePeriod,CreatedBy,UserID,IsDeleted)
		VALUES
		(  @EmployeeCode,@WorkDate,@LeavePeriod,@UserID,@UserID,0)
	END
END
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeWeekOffs_LoadCombobox]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeWeekOffs_LoadCombobox]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@Lang NVARCHAR(10)
)
AS
	SELECT DowCode,BegDate,EndDate FROM dbo.LsDowLists ORDER BY DowCode DESC
	SELECT Value AS LeavePeriod,Caption AS LeavePeriodName FROM dbo.fnGetValueList(@Lang,'LLeavePeriod')
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeWeekOffs_SaveData]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeWeekOffs_SaveData]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Err NVARCHAR(max) OUT
)
AS
	SELECT EmployeeCode INTO #emp FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)
	SELECT EmployeeCode,WorkDate,LeavePeriod INTO #shift FROM dbo.EmployeeWeekOffs_tmp WHERE UserID = @UserID

	DELETE S FROM dbo.EmployeeWeekOffs S INNER JOIN #emp E ON E.EmployeeCode = s.EmployeeCode
	WHERE s.WorkDate BETWEEN @BegDate AND @EndDate

	INSERT INTO EmployeeWeekOffs(EmployeeCode,WorkDate,LeavePeriod,CreatedOn,CreatedBy,IsDeleted)
	SELECT S.EmployeeCode,S.WorkDate,S.LeavePeriod,GETDATE(),@UserID,0
	FROM #shift S
	WHERE ISNULL(S.ShiftCode,'') <> ''
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeWeekOffs_spDeleteAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmployeeWeekOffs_spDeleteAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME, 
	@EndDate DATETIME
)
AS
	DELETE S FROM dbo.EmployeeWeekOffs S
	INNER JOIN dbo.fnGetEmpFilter(@UserID,@FunctionID) E ON E.EmployeeCode = S.EmployeeCode
	INNER JOIN (SELECT EmployeeCode FROM EmployeeWeekOffs_tmp WHERE UserID=@UserID AND IsSelected=1) F ON F.EmployeeCode = S.EmployeeCode
	WHERE S.WorkDate BETWEEN @BegDate AND @EndDate

	DELETE FROM dbo.EmployeeWeekOffs_tmp WHERE UserID = @UserID AND IsSelected=1
GO
/****** Object:  StoredProcedure [dbo].[spEmployeeWeekOffs_spGetAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec spEmployeeWeekOffs_spGetAll 'admin','ts08',1,30,'',null
*/
CREATE PROC [dbo].[spEmployeeWeekOffs_spGetAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max),
	@totalRow INT OUT
)
AS
	SELECT F.EmployeeCode, F.WorkDate, F.LeavePeriod, F.Id --,ROW_NUMBER()OVER(ORDER BY F.EmployeeCode) AS RowIndex 
	INTO #lstOFEmp
	FROM dbo.EmployeeWeekOffs_tmp F
	WHERE F.UserID = @UserID

	SELECT S.EmployeeCode, E.LastName,E.FirstName,E.DepartmentCode,ROW_NUMBER()OVER(ORDER BY S.EmployeeCode) AS RowIndex INTO #emp
	FROM #lstOFEmp S INNER JOIN dbo.Employees E ON E.EmployeeCode = S.EmployeeCode
	GROUP BY S.EmployeeCode, E.LastName,E.FirstName,E.DepartmentCode

	SELECT E.EmployeeCode, E.LastName, E.FirstName, P.Name AS DeptName, F.ID, F.WorkDate,F.LeavePeriod
	FROM #lstOFEmp F
	INNER JOIN #emp E ON E.EmployeeCode = F.EmployeeCode
	LEFT JOIN dbo.Departments P ON P.Id = E.DepartmentCode
	WHERE E.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)

	SET @totalRow = 0
	SELECT @totalRow = COUNT(1) FROM #lstOFEmp
GO
/****** Object:  StoredProcedure [dbo].[spEmpOverTimeReg_CheckAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpOverTimeReg_CheckAll]
(
	@UserID NVARCHAR(50),
	@IsCheck BIT	
)
AS
BEGIN
	UPDATE dbo.EmpOverTimeReg_tmp SET IsSelected = @IsCheck WHERE UserID = @UserID
END
GO
/****** Object:  StoredProcedure [dbo].[spEmpOverTimeReg_CheckOne]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpOverTimeReg_CheckOne]
(
	@EmployeeCode NVARCHAR(30),
	@UserID NVARCHAR(50),
	@IsCheck BIT	
)
AS
BEGIN
	UPDATE dbo.EmpOverTimeReg_tmp SET IsSelected = @IsCheck WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode
END
GO
/****** Object:  StoredProcedure [dbo].[spEmpOverTimeReg_CreateDataTmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpOverTimeReg_CreateDataTmp]
(
	@UserID NVARCHAR(50),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Err NVARCHAR(max) OUT
)
AS
	SELECT E.EmployeeCode, E.DepartmentCode, E.JobWCode, E.JoinDate, E.EndDate
	INTO #Emp
	FROM dbo.Employees E  with(NOLOCK)
	inner join dbo.fnGetEmpFilter(@UserID,@FunctionID) F  on F.EmployeeCode = E.EmployeeCode
	where E.JoinDate <= @EndDate and (E.EndDate IS null	OR (E.EndDate IS NOT NULL AND E.EndDate > @BegDate))
	option (maxrecursion 0)

	DELETE FROM dbo.EmpOverTimeReg_tmp WHERE UserID=@UserID

	INSERT INTO dbo.EmpOverTimeReg_tmp(EmployeeCode,WorkDate,FromTime,ToTime,HourNum,CreatedOn,CreatedBy,UserID)
	SELECT R.EmployeeCode,D.mDate as WorkDate,R.FromTime,R.ToTime,R.HourNum,GETDATE(), @UserID,@UserID
	FROM #Emp E CROSS APPLY dbo.fnSelectFromTODate(@BegDate,@EndDate) D
	LEFT JOIN dbo.EmpOverTimeReg R ON R.EmployeeCode = E.EmployeeCode AND R.WorkDate = D.mDate
GO
/****** Object:  StoredProcedure [dbo].[spEmpOverTimeReg_InsertTmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpOverTimeReg_InsertTmp]
(
	@EmployeeCode NVARCHAR(30),
	@WorkDate DATETIME,
	@FromTime DATETIME,
	@ToTime DATETIME,
	@Hour FLOAT,
	@UserID NVARCHAR(50),
	@Err NVARCHAR(max) OUT
)
AS
BEGIN
	IF EXISTS (SELECT 1 FROM dbo.EmpOverTimeReg_tmp WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode AND WorkDate = @WorkDate)
	BEGIN
		UPDATE dbo.EmpOverTimeReg_tmp SET FromTime = @FromTime,ToTime=@ToTime,HourNum = @Hour
		WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode AND WorkDate = @WorkDate
	END
	ELSE
	BEGIN
		INSERT INTO dbo.EmpOverTimeReg_tmp
		(EmployeeCode,WorkDate,FromTime,ToTime,HourNum,CreatedBy,UserID)
		VALUES
		(  @EmployeeCode,@WorkDate,@FromTime,@ToTime, @Hour,@UserID,@UserID)
	END
END
GO
/****** Object:  StoredProcedure [dbo].[spEmpOverTimeReg_LoadCombobox]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpOverTimeReg_LoadCombobox]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@Lang NVARCHAR(10)
)
AS
	SELECT DowCode,BegDate,EndDate FROM dbo.LsDowLists ORDER BY DowCode DESC
GO
/****** Object:  StoredProcedure [dbo].[spEmpOverTimeReg_SaveData]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpOverTimeReg_SaveData]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Err NVARCHAR(max) OUT
)
AS
	SELECT EmployeeCode INTO #emp FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)
	SELECT EmployeeCode,WorkDate,FromTime,ToTime,HourNum INTO #Overtime FROM dbo.EmpOverTimeReg_tmp WHERE UserID = @UserID

	DELETE S FROM dbo.EmpOverTimeReg S INNER JOIN #emp E ON E.EmployeeCode = s.EmployeeCode
	WHERE s.WorkDate BETWEEN @BegDate AND @EndDate

	INSERT INTO EmpOverTimeReg(EmployeeCode,WorkDate,FromTime,ToTime,HourNum,CreatedOn,CreatedBy)
	SELECT S.EmployeeCode,S.WorkDate,S.FromTime,S.ToTime,S.HourNum,GETDATE(),@UserID
	FROM #Overtime S
GO
/****** Object:  StoredProcedure [dbo].[spEmpOverTimeReg_spDeleteAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpOverTimeReg_spDeleteAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME, 
	@EndDate DATETIME
)
AS
	DELETE S FROM dbo.EmpOverTimeReg S
	INNER JOIN dbo.fnGetEmpFilter(@UserID,@FunctionID) E ON E.EmployeeCode = S.EmployeeCode
	INNER JOIN (SELECT EmployeeCode FROM EmpOverTimeReg_tmp WHERE UserID=@UserID AND IsSelected=1) F ON F.EmployeeCode = S.EmployeeCode
	WHERE S.WorkDate BETWEEN @BegDate AND @EndDate

	DELETE FROM dbo.EmpOverTimeReg_tmp WHERE UserID = @UserID AND IsSelected=1
GO
/****** Object:  StoredProcedure [dbo].[spEmpOverTimeReg_spGetAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec spEmpOverTimeReg_spGetAll 'admin','ts08',1,30,'',null
*/
CREATE PROC [dbo].[spEmpOverTimeReg_spGetAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max),
	@totalRow INT OUT
)
AS
	SELECT F.EmployeeCode, F.WorkDate, F.FromTime,F.ToTime,F.HourNum, F.Id --,ROW_NUMBER()OVER(ORDER BY F.EmployeeCode) AS RowIndex 
	INTO #lstOFEmp
	FROM dbo.EmpOverTimeReg_tmp F
	WHERE F.UserID = @UserID

	SELECT S.EmployeeCode, E.LastName,E.FirstName,E.DepartmentCode,ROW_NUMBER()OVER(ORDER BY S.EmployeeCode) AS RowIndex INTO #emp
	FROM #lstOFEmp S INNER JOIN dbo.Employees E ON E.EmployeeCode = S.EmployeeCode
	GROUP BY S.EmployeeCode, E.LastName,E.FirstName,E.DepartmentCode

	SELECT E.EmployeeCode, E.LastName, E.FirstName, P.Name AS DeptName, F.ID, F.WorkDate,F.FromTime,F.ToTime,F.HourNum
	FROM #lstOFEmp F
	INNER JOIN #emp E ON E.EmployeeCode = F.EmployeeCode
	LEFT JOIN dbo.Departments P ON P.Id = E.DepartmentCode
	WHERE E.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)

	SET @totalRow = 0
	SELECT @totalRow = COUNT(1) FROM #lstOFEmp
GO
/****** Object:  StoredProcedure [dbo].[spEmpRegLateEarly_CheckAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpRegLateEarly_CheckAll]
(
	@UserID NVARCHAR(50),
	@IsCheck BIT	
)
AS
BEGIN
	UPDATE dbo.EmpRegLateEarly_tmp SET IsSelected = @IsCheck WHERE UserID = @UserID
END
GO
/****** Object:  StoredProcedure [dbo].[spEmpRegLateEarly_CheckOne]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpRegLateEarly_CheckOne]
(
	@EmployeeCode NVARCHAR(30),
	@UserID NVARCHAR(50),
	@IsCheck BIT	
)
AS
BEGIN
	UPDATE dbo.EmpRegLateEarly_tmp SET IsSelected = @IsCheck WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode
END
GO
/****** Object:  StoredProcedure [dbo].[spEmpRegLateEarly_CreateDataTmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpRegLateEarly_CreateDataTmp]
(
	@UserID NVARCHAR(50),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Err NVARCHAR(max) OUT
)
AS
	DELETE FROM EmpRegLateEarly_tmp WHERE UserID=@UserID
	INSERT INTO EmpRegLateEarly_tmp(UserID,EmployeeCode,WorkDate,LateIn,EarlyOut,DTFrom,DTTo,VSFrom,VSTo,Kind,CreatedOn,CreatedBy)
	SELECT @UserID,E.EmployeeCode, D.mDate, W.LateIn,W.EarlyOut,W.DTFrom,W.DTTo,W.VSFrom,W.VSTo,W.Kind, GETDATE(),@UserID
	FROM dbo.fnGetEmpFilter(@UserID,@FunctionID) E
	CROSS APPLY dbo.fnSelectFromTODate(@BegDate,@EndDate) D
	LEFT JOIN dbo.EmpRegLateEarly W ON W.EmployeeCode = E.EmployeeCode AND W.WorkDate = D.mDate
GO
/****** Object:  StoredProcedure [dbo].[spEmpRegLateEarly_InsertTmp]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpRegLateEarly_InsertTmp]
(
	@EmployeeCode NVARCHAR(30),
	@WorkDate DATETIME,
	@EarlyOut float,
	@LateIn FLOAT,
	@DTFrom VARCHAR(5),
	@DTTo VARCHAR(5),
	@VSFrom VARCHAR(5),
	@VSTo VARCHAR(5),
	@Kind VARCHAR(2),
	@UserID NVARCHAR(50),
	@Err NVARCHAR(max) OUT
)
AS
BEGIN
	IF EXISTS (SELECT 1 FROM dbo.EmpRegLateEarly_tmp WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode AND WorkDate = @WorkDate)
	BEGIN
		UPDATE dbo.EmpRegLateEarly_tmp SET EarlyOut = @EarlyOut, LateIn = @LateIn, DTFrom = @DTFrom, DTTo = @DTTo,
					VSFrom = @VSFrom, VSTo = @VSTo, Kind = @Kind
		WHERE UserID = @UserID AND EmployeeCode = @EmployeeCode AND WorkDate = @WorkDate
	END
	ELSE
	BEGIN
		INSERT INTO dbo.EmpRegLateEarly_tmp
		(EmployeeCode,WorkDate,LateIn,EarlyOut,DTFrom,DTTo,VSFrom,VSTo,Kind,CreatedBy,UserID)
		VALUES
		(  @EmployeeCode,@WorkDate,@LateIn,@EarlyOut,@DTFrom,@DTTo,@VSFrom,@VSTo,@Kind,@UserID,@UserID)
	END
END
GO
/****** Object:  StoredProcedure [dbo].[spEmpRegLateEarly_LoadCombobox]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpRegLateEarly_LoadCombobox]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@Lang NVARCHAR(10)
)
AS
	SELECT DowCode,BegDate,EndDate FROM dbo.LsDowLists ORDER BY DowCode DESC
	SELECT Value AS LateEarlyKind,Caption AS LateEarlyKindName FROM dbo.fnGetValueList(@Lang,'LLateEarlyKind')
GO
/****** Object:  StoredProcedure [dbo].[spEmpRegLateEarly_SaveData]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpRegLateEarly_SaveData]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Err NVARCHAR(max) OUT
)
AS
	SELECT EmployeeCode INTO #emp FROM dbo.fnGetEmpFilter(@UserID,@FunctionID)
	SELECT EmployeeCode,WorkDate,LateIn,EarlyOut,DTFrom,DTTo,VSFrom,VSTo,Kind INTO #shift FROM dbo.EmpRegLateEarly_tmp WHERE UserID = @UserID

	DELETE S FROM dbo.EmpRegLateEarly S INNER JOIN #emp E ON E.EmployeeCode = s.EmployeeCode
	WHERE s.WorkDate BETWEEN @BegDate AND @EndDate

	INSERT INTO EmpRegLateEarly(EmployeeCode,WorkDate,LateIn,EarlyOut,DTFrom,DTTo,VSFrom,VSTo,Kind,CreatedOn,CreatedBy)
	SELECT S.EmployeeCode,S.WorkDate,S.LateIn,S.EarlyOut,S.DTFrom,S.DTTo,S.VSFrom,S.VSTo,S.Kind,GETDATE(),@UserID
	FROM #shift S
GO
/****** Object:  StoredProcedure [dbo].[spEmpRegLateEarly_spDeleteAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spEmpRegLateEarly_spDeleteAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@BegDate DATETIME, 
	@EndDate DATETIME
)
AS
	DELETE S FROM dbo.EmpRegLateEarly S
	INNER JOIN dbo.fnGetEmpFilter(@UserID,@FunctionID) E ON E.EmployeeCode = S.EmployeeCode
	INNER JOIN (SELECT EmployeeCode FROM EmpRegLateEarly_tmp WHERE UserID=@UserID AND IsSelected=1) F ON F.EmployeeCode = S.EmployeeCode
	WHERE S.WorkDate BETWEEN @BegDate AND @EndDate

	DELETE FROM dbo.EmpRegLateEarly_tmp WHERE UserID = @UserID AND IsSelected=1
GO
/****** Object:  StoredProcedure [dbo].[spEmpRegLateEarly_spGetAll]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec spEmpRegLateEarly_spGetAll 'admin','ts08',1,30,'',null
*/
CREATE PROC [dbo].[spEmpRegLateEarly_spGetAll]
(
	@UserID NVARCHAR(100),
	@FunctionID NVARCHAR(100),
	@PageIndex int,
	@PageSize int,
	@KeySearch nvarchar(max),
	@totalRow INT OUT
)
AS
	SELECT F.EmployeeCode, F.WorkDate, F.LateIn,F.EarlyOut,F.DTFrom,F.DTTo,F.VSFrom,F.VSTo,F.Kind, F.Id --,ROW_NUMBER()OVER(ORDER BY F.EmployeeCode) AS RowIndex 
	INTO #lstOFEmp
	FROM dbo.EmpRegLateEarly_tmp F
	WHERE F.UserID = @UserID

	SELECT S.EmployeeCode, E.LastName,E.FirstName,E.DepartmentCode,ROW_NUMBER()OVER(ORDER BY S.EmployeeCode) AS RowIndex INTO #emp
	FROM #lstOFEmp S INNER JOIN dbo.Employees E ON E.EmployeeCode = S.EmployeeCode
	GROUP BY S.EmployeeCode, E.LastName,E.FirstName,E.DepartmentCode

	SELECT E.EmployeeCode, E.LastName, E.FirstName, P.Name AS DeptName, F.ID, F.WorkDate,F.LateIn,F.EarlyOut,F.DTFrom,F.DTTo,F.VSFrom,F.VSTo,F.Kind
	FROM #lstOFEmp F
	INNER JOIN #emp E ON E.EmployeeCode = F.EmployeeCode
	LEFT JOIN dbo.Departments P ON P.Id = E.DepartmentCode
	WHERE E.RowIndex between (((@PageIndex-1) * @PageSize) + 1) and (@PageIndex * @PageSize)

	SET @totalRow = 0
	SELECT @totalRow = COUNT(1) FROM #lstOFEmp
GO
/****** Object:  StoredProcedure [dbo].[spGetCombobox_PhanCa]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spGetCombobox_PhanCa]
(
	@UserID NVARCHAR(20),
	@Lang NVARCHAR(10)
)
AS
	SELECT LeaveGroupCode,LeaveGroupName FROM dbo.lsLeaveGroups
	SELECT ShiftCode,ShiftName FROM dbo.LsShifts
	SELECT DowCode,BegDate,EndDate FROM dbo.LsDowLists
GO
/****** Object:  StoredProcedure [dbo].[spGetCombobox_TestOutPut]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spGetCombobox_TestOutPut]
(
	@UserID NVARCHAR(20),
	@Lang NVARCHAR(10),
	@Err NVARCHAR(max) OUT
)
AS
	SET @Err = 'tra ve ket qua'
GO
/****** Object:  StoredProcedure [dbo].[spKowTimeSheet]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec spKowTimeSheet 'admin','NV', '2021/04/01', '2021/04/20', null
*/
CREATE PROC [dbo].[spKowTimeSheet]
(
	@UserID NVARCHAR(200),
	@strEmpID NVARCHAR(MAX) = '__NV001__',
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Err NVARCHAR(MAX) OUT
)
AS
BEGIN
	--DROP TABLE Test01
	--CREATE TABLE Test01(emp NVARCHAR(100),begdate DATETIME,enddate DATETIME)
	
	set @BegDate = convert(NVARCHAR(10),@BegDate,111)
	set @EndDate = convert(NVARCHAR(10),@EndDate,111)
	set @Err = ''
	CREATE TABLE #lstOfNgayLeWithEmp(EmployeeCode NVARCHAR(20), WorkDate DATETIME, Vacation INT, gSGMC FLOAT, NgayThuongOfNgayOff INT, IsHaftDays bit)
	--xet xem có chạy theo từng BU hay ko.
	--neu ko chay theo BU thì xử lý như cũ.
	EXEC spKowTimeSheet_sub @UserID, @strEmpID, @BegDate, @EndDate, @Err OUT

	--nghi phep/bu HCSTS_spUpDateDayOffEmpInToKowDs
	exec spUpDateDayOffEmpInToKowDs @UserID,'',@strEmpID,@BegDate,@EndDate,1,null
END
GO
/****** Object:  StoredProcedure [dbo].[spKowTimeSheet_sub]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	create: 13/04/2021
	exec spKowTimeSheet 'admin','NV', '2021/04/01', '2021/04/20', null
*/
CREATE PROC [dbo].[spKowTimeSheet_sub]
(
	@UserID NVARCHAR(200),
	@strEmpID NVARCHAR(MAX),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@Err NVARCHAR(MAX) OUT
)
AS
BEGIN
	set @BegDate = convert(NVARCHAR(10),@BegDate,111)
	set @EndDate = convert(NVARCHAR(10),@EndDate,111)
	set @Err = ''
	SET NOCOUNT ON
	--SELECT 'ffff'
	--SQL version: 12.0.x.x	SQL 2014, 11.0.x.x	SQL 2012, 10.50.x.x	SQL 2008 R2, 10.00.x.x	SQL 2008
	--9.00.x.x	SQL 2005, 8.00.x.x	SQL 2000
	declare @SQLVersion int 
	declare @gSSLNC int set @gSSLNC = 2
	declare @IsSGMC_AllowShift bit set @IsSGMC_AllowShift = 0 --Số giờ một công thay đổi theo ca
	declare @TSIsCalOTByRegister bit --OT được tính phải có đăng ký OT 
	declare @TSIsCalOTByConfirm bit --OT được tính phải có xác nhận
	declare @TSIsWLeaveRegOT bit --Chi tính tăng ca ngày nghỉ khi có đăng ký
	declare @TSIsHolidayRegOT bit -- chỉnh tính tăng ca ngày lễ khi có đăng ký
	declare @TSCalOT int --Ngoài giờ/ Valuelist: 1. Tính chính xác theo thời gian làm thực tế; 2. Tính chính xác theo thời gian làm thực tế nhưng số phút tối thiểu như sau; 3. Tính theo từng block; 4. Chỉ tính khi nhân viên làm đủ thời gian đăng ký trở lên
	declare @TSIsRegOTByFromTo bit --True: Đăng ký tăng ca theo thời điểm, false: đăng ký theo số giờ
	declare @TSIsExactKowOnHoliday bit --TTChung/ Tính công chính xác khi đi làm vào ngày nghỉ, ngày lễ cho nhóm nhân viên: không tính đi trễ về sớm.
	declare @TSIsSubLateEarlyOnHoliday bit --TTChung/ Tính trừ đi trễ về sớm theo quy định khi đi làm vào ngày nghỉ, lễ.
	declare @TSIsNightByHour bit --TTChung/ Công làm đêm tính theo giờ
	declare @TSIsOTByHour bit --TTChung/ Công ngoài giờ tính theo giờ
	declare @TSIsHolidayKow bit --	Ngày lễ/ Có thêm một ngày công sau khi quy đổi sang ngày lễ
	declare @TSHolidayKowCode nvarchar(100)	--Ngày lễ/ Có thêm một ngày công sau khi quy đổi sang ngày lễ - Loại công.Ref: DM loại công (LsKows)
	declare @TSIsLate bit--Đi trễ/ Trừ đi trễ theo quy định của công ty
	declare @TSIsEarly bit --Về sớm/ Trừ đi trễ theo quy định của công ty
	declare @TSIsLateEarly bit --Đi trễ - Về sớm/ Trừ đi trễ-Về sớm theo quy định của công ty
	declare @TSIsCalOTChange bit --Block OT/Có chính sách tính riêng cho từng chi nhánh.
	declare @WLeaveDayValue int -- Chế độ nghỉ tuần(Thiết lập chung cho toàn Cty)
	declare @TSOTMinShift float-- Số phút OT tối thiểu được tính
	DECLARE @TSIsLateEarlyAllowShift BIT --Tinh trư số phút ĐTVS theo thiết lập số giờ thực tế trong Ca làm việc(ca quy định môc thời gian sáng chiều trong từng đoạn)
	DECLARE @TSIsCalOTAlloRegis BIT SET @TSIsCalOTAlloRegis = 0--ngoai gio dang ky bao nhieu tinh bay nhieu
	DECLARE @IsDTVSThaiSan_TinhRieng BIT SET @IsDTVSThaiSan_TinhRieng = 0 --tinh riêng đi trễ - về sớm cho chính sách dc phép Đi trễ về sớm(thai sản)
	DECLARE @IsApplyBlockOTWithHoliday BIT SET @IsApplyBlockOTWithHoliday = 0 --Lam tron OT theo block khi di lam vao ngày nghi/le
	DECLARE @KOW2LastPayroll NVARCHAR(20) SET @KOW2LastPayroll ='0'
	DECLARE @IsCalLateWithMonth BIT --Tinh cong di tre-Số lần trên tháng
	DECLARE @NumMaxAllowLateInMonth INT,@MinMaxAllowLateInMonth FLOAT

	--Table Luu cong tinh ra tu quet the
	create table #EmpKowDays(EmployeeCode nvarchar(100), WorkDate datetime, KowCode nvarchar(100), DayNum float)

	--thay truyen truc tiep nhan vien can ktra(cu truyen bo loc filter de chay cho cac job tu dong tinh cong)
	SELECT DepartmentCode, BegDate, EndDate INTO #lstOfLockTimeSheet 
	FROM fnCheckLockDataTimeSheet_WithEmp(NULL,@strEmpID, NULL, @BegDate, @EndDate)
	option (maxrecursion 0)

	--Get thông tin thiết lập chung
	SELECT TOP(1) @gSSLNC = isnull(S.TSDecPlaceWD,0),@IsSGMC_AllowShift = isnull(S.TSIsChangeHoursPerWDByShift,0),
			@TSIsCalOTByRegister = isnull(S.TSIsCalOTByRegister,0), @TSIsCalOTByConfirm = isnull(S.TSIsCalOTByConfirm,0),
			@TSIsWLeaveRegOT = isnull(S.TSIsWLeaveRegOT,0), @TSIsHolidayRegOT = isnull(S.TSIsHolidayRegOT,0),
			@TSCalOT = isnull(S.TSCalOT,1), @TSIsRegOTByFromTo = isnull(S.TSIsRegOTByFromTo,0),
			@TSIsExactKowOnHoliday = isnull(S.TSIsExactKowOnHoliday,0), @TSIsSubLateEarlyOnHoliday = isnull(S.TSIsSubLateEarlyOnHoliday,0),
			@TSIsNightByHour = isnull(S.TSIsNightByHour,0), @TSIsOTByHour = isnull(S.TSIsOTByHour,0),
			@TSIsHolidayKow = isnull(S.TSIsHolidayKow,0), @TSHolidayKowCode = isnull(S.TSHolidayKowCode,''),
			@TSIsLate = isnull(S.TSIsLate,0), @TSIsEarly = isnull(S.TSIsEarly,0), @TSIsLateEarly = ISNULL(S.TSIsLateEarly,0),
			@TSIsCalOTChange = isnull(S.TSIsCalOTChange,0),
			@WLeaveDayValue = isnull(L.LeaveType,1), @TSOTMinShift = isnull(TSOTMinShift,0), @TSIsLateEarlyAllowShift = ISNULL(TSIsLateEarlyAllowShift,0),
			@TSIsCalOTAlloRegis = ISNULL(S.TSIsCalOTAlloRegis,0),
			@IsDTVSThaiSan_TinhRieng = ISNULL(S.TSIsLateEarlyAllowDistinct,0), @IsApplyBlockOTWithHoliday = ISNULL(S.IsApplyBlockOTWithHoliday,0),
			@IsCalLateWithMonth = IsCalLateWithMonth, @NumMaxAllowLateInMonth = S.NumMaxAllowLateInMonth,
			@MinMaxAllowLateInMonth = S.MinMaxAllowLateInMonth
	from sysConfigTS S with(NOLOCK)
	left JOIN dbo.lsLeaveGroups L WITH(NOLOCK) on L.LeaveGroupCode = S.TSWLeaveDayCode

	SELECT ce.* INTO #tmpEmps FROM (
		SELECT LTRIM(RTRIM(data)) AS EmployeeCode from dbo.FNSplitString(@strEmpID,',')
	) AS ce
	option (maxrecursion 0)
	
	--SELECT * FROM #tmpEmps
	SELECT S.DowCode, S.BegDate AS BegDate, S.EndDate AS EndDate INTO #lstOfPayRoll
	FROM dbo.LsDowLists S WITH(NOLOCK)

	select A.EmployeeCode as EmployeeCode, WorkDate, ShiftCode into #EmployeeShifts 
	FROM dbo.EmployeeShifts AS A with(NOLOCK) INNER JOIN #tmpEmps AS E ON A.EmployeeCode = E.EmployeeCode 
	WHERE WorkDate between @BegDate and @EndDate

	--Tap nhan vien can tinh
	create table #Emp(EmployeeCode nvarchar(100), DepartmentCode nvarchar(100), JobWCode nvarchar(100), JoinDate datetime, EndDate datetime, GroupSalCode nvarchar(100), 
			IsNotScan bit, IsNotLateEarly bit, IsNotOTKow bit, Alt_Shift bit, ShiftCode nvarchar(100), WLeaveDayValue INT, IsPrivateT7 BIT,
			NumMaxAllowLateInMonth INT, MinMaxAllowLateInMonth FLOAT)
	
	insert INTO #Emp(EmployeeCode , DepartmentCode , JobWCode , JoinDate , EndDate , GroupSalCode , 
			IsNotScan , IsNotLateEarly , IsNotOTKow , Alt_Shift , ShiftCode, WLeaveDayValue, IsPrivateT7)
	SELECT E.EmployeeCode, E.DepartmentCode, E.JobWCode, E.JoinDate, E.EndDate, '' as GroupSalCode, 
			E.IsNotScan, E.IsNotLateEarly, E.IsNotOTKow, isnull(E.Alt_Shift,0) as  Alt_Shift, E.ShiftCode, 
			isnull(L.LeaveType, @WLeaveDayValue) as WLeaveDayValue, 0
	FROM dbo.Employees E  with(NOLOCK)
	inner join #tmpEmps F  on F.EmployeeCode = E.EmployeeCode
	left JOIN dbo.lsLeaveGroups L WITH(NOLOCK) on L.LeaveGroupCode = E.LeaveGroupCode
	where E.JoinDate <= @EndDate and (E.EndDate IS null	OR (E.EndDate IS NOT NULL AND E.EndDate > @BegDate))
	option (maxrecursion 0)
	
	--SELECT * FROM #Emp
	--Xoa Đi trễ - về sớm
	delete K from EmpKowLateEarly K inner JOIN #Emp E on E.EmployeeCode = K.EmployeeCode
	LEFT JOIN #lstOfLockTimeSheet LC ON LC.DepartmentCode = E.DepartmentCode AND K.WorkDate BETWEEN LC.BegDate AND LC.EndDate
	where K.WorkDate between @BegDate and @EndDate
	delete K from dbo.EmpKowLateEarly_sub K inner JOIN #Emp E on E.EmployeeCode = K.EmployeeCode
	LEFT JOIN #lstOfLockTimeSheet LC ON LC.DepartmentCode = E.DepartmentCode AND K.WorkDate BETWEEN LC.BegDate AND LC.EndDate
	where K.WorkDate between @BegDate and @EndDate

	--ktra so lan vs so phut DTVS dc phep con lai trong thang
	IF @IsCalLateWithMonth = 1
	BEGIN
		SELECT S.EmployeeCode,p.DowCode,p.BegDate,p.EndDate,SUM(S.MinMaxAllowLateInMonth) AS SoPhut,COUNT(1) AS SoLan INTO #SoPhutDTVSDaSuDung
		FROM EmpKowLateEarly S WITH(NOLOCK) INNER JOIN #Emp E ON E.EmployeeCode = S.EmployeeCode
		INNER JOIN #lstOfPayRoll P ON S.WorkDate BETWEEN P.BegDate AND P.EndDate
		WHERE ISNULL(S.MinMaxAllowLateInMonth,0) > 0
		GROUP BY S.EmployeeCode,p.DowCode,p.BegDate,p.EndDate

		UPDATE E SET E.MinMaxAllowLateInMonth = E.MinMaxAllowLateInMonth - S.SoPhut, E.NumMaxAllowLateInMonth = E.NumMaxAllowLateInMonth - S.SoLan
		FROM #Emp E 
		INNER JOIN #SoPhutDTVSDaSuDung S ON S.EmployeeCode = E.EmployeeCode
	END
	--SELECT * FROM #Emp
	
	SELECT R.RecID, R.EmployeeCode, cast(convert(nvarchar(10), R.WorkDate,111) as datetime) as WorkDate, 
								cast(convert(nvarchar(10), R.ForDate,111) as datetime) as ForDate, 
								R.HourNum AS HourNum, 
			R.Note, R.RealHourNum, row_number()over(partition by R.EmployeeCode order by R.ForDate) as RowIndex
	INTO #EmpRegisterExtraWorkDay_tmp
	FROM EmpRegisterExtraWorkDay R WITH(NOLOCK) inner join #Emp E on E.EmployeeCode = R.EmployeeCode
	WHERE (R.WorkDate between @BegDate AND @EndDate OR R.ForDate BETWEEN @BegDate AND @EndDate) and isnull(R.HourNum,0) > 0
	
	update #EmpRegisterExtraWorkDay_tmp set RowIndex = 0 where WorkDate = ForDate

	--tap công chuyển đổi khi đi làm vào ngày nghỉ ngày lễ
	SELECT S.IsHoliday,S.KowCode,S.CKowCode INTO  #sysConfigTSEmpDayOff 
	FROM dbo.sysConfigTSEmpDayOff S WITH(NOLOCK) 

	--Block tinh OT
	SELECT   S.EmployeeCode, S.TSCalOT, S.TSMinShift, S.MinFrom, S.MinTo, S.MinCal
	into #sysConfigTSEmpOT_OT
	FROM   sysConfigTSEmpOT S WITH(NOLOCK) inner join #Emp E on E.EmployeeCode = S.EmployeeCode

--SELECT * FROM #Emp
	--Tap danh muc ngay cong chuan
	SELECT W.DowCode as DowCode, W.BegDate as BegDay, W.EndDate as EndDay, NULL AS CutoffDay, 0 AS ExpiryAfterDays
	INTO #lsPayrollDow
	FROM #lstOfPayRoll W

	--SET @KOW2LastPayroll_V2 = 1
	DECLARE @KOW2LastPayroll_V2 BIT, @Now DATETIME SET @Now = CONVERT(NVARCHAR(10),GETDATE(),111)
	SET @KOW2LastPayroll_V2 = 0
	--Tập nhân viên cần tính theo ngày.
	--Vacation: 3 ngay le, 2 ngay nghi nguyen ngay, 1 ngay nghi 1/2 ngay, 0 ngay binh thuong
	select E.EmployeeCode, E.DepartmentCode, E.JobWCode, E.GroupSalCode, E.IsNotScan, E.IsNotLateEarly, E.IsNotOTKow, 
			CASE WHEN E.Alt_Shift = 1 THEN S.ShiftCode else E.ShiftCode end as ShiftCode, D.mDate as WorkDate, 
			isnull(C.TSHoursPerWD,8) as gSGMC, 
			CASE WHEN Vs.VacationDay IS NOT NULL THEN 3
				WHEN (((E.WLeaveDayValue = 3 or E.WLeaveDayValue = 5) and ISNULL(F.LeavePeriod,0) NOT IN (1,2)) AND datepart(dw,D.mDate) = 7) or (ISNULL(F.LeavePeriod,0) IN (2,3)) THEN 1 
				WHEN ISNULL(F.LeavePeriod,0) = 1 
					or (E.WLeaveDayValue IN (3,5) and datepart(dw,D.mDate) = 7 and ISNULL(F.LeavePeriod,0) IN (1,2))
					OR (E.WLeaveDayValue IN (1,2,3) AND datepart(dw,D.mDate) = 1) 
					OR (E.WLeaveDayValue = 1 AND datepart(dw,D.mDate) = 7) THEN 2
				else 0 END as Vacation, convert(NVARCHAR(10),D.mDate,111) as strWorkDate, datepart(dw,D.mDate) AS DatesName,
				ISNULL(E.Alt_Shift,0) AS Alt_Shift, E.ShiftCode AS ShiftCodeEmp,
			CASE WHEN ISNULL(F.LeavePeriod,0) = 1 
					or (E.WLeaveDayValue IN (3,5) and datepart(dw,D.mDate) = 7 and ISNULL(F.LeavePeriod,0) IN (1,2))
					OR (E.WLeaveDayValue IN (1,2,3) AND datepart(dw,D.mDate) = 1) 
					OR (E.WLeaveDayValue = 1 AND datepart(dw,D.mDate) = 7) THEN 2
				else 0 END as NgayThuongOfNgayOff, null AS NgayChotLuong,
				CAST(NULL AS BIT) AS IsLastPayroll, P.CutoffDay,
				CASE WHEN (((E.WLeaveDayValue = 3 or E.WLeaveDayValue = 5) and ISNULL(F.LeavePeriod,0) NOT IN (1,2)) AND datepart(dw,D.mDate) = 7) or (ISNULL(F.LeavePeriod,0) IN (2,3)) THEN 1 
				else 0 END as IsHaftDays
	into #emp_days_d
	from #Emp E
	cross APPLY dbo.fnSelectFromTODate(@BegDate, @EndDate) D
	left join #EmployeeShifts S on S.EmployeeCode = E.EmployeeCode and S.WorkDate = D.mDate
	left JOIN dbo.sysConfigTS C with(NOLOCK) on 1=1
	left JOIN dbo.LsVacationDays Vs with(NOLOCK) on Vs.VacationDay = D.mDate 
	left JOIN dbo.EmployeeWeekOffs F with(NOLOCK) on F.EmployeeCode = E.EmployeeCode and F.WorkDate = D.mDate
	LEFT JOIN #lstOfLockTimeSheet LC ON LC.DepartmentCode = E.DepartmentCode AND D.mDate BETWEEN LC.BegDate AND LC.EndDate
	LEFT JOIN #lsPayrollDow P ON D.mDate BETWEEN P.BegDay AND P.EndDay
	WHERE LC.DepartmentCode IS NULL and E.JoinDate<=D.mDate and (E.EndDate is null or (E.EndDate is not null and E.EndDate > D.mDate))

	--SELECT * FROM #emp_days_d
	IF @KOW2LastPayroll_V2 = 1
	BEGIN
		UPDATE #emp_days_d SET IsLastPayroll = 1 WHERE NgayChotLuong IS NOT NULL AND @Now > NgayChotLuong 

		DELETE K FROM dbo.EmpKowDsLastPayroll K INNER JOIN #Emp E ON E.EmployeeCode = K.EmployeeCode
		INNER JOIN dbo.LsKows L WITH(NOLOCK) ON L.KowCode = K.KowCode
		LEFT JOIN #lstOfLockTimeSheet LC ON LC.DepartmentCode = E.DepartmentCode AND K.WorkDate BETWEEN LC.BegDate AND LC.EndDate
		WHERE K.WorkDate BETWEEN @BegDate AND @EndDate 
				AND (L.KowType IN (1,3,5,6,25)) AND LC.DepartmentCode IS NULL
	END
	
	--SELECT * FROM #emp_days_d
	--Xoa công trước khi tính lại
	--SELECT @KOW2LastPayroll
	--SELECT * FROM #emp_days_d
	
	IF @KOW2LastPayroll = '1'--chuyen sang lastpayroll bo qua ko xu ly OT khi tinh cong
	BEGIN
		delete K from EmpKowDays K inner JOIN #Emp E on E.EmployeeCode = K.EmployeeCode
		inner JOIN LsKows L on L.KowCode = K.KowCode
		LEFT JOIN #lstOfLockTimeSheet LC ON LC.DepartmentCode = E.DepartmentCode AND K.WorkDay BETWEEN LC.BegDate AND LC.EndDate
		INNER JOIN #emp_days_d D ON D.EmployeeCode = K.EmployeeCode AND D.WorkDate = K.WorkDay
		where K.WorkDay between @BegDate and @EndDate and (L.KowType in (1,3,6)) and LC.DepartmentCode is NULL
					AND ISNULL(D.IsLastPayroll,0) = 0
	END
	ELSE
    BEGIN
		delete K from EmpKowDays K inner JOIN #Emp E on E.EmployeeCode = K.EmployeeCode
		inner JOIN LsKows L WITH(NOLOCK) on L.KowCode = K.KowCode
		LEFT JOIN #lstOfLockTimeSheet LC ON LC.DepartmentCode = E.DepartmentCode AND K.WorkDay BETWEEN LC.BegDate AND LC.EndDate
		INNER JOIN #emp_days_d D ON D.EmployeeCode = K.EmployeeCode AND D.WorkDate = K.WorkDay
		where K.WorkDay between @BegDate and @EndDate and (L.KowType in (1,3,5,6,25)) 
			AND LC.DepartmentCode is NULL AND ISNULL(D.IsLastPayroll,0) = 0
	END
	--SELECT * FROM #lstOfLockTimeSheet
	
	--luu thong tin ngay nghi/le cua nhan vien cho store chinh o ngoai
	INSERT INTO #lstOfNgayLeWithEmp(EmployeeCode,WorkDate,Vacation, gSGMC, NgayThuongOfNgayOff, IsHaftDays)
	SELECT EmployeeCode, WorkDate,Vacation,gSGMC, NgayThuongOfNgayOff, IsHaftDays
	FROM #emp_days_d WHERE ISNULL(Vacation,0) <> 0
	--PRINT 'fffff'
--select * from #emp_days_d
	select  S.EmployeeCode, S.DepartmentCode, S.JobWCode, S.GroupSalCode, S.IsNotScan, S.IsNotLateEarly, S.IsNotOTKow, 
			S.ShiftCode, S.WorkDate, case when @IsSGMC_AllowShift = 1 THEN isnull(L.SGMC,8) ELSE S.gSGMC END as gSGMC, 
			S.Vacation, S.strWorkDate, S.IsLastPayroll,
			CAST(CONVERT(NVARCHAR(10),S.WorkDate,111) + ' ' + L.FromTime AS DATETIME) AS ShiftIn,
			CAST(CONVERT(NVARCHAR(10),DATEADD(DAY,L.TotalDays-1,S.WorkDate),111) + ' ' + L.ToTime AS DATETIME) AS ShiftOut
	into #emp_days
	from #emp_days_d S inner JOIN dbo.LsShifts L WITH(NOLOCK) on L.ShiftCode = S.ShiftCode

	--so phut xin ra ngaoi(loai so 6) bị trừ đi trễ về sớm cho đoạn ra ngoài này---------------
	--get thoi gian dang ky ra ngoai theo tu gio-den gio(dang ky theo gio thi xu ly tru lai cong sau khi tinh dc)
	DECLARE @IsRegDTVSFromTo BIT--dang ky DTVS theo so gio hay Tu gio - den gio(lấy để xét thời gian xin phép ra ngoài theo từ giờ-đến giờ)
	SET @IsRegDTVSFromTo = 0

	SELECT S.EmployeeCode, S.WorkDate, S.FromTime, 
			CASE WHEN S.ToTime < S.FromTime THEN DATEADD(DAY,1,S.ToTime) ELSE S.ToTime END AS ToTime, S.ShiftIn, S.ShiftOut
	INTO #EmpRegLateEarly_K6Sub
	FROM (
		SELECT R.EmployeeCode, R.WorkDate, CAST(CONVERT(NVARCHAR(10),R.WorkDate,111) + ' ' + R.DTFrom AS DATETIME) AS FromTime, 
										   CAST(CONVERT(NVARCHAR(10),R.WorkDate,111) + ' ' + R.DTTo AS DATETIME) AS ToTime, E.ShiftIn, E.ShiftOut
		FROM EmpRegLateEarly R WITH(NOLOCK)
		INNER JOIN #emp_days E ON E.EmployeeCode = R.EmployeeCode AND E.WorkDate = R.WorkDate
		WHERE R.WorkDate BETWEEN @BegDate AND @EndDate AND R.Kind = 6 AND ISNULL(@IsRegDTVSFromTo,0) = 1 --AND ISNULL(@IsScanTimeFistLast,0) = 1
				AND (ISNULL(R.DTFrom,'') <> '' AND ISNULL(R.DTTo,'') <> '')
		UNION ALL
		SELECT R.EmployeeCode, R.WorkDate, CAST(CONVERT(NVARCHAR(10),R.WorkDate,111) + ' ' + R.VSFrom AS DATETIME) AS FromTime, 
										   CAST(CONVERT(NVARCHAR(10),R.WorkDate,111) + ' ' + R.VSTo AS DATETIME) AS ToTime, E.ShiftIn, E.ShiftOut
		FROM EmpRegLateEarly R WITH(NOLOCK)
		INNER JOIN #emp_days E ON E.EmployeeCode = R.EmployeeCode AND E.WorkDate = R.WorkDate
		WHERE R.WorkDate BETWEEN @BegDate AND @EndDate AND R.Kind = 6 AND ISNULL(@IsRegDTVSFromTo,0) = 1
				AND (ISNULL(R.VSFrom,'') <> '' AND ISNULL(R.VSTo,'') <> '')
	) S 
	SELECT S.EmployeeCode,S.WorkDate, S.FromTime, CASE WHEN S.ToTime < S.FromTime THEN DATEADD(DAY,1,S.ToTime) ELSE S.ToTime END AS ToTime
	INTO #EmpRegLateEarly_K6
	FROM (
		SELECT S.EmployeeCode, S.WorkDate, CASE WHEN (S.FromTime < S.ShiftIn OR S.FromTime > S.ShiftOut) AND (S.ToTime < S.ShiftIn OR S.ToTime > S.ShiftOut)
													THEN DATEADD(DAY,1,S.FromTime) ELSE S.FromTime END AS FromTime, S.ToTime
		FROM #EmpRegLateEarly_K6Sub S
	) S
	--SELECT * FROM #EmpRegLateEarly_K6
	--end so phut xin ra ngaoi(loai so 6)---------------


	--TÂN Á: so phut xin làm việc ngòai dc duyệt(đăng ký ĐTVS loai so 4) đoạn này được tính công ko bị trừ ĐTVS---------------
	--get thoi gian dang ky ra ngoai theo tu gio-den gio
	SELECT S.EmployeeCode, S.WorkDate, S.FromTime, 
			CASE WHEN S.ToTime < S.FromTime THEN DATEADD(DAY,1,S.ToTime) ELSE S.ToTime END AS ToTime, S.ShiftIn, S.ShiftOut
	INTO #EmpRegLateEarly_K4Sub
	FROM (
		SELECT R.EmployeeCode, R.WorkDate, CAST(CONVERT(NVARCHAR(10),R.WorkDate,111) + ' ' + R.DTFrom AS DATETIME) AS FromTime, 
										   CAST(CONVERT(NVARCHAR(10),R.WorkDate,111) + ' ' + R.DTTo AS DATETIME) AS ToTime, E.ShiftIn, E.ShiftOut
		FROM EmpRegLateEarly R WITH(NOLOCK)
		INNER JOIN #emp_days E ON E.EmployeeCode = R.EmployeeCode AND E.WorkDate = R.WorkDate
		WHERE R.WorkDate BETWEEN @BegDate AND @EndDate AND R.Kind = 4 AND ISNULL(@IsRegDTVSFromTo,0) = 1 
				AND (ISNULL(R.DTFrom,'') <> '' AND ISNULL(R.DTTo,'') <> '')
		UNION ALL
		SELECT R.EmployeeCode, R.WorkDate, CAST(CONVERT(NVARCHAR(10),R.WorkDate,111) + ' ' + R.VSFrom AS DATETIME) AS FromTime, 
										   CAST(CONVERT(NVARCHAR(10),R.WorkDate,111) + ' ' + R.VSTo AS DATETIME) AS ToTime, E.ShiftIn, E.ShiftOut
		FROM EmpRegLateEarly R WITH(NOLOCK)
		INNER JOIN #emp_days E ON E.EmployeeCode = R.EmployeeCode AND E.WorkDate = R.WorkDate
		WHERE R.WorkDate BETWEEN @BegDate AND @EndDate AND R.Kind = 4 AND ISNULL(@IsRegDTVSFromTo,0) = 1 
				AND (ISNULL(R.VSFrom,'') <> '' AND ISNULL(R.VSTo,'') <> '')
	) S 
	SELECT S.EmployeeCode,S.WorkDate, S.FromTime, CASE WHEN S.ToTime < S.FromTime THEN DATEADD(DAY,1,S.ToTime) ELSE S.ToTime END AS ToTime
	INTO #EmpRegLateEarly_K4
	FROM (
		SELECT S.EmployeeCode, S.WorkDate, CASE WHEN (S.FromTime < S.ShiftIn OR S.FromTime > S.ShiftOut) AND (S.ToTime < S.ShiftIn OR S.ToTime > S.ShiftOut)
													THEN DATEADD(DAY,1,S.FromTime) ELSE S.FromTime END AS FromTime, S.ToTime
		FROM #EmpRegLateEarly_K4Sub S
	) S
	--SELECT * FROM #EmpRegLateEarly_K4
	--end TÂN Á: so phut xin làm việc ngòai dc duyệt(đăng ký ĐTVS loai so 4) đoạn này được tính công ko bị trừ ĐTVS---------------


	--SELECT * FROM #emp_days_d
	delete FROM #emp_days where ShiftCode is NULL
	IF not exists (select top 1 1 from #emp_days) return
--select * from #emp_days
	--Danh sach chi tiet ca lam viec
	--Ca Full ngay
	select Real_Time_In , Real_Time_Out , KowCode, ShiftCode, NextIn, NextOut, KowType, WorkingHours ,OrdinalForKowDs, HoursPerWD, IsNoon
	into #VWShiftDetail_In_Out from VWShiftDetail_In_Out
	--Ca 1/2 ngay
	select Real_Time_In , Real_Time_Out , KowCode, ShiftCode, NextIn, NextOut, KowType, WorkingHours ,OrdinalForKowDs, HoursPerWD, 1 AS IsNoon
	into #VWShiftDetail_In_Out_haftDay from VWShiftDetail_In_Out_haftDay

	--A.Tự động add đủ công cho những nhân viên không cần quét thẻ IsNotScan = 1(Loại trừ ngày nghỉ,lễ)
	if exists (select top 1 1 from #emp E where E.IsNotScan = 1)
	BEGIN
		--danh sach chi tiết từng công trong Ca làm việc
		--Với những nhân viên không cần quẹt thẻ thì ngày đó áp đủ số giờ của Ca cho những nhân viên này
		--Số giờ một công thay đổi theo ca làm việc
		IF(@IsSGMC_AllowShift = 1)
		BEGIN
			select E.EmployeeCode, E.WorkDate, S.KowCode, Round(isnull(S.WorkingHours,0)/(S.SGMC * 1.00), @gSSLNC) as DayNum, 
					S.WorkingHours, E.IsLastPayroll
			INTO #vsKowDs
			from #emp_days E 
			inner join vwShiftDetail_KowNormal S on E.ShiftCode = S.ShiftCode
			inner JOIN #lstOfPayRoll P ON E.WorkDate between P.BegDate and P.EndDate
			where E.IsNotScan = 1 and E.Vacation = 0 and ISNULL(S.SGMC,0) > 0
			union ALL
			select E.EmployeeCode, E.WorkDate, Sh.KowCode,  Round(isnull(Sh.WorkingHours,0)/(Sh.SGMC * 1.00), @gSSLNC) as DayNum, 
					Sh.WorkingHours, E.IsLastPayroll
			from #emp_days E 
			inner join VWShiftDetail_Normal_haftDay Sh on E.ShiftCode = Sh.ShiftCode
			inner JOIN #lstOfPayRoll P ON E.WorkDate between P.BegDate and P.EndDate
			where E.IsNotScan = 1 and E.Vacation = 1 and Sh.SGMC > 0

			insert INTO EmpKowDays(EmployeeCode, WorkDay, KowCode, DayNum,  IsPay, CreatedOn, CreatedBy)
			select EmployeeCode, WorkDate, KowCode, DayNum,  0, getdate(), @UserID
			FROM #vsKowDs
			WHERE ISNULL(IsLastPayroll,0) = 0

			
			INSERT INTO dbo.EmpKowDsLastPayroll(EmployeeCode,WorkDate,KowCode,DayNum,IsNoon,IsPay,CreatedOn,CreatedBy)
			SELECT V.EmployeeCode, V.WorkDate, V.KowCode, V.DayNum - ISNULL(K.DayNum,0),0 , 0 , GETDATE(), @UserID
			FROM #vsKowDs V
			LEFT JOIN dbo.EmpKowDays K WITH(NOLOCK) ON K.WorkDay = V.WorkDate AND K.EmployeeCode = V.EmployeeCode AND K.KowCode = V.KowCode
			WHERE ISNULL(V.IsLastPayroll,0) = 1 AND V.DayNum - ISNULL(K.DayNum,0) <> 0
		END
		ELSE
		BEGIN
			SELECT E.EmployeeCode, E.WorkDate, S.KowCode, S.WorkingHours/ (E.gSGMC * 1.00) AS DayNum, 
					P.DowCode, S.WorkingHours, E.IsLastPayroll
			INTO #vsKowDs2
			FROM #emp_days E 
			INNER JOIN dbo.vwShiftDetail_KowNormal S ON E.ShiftCode = S.ShiftCode
			INNER JOIN #lstOfPayRoll P ON E.WorkDate BETWEEN P.BegDate AND P.EndDate
			WHERE E.IsNotScan = 1 AND E.Vacation = 0 AND E.gSGMC > 0
			UNION ALL
			SELECT E.EmployeeCode, E.WorkDate, Sh.KowCode, Sh.WorkingHours/ (E.gSGMC * 1.00) AS DayNum, 
					P.DowCode, Sh.WorkingHours, E.IsLastPayroll
			FROM #emp_days E 
			INNER JOIN dbo.VWShiftDetail_Normal_haftDay Sh ON E.ShiftCode = Sh.ShiftCode
			INNER JOIN #lstOfPayRoll P ON E.WorkDate BETWEEN P.BegDate AND P.EndDate
			WHERE E.IsNotScan = 1 AND E.Vacation = 1 AND E.gSGMC > 0

			--So giờ một công lấy theo thiết lập hệ thông
			INSERT INTO EmpKowDays(EmployeeCode, WorkDay, KowCode, DayNum, IsPay, CreatedOn, CreatedBy)
			SELECT V.EmployeeCode, V.WorkDate, V.KowCode, V.DayNum,0 , GETDATE(), @UserID
			FROM #vsKowDs2 V
			WHERE ISNULL(V.IsLastPayroll,0) = 0

			INSERT INTO dbo.EmpKowDsLastPayroll(EmployeeCode,WorkDate,KowCode,DayNum,IsNoon,IsPay,CreatedOn,CreatedBy)
			SELECT V.EmployeeCode, V.WorkDate, V.KowCode, V.DayNum - ISNULL(K.DayNum,0),0 ,0 , GETDATE(), @UserID
			FROM #vsKowDs2 V
			LEFT JOIN dbo.EmpKowDays K WITH(NOLOCK) ON K.WorkDay = V.WorkDate AND K.EmployeeCode = V.EmployeeCode AND K.KowCode = V.KowCode
			WHERE ISNULL(V.IsLastPayroll,0) = 1 AND V.DayNum - ISNULL(K.DayNum,0) <> 0
		END
		delete FROM #emp_days where IsNotScan = 1
		DELETE FROM #Emp WHERE IsNotScan = 1
	END
	IF not exists (select TOP 1 1 from #Emp where IsNotScan <> 1) return
	--select * from EmpKowDays
	
	--B.Tính công cho các nhân viên còn lại(dựa vào quét thẻ, đăng ký OT)
	--Xử lý cho nhân viên ko tính tăng ca, nhân viên không tính đi trễ về sớm, nhân viên có đăng ký Đi trễ - về sớm
	--PRINT 'fffff'
	--B.1. Lấy thông tin quét thẻ của nhân viên trong ngày(Chỉ tính cho những nhân viên có số mẫu tin quét là chẵn).
	select S.EmployeeCode as EmployeeCode, S.WorkDate, cast(S.ScanTime as DATETIME) as ScanTime, 0 AS IsOver, 0 AS IsOverF,
		row_number() OVER (PARTITION BY S.EmployeeCode, S.WorkDate ORDER BY S.ScanTime ASC) as RowIndex, E.IsNotLateEarly, E.IsNotOTKow
	into #EmpScanTimes_d from dbo.EmpScanTimes S 
	inner join #Emp E on E.EmployeeCode = S.EmployeeCode
	where S.WorkDate between @BegDate AND dateadd(day,1,@EndDate)
--select @BegDate,@EndDate
--select * from #Emp
--select * from #EmpScanTimes_d
--select * from #Emp

	--TIm tong so dong quet the trong ngay(Loai tru những ngày có quét thẻ là Lẽ ko tinh)
	select EmployeeCode, WorkDate into #VWScanTime_NumRowInDay from #EmpScanTimes_d 
	group BY EmployeeCode, WorkDate having count(1) % 2 > 0
	
	--delete nhung ngay ko co qthe
	DELETE S FROM #emp_days S
	LEFT JOIN (SELECT EmployeeCode,WorkDate FROM #EmpScanTimes_d GROUP BY EmployeeCode,WorkDate) T 
				ON T.EmployeeCode = S.EmployeeCode AND T.WorkDate = S.WorkDate
	WHERE T.EmployeeCode IS NULL

	--delete nhung ngay co mau tin le
	DELETE S FROM #emp_days S
	INNER JOIN #VWScanTime_NumRowInDay T 
				ON T.EmployeeCode = S.EmployeeCode AND T.WorkDate = S.WorkDate

	--Tap danh sach quet the con lại được tính công.
	select S.EmployeeCode, S.WorkDate, S.ScanTime, cast(S.IsOver AS INT) as IsOver, cast(S.IsOverF AS INT) as IsOverF, cast(S.RowIndex % 2 as INT) as In1Out0,
			row_number() OVER(PARTITION BY S.EmployeeCode, S.WorkDate ORDER BY S.ScanTime ASC) as RowIndex
	into #VWScanTime
	from #EmpScanTimes_d S left JOIN #VWScanTime_NumRowInDay V on S.EmployeeCode = V.EmployeeCode and S.WOrkDate = V.WorkDate
	where V.EMployeeCode is NULL
--select * from #VWScanTime

	--Pivort quet the
	SELECT S1.EmployeeCode, S1.WorkDate, S1.ScanTime as RI, S2.ScanTime as RO, S1.IsOver, S1.IsOverF
	into #VWScanTime_RiRo
	FROM (
		SELECT EmployeeCode as EmployeeCode, WorkDate, ScanTime, RowIndex, IsOver, IsOverF FROM #VWScanTime where RowIndex % 2 > 0
	) S1
	INNER JOIN  (
		SELECT EmployeeCode, WorkDate, ScanTime, RowIndex FROM #VWScanTime where RowIndex % 2 = 0
	) S2 ON S1.EmployeeCode = S2.EmployeeCode AND S1.WorkDate = S2.WorkDate AND S1.RowIndex = S2.RowIndex - 1
	where S1.WorkDate between @BegDate and @EndDate

	--SELECT * FROM #VWScanTime_RiRo
	DECLARE @EmployeeCode NVARCHAR(30), @WDate DATETIME, @RI DATETIME, @RO DATETIME, @FromTime DATETIME, @ToTime DATETIME
	IF EXISTS (SELECT 1 FROM #EmpRegLateEarly_K6)
	BEGIN
		declare curtgRN cursor for
			SELECT EmployeeCode,WorkDate,FromTime,ToTime FROM #EmpRegLateEarly_K6 
		open curtgRN
		fetch next from curtgRN into @EmployeeCode,@WDate,@FromTime,@ToTime
		while @@FETCH_STATUS=0
		begin
			IF OBJECT_ID('tempdb..#tblTach2Row') IS NOT NULL
				DROP TABLE #tblTach2Row
			--TH1: Mốc đầu vs cuối của thời gian xin ra ngoài đều nằm trong thời gian qthe RI vs RO cua 1 doan
			SELECT S.EmployeeCode,S.WorkDate,S.RI,S.RO,S.IsOver, S.IsOverF, @FromTime AS FromTime, @ToTime AS ToTime
			INTO #tblTach2Row
			FROM #VWScanTime_RiRo S
			WHERE S.EmployeeCode = @EmployeeCode AND S.WorkDate = @WDate AND @FromTime BETWEEN S.RI AND S.RO AND @ToTime BETWEEN S.RI AND S.RO

			IF OBJECT_ID('tempdb..#tblDelete2Row') IS NOT NULL
				DROP TABLE #tblDelete2Row
			--TH2: Mốc đầu vs cuối của thời gian xin ra ngoài bao hết thời gian qthe
			SELECT S.EmployeeCode,S.WorkDate,S.RI,S.RO,S.IsOver, S.IsOverF, @FromTime AS FromTime, @ToTime AS ToTime
			INTO #tblDelete2Row
			FROM #VWScanTime_RiRo S 
			WHERE S.EmployeeCode = @EmployeeCode AND S.WorkDate = @WDate AND @FromTime <= S.RI AND @ToTime >= S.RO

			IF OBJECT_ID('tempdb..#tblRaNgoai_TH3') IS NOT NULL
				DROP TABLE #tblRaNgoai_TH3
			--TH3: Mốc đầu nằm trong, vs mốc 2 nằm ngoài
			SELECT S.EmployeeCode,S.WorkDate,S.RI,S.RO,S.IsOver, S.IsOverF, @FromTime AS FromTime, @ToTime AS ToTime
			INTO #tblRaNgoai_TH3
			FROM #VWScanTime_RiRo S
			WHERE S.EmployeeCode = @EmployeeCode AND S.WorkDate = @WDate AND @FromTime BETWEEN S.RI AND S.RO AND @ToTime >= S.RO

			IF OBJECT_ID('tempdb..#tblRaNgoai_TH4') IS NOT NULL
				DROP TABLE #tblRaNgoai_TH4
			--TH4: Mốc đầu nằm ngoai vs mốc sau nằm trong
			SELECT S.EmployeeCode,S.WorkDate,S.RI,S.RO,S.IsOver, S.IsOverF, @FromTime AS FromTime, @ToTime AS ToTime
			INTO #tblRaNgoai_TH4
			FROM #VWScanTime_RiRo S
			WHERE S.EmployeeCode = @EmployeeCode AND S.WorkDate = @WDate AND @FromTime <= S.RI AND @ToTime BETWEEN S.RI AND S.RO
		
			--TH1: Mốc đầu vs cuối của thời gian xin ra ngoài đều nằm trong thời gian qthe RI vs RO cua 1 doan
			IF EXISTS (SELECT 1 FROM #tblTach2Row)--loại bỏ đoạn giữa xin ra ngoài
			BEGIN
				DELETE S FROM #VWScanTime_RiRo S INNER JOIN #tblTach2Row R ON R.EmployeeCode =S.EmployeeCode AND R.WorkDate = S.WorkDate AND R.RI =S.RI AND R.RO = S.RO
			
				INSERT INTO #VWScanTime_RiRo(EmployeeCode,WorkDate,RI,RO,IsOver,IsOverF)
				SELECT S.EmployeeCode,S.WorkDate,S.RI,S.FromTime,S.IsOver, S.IsOverF
				FROM #tblTach2Row S
				UNION ALL
				SELECT S.EmployeeCode,S.WorkDate,S.ToTime,S.RO,S.IsOver, S.IsOverF
				FROM #tblTach2Row S

				--SELECT * FROM #VWScanTime_RiRo
			END
			--TH2: Mốc đầu vs cuối của thời gian xin ra ngoài bao hết thời gian qthe
			IF EXISTS (SELECT 1 FROM #tblDelete2Row)--loại bỏ nguyen đoạn xin ra ngoài
			BEGIN
				DELETE S FROM #VWScanTime_RiRo S INNER JOIN #tblDelete2Row R ON R.EmployeeCode =S.EmployeeCode AND R.WorkDate = S.WorkDate AND R.RI =S.RI AND R.RO = S.RO
			END
			--TH3: Mốc đầu nằm trong, vs mốc 2 nằm ngoài
			IF EXISTS (SELECT 1 FROM #tblRaNgoai_TH3)--loại bỏ đoạn làm sau xin ra ngoài
			BEGIN
				UPDATE S SET S.RO=R.FromTime FROM #VWScanTime_RiRo S
				INNER JOIN #tblRaNgoai_TH3 R ON R.EmployeeCode =S.EmployeeCode AND R.WorkDate = S.WorkDate AND R.RI =S.RI AND R.RO = S.RO
			END
			--TH4: Mốc đầu nằm ngoai vs mốc sau nằm trong
			IF EXISTS (SELECT 1 FROM #tblRaNgoai_TH4)--loai bỏ khúc đầu xin ra ngoài
			BEGIN
				UPDATE S SET S.RI=R.ToTime FROM #VWScanTime_RiRo S
				INNER JOIN #tblRaNgoai_TH4 R ON R.EmployeeCode =S.EmployeeCode AND R.WorkDate = S.WorkDate AND R.RI =S.RI AND R.RO = S.RO
			END

			NEXT_RN:
			fetch next from curtgRN into @EmployeeCode,@WDate,@FromTime,@ToTime
		end
		close curtgRN
		deallocate curtgRN

		--SELECT 'ffffff1',* FROM #VWScanTime_RiRo
	END
	--Tan Á: loại xin làm việc ngoài dc duyệt trong thời gian làm việc
	--Chèn đoạn thời gian hợp lệ này vào qthe để tính công
	IF EXISTS (SELECT 1 FROM #EmpRegLateEarly_K4)
	BEGIN
		INSERT INTO #VWScanTime_RiRo(EmployeeCode,WorkDate,RI,RO,IsOver,IsOverF)
		SELECT R.EmployeeCode,R.WorkDate, CASE WHEN I.EmployeeCode IS NOT NULL THEN I.RO ELSE R.FromTime END AS FromTime,
										  CASE WHEN O.EmployeeCode IS NOT NULL THEN O.RI ELSE R.ToTime END AS ToTime, 0, 0
		FROM #EmpRegLateEarly_K4 R
		LEFT JOIN #VWScanTime_RiRo I ON I.EmployeeCode = R.EmployeeCode AND I.WorkDate = R.WorkDate AND R.FromTime > I.RI AND R.FromTime < I.RO
		LEFT JOIN #VWScanTime_RiRo O ON O.EmployeeCode = R.EmployeeCode AND O.WorkDate = R.WorkDate AND R.ToTime > O.RI AND R.ToTime < O.RO
		LEFT JOIN #VWScanTime_RiRo V ON V.EmployeeCode = R.EmployeeCode AND V.WorkDate = R.WorkDate AND R.FromTime >= V.RI AND R.ToTime <= V.RO
		WHERE V.EmployeeCode IS NULL --nếu đoạn đăng ký đã nằm hết trong 1 đoạn quét thẻ rồi thì bỏ qua
	END

	--SELECT 'kowlateEarly kind 4',* FROM #VWScanTime_RiRo
	--END Tan Á: loại xin làm việc ngoài dc duyệt trong thời gian làm việc
--select * from #VWScanTime_RiRo
--select @IsSGMC_AllowShift
--select * from #emp_days
--select * from #VWScanTime_RiRo
	--B.2. Lấy thông tin đăng ký OT của nhân viên trong ngày.(Loại trừ những nhân viên ko tính tăng ca)
	create table #RegisterOT(EmployeeCode nvarchar(100), WorkDate datetime, FromTime datetime, ToTime datetime, HourNum FLOAT, KowCode NVARCHAR(30), IsUnPaid INT)
	IF ISNULL(@TSIsCalOTByRegister,0) = 1 --OT duoc tinh khi co dang ky
	BEGIN
		print 'OT duoc tinh khi co dang ky'
--select @TSIsRegOTByFromTo as TSIsRegOTByFromTo
		IF @TSIsRegOTByFromTo = 0--OT duoc tinh theo so gio
		BEGIN
			insert into #RegisterOT(EmployeeCode, WorkDate, HourNum, KowCode, IsUnPaid)
			select R.EmployeeCode, R.WorkDate, sum(R.HourNum), NULL, max(R.IsUnPaid)
			from dbo.EmpOverTimeReg R with(NOLOCK) inner join #Emp E on E.EmployeeCode = R.EmployeeCode
			where R.WorkDate between @BegDate AND @EndDate and isnull(R.HourNum,0) > 0
			group BY R.EmployeeCode, R.WorkDate
		END
		ELSE--OT duoc tinh theo thoi diem
		BEGIN
			INSERT INTO #RegisterOT(EmployeeCode, WorkDate, FromTime, ToTime, HourNum,IsUnPaid)
			SELECT R.EmployeeCode, R.WorkDate, R.FromTime, R.ToTime, R.HourNum, R.IsUnPaid
			FROM EmpOverTimeReg R WITH(NOLOCK) INNER JOIN #Emp E ON E.EmployeeCode = R.EmployeeCode
			WHERE R.WorkDate BETWEEN @BegDate AND @EndDate AND R.FromTime IS NOT NULL
		END
	END
--select @TSIsWLeaveRegOT
--select * from #emp_days order BY WorkDate
	--Chinh tinh tăng ca ngay nghỉ khi có đăng ký OT(ko đăng ký không tinh, xoa trong cac table tinh ngay nghi de khoi tinh)
	IF @TSIsWLeaveRegOT = 1 
	begin
		--Vacation: 3 ngay le, 2 ngay nghi nguyen ngay, 1 ngay nghi 1/2 ngay, 0 ngay binh thuong
		delete E from #emp_days E  left join #RegisterOT R on E.EmployeeCode = R.EmployeeCode and E.WorkDate = R.WorkDate
		where R.EmployeeCode is NULL and E.Vacation = 2
	END
	--Chinh tinh tăng ca ngay lễ khi có đăng ký OT(ko đăng ký không tinh, xoa trong cac table tinh ngay Le de khoi tinh)
--select * from #emp_days
	IF (@TSIsHolidayRegOT = 1)
	BEGIN
		--Vacation: 3 ngay le, 2 ngay nghi nguyen ngay, 1 ngay nghi 1/2 ngay, 0 ngay binh thuong
		delete E from #emp_days E  left join #RegisterOT R on E.EmployeeCode = R.EmployeeCode and E.WorkDate = R.WorkDate
		where R.EmployeeCode is NULL and E.Vacation = 3
	END
	--SELECT * FROM #VWShiftDetail_In_Out
--select * from #emp_days
	-- NHAN VIEN CO GAN CHI TIET CA LAM VIEC
	select E.EmployeeCode, E.WorkDate, E.ShiftCode, dateadd(day,Sh.NextIn,cast(strWorkDate + ' ' + Sh.Real_Time_In AS DATETIME)) as ShiftIn, 
		dateadd(day,Sh.NextOut,cast(strWorkDate + ' ' + Sh.Real_Time_Out as DATETIME)) as ShiftOut, 
			Sh.KowCode, Sh.KowType, E.Vacation, Sh.WorkingHours, 
			case when @IsSGMC_AllowShift = 1 then Sh.HoursPerWD ELSE E.gSGMC END as gSGMC, E.IsNotLateEarly, E.IsNotOTKow, Sh.IsNoon, E.IsLastPayroll
	into #emp_days_Shift
	from #emp_days E 
	inner join #VWShiftDetail_In_Out Sh ON Sh.ShiftCode = E.ShiftCode
	where E.IsNotScan <> 1 and E.Vacation <> 1
	union ALL
	select E.EmployeeCode, E.WorkDate, E.ShiftCode, dateadd(day,Sh.NextIn,cast(strWorkDate + ' ' + Sh.Real_Time_In AS DATETIME)) as ShiftIn, 
		dateadd(day,Sh.NextOut,cast(strWorkDate + ' ' + Sh.Real_Time_Out as DATETIME)) as ShiftOut, 
			Sh.KowCode, Sh.KowType, E.Vacation, Sh.WorkingHours, 
			case when @IsSGMC_AllowShift = 1 then Sh.HoursPerWD ELSE E.gSGMC END as gSGMC, E.IsNotLateEarly, E.IsNotOTKow, Sh.IsNoon, E.IsLastPayroll
	from #emp_days E 
	inner join #VWShiftDetail_In_Out_haftDay Sh ON Sh.ShiftCode = E.ShiftCode
	where E.IsNotScan <> 1 and E.Vacation = 1

--select * from #emp_days_Shift
	--Tinh ra so gio Di lam tu quet the voi ca lam viec
	--WorkingHours: so gio tung doan trong ca lam viec
--select * from #VWScanTime_RiRo
--select * from #emp_days_Shift
	select S.EmployeeCode, S.WorkDate, S.ShiftCode, 
			CASE WHEN R.EmployeeCode IS NULL THEN NULL WHEN R.RI > S.ShiftIn THEN R.RI ELSE S.ShiftIn END as RI,
			CASE WHEN R.EmployeeCode IS NULL THEN NULL WHEN R.RO < S.ShiftOut THEN R.RO ELSE S.ShiftOut END as RO, 
										S.KowCode, S.KowType, S.Vacation, S.IsNotLateEarly, S.IsNotOTKow, S.gSGMC, S.WorkingHours, 
										ISNULL(R.IsOver,0) as IsOver
										,ROW_NUMBER()OVER(PARTITION BY S.EmployeeCode,S.WorkDate ORDER BY S.ShiftIn) AS STT,
										S.IsNoon, S.IsLastPayroll, S.ShiftIn, S.ShiftOut
	into #emp_days_Shift_d
	from #emp_days_Shift S 
	LEFT JOIN #VWScanTime_RiRo R ON S.EmployeeCode = R.EmployeeCode and S.WorkDate = R.WorkDate 
					AND R.RI < S.ShiftOut and R.RO > S.ShiftIn
	where (S.KowType = 5 AND R.EmployeeCode IS NOT NULL) OR (S.KowType <> 5)

	--SELECT * FROM #emp_days_Shift_d
	--SELECT * FROM #VWScanTime_RiRo
	--SELECT * FROM #emp_days_Shift_d
	--SELECT * FROM #emp_days_Shift

	--SELECT '#emp_days_Shift_d ss',* FROM #emp_days_Shift_d
	select S.EmployeeCode, S.WorkDate, S.ShiftCode, S.KowCode, S.RI, S.RO,
			ISNULL(datediff(SECOND, S.RI,S.RO)/60.00,0) as SoPhut, S.KowType, S.Vacation, S.IsNotLateEarly, S.IsNotOTKow,
			S.WorkingHours, S.gSGMC, S.IsOver, S.STT, S.IsNoon, S.IsLastPayroll, CAST(NULL AS INT) AS IsPay, S.ShiftIn, S.ShiftOut
	into #emp_days_scantime_to_shift
	from #emp_days_Shift_d S 
	where S.Vacation < 2
	--select * from #emp_days_scantime_to_shift
	--SELECT 'ssssssssss',* FROM #emp_days_scantime_to_shift
	
--SELECT '#emp_days_scantime_to_shift',* FROM #emp_days_scantime_to_shift
	--Xét option Ngay nghi,lễ khi có đăng ký OT thì mới tính
	IF exists (select top 1 1 from #emp_days_Shift_d where Vacation >= 2)
	BEGIN
		--Mới xét cho Đăng ký theo thời điểm, còn đăng ký theo số giờ xét sau khi tính ra công cuối cùng.
		IF @TSIsRegOTByFromTo = 1
		BEGIN
			--Chi tinh tăng ca ngày lễ khi có đăng ký tăng ca
			IF @TSIsHolidayRegOT = 1
			begin
				insert INTO #emp_days_scantime_to_shift(EmployeeCode, WorkDate, ShiftCode, KowCode, RI, RO,
							SoPhut, KowType, Vacation, IsNotLateEarly, IsNotOTKow,
							WorkingHours, gSGMC, IsOver, IsNoon, IsLastPayroll, IsPay, ShiftIn,ShiftOut)
				select S.EmployeeCode, S.WorkDate, S.ShiftCode, S.KowCode,S.RI, S.RO, datediff(SECOND, S.RI,S.RO)/60.00,
							S.KowType, S.Vacation, S.IsNotLateEarly, S.IsNotOTKow,
								S.WorkingHours, S.gSGMC, S.IsOver, 0, S.IsLastPayroll, S.IsUnPaid, S.ShiftIn, S.ShiftOut
				from
				(
					select S.EmployeeCode, S.WorkDate, S.ShiftCode, S.KowCode,
							CASE WHEN S.RI > R.FromTime then S.RI ELSE R.FromTime END as RI,
							CASE WHEN S.RO < R.ToTime then S.RO ELSE R.ToTime END as RO,
							S.KowType, S.Vacation, S.IsNotLateEarly, S.IsNotOTKow,
								S.WorkingHours, S.gSGMC, S.IsOver, S.IsLastPayroll, R.IsUnPaid, S.ShiftIn, S.ShiftOut
					from #emp_days_Shift_d S
					inner JOIN EmpOverTimeReg R WITH(NOLOCK) on S.EmployeeCode = R.EmployeeCode and S.RI < R.ToTime and S.RO > R.FromTime
					where S.Vacation = 3
				) S
			END
			--Chỉ tính tăng ca ngày nghỉ khi có đăng ký tăng ca
			IF @TSIsWLeaveRegOT = 1
			BEGIN
				INSERT INTO #emp_days_scantime_to_shift(EmployeeCode, WorkDate, ShiftCode, KowCode, RI, RO,
							SoPhut, KowType, Vacation, IsNotLateEarly, IsNotOTKow,
							WorkingHours, gSGMC, IsOver, IsNoon, IsLastPayroll, IsPay, ShiftIn, ShiftOut)
				SELECT S.EmployeeCode, S.WorkDate, S.ShiftCode, S.KowCode,S.RI, S.RO, DATEDIFF(SECOND, S.RI,S.RO)/60.00,
							S.KowType, S.Vacation, S.IsNotLateEarly, S.IsNotOTKow,
								S.WorkingHours, S.gSGMC, S.IsOver, 0, S.IsLastPayroll, S.IsUnPaid, S.ShiftIn, S.ShiftOut
				FROM
				(
					SELECT S.EmployeeCode, S.WorkDate, S.ShiftCode, S.KowCode,
							CASE WHEN S.RI > R.FromTime THEN S.RI ELSE R.FromTime END AS RI,
							CASE WHEN S.RO < R.ToTime THEN S.RO ELSE R.ToTime END AS RO,
							S.KowType, S.Vacation, S.IsNotLateEarly, S.IsNotOTKow,
								S.WorkingHours, S.gSGMC, S.IsOver, S.IsLastPayroll, R.IsUnPaid, S.ShiftIn, S.ShiftOut
					FROM #emp_days_Shift_d S
					INNER JOIN EmpOverTimeReg R WITH(NOLOCK) ON S.EmployeeCode = R.EmployeeCode AND S.RI < R.ToTime AND S.RO > R.FromTime
					WHERE S.Vacation = 2
				) S
			END
		END
		ELSE
		BEGIN
			INSERT INTO #emp_days_scantime_to_shift(EmployeeCode, WorkDate, ShiftCode, KowCode, RI, RO,
						SoPhut, KowType, Vacation, IsNotLateEarly, IsNotOTKow,
						WorkingHours, gSGMC, IsOver, IsNoon, IsLastPayroll, ShiftIn, ShiftOut)
			SELECT S.EmployeeCode, S.WorkDate, S.ShiftCode, S.KowCode,S.RI, S.RO, DATEDIFF(SECOND, S.RI,S.RO)/60.00,
						S.KowType, S.Vacation, S.IsNotLateEarly, S.IsNotOTKow,
							S.WorkingHours, S.gSGMC, S.IsOver, 0, S.IsLastPayroll, S.ShiftIn, S.ShiftOut
			FROM
			(
				SELECT S.EmployeeCode, S.WorkDate, S.ShiftCode, S.KowCode,
						S.RI AS RI,
						S.RO AS RO,
						S.KowType, S.Vacation, S.IsNotLateEarly, S.IsNotOTKow,
							S.WorkingHours, S.gSGMC, S.IsOver, S.IsLastPayroll, S.ShiftIn, S.ShiftOut
				FROM #emp_days_Shift_d S
				WHERE S.Vacation >= 2
			) S
		END
	END
	--ToTalHoursNormalInDay: Tong số công đủ của ca(có thể là giờ hoặc số công)	
	--TÍNH ĐI TRỄ VỀ SỚM DỰA VÀO QUÉT THẺ VÀ CA LÀM VIỆC(dựa vào quét đầu tiên và ra cuối cùng)-----------------------------------------
	--TSIsSubLateEarlyOnHoliday: TTChung/ Tính trừ đi trễ về sớm theo quy định khi đi làm vào ngày nghỉ, lễ.
	--TSIsExactKowOnHoliday: TTChung/ Tính công chính xác khi đi làm vào ngày nghỉ, ngày lễ cho nhóm nhân viên: không tính đi trễ về sớm.
--select * from #emp_days_Shift
	select S.EmployeeCode, S.WorkDate,S.ShiftIn, S.ShiftOut,
			CASE WHEN S.RI is null and S.RowIndex = 1 then S.WorkingHours * 60
				WHEN S.RI BETWEEN S.ShiftIn AND S.ShiftOut then datediff(SECOND,S.ShiftIn,S.RI)/60.00  ELSE 0 END as DiTre,
			CASE WHEN S.RO is null and S.RowIndex > 1 then S.WorkingHours * 60
				WHEN S.RO BETWEEN S.ShiftIn AND S.ShiftOut then datediff(SECOND,S.RO,S.ShiftOut)/60.00
				ELSE 0 END as VeSom, S.Vacation, S.gSGMC, S.RI, S.RO, S.ShiftCode, ISNULL(S.SoPhutLamThucTe,0) AS SoPhutLamThucTe,
				ROW_NUMBER()OVER(PARTITION BY S.EmployeeCode,S.WorkDate,S.ShiftIn ORDER BY S.RI) AS IsAsc,
				ROW_NUMBER()OVER(PARTITION BY S.EmployeeCode,S.WorkDate,S.ShiftIn ORDER BY S.RI DESC) AS IsDesc, S.WorkingHours
	into #emp_ditre_vesom_d
	from
	(
		SELECT E.EmployeeCode, E.WorkDate, R.RI,R.RO,E.ShiftIn, E.ShiftOut, E.WorkingHours, 
				row_number()OVER(PARTITION BY E.EmployeeCode, E.WorkDate ORDER BY E.ShiftIn) as RowIndex, E.Vacation, E.gSGMC, E.ShiftCode,
				R.SoPhut AS SoPhutLamThucTe
		from #emp_days_Shift E 
		inner JOIN (select EmployeeCode, WorkDate FROM #VWScanTime group BY EmployeeCode, WorkDate) S ON S.EmployeeCode = E.EmployeeCode and S.WorkDate = E.WorkDate
		left JOIN #emp_days_scantime_to_shift R    --#VWScanTime_RiRo(thay 01/03/2021)
					ON R.EmployeeCode = E.EmployeeCode and R.WorkDate = E.WorkDate AND R.RI IS NOT NULL and R.RI < E.ShiftOut and R.RO > E.ShiftIn
		WHERE E.KowType <> 5 and E.KowType <> 25 AND ((E.Vacation < 2 AND E.IsNotLateEarly <> 1) OR 
									((@TSIsSubLateEarlyOnHoliday = 1 OR (@TSIsExactKowOnHoliday = 1 AND E.IsNotLateEarly = 1)) and E.Vacation > 1))
	) S
	--SELECT * FROM #emp_days_scantime_to_shift
	--SELECT * FROM #emp_ditre_vesom_d
	--Xu ly trường hợp 2 đoạn quét thẻ trong 1 đoạn detail của Ca
	--VD: đoạn ca 08-12 mà qthe 08:00-09:30 vs 10-11:30
	SELECT S.EmployeeCode,S.WorkDate,S.ShiftIn,S.ShiftOut 
	INTO #DTVSCuaNhieuDoanQTheTrong1DoanCa
	FROM #emp_ditre_vesom_d S 
	GROUP BY S.EmployeeCode,S.WorkDate,S.ShiftIn,S.ShiftOut
	HAVING COUNT(1) > 1

	--SELECT * FROM #emp_ditre_vesom_d ORDER BY RI
	IF EXISTS (SELECT 1 FROM #DTVSCuaNhieuDoanQTheTrong1DoanCa)
	BEGIN
		DECLARE @IsAsc INT, @IsDesc INT, @WorkingHours FLOAT, @TongDTVS FLOAT
		DECLARE @ShiftIn DATETIME, @ShiftOut DATETIME, @DiTre FLOAT, @VeSom FLOAT, @SoPhutLamThucTe FLOAT, @iRun INT SET @iRun = 0
		declare curtgDTVS01 cursor for
			SELECT S.EmployeeCode,S.WorkDate,S.ShiftIn,S.ShiftOut, S.RI, S.RO, S.DiTre, S.VeSom, S.IsAsc, S.IsDesc, S.WorkingHours
			FROM #emp_ditre_vesom_d S 
			INNER JOIN #DTVSCuaNhieuDoanQTheTrong1DoanCa T ON T.EmployeeCode = S.EmployeeCode AND T.WorkDate = S.WorkDate 
																				AND T.ShiftIn = S.ShiftIn AND T.ShiftOut = S.ShiftOut
			order BY S.EmployeeCode,S.WorkDate,S.ShiftIn, S.IsAsc
		OPEN curtgDTVS01
		fetch next from curtgDTVS01 into @EmployeeCode, @WDate, @ShiftIn, @ShiftOut, @RI, @RO, @DiTre, @VeSom, @IsAsc, @IsDesc, @WorkingHours
		while @@FETCH_STATUS=0
		BEGIN
			--tổng số phút làm thực tế trong đoạn
			SET @SoPhutLamThucTe = 0
			SELECT @SoPhutLamThucTe = SUM(S.SoPhutLamThucTe)
			FROM #emp_ditre_vesom_d S WHERE S.EmployeeCode = @EmployeeCode AND S.WorkDate = @WDate 
							AND S.ShiftIn = @ShiftIn AND S.ShiftOut = @ShiftOut

			SET @TongDTVS = @WorkingHours * 60.00 - ISNULL(@SoPhutLamThucTe,0)
			IF @IsAsc = 1
			BEGIN
				UPDATE #emp_ditre_vesom_d
				SET VeSom = @TongDTVS - ISNULL(DiTre,0),SoPhutLamThucTe = @SoPhutLamThucTe
				WHERE EmployeeCode = @EmployeeCode AND WorkDate =@WDate AND ShiftIn = @ShiftIn AND ShiftOut = @ShiftOut AND RI = @RI AND RO = @RO
			END
			ELSE
            BEGIN
				UPDATE #emp_ditre_vesom_d
				SET VeSom = 0, DiTre = 0
				WHERE EmployeeCode = @EmployeeCode AND WorkDate =@WDate AND ShiftIn = @ShiftIn AND ShiftOut = @ShiftOut AND RI = @RI AND RO = @RO
			END

			NEXT_DTVS:
			SET @iRun = @iRun + 1
			fetch next from curtgDTVS01 into @EmployeeCode, @WDate, @ShiftIn, @ShiftOut, @RI, @RO, @DiTre, @VeSom, @IsAsc, @IsDesc, @WorkingHours
		end
		close curtgDTVS01
		deallocate curtgDTVS01

		--đã dồn DTVS vào đoạn 1 của chi tiết ca, các đoạn sau xóa hết
		DELETE FROM #emp_ditre_vesom_d WHERE IsAsc > 1
	END

	--SELECT * FROM #emp_ditre_vesom_d
	UPDATE #emp_ditre_vesom_d SET DiTre = CASE WHEN ISNULL(DiTre,0) < 0 THEN 0 ELSE DiTre END,
									VeSom = CASE WHEN ISNULL(VeSom,0) < 0 THEN 0 ELSE VeSom END
	WHERE ISNULL(DiTre,0) < 0 OR ISNULL(VeSom,0) < 0
--SELECT * FROM #emp_days_Shift
--SELECT 'dtvs sss',* FROM #emp_ditre_vesom_d
	select S.EmployeeCode, S.WorkDate, S.gSGMC, sum(S.DiTre) as DiTre, sum(S.VeSom) as VeSom, MIN(S.RI) AS RI, MAX(S.RO) AS RO, S.ShiftCode, 
					CAST(0 AS FLOAT) AS MinMaxAllowLateInMonth
	INTO #emp_ditre_vesom
	from #emp_ditre_vesom_d S
	group BY S.EmployeeCode, S.WorkDate, S.gSGMC, S.ShiftCode

	--SELECT * FROM #emp_ditre_vesom
	--Xet nghi phep trong ngay de tru lai DTVS
	SELECT F.EmployeeCode,F.WorkDate, CASE WHEN F.LeavePeriod IN (6,7) AND CONVERT(NVARCHAR(8), F.FromTime,108) < '12:00:00' THEN 2 
												WHEN F.LeavePeriod IN (6,7) AND CONVERT(NVARCHAR(8), F.FromTime,108) > '12:00:00' THEN 3
												ELSE F.LeavePeriod END AS LeavePeriod,CASE WHEN L.gSGMC = 1 THEN F.DayNum * 8.0 * 60.0 ELSE F.DayNum * L.gSGMC * 60.0 END AS SoPhut, L.gSGMC, F.DayNum AS SOCONG
	INTO #EmpDayOff_sub
	FROM dbo.EmployeeDayOffs_detailDay F WITH(NOLOCK)
	INNER JOIN #emp_days_d L ON L.EmployeeCode = F.EmployeeCode AND F.WorkDate = L.WorkDate
	WHERE F.LeavePeriod > 1 AND F.WorkDate BETWEEN @BegDate AND @EndDate

	SELECT EmployeeCode,WorkDate,gSGMC,LeavePeriod, SUM(SoPhut) AS SoPhut, SUM(SOCONG) AS SOCONG
	INTO #EmpDayOff
	FROM #EmpDayOff_sub
	GROUP BY EmployeeCode,WorkDate,gSGMC,LeavePeriod

	--SELECT * FROM #EmpDayOff

	UPDATE S SET s.DiTre = CASE WHEN S.DiTre <= F.SoPhut THEN 0 ELSE S.DiTre - F.SoPhut END from #emp_ditre_vesom S
	INNER JOIN #EmpDayOff F ON F.EmployeeCode = S.EmployeeCode AND F.WorkDate = S.WorkDate
	WHERE F.LeavePeriod IN (2,5)
	UPDATE S SET s.VeSom = CASE WHEN S.VeSom <= F.SoPhut THEN 0 ELSE S.VeSom - F.SoPhut END from #emp_ditre_vesom S
	INNER JOIN #EmpDayOff F ON F.EmployeeCode = S.EmployeeCode AND F.WorkDate = S.WorkDate
	WHERE F.LeavePeriod IN (3)


	select S.EmployeeCode, S.WorkDate,S.ShiftIn, S.ShiftOut,
		CASE WHEN S.RI is null and S.RowIndex = 1 then S.WorkingHours * 60
			WHEN S.RI BETWEEN S.ShiftIn AND S.ShiftOut then datediff(SECOND,S.ShiftIn,S.RI)/60.00  ELSE 0 END as DiTre,
		CASE WHEN S.RO is null and S.RowIndex > 1 then S.WorkingHours * 60
			WHEN S.RO BETWEEN S.ShiftIn AND S.ShiftOut then datediff(SECOND,S.RO,S.ShiftOut)/60.00
			ELSE 0 END as VeSom, S.Vacation, S.gSGMC, S.RI, S.RO, S.ShiftCode
	into #emp_ditre_vesom_d_NP
	from
	(
		SELECT E.EmployeeCode, E.WorkDate, R.RI,R.RO,E.ShiftIn, E.ShiftOut, E.WorkingHours, 
				row_number()OVER(PARTITION BY E.EmployeeCode, E.WorkDate ORDER BY E.ShiftIn) as RowIndex, E.Vacation, E.gSGMC, E.ShiftCode
		from #emp_days_Shift E 
		inner JOIN (SELECT EmployeeCode as EmployeeCode, WorkDate FROM #VWScanTime group BY EmployeeCode, WorkDate) S ON S.EmployeeCode = E.EmployeeCode and S.WorkDate = E.WorkDate
		left JOIN #VWScanTime_RiRo R
					ON R.EmployeeCode = E.EmployeeCode and R.WorkDate = E.WorkDate and R.RI < E.ShiftOut and R.RO > E.ShiftIn
		WHERE E.KowType <> 5 and E.KowType <> 25 AND E.Vacation < 2
	) S

--SELECT * FROM #emp_ditre_vesom_d_NP
	select S.EmployeeCode, S.WorkDate, S.gSGMC, sum(S.DiTre) as DiTre, sum(S.VeSom) as VeSom, MIN(S.RI) AS RI, MAX(S.RO) AS RO, S.ShiftCode
	INTO #emp_ditre_vesom_NP
	from #emp_ditre_vesom_d_NP S
	group BY S.EmployeeCode, S.WorkDate, S.gSGMC, S.ShiftCode

	--SELECT * FROM #emp_ditre_vesom_NP
	--SELECT * FROM dbo.SYS_ValueList WHERE ListName LIKE '%avePeriod%'

--select * from #emp_days_Shift WHERE KowType <> 5 order BY EmployeeCode, WorkDate
--select S.EmployeeCode, S.WorkDate, min(RI) as RI, max(RO) as RO from #VWScanTime_RiRo S group BY S.EmployeeCode, S.WorkDate
--select * from #emp_ditre_vesom
	--------END TINH DI TRE VE SOM-----------------------------------------------------------------------------------------------------

	--TINH CONG BINH THUONG CHO NHUNG NHAN VIEN CON LAI.(tinh co đi trễ về sớm dựa vào quét thẻ so với ca)
	--Danh sách nhân viên được phép đi trễ về sớm trong ngày(có đăng ký DT VS)
	--TotalMin: Tong so phut xin phep DTVS, TotalReal: Tong so phut DTVS thuc te
	select R.EmployeeCode, R.WorkDate, isnull(R.LateIn,0) + isnull(R.EarlyOut,0) as TotalMin , 
					ISNULL(E.DiTre,0) + isnull(E.VeSom,0) as TotalReal,
					isnull(R.LateIn,0) AS LateIn, isnull(R.EarlyOut,0) AS EarlyOut, isnull(E.DiTre,0) AS DiTre , 
					ISNULL(E.VeSom,0) AS VeSom, R.Kind
	into #EmpRegLateEarly_subDetail
	from EmpRegLateEarly R WITH(NOLOCK) 
	inner JOIN #emp_ditre_vesom E on E.EmployeeCode = R.EmployeeCode and R.WorkDate = E.WorkDate
	where R.WorkDate between @BegDate and @EndDate and isnull(E.DiTre,0) + isnull(E.VeSom,0) > 0
				AND isnull(R.LateIn,0) + isnull(R.EarlyOut,0) > 0 AND R.Kind <> 6 AND R.Kind <> 4

	SELECT S.EmployeeCode,S.WorkDate, SUM(TotalMin) AS TotalMin, SUM(TotalReal) AS TotalReal,
										SUM(LateIn) AS LateIn, SUM(EarlyOut) AS EarlyOut, 
										MAX(S.DiTre) AS DiTre,MAX(S.VeSom) AS VeSom
	INTO #EmpRegLateEarly
	FROM #EmpRegLateEarly_subDetail S
	GROUP BY S.EmployeeCode,S.WorkDate

	--SELECT * FROM #emp_ditre_vesom
	--SELECT * FROM #EmpRegLateEarly
	--hntruong - 04/03/2020 - IS2002/00015 - Nippon: deadline: 21/02/2020 - Hỗ trợ chỉnh tính đăng ký đi trễ về sớm theo đăng ký đi trễ hoặc về sớm
	--Chinh sach tinh rieng số phút được phép DTVS trong ngày
	--SELECT @IsDTVSThaiSan_TinhRieng
	IF @IsDTVSThaiSan_TinhRieng = 1
	BEGIN
		update R SET R.DiTre = CASE WHEN S.LateIn >= R.DiTre THEN 0 ELSE R.DiTre - S.LateIn END ,
					R.VeSom = CASE WHEN S.EarlyOut >= R.VeSom THEN 0 ELSE R.VeSom - S.EarlyOut END
		from #emp_ditre_vesom R 
		inner JOIN #EmpRegLateEarly S ON S.EmployeeCode = R.EmployeeCode and S.WorkDate = R.WorkDate

		--SELECT * FROM #emp_ditre_vesom
		DELETE R FROM #emp_ditre_vesom R  WHERE ISNULL(R.DiTre,0) <= 0 AND ISNULL(R.VeSom,0) <= 0
	END
	ELSE
	BEGIN
		--Xóa đi trễ - về sớm cho những ngày có đăng ký DTVS mà số Phút DTVS thực tế nằm trong mức cho phép.
		delete R FROM #emp_ditre_vesom R inner JOIN #EmpRegLateEarly S ON S.EmployeeCode = R.EmployeeCode and S.WorkDate = R.WorkDate
		where S.TotalMin >= S.TotalReal 

		--Update lại số phút đi trễ về sớm (Cho những ngày có đăng ký DTVS)
		UPDATE R SET R.DiTre = CASE WHEN S.TotalMin >= R.DiTre THEN 0 ELSE R.DiTre - S.TotalMin END ,
					R.VeSom = CASE WHEN S.TotalMin >= (R.VeSom + R.DiTre) THEN 0 
									ELSE 
										CASE WHEN S.TotalMin <= R.DiTre THEN R.VeSom else R.VeSom - (S.TotalMin - R.DiTre) END
									END
		FROM #emp_ditre_vesom R 
		INNER JOIN #EmpRegLateEarly S ON S.EmployeeCode = R.EmployeeCode AND S.WorkDate = R.WorkDate
	END

	CREATE TABLE #lstOfSoPhutLamBu(EmployeeCode NVARCHAR(30),WorkDate DATETIME, ForDate DATETIME, SoPhutTinhLB FLOAT, 
				SoPhutTangCa FLOAT, SoPhutDTVS FLOAT, SoPhutThucTeDcTinh FLOAT, SoCongThucTeDcTinh FLOAT)
	--XU LY TRU DI SO PHUT DANG KY LAM BU CHO THOI GIAN OT(Tru baland thoi gian oT)
	--SELECT @IsExtraWordInOneDays
	IF EXISTS (SELECT 1 FROM #EmpRegisterExtraWorkDay_tmp) 
	BEGIN
		--chi lay cac dong thông tin có số giờ thực tế làm bù >= số giờ đăng ký, những ngày đăng ký làm bù mà di ko đủ thì ko tính
		SELECT S.EmployeeCode,S.WorkDate,S.RI,S.RO,S.KowCode,S.STT, T.ForDate, S.SoPhut, T.HourNum,
				T.HourNum - SUM(S.SoPhut) OVER (PARTITION BY S.EmployeeCode,S.WorkDate ORDER BY S.STT ASC ROWS UNBOUNDED PRECEDING) as Baland
		INTO #lstOfBalandLamBu
		FROM #emp_days_scantime_to_shift  S
		INNER JOIN #EmpRegisterExtraWorkDay_tmp T ON T.EmployeeCode = S.EmployeeCode AND T.WorkDate =S.WorkDate
		WHERE S.KowType = 5 AND T.HourNum > 0 

		--
		SELECT EmployeeCode,WorkDate,SUM(SoPhut) AS SoPhut,MAX(HourNum) AS HourNum 
		INTO #Lambuhople
		FROM #lstOfBalandLamBu 
		GROUP BY EmployeeCode,WorkDate
		HAVING MAX(HourNum) <= SUM(SoPhut)

		UPDATE T SET T.RealHourNum = CASE WHEN S.SoPhut >= S.HourNum THEN S.HourNum ELSE S.SoPhut END
		FROM #EmpRegisterExtraWorkDay_tmp T
		INNER JOIN #Lambuhople S ON S.EmployeeCode = T.EmployeeCode AND S.WorkDate = T.WorkDate

		--xoa nhung dong dang ký mà thời gian làm bù ko đủ(ko hợp lệ)
		DELETE T FROM #EmpRegisterExtraWorkDay_tmp T
		LEFT JOIN #Lambuhople S ON S.EmployeeCode = T.EmployeeCode AND S.WorkDate = T.WorkDate
		WHERE S.EmployeeCode IS NULL

		--SELECT * FROM #EmpRegisterExtraWorkDay_tmp
		--SELECT @IsDangKyLamBuIsApplyForNoon
		--delete thoi gian OT đã làm bù hết cho ngày khác
		DELETE S FROM #emp_days_scantime_to_shift S 
		INNER JOIN #lstOfBalandLamBu L ON L.EmployeeCode = S.EmployeeCode AND L.WorkDate = S.WorkDate AND L.STT = S.STT
		INNER JOIN #Lambuhople H ON H.EmployeeCode = S.EmployeeCode AND H.WorkDate = S.WorkDate
		WHERE L.Baland >= 0

		UPDATE S SET S.SoPhut = (-1)*L.Baland, S.RI = DATEADD(MINUTE,L.Baland,S.RO)
		FROM #emp_days_scantime_to_shift S
		INNER JOIN (
			SELECT *
			FROM #lstOfBalandLamBu
			WHERE Baland < 0  AND HourNum + Baland > 0
		) L ON L.EmployeeCode = S.EmployeeCode AND L.WorkDate = S.WorkDate AND L.STT = S.STT
		INNER JOIN #Lambuhople H ON H.EmployeeCode = S.EmployeeCode AND H.WorkDate = S.WorkDate

		--SELECT * FROM #EmpRegisterExtraWorkDay_tmp
		--update so gio lam bu thuc te cua phieu(so voi quet the)
		--SELECT 'ffff',* FROM EmpRegisterExtraWorkDay W
		--INNER JOIN #EmpRegisterExtraWorkDay_tmp T ON T.RecID = W.RecID

		INSERT INTO #lstOfSoPhutLamBu(EmployeeCode,WorkDate,ForDate,SoPhutThucTeDcTinh)
		SELECT EmployeeCode,WorkDate,ForDate,RealHourNum
		FROM #EmpRegisterExtraWorkDay_tmp
	END
	
	--SELECT @IsDTVSThaiSan_TinhRieng AS '@IsDTVSThaiSan_TinhRieng'
	--select * from #emp_ditre_vesom	
	--Ap block lam tron DTVS sớm thiết lập trong hệ thống
	--@TSIsLate : Đi trễ/ Trừ đi trễ theo quy định của công ty
	--@TSIsEarly: Về sớm/ Trừ đi trễ theo quy định của công ty
	--SELECT @TSIsLate
	IF ISNULL(@TSIsLate,0) = 1 or ISNULL(@TSIsEarly,0) = 1 OR ISNULL(@TSIsLateEarly,0) = 1
	BEGIN
	--select 'fffffffffffffffffff',@TSIsLateEarly,@TSIsLate,@TSIsEarly
		select V.IsLate, V.MinFrom, V.MinTo, V.MinCal into #sysConfigTSSubLateEarly 
		from sysConfigTSSubLateEarly V WITH(NOLOCK) 

		--SELECT * FROM sysConfigTSSubLateEarly
		IF ISNULL(@TSIsLateEarly,0) = 1
		BEGIN
			update R SET R.DiTre = S.MinCal, R.VeSom = 0
			from #emp_ditre_vesom R 
			inner join sysConfigTSSubLateEarly S on S.IsLate = 2
			where S.MinFrom <= R.DiTre + R.VeSom and R.DiTre + R.VeSom < S.MinTo
		END
		ELSE
        BEGIN
			--Update block Di tre
			IF @TSIsLate = 1
			BEGIN
				update R SET R.DiTre = S.MinCal
				from #emp_ditre_vesom R 
				inner join sysConfigTSSubLateEarly S on S.IsLate = 1
				where S.MinFrom <= R.DiTre and R.DiTre < S.MinTo
			END
			--Update block Ve som
			IF @TSIsEarly = 1
			BEGIN
				UPDATE R SET R.VeSom = S.MinCal
				FROM #emp_ditre_vesom R 
				INNER JOIN sysConfigTSSubLateEarly S ON S.IsLate = 0
				WHERE S.MinFrom <= R.VeSom AND R.VeSom < S.MinTo
			END
		END
	END
	--SELECT * FROM #emp_ditre_vesom
	--Thanh buoi-Xac dinh so phut lam bu trong ngay
	--Neu co dang ky thoi gian lam bu trong ngay
	
	DECLARE @IsExtraWordInOneDays bit
	SET @IsExtraWordInOneDays = 0
	IF EXISTS (SELECT 1 FROM #EmpRegisterExtraWorkDay_tmp) AND ISNULL(@IsExtraWordInOneDays,0) = 1
	BEGIN
		--SELECT * FROM #EmpRegisterExtraWorkDay_tmp
		INSERT INTO #lstOfSoPhutLamBu(EmployeeCode, WorkDate, SoPhutTinhLB, SoPhutTangCa, SoPhutDTVS)
		SELECT S.EmployeeCode,S.WorkDate, CASE WHEN S.SoPhut < T.HourNum THEN S.SoPhut ELSE T.HourNum END AS SoPhutTinhLB, 
					S.SoPhut AS SoPhutTangCa, ISNULL(L.DiTre,0) + ISNULL(L.VeSom,0) AS SoPhutDTVS
		FROM #EmpRegisterExtraWorkDay_tmp T 
		LEFT JOIN #emp_ditre_vesom_NP L ON L.EmployeeCode = T.EmployeeCode AND L.WorkDate = T.WorkDate
		INNER JOIN
		(
			SELECT EmployeeCode,WorkDate,SUM(SoPhut) AS SoPhut FROM #emp_days_scantime_to_shift 
			WHERE KowType NOT IN (1,3) AND SoPhut > 0  
			GROUP BY EmployeeCode,WorkDate
		) S ON S.EmployeeCode = T.EmployeeCode AND S.WorkDate = T.WorkDate
		--SELECT * FROM #lstOfSoPhutLamBu
	END

	--Xóa OT những nhân viên thiết lập là không tính OT
	delete from #emp_days_scantime_to_shift where IsNotOTKow = 1 and KowType = 5

--select * from #emp_ditre_vesom
	--ToTalHoursNormalInDay: Tong số công đủ của ca(có thể là giờ hoặc số công)	
	--@TSIsExactKowOnHoliday: Tinh chinh xac khi đi làm vào ngày nghỉ, ngày lễ
	--create table #emp_daynum(EmployeeCode nvarchar(100), WorkDate datetime, KowCode nvarchar(100), ToTalHoursNormalInDay float, 
	--					DayNum float, WorkingHours float, MiDTVS float, gSGMC float, IsKowOT bit)
	--insert INTO #emp_daynum(EmployeeCode, WorkDate, KowCode, ToTalHoursNormalInDay, DayNum, WorkingHours, MiDTVS, gSGMC, IsKowOT)
--select @TSIsExactKowOnHoliday as TSIsExactKowOnHoliday
--select IsNotLateEarly,* from #emp_days_scantime_to_shift
	
	--SELECT * FROM #emp_days_scantime_to_shift
	SELECT S.EmployeeCode,S.WorkDate,S.ShiftIn, S.ShiftOut, MAX(S.ShiftCode) AS ShiftCode,MAX(S.KowCode) AS KowCode,
		MIN(S.RI) AS RI,MAX(S.RO) AS RO,SUM(S.SoPhut) AS SoPhut,MAX(S.KowType) AS KowType,MAX(S.Vacation) AS Vacation,S.IsNotLateEarly,
		MAX(S.WorkingHours) AS WorkingHours,S.gSGMC,S.IsLastPayroll,MAX(S.IsPay) AS IsPay
	INTO #emp_days_scantime_to_shift_sub
	from #emp_days_scantime_to_shift S 
	GROUP BY S.EmployeeCode,S.WorkDate,S.ShiftIn, S.ShiftOut,S.IsNotLateEarly,S.gSGMC,S.IsLastPayroll

	--SELECT * FROM #emp_days_scantime_to_shift_sub
	--SELECT * FROM #emp_ditre_vesom

	select S.*, case when S.RowLate=1 then isnull(L.DiTre,0) else 0 END + case when S.RowEarly=1 then isnull(L.VeSom,0) else 0 END as DTVSMi
	into #emp_days_scantime_to_shift_TongDTVS
	from 
	(
		select *, ROW_NUMBER()over(partition by EmployeeCode,WorkDate order by RI) as RowLate
				, ROW_NUMBER()over(partition by EmployeeCode,WorkDate order by RI desc ) as RowEarly
		from #emp_days_scantime_to_shift_sub WHERE KowType <> 5
	) S
	left join #emp_ditre_vesom L on L.EmployeeCode = S.EmployeeCode and L.WorkDate = S.WorkDate

	--SELECT * FROM #emp_days_scantime_to_shift_TongDTVS

	--SELECT @TSIsSubLateEarlyOnHoliday,@TSIsExactKowOnHoliday
	--SELECT * FROM #emp_days_scantime_to_shift_TongDTVS
--select * from #emp_days_scantime_to_shift_TongDTVS
	select S.EmployeeCode, S.WorkDate, S.KowCode, case when S.Vacation = 1 then Shs.TotalWorkingHours * 60 ELSE Sh.TotalWorkingHours * 60 END as ToTalHoursNormalInDay,
				CASE WHEN S.IsNotLateEarly = 1 THEN case when S.Vacation = 1 then Shs.TotalWorkingHours * 60 ELSE Sh.TotalWorkingHours * 60 END
						WHEN (S.Vacation > 1 AND (@TSIsSubLateEarlyOnHoliday = 1 OR @TSIsExactKowOnHoliday = 1)) OR S.KowType=25 THEN S.DayNum
					 WHEN S.DTVSMi <= 0 THEN S.WorkingHours
					 ELSE S.DayNum END as DayNum, S.WorkingHours, S.DTVSMi as MiDTVS, S.gSGMC, 0 as IsKowOT, S.Vacation, S.KowType,
					 S.IsPay AS IsPay, S.DayNum AS SoPhutLamViecThucTe, S.IsLastPayroll
	into #emp_daynum
	from
	(
		select S.EmployeeCode, S.WorkDate, S.ShiftCode, S.KowCode, S.Vacation, S.IsNotLateEarly, sum(S.SoPhut) as DayNum, 
				sum(S.WorkingHours) * 60 as WorkingHours, S.KowType, S.gSGMC, sum(DTVSMi) as DTVSMi, S.IsLastPayroll, MAX(ISNULL(S.IsPay,0)) AS IsPay
		from #emp_days_scantime_to_shift_TongDTVS S 
		group BY S.EmployeeCode, S.WorkDate, S.ShiftCode, S.KowCode, S.KowType, S.gSGMC, S.Vacation, S.IsNotLateEarly, S.IsLastPayroll
	) S
	left join (
		select ShiftCode, sum(WorkingHours) as TotalWorkingHours
		from #VWShiftDetail_In_Out where KowType in (1,3)
		group BY ShiftCode
	) Sh ON Sh.ShiftCode = S.ShiftCode
	left join (
		select ShiftCode, sum(WorkingHours) as TotalWorkingHours
		from #VWShiftDetail_In_Out_haftDay where KowType in (1,3)
		group BY ShiftCode
	) Shs ON Shs.ShiftCode = S.ShiftCode
--select * from #emp_daynum
--select * from #emp_ditre_vesom
--select * from #emp_days_scantime_to_shift
	--Tìm số phút bị lệch sau khi làm tròn Di trễ về sớm.(LAM TRONG DTVS CHI TINH CHO CONG CA CHINH KO TINH OT)
	select S.EmployeeCode, S.WorkDate, sum(DayNum) as DayNum, max(ToTalHoursNormalInDay) as ToTalHoursNormalInDay, 
			max(MiDTVS) as MiDTVS, CASE WHEN S.Vacation>1 THEN 0 ELSE max(ToTalHoursNormalInDay) - sum(DayNum) - max(MiDTVS) end as HieuSoLech
	into #HieuSoLech_DayNum
	from #emp_daynum S where S.KowType <> 5 and S.KowType <> 25
	group BY S.EmployeeCode, S.WorkDate, S.Vacation
--SELECT * FROM #HieuSoLech_DayNum

	declare @i int set @i = 0
	--DIEU CHINH SO PHÚT BỊ LỆCH SAU KHI LÀM TRÒN ĐI TRỄ - VỀ SỚM
--select * from #HieuSoLech_DayNum
--select * from #emp_daynum
--select * from #HieuSoLech_DayNum where HieuSoLech <> 0
	IF exists (select top 1 1 from #HieuSoLech_DayNum where HieuSoLech <> 0)
	BEGIN
		--SELECT 'fff'
		create table #HieuSo(EmployeeCode nvarchar(100), WorkDate datetime, KowCode nvarchar(100) ,Oldvalue float, Newvalue float)
		WHILE @i < 2
		BEGIN
			IF exists (select TOP 1 1 from #HieuSoLech_DayNum where HieuSoLech > 0)
			BEGIN
				delete FROM #HieuSo

				--select S.EmployeeCode, S.WorkDate, S.KowCode, S.DayNum,S.WorkingHours , H.HieuSoLech,S.MiDTVS
				--	from #emp_daynum S inner join #HieuSoLech_DayNum H ON H.EmployeeCode = S.EmployeeCode and H.WorkDate = S.WorkDate
					--where S.DayNum < S.WorkingHours and H.HieuSoLech > 0 AND S.KowType <> 25 and S.MiDTVS > 0

				--Update nhung truong hop thiếu số giờ đi làm(do làm tròn Đi trễ về sớm xuống)
				update S SET S.DayNum = CASE WHEN S.DayNum + R.HieuSoLech >= S.WorkingHours THEN S.WorkingHours ELSE S.DayNum + R.HieuSoLech END
				OUTPUT		inserted.EmployeeCode,
							inserted.WorkDate,
							inserted.KowCode,
							deleted.DayNum,  
							inserted.DayNum
						INTO #HieuSo
				from #emp_daynum S
				inner JOIN
				(
					select S.EmployeeCode, S.WorkDate, S.KowCode, S.DayNum , H.HieuSoLech,
					row_number()OVER(PARTITION BY S.EmployeeCode, S.WorkDate ORDER BY S.DayNum) as RowIndex
					from #emp_daynum S inner join #HieuSoLech_DayNum H ON H.EmployeeCode = S.EmployeeCode and H.WorkDate = S.WorkDate
					where S.DayNum < S.WorkingHours and H.HieuSoLech > 0 AND S.KowType <> 25 and S.MiDTVS > 0
				) R on R.EmployeeCode = S.EmployeeCode and R.WorkDate = S.WorkDate and R.KowCode = S.KowCode
				where R.RowIndex = 1

				--select * from #HieuSo
				UPDATE S SET S.HieuSoLech = S.HieuSoLech - (R.Newvalue - R.Oldvalue) 
				FROM #HieuSoLech_DayNum S 
				INNER JOIN #HieuSo R ON R.EmployeeCode = S.EmployeeCode AND R.WorkDate = S.WorkDate
			END
			
			IF exists (select TOP 1 1 from #HieuSoLech_DayNum where HieuSoLech < 0)
			BEGIN
				delete FROM #HieuSo
				--Update nhung truong hop dư số giờ đi làm(do làm tròn Đi trễ về sớm lên)
				update S SET S.DayNum = S.DayNum + R.HieuSoLech
				OUTPUT		inserted.EmployeeCode,
							inserted.WorkDate,
							inserted.KowCode,
							deleted.DayNum,  
							inserted.DayNum
						INTO #HieuSo
				from #emp_daynum S
				inner JOIN
				(
					select S.EmployeeCode, S.WorkDate, S.KowCode, S.DayNum , H.HieuSoLech,
							row_number()OVER(PARTITION BY S.EmployeeCode, S.WorkDate ORDER BY S.DayNum desc) as RowIndex
					from #emp_daynum S inner join #HieuSoLech_DayNum H ON H.EmployeeCode = S.EmployeeCode and H.WorkDate = S.WorkDate
					where H.HieuSoLech < 0 AND S.KowType <> 25 and S.MiDTVS > 0
				) R on R.EmployeeCode = S.EmployeeCode and R.WorkDate = S.WorkDate and R.KowCode = S.KowCode
				where R.RowIndex = 1

				UPDATE S SET S.HieuSoLech = S.HieuSoLech + (R.Oldvalue - R.Newvalue) 
				FROM #HieuSoLech_DayNum S 
				INNER JOIN #HieuSo R ON R.EmployeeCode = S.EmployeeCode AND R.WorkDate = S.WorkDate
			END
			SET @i = @i + 1
		END
	END
	--SELECT * FROM #emp_daynum
	
	

	--ktra cong lam bu
	
	--SELECT @KowCodeExtraWorkDay
	DECLARE @KowCodeExtraWorkDay NVARCHAR(100)
	IF EXISTS (SELECT 1 FROM #lstOfSoPhutLamBu) AND ISNULL(@KowCodeExtraWorkDay,'') <> ''  AND ISNULL(@IsExtraWordInOneDays,0) = 1
	BEGIN
		SELECT L.EmployeeCode,L.WorkDate,
			CASE WHEN R.DayNum + L.SoPhutTinhLB >= R.ToTalHoursNormalInDay THEN 
					CASE WHEN R.gSGMC <> 1 THEN	1 - ROUND(R.DayNum/60.00/R.gSGMC,@gSSLNC) ELSE R.SoGioCa - ROUND(R.DayNum/60.00,@gSSLNC) end 
				ELSE 
					 ROUND(L.SoPhutTinhLB/60.00/R.gSGMC,@gSSLNC)  
				END AS SoCongLB,
			CASE WHEN R.DayNum + L.SoPhutTinhLB >= R.ToTalHoursNormalInDay THEN 
				R.ToTalHoursNormalInDay - R.DayNum
			ELSE 
				L.SoPhutTinhLB
			END AS SoPhutLB, R.gSGMC, 
			CASE WHEN L.SoPhutTinhLB >= L.SoPhutDTVS THEN L.SoPhutDTVS ELSE L.SoPhutTinhLB END AS SoPhutThucTeLBCuaPhieu, R.IsLastPayroll
		INTO #lstOfLamBuDcTinh
		FROM #lstOfSoPhutLamBu L
		INNER JOIN 
		(
			SELECT S.EmployeeCode,S.WorkDate, MAX(S.gSGMC) AS gSGMC,SUM(S.DayNum) AS DayNum, 
						MAX(S.ToTalHoursNormalInDay) AS ToTalHoursNormalInDay, SUM(S.WorkingHours)/60.00 AS SoGioCa, S.IsLastPayroll
			FROM #emp_daynum S 
			WHERE S.KowType IN (1,3) GROUP BY S.EmployeeCode,S.WorkDate, S.IsLastPayroll
		) R ON R.EmployeeCode =L.EmployeeCode AND R.WorkDate = L.WorkDate

--SELECT * FROM #emp_daynum
--SELECT * FROM #lstOfLamBuDcTinh
		UPDATE S SET S.SoPhutThucTeDcTinh = T.SoPhutThucTeLBCuaPhieu, S.SoCongThucTeDcTinh = T.SoCongLB from #lstOfSoPhutLamBu S
		INNER JOIN #lstOfLamBuDcTinh T ON T.EmployeeCode = S.EmployeeCode AND T.WorkDate = S.WorkDate

--SELECT * FROM #lstOfLamBuDcTinh
		INSERT INTO #emp_daynum(EmployeeCode,WorkDate,KowCode,ToTalHoursNormalInDay,DayNum,WorkingHours,MiDTVS,gSGMC,IsKowOT,Vacation,KowType, IsLastPayroll)
		SELECT S.EmployeeCode,S.WorkDate, @KowCodeExtraWorkDay, 0,S.SoCongLB, 0, 0, S.gSGMC,0, 0, -1, S.IsLastPayroll
		FROM #lstOfLamBuDcTinh S

		--xoa hoac tru lai so phut dtvs thuc te, neu co thoi gian lam bu trong ngay
		INSERT INTO EmpKowLateEarly_sub(EmployeeCode,WorkDate,Late,Early, ShiftCode, Ri, RO,CreatedBy)
		SELECT S.EmployeeCode, S.WorkDate,
				CASE WHEN ISNULL(S.DiTre,0) > 0 THEN CASE WHEN ISNULL(S.DiTre,0) <= ISNULL(T.SoPhutThucTeLBCuaPhieu,0) THEN 0 ELSE ISNULL(S.DiTre,0) - ISNULL(T.SoPhutThucTeLBCuaPhieu,0) END ELSE 0 END AS DiTre,
				CASE WHEN ISNULL(S.VeSom,0) > 0 THEN CASE WHEN ISNULL(S.VeSom,0) <= ISNULL(T.SoPhutThucTeLBCuaPhieu,0) THEN 0 ELSE ISNULL(S.VeSom,0) - ISNULL(T.SoPhutThucTeLBCuaPhieu,0) END ELSE 0 END AS VeSom,
				S.ShiftCode, S.RI, S.RO,@UserID
		FROM #emp_ditre_vesom_NP S
		LEFT JOIN #lstOfLamBuDcTinh T ON T.EmployeeCode = S.EmployeeCode AND T.WorkDate = S.WorkDate
	END
	ELSE
    BEGIN
		--SELECT * FROM #emp_ditre_vesom_NP
		INSERT INTO EmpKowLateEarly_sub(EmployeeCode,WorkDate,Late,Early, ShiftCode, Ri, RO,CreatedBy)
		SELECT EmployeeCode, WorkDate,DiTre,VeSom, ShiftCode, RI, RO,@UserID
		FROM #emp_ditre_vesom_NP
	END
	--SELECT * FROM #lstOfSoPhutLamBu

	--PRINT 'ffffffffffffff'

	--************************TINH OT LÀM NGOÀI GIỜ ********************************************************************************************
	--ConfigTS -	TSCalOT	Ngoài giờ/ Valuelist: 1. Tính chính xác theo thời gian làm thực tế; 2. Tính chính xác theo thời gian làm thực tế nhưng số phút tối thiểu như sau; 3. Tính theo từng block; 4. Chỉ tính khi nhân viên làm đủ thời gian đăng ký trở lên
	--declare @TSIsCalOTByRegister bit --OT được tính phải có đăng ký OT 
	--declare @TSIsCalOTByConfirm bit --OT được tính phải có xác nhận
	--declare @TSIsWLeaveRegOT bit --Chi tính tăng ca ngày nghỉ khi có đăng ký
	--declare @TSIsHolidayRegOT bit -- chỉnh tính tăng ca ngày lễ khi có đăng ký

	
	--SELECT * FROM #emp_days_scantime_to_shift

	select * into #empOT from #emp_days_scantime_to_shift where KowType = 5
	
	--SELECT '#empOT',* from #empOT
	--Get Table làm tròn OT block cho từng nhân viên
	select * into #emp_OTdaynum from #emp_daynum where 1=0
--print 'fffff'
--select * from #empOT order BY WorkDate
--return
	--1. Tính OT không cần đăng ký và xác nhận, thời gian quét thẻ dư bao nhiêu tính bấy nhiêu.
--select @TSIsCalOTByRegister as TSIsCalOTByRegister, @TSIsCalOTByConfirm as TSIsCalOTByConfirm
--select * from #empOT
--return
--SELECT * FROM #emp_daynum
--SELECT @TSIsCalOTByRegister AS '@TSIsCalOTByRegister'
	IF ISNULL(@TSIsCalOTByRegister,0) = 0 and ISNULL(@TSIsCalOTByConfirm,0) = 0
	BEGIN
		Insert into #emp_OTdaynum(EmployeeCode, WorkDate, KowCode, DayNum, Vacation, KowType, MiDTVS, gSGMC, IsKowOT, IsPay)
		select EmployeeCode, WorkDate, KowCode, SoPhut as DayNum, vacation, KowType, 0, gSGMC, CASE WHEN KowType=5 THEN 1 else 0 END,0
		from #empOT

		--Insert into #emp_OTdaynum(EmployeeCode, WorkDate, KowCode, DayNum, Vacation, KowType, MiDTVS, gSGMC, IsKowOT)
		--select EmployeeCode, WorkDate, KowCode, sum(SoPhut) as DayNum, vacation, KowType, 0, gSGMC, CASE WHEN KowType=5 THEN 1 else 0 END
		--from #empOT
		--group BY EmployeeCode, WorkDate, KowCode, vacation, KowType, gSGMC
	END
	ELSE 
	BEGIN
		--2. Tính OT phải có đăng ky.
		IF ISNULL(@TSIsCalOTByRegister,0) = 1 --and @TSIsCalOTByConfirm = 0
		BEGIN
			create table #TimeOT(EmployeeCode nvarchar(100), WorkDate datetime, KowCode nvarchar(100), RI datetime, RO datetime, 
					MinOT float, gSGMC float, RowIndex int, SoPhutDangKy float, Vacation int, KowType INT, IsPay int)
			--Tinh OT dựa vào đăng ký OT theo thời điểm or theo số giờ đăng ký.
			--SELECT @TSIsRegOTByFromTo AS '@TSIsRegOTByFromTo'
			IF @TSIsRegOTByFromTo = 1
			BEGIN
				print 'Tinh OT theo thoi diem'
				--SELECT @TSIsCalOTByConfirm AS '@TSIsCalOTByConfirm'
				--Tính OT không cần xác nhận(so sanh voi dang ky OT)
				IF @TSIsCalOTByConfirm = 0
				BEGIN
					--SELECT * FROM #RegisterOT
					print 'Tinh OT ko can xac nhan'
					INSERT INTO #TimeOT(EmployeeCode, WorkDate, KowCode, RI, RO, gSGMC, Vacation, KowType, IsPay)
					SELECT S.EmployeeCode, S.WorkDate, S.KowCode, CASE WHEN S.RI > R.FromTime THEN S.RI ELSE R.FromTime END AS RI
													 , CASE WHEN S.RO < R.ToTime THEN S.RO ELSE R.ToTime END AS RO, S.gSGMC, S.Vacation, S.KowType, R.IsUnPaid
					FROM #empOT S 
					INNER JOIN  #RegisterOT R ON R.EmployeeCode = S.EmployeeCode AND R.WorkDate = S.WorkDate
									AND S.RI < R.ToTime AND S.RO > R.FromTime
					--select * from #empOT
					--select 'fff',* from #TimeOT
				END
				ELSE
				BEGIN
					print 'Tinh OT phai co xac nhan'
					INSERT INTO #TimeOT(EmployeeCode, WorkDate, KowCode, RI, RO, gSGMC, Vacation, KowType, IsPay)
					SELECT S.EmployeeCode, S.WorkDate, S.KowCode, CASE WHEN S.RI > R.FromTime THEN S.RI ELSE R.FromTime END AS RI
													 , CASE WHEN S.RO < R.ToTime THEN S.RO ELSE R.ToTime END AS RO, S.gSGMC, S.Vacation, S.KowType, R.IsUnPaid
					FROM #empOT S 
					INNER JOIN  #RegisterOT R ON R.EmployeeCode = S.EmployeeCode AND R.WorkDate = S.WorkDate
									AND S.RI < R.ToTime AND S.RO > R.FromTime
					WHERE S.IsOver = 1
				END
				IF EXISTS (SELECT TOP 1 1 FROM #TimeOT)
				BEGIN
					INSERT INTO #emp_OTdaynum(EmployeeCode, WorkDate, KowCode, DayNum , gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
					SELECT S.EmployeeCode, S.WorkDate, S.KowCode, S.MinOT AS MinOT, S.gSGMC AS gSGMC, 0 AS MiDTVS, 1 AS IsKowOT, S.Vacation, S.KowType, S.IsPay
					FROM
					(
						SELECT EmployeeCode, WorkDate, KowCode, DATEDIFF(SECOND, R.RI, R.RO)/60.00 AS MinOT, R.gSGMC, R.Vacation, R.KowType, R.IsPay
						FROM #TimeOT R
					) S 
					--SELECT '#emp_OTdaynum',* from #emp_OTdaynum
				END
--select 'gggg',* from #emp_OTdaynum
			END
			ELSE
			BEGIN
				print 'Tinh OT theo so gio dang ky'
				--Tính OT không cần xác nhận
				IF @TSIsCalOTByConfirm = 0
				BEGIN
					print 'Tinh OT ko can xac nhan'
					INSERT INTO #TimeOT(EmployeeCode, WorkDate, KowCode, MinOT, gSGMC, RowIndex, SoPhutDangKy, Vacation, KowType, IsPay)
					SELECT S.EmployeeCode, S.WorkDate, S.KowCode, S.MinOT, gSGMC, 
						ROW_NUMBER() OVER(PARTITION BY S.EmployeeCode, S.WorkDate ORDER BY L.BasicSalRate) AS RowIndex, 
						R.HourNum * 60 AS SoPhutDangKy, S.Vacation, S.KowType, R.IsUnPaid
					FROM 
					(
						SELECT S.EmployeeCode, S.WorkDate, S.KowCode, DATEDIFF(SECOND, S.RI, S.RO)/60.00 AS MinOT, S.gSGMC, S.Vacation, S.KowType
						FROM #empOT S 
					) S  INNER JOIN LsKows L WITH(NOLOCK) ON L.KowCode = S.KowCode
					INNER JOIN #RegisterOT R ON R.EmployeeCode = S.EmployeeCode AND R.WorkDate = S.WOrkDate
				END
				ELSE
				BEGIN
					print 'Tinh OT phai co xac nhan'
					INSERT INTO #TimeOT(EmployeeCode, WorkDate, KowCode, MinOT, gSGMC, RowIndex, SoPhutDangKy, Vacation, KowType, IsPay)
					SELECT S.EmployeeCode, S.WorkDate, S.KowCode, S.MinOT, gSGMC, 
							ROW_NUMBER() OVER(PARTITION BY S.EmployeeCode, S.WorkDate ORDER BY L.BasicSalRate) AS RowIndex, 
						 R.HourNum * 60 AS SoPhutDangKy, S.Vacation, S.KowType, R.IsUnPaid
					FROM 
					(
						SELECT S.EmployeeCode, S.WorkDate, S.KowCode, DATEDIFF(SECOND, S.RI, S.RO)/60.00 AS MinOT, S.gSGMC, S.Vacation, S.KowType
						FROM #empOT S 
						WHERE S.IsOver = 1
					) S INNER JOIN LsKows L WITH(NOLOCK) ON L.KowCode = S.KowCode
					INNER JOIN #RegisterOT R ON R.EmployeeCode = S.EmployeeCode AND R.WorkDate = S.WOrkDate
				END
				IF EXISTS (SELECT TOP 1 1 FROM #TimeOT)
				BEGIN
					--insert into #emp_OTdaynum(EmployeeCode, WorkDate, KowCode, DayNum , gSGMC, MiDTVS, IsKowOT)
					--Tap danh sach OT lam thực tế < OT đăng ký thì lấy hết các OT thực tế(ngược lại OT thực tế > OT đăng ký thì lấy tổng số giờ OT = SỐ giờ OT đăng ký)
					select EmployeeCode, WorkDate, Vacation into #OTRegHour
					from #TimeOT R 
					GROUP BY EmployeeCode, WorkDate, Vacation
					HAVING sum(MinOT) <= max(SoPhutDangKy)

					IF exists (select top 1 1 from #OTRegHour)
					BEGIN
						insert into #emp_OTdaynum(EmployeeCode, WorkDate, KowCode, DayNum , gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
						select S.EmployeeCode, S.WorkDate, S.KowCode, S.MinOT, S.gSGMC, 0 as MiDTVS, 1 as IsKowOT, S.Vacation, S.KowType, S.IsPay
						from #TimeOT S inner join #OTRegHour R on R.EmployeeCode = S.EmployeeCode and R.WorkDate = S.WorkDate

						DELETE S FROM #TimeOT S INNER JOIN #OTRegHour R ON R.EmployeeCode = S.EmployeeCode AND R.WorkDate = S.WorkDate
					END
					IF EXISTS (SELECT TOP 1 1 FROM #TimeOT)
					BEGIN
						declare @MaxKow int
						select @MaxKow = max(RowIndex) from #TimeOT
						IF ISNULL(@MaxKow,0) > 0
						BEGIN
							--MinOT: So phut OT lam thuc te theo quet the, SoPhutDangKy: so phut OT nhan vien dang ky, DayNum: SO phut OT sẽ được tính
							create table #tmpRemainOT(EmployeeCode nvarchar(100), WorkDate datetime, KowCode nvarchar(100), MinOT float, SoPhutDangKy float, 
										DayNum float, RowIndex int, gSGMC float, Vacation int, KowType INT, IsPay INT)
							set @i = 1
							WHILE(@i <= @MaxKow)
							BEGIN
								IF exists (SELECT 1 from #TimeOT where RowIndex = @i)
								BEGIN
									delete from #tmpRemainOT

									insert INTO #tmpRemainOT(EmployeeCode, WorkDate, KowCode, MinOT, SoPhutDangKy, DayNum, RowIndex, gSGMC, Vacation, KowType, IsPay)
									SELECT R.EmployeeCode, R.WorkDate , R.KowCode, MinOT, SoPhutDangKy, 
										CASE WHEN R.MinOT <= R.SoPhutDangKy THEN R.MinOT ELSE R.SoPhutDangKy END, R.RowIndex, R.gSGMC, R.Vacation, R.KowType, R.IsPay
									from #TimeOT R
									where R.RowIndex = @i

									insert into #emp_OTdaynum(EmployeeCode, WorkDate, KowCode, DayNum , gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
									SELECT R.EmployeeCode, R.WorkDate , R.KowCode, R.DayNum, R.gSGMC, 0, 1, R.Vacation, R.KowType, R.IsPay
									from #tmpRemainOT R

									delete R from #TimeOT R inner join #tmpRemainOT S on S.EmployeeCode = R.EmployeeCode and S.WorkDate = R.WorkDate
									where R.RowIndex = @i or S.SoPhutDangKy <= S.MinOT

									UPDATE R SET R.SoPhutDangKy = R.SoPhutDangKy - S.MinOT 
									FROM #TimeOT R 
									INNER JOIN #tmpRemainOT S ON S.EmployeeCode = R.EmployeeCode AND S.WorkDate = R.WorkDate
								END
								SET @i = @i + 1
							END
						END
					END
				END
			END
		END
		ELSE
		BEGIN
			--Tinh OT không cần đăng ký, chỉ cần xác nhận
			IF(@TSIsCalOTByConfirm = 1)
			BEGIN
				INSERT INTO #emp_OTdaynum(EmployeeCode, WorkDate, KowCode, DayNum , gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
				SELECT S.EmployeeCode, S.WorkDate, S.KowCode, MinOT AS MinOT, S.gSGMC, 0 AS MiDTVS, 1 AS IsKowOT, S.Vacation, S.KowType, 0
				FROM
				(
					SELECT S.EmployeeCode, S.WorkDate, S.KowCode, DATEDIFF(SECOND, S.RI, S.RO)/60.00 AS MinOT, S.gSGMC, S.Vacation, S.KowType
					FROM #empOT S 
					WHERE S.IsOver = 1
				) S 
			END
		END
	END
	
--select * from #emp_OTdaynum
--return
--select 'fff',* from #empOT
--select 'gggggg',* from #emp_OTdaynum where IsKowOT = 1
--select @TSCalOT as '@TSCalOT'
--select * from sysConfigTSEmpOT where TSCalOT = 2

--select * from #emp_daynum
	--CHUYỂN OT25(KOWTYPE = 25) VỀ MỘT LOẠI CÔNG OT(KOWTYPE = 5) CÓ BS_RATE BẰNG VỚI NÓ
	IF EXISTS (SELECT TOP 1 1 FROM #emp_daynum WHERE KOWTYPE = 25)
	BEGIN
		SELECT S.EmployeeCode, S.WorkDate, LC.KowCode, S.DayNum , S.gSGMC, S.IsKowOT, S.Vacation, LC.KowType,
				row_number()OVER (PARTITION BY S.EmployeeCode, S.WorkDate ORDER BY LC.Ordinal DESC, LC.KowCode) as RowIndex, S.IsPay
		into #KowOT25
		FROM #emp_daynum S inner JOIN LsKows L ON L.KowCode = S.KowCode
		inner join (select KowCode, KowType, BasicSalRate, Ordinal from LsKows WITH(NOLOCK)
						WHERE KowType = 5) LC on LC.BasicSalRate = L.BasicSalRate
		WHERE S.KOWTYPE = 25

		update S SET S.DayNum = S.DayNum + K.DayNum from #emp_OTdaynum S 
		inner join (select * from #KowOT25 where RowIndex = 1) K on K.EmployeeCode = S.EmployeeCode and K.WorkDate = S.WorkDate and K.KowCode = S.KowCode
--select K.EmployeeCode, K.WorkDate, K.KowCode, K.DayNum, K.gSGMC, 0, 1, K.Vacation, K.KowType
--from #KowOT25 K left JOIN #emp_OTdaynum S ON K.EmployeeCode = S.EmployeeCode and K.WorkDate = S.WorkDate and K.KowCode = S.KowCode
--where K.RowIndex = 1 and S.EmployeeCode is NULL
		insert INTO #emp_OTdaynum(EmployeeCode, WorkDate, KowCode, DayNum, gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
		select K.EmployeeCode, K.WorkDate, K.KowCode, K.DayNum, K.gSGMC, 0, 1, K.Vacation, K.KowType, K.IsPay
		from #KowOT25 K left JOIN #emp_OTdaynum S ON K.EmployeeCode = S.EmployeeCode and K.WorkDate = S.WorkDate and K.KowCode = S.KowCode
		where K.RowIndex = 1 and S.EmployeeCode is NULL
--select * from #emp_OTdaynum
		DELETE S FROM #emp_daynum S INNER JOIN #KowOT25 K ON K.EmployeeCode = S.EmployeeCode AND K.WorkDate = S.WorkDate WHERE S.KowType=25
	END
--select * from #emp_daynum	
--select * from #emp_OTdaynum
	--XET LAM TRON OT THEO BLOCK
--select * from #emp_OTdaynum
--SELECT @TSIsCalOTChange,@TSCalOT
	IF exists (select top 1 1 from #emp_OTdaynum where IsKowOT = 1)
	BEGIN
		IF @TSIsCalOTChange = 0
		BEGIN
			IF @TSCalOT = 1 --1. Tính chính xác theo thời gian làm thực tế
			BEGIN
				Insert into #emp_daynum(EmployeeCode, WorkDate, KowCode, DayNum, gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
				select EmployeeCode, WorkDate, KowCode, DayNum , gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay
				from #emp_OTdaynum
			END
			IF @TSCalOT = 2 --2. Tính chính xác theo thời gian làm thực tế nhưng số phút tối thiểu như sau
			BEGIN
				Insert into #emp_daynum(EmployeeCode, WorkDate, KowCode, DayNum, gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
				SELECT S.EmployeeCode, S.WorkDate, S.KowCode, S.DayNum, S.gSGMC, S.MiDTVS, S.IsKowOT, S.Vacation, S.KowType, S.IsPay
				from #emp_OTdaynum S 
				where  S.DayNum >= @TSOTMinShift
			END
			IF @TSCalOT = 3 --3. Tính theo từng block
			BEGIN
				INSERT INTO #emp_daynum(EmployeeCode, WorkDate, KowCode, DayNum, gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
				SELECT S.EmployeeCode, S.WorkDate, S.KowCode, ISNULL(C.MinCal, S.DayNum), S.gSGMC, S.MiDTVS, S.IsKowOT, S.Vacation, S.KowType, S.IsPay
				FROM #emp_OTdaynum S 
				LEFT JOIN #sysConfigTSEmpOT_OT C ON S.DayNum >= C.MinFrom AND S.DayNum < C.MinTo AND C.EmployeeCode = S.EmployeeCode
				WHERE C.MinCal IS NULL OR (C.MinCal IS NOT NULL AND C.MinCal > 0)
			END
			--IF @TSCalOT = 4 --4. Chỉ tính khi nhân viên làm đủ thời gian đăng ký trở lên
			--BEGIN
			
			--END
		END
		ELSE
		BEGIN
			--Có chính sách xét riêng OT cho các chi nhánh, nhóm lương,...
			SELECT   S.EmployeeCode, S.TSCalOT, S.TSMinShift, S.MinFrom, S.MinTo, S.MinCal
			into #sysConfigTSEmpOT
			FROM   sysConfigTSEmpOT S inner join #Emp E on E.EmployeeCode = S.EmployeeCode

			select K.EmployeeCode, isnull(S.TSCalOT,1) as TSCalOT, isnull(S.TSMinShift,0) as TSMinShift into #SetUpOTEmp from 
				(select EmployeeCode from #emp_OTdaynum group BY EmployeeCode) K 
			left JOIN (
				select EmployeeCode, max(TSCalOT) as TSCalOT, max(TSMinShift) as TSMinShift 
				from #sysConfigTSEmpOT group BY EmployeeCode
			) S ON K.EmployeeCode = S.EmployeeCode

			--1. Tính chính xác theo thời gian làm thực tế
			IF exists (SELECT top 1 1 from #SetUpOTEmp where TSCalOT = 1)
			BEGIN
				Insert into #emp_daynum(EmployeeCode, WorkDate, KowCode, DayNum, gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
				select K.EmployeeCode, K.WorkDate, K.KowCode, K.DayNum , K.gSGMC, K.MiDTVS, K.IsKowOT, K.Vacation, K.KowType, K.IsPay
				from #emp_OTdaynum K inner join #SetUpOTEmp S on S.EmployeeCode = K.EmployeeCode
				where S.TSCalOT = 1
			END
			--2. Tính chính xác theo thời gian làm thực tế nhưng số phút tối thiểu như sau
			IF exists (SELECT top 1 1 from #SetUpOTEmp where TSCalOT = 2)
			BEGIN
				Insert into #emp_daynum(EmployeeCode, WorkDate, KowCode, DayNum, gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
				select K.EmployeeCode, K.WorkDate, K.KowCode, K.DayNum , K.gSGMC, K.MiDTVS, K.IsKowOT, K.Vacation, K.KowType, K.IsPay
				from #emp_OTdaynum K inner join #SetUpOTEmp S on S.EmployeeCode = K.EmployeeCode
				where S.TSCalOT = 2 and K.DayNum >= S.TSMinShift
			END
			--3. Tính theo từng block
			IF EXISTS (SELECT TOP 1 1 FROM #SetUpOTEmp WHERE TSCalOT = 3)
			BEGIN
				INSERT INTO #emp_daynum(EmployeeCode, WorkDate, KowCode, DayNum, gSGMC, MiDTVS, IsKowOT, Vacation, KowType, IsPay)
				SELECT K.EmployeeCode, K.WorkDate, K.KowCode, ISNULL(P.MinCal ,K.DayNum), K.gSGMC, K.MiDTVS, K.IsKowOT, K.Vacation, K.KowType, K.IsPay
				FROM #emp_OTdaynum K INNER JOIN #SetUpOTEmp S ON S.EmployeeCode = K.EmployeeCode
				LEFT JOIN #sysConfigTSEmpOT P ON P.EmployeeCode = S.EmployeeCode AND K.DayNum >= P.MinFrom AND K.DayNum < P.MinTo
				WHERE S.TSCalOT = 3 AND (P.MinCal IS NULL OR (P.MinCal IS NOT NULL AND P.MinCal > 0))
			END
		END
	END
--select 'ffff',* from #emp_daynum

--select 'fff',* from #emp_OTdaynum
	--************************END TINH OT LÀM NGOÀI GIỜ ****************************************************************************************
	--SELECT @gSSLNC AS '@gSSLNC'
	--CHUYỂN CÔNG OT KHI ĐI LÀM VÀO NGÀY NGHỈ, NGÀY LỄ.
--SELECT 'chuyen OT nghi/le',* FROM #emp_daynum --WHERE VACATION > 1
--SELECT * FROM #emp_daynum
	IF EXISTS (SELECT TOP 1 1 FROM #emp_daynum WHERE VACATION > 1) 
													AND @KOW2LastPayroll <> '1'--chuyen sang lastpayroll bo qua ko xu ly OT khi tinh cong
	BEGIN
--select * from #emp_daynum
		--@TSIsNightByHour = isnull(TSIsNightByHour,0), @TSIsOTByHour = isnull(TSIsOTByHour,0)
		IF  ISNULL(@IsApplyBlockOTWithHoliday,0) = 0
		BEGIN
		
			SELECT S.EMPLOYEECODE, S.WorkDate, S.KowCode, MAX(S.RootKow) AS RootKow, sum(S.DayNum) AS DayNum, 
						 max(S.IsPay) AS IsPay, wd.IsLastPayroll
			INTO #KowDsTmp_off_1
			from
			(
				select S.EMPLOYEECODE, S.WorkDate, S.KowCode, S.RootKow,
					Round(CASE WHEN L.KowType = 3 AND @TSIsNightByHour = 1 THEN S.DayNum/60.00
						 WHEN (L.KowType = 5 or L.KowType = 25) AND @TSIsOTByHour = 1 THEN S.DayNum/60.00
						 ELSE  S.DayNum/(S.gSGMC * 60.00) END, @gSSLNC) as DayNum, 
						 ISNULL(S.IsPay,0) as IsPay
				from
				(
					SELECT S.EMPLOYEECODE, S.WorkDate, isnull(C.CKowCode, S.KowCode) as KowCode, S.DayNum, S.KowType, S.gSGMC, S.KowCode as RootKow, S.IsPay
					FROM #emp_daynum S left JOIN #sysConfigTSEmpDayOff C on C.KowCode = S.KowCode and C.IsHoliday = 0
					WHERE S.VACATION = 2
					union ALL
					SELECT S.EMPLOYEECODE, S.WorkDate, isnull(C.CKowCode, S.KowCode) as KowCode, S.DayNum, S.KowType, S.gSGMC, S.KowCode as RootKow, S.IsPay
					FROM #emp_daynum S left JOIN #sysConfigTSEmpDayOff C on C.KowCode = S.KowCode and C.IsHoliday = 1
					WHERE S.VACATION = 3
				) S inner JOIN dbo.LsKows L on L.KowCode = S.KowCode
				inner JOIN #lstOfPayRoll P ON S.WorkDate between P.BegDate and P.EndDate
			) S INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate
			WHERE DayNum > 0
			group by S.EMPLOYEECODE, S.WorkDate, S.KowCode, wd.IsLastPayroll
			
			insert INTO EmpKowDays(EmployeeCode, WorkDay, KowCode, DayNum, IsPay, CreatedBy)
			SELECT S.EMPLOYEECODE, S.WorkDate, S.KowCode, S.DayNum, 
						S.IsPay, @UserID
			FROM #KowDsTmp_off_1 S
			WHERE ISNULL(S.IsLastPayroll,0) = 0
			--SELECT * FROM dbo.EmpKowDays
			INSERT INTO EmpKowDsLastPayroll(EMPLOYEECODE, WorkDate, KowCode, DayNum, IsNoon, IsPay, CreatedBy)
			SELECT S.EMPLOYEECODE, S.WorkDate, S.KowCode, ISNULL(S.DayNum,0) - ISNULL(K.DayNum,0), 0, S.IsPay, @UserID
			FROM #KowDsTmp_off_1 S
			LEFT JOIN dbo.EmpKowDays K WITH(NOLOCK) ON k.EmployeeCode = S.EmployeeCode AND K.WorkDay = S.WorkDate AND K.KowCode = S.KowCode
			WHERE ISNULL(S.IsLastPayroll,0) = 1 AND ISNULL(S.DayNum,0) - ISNULL(K.DayNum,0) <> 0
		END
		ELSE
		BEGIN

			SELECT S.EMPLOYEECODE, S.WorkDate, S.KowCode, S.KowType, S.gSGMC,
				MAX(S.RootKow) AS RootKow, sum(S.DayNum) AS DayNum, S.DowCode, max(S.IsPay) AS IsPay, Wd.IsLastPayroll
			INTO #lstOfKowOTHoliday
			from
			(
				select S.EMPLOYEECODE, S.WorkDate, S.KowCode, S.RootKow, S.DayNum,P.DowCode, 
						ISNULL(S.IsPay,0) as IsPay, L.KowType, S.gSGMC
				from
				(
					SELECT S.EMPLOYEECODE, S.WorkDate, isnull(C.CKowCode, S.KowCode) as KowCode, S.DayNum, S.KowType, S.gSGMC, S.KowCode as RootKow, S.IsPay
					FROM #emp_daynum S left JOIN #sysConfigTSEmpDayOff C on C.KowCode = S.KowCode and C.IsHoliday = 0
					WHERE S.VACATION = 2
					union ALL
					SELECT S.EMPLOYEECODE, S.WorkDate, isnull(C.CKowCode, S.KowCode) as KowCode, S.DayNum, S.KowType, S.gSGMC, S.KowCode as RootKow, S.IsPay
					FROM #emp_daynum S left JOIN #sysConfigTSEmpDayOff C on C.KowCode = S.KowCode and C.IsHoliday = 1
					WHERE S.VACATION = 3
				) S inner JOIN dbo.LsKows L on L.KowCode = S.KowCode
				inner JOIN #lstOfPayRoll P ON S.WorkDate between P.BegDate and P.EndDate
			) S  INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate 
			WHERE DayNum > 0
			group by S.EMPLOYEECODE, S.WorkDate, S.KowCode, S.DowCode, S.KowType, S.gSGMC, Wd.IsLastPayroll

			insert INTO EmpKowDays(EmployeeCode, WorkDay, KowCode, DayNum, IsPay, CreatedBy)
			SELECT S.EmployeeCode, S.WorkDate, S.KowCode,
						Round(CASE WHEN S.KowType = 3 AND @TSIsNightByHour = 1 THEN ISNULL(C.MinCal, S.DayNum)/60.00
						 WHEN (S.KowType = 5 or S.KowType = 25) AND @TSIsOTByHour = 1 THEN ISNULL(C.MinCal, S.DayNum)/60.00
						 ELSE ISNULL(C.MinCal, S.DayNum)/(S.gSGMC * 60.00) END, @gSSLNC) as DayNum, S.IsPay, @UserID
			
			FROM #lstOfKowOTHoliday S 
			LEFT JOIN #sysConfigTSEmpOT_OT C ON S.DayNum >= C.MinFrom AND S.DayNum < C.MinTo AND C.EmployeeCode = S.EmployeeCode
			WHERE (C.MinCal IS NULL OR (C.MinCal IS NOT NULL AND C.MinCal > 0)) AND ISNULL(S.IsLastPayroll,0) = 0

			INSERT INTO EmpKowDsLastPayroll(EMPLOYEECODE, WorkDate, KowCode, DayNum, DowCode, IsNoon, IsPay, CreatedBy)
			SELECT S.EmployeeCode, S.WorkDate, S.KowCode,S.DayNum-ISNULL(K.DayNum,0), S.DowCode, 0, S.IsPay, @UserID
			FROM (
				SELECT S.EmployeeCode, S.WorkDate, S.KowCode,
							ROUND(CASE WHEN S.KowType = 3 AND @TSIsNightByHour = 1 THEN ISNULL(C.MinCal, S.DayNum)/60.00
							 WHEN (S.KowType = 5 OR S.KowType = 25) AND @TSIsOTByHour = 1 THEN ISNULL(C.MinCal, S.DayNum)/60.00
							 ELSE ISNULL(C.MinCal, S.DayNum)/(S.gSGMC * 60.00) END, @gSSLNC) AS DayNum, S.DowCode, S.IsPay
			
				FROM #lstOfKowOTHoliday S 
				LEFT JOIN #sysConfigTSEmpOT_OT C ON S.DayNum >= C.MinFrom AND S.DayNum < C.MinTo AND C.EmployeeCode = S.EmployeeCode
				WHERE (C.MinCal IS NULL OR (C.MinCal IS NOT NULL AND C.MinCal > 0)) AND ISNULL(S.IsLastPayroll,0) = 1
			) S LEFT JOIN dbo.EmpKowDays K WITH(NOLOCK) ON K.KowCode = S.KowCode AND K.WorkDay = S.WorkDate AND K.EmployeeCode = S.EmployeeCode
			WHERE S.DayNum <> ISNULL(K.DayNum,0)
		END

		--SELECT @TSIsHolidayKow
		--Có thêm 1 ngày công @TSHolidayKowCode sau khi quy đổi công cho ngày lễ
		IF @TSIsHolidayKow = 1 AND @TSHolidayKowCode <> ''
		BEGIN
			IF EXISTS (SELECT TOP 1 1 FROM LsKows WHERE KowCode = @TSHolidayKowCode)
			BEGIN
				declare @OrdinalForKowds int, @KowType INT SET @OrdinalForKowds = 0
				SELECT  @KowType = KowType from dbo.LsKows --@OrdinalForKowds = OrdinalForKowDs,
				WHERE KowCode = @TSHolidayKowCode

				delete K from EmpKowDays K inner JOIN #emp_daynum S ON S.EmployeeCode = K.EmployeeCode and S.WorkDate = K.WorkDay
				where K.KowCode = @TSHolidayKowCode AND ISNULL(S.IsLastPayroll,0) = 0

				delete K from EmpKowDsLastPayroll K inner JOIN #emp_daynum S ON S.EmployeeCode = K.EmployeeCode and S.WorkDate = K.WorkDate
				where K.KowCode = @TSHolidayKowCode AND ISNULL(S.IsLastPayroll,0) = 1

				--@TSIsNightByHour: = true: Cong ca dem tinh theo gio
				INSERT INTO EmpKowDays(EmployeeCode, WorkDay, KowCode, DayNum, IsPay, CreatedBy)
				SELECT S.EmployeeCode, S.WorkDate, @TSHolidayKowCode, ISNULL(@OrdinalForKowds,0), 0, @UserID
				FROM
				(
					SELECT S.EmployeeCode, S.WorkDate, 
							ROUND(CASE WHEN @TSIsNightByHour = 1 AND @KowType = 3 THEN ISNULL(MAX(S.ToTalHoursNormalInDay),0)/60.00
								WHEN S.gSGMC <> 1 THEN 1 ELSE ISNULL(MAX(S.ToTalHoursNormalInDay),0)/60.00 END, @gSSLNC) AS DayNum, 
								P.DowCode
					FROM #emp_daynum S 
					INNER JOIN #lstOfPayRoll P ON  S.WorkDate BETWEEN P.BegDate AND P.EndDate
					WHERE vacation = 3 AND KowType IN (1,3)
					GROUP BY S.EmployeeCode, S.WorkDate, S.gSGMC, P.DowCode
				) S INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate
				WHERE S.DayNum > 0 AND ISNULL(Wd.IsLastPayroll,0) = 0
				GROUP BY S.EmployeeCode, S.WorkDate, S.DowCode

				INSERT INTO EmpKowDsLastPayroll(EMPLOYEECODE, WorkDate, KowCode, DayNum, IsPay, CreatedBy)
				SELECT S.EmployeeCode, S.WorkDate, @TSHolidayKowCode, 
							SUM(S.DayNum) - MAX(ISNULL(K.DayNum,0)), 0, @UserID
				FROM
				(
					SELECT S.EmployeeCode, S.WorkDate, 
							ROUND(CASE WHEN @TSIsNightByHour = 1 AND @KowType = 3 THEN ISNULL(MAX(S.ToTalHoursNormalInDay),0)/60.00
								WHEN S.gSGMC <> 1 THEN 1 ELSE ISNULL(MAX(S.ToTalHoursNormalInDay),0)/60.00 END, @gSSLNC) AS DayNum, 
								P.DowCode
					FROM #emp_daynum S 
					INNER JOIN #lstOfPayRoll P ON S.WorkDate BETWEEN P.BegDate AND P.EndDate
					WHERE vacation = 3 AND KowType IN (1,3)
					GROUP BY S.EmployeeCode, S.WorkDate, S.gSGMC, P.DowCode
				) S INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate
				LEFT JOIN dbo.EmpKowDays K WITH(NOLOCK) ON K.EmployeeCode = S.EmployeeCode AND K.WorkDay = S.WorkDate AND K.KowCode = @TSHolidayKowCode
				WHERE S.DayNum > 0 AND ISNULL(Wd.IsLastPayroll,0) = 1
				GROUP BY S.EmployeeCode, S.WorkDate, S.DowCode
				HAVING SUM(S.DayNum) - MAX(ISNULL(K.DayNum,0)) <> 0
			END
		END
	END

	--Insert các công còn lại(khác các công OT ngày nghỉ, lễ đã chuyển phía trên).
	--DayNum_RealDay: Tổng công đi làm thực tế trong ngày(công ngày và ca đêm đều chung 1 kiểu tính hoặc giờ hết hoặc công hết) để làm tròn lại đi trễ về sớm so với tổng công trong ngaỳ
	select S.EMPLOYEECODE, S.WorkDate, S.KowCode, CASE WHEN MIN(S.KowType) = -1 THEN sum(S.DayNum) ELSE --cong lam bu da dc quy doi
			Round(CASE WHEN L.KowType = 3 AND @TSIsNightByHour = 1 THEN sum(S.DayNum)/60.00
				 WHEN (L.KowType = 5 or L.KowType = 25) AND @TSIsOTByHour = 1 THEN sum(S.DayNum)/60.00
				 ELSE  sum(S.DayNum)/(max(isnull(S.gSGMC,0)) * 60.00) END, @gSSLNC) END as DayNum, 
				 P.DowCode, L.KowType,0 AS OrdinalForKowDs, round(sum(S.DayNum)/(max(isnull(S.gSGMC,0)) * 60.00), @gSSLNC) as DayNum_RealDay,
				 round(max(isnull(S.TotalHoursNormalInDay,0))/(60.00*max(isnull(S.gSGMC,0))), @gSSLNC) as TotalDayNumInDay, max(S.gSGMC) as gSGMC,
				 MAX(ISNULL(S.IsPay,0)) AS IsPay, sum(S.DayNum) AS DayNumHour, SUM(ISNULL(S.SoPhutLamViecThucTe,0)) AS SoPhutLamViecThucTe
	into #emp_daynum_kowds
	from #emp_daynum S 
	inner JOIN dbo.LsKows L on L.KowCode = S.KowCode
	inner JOIN #lstOfPayRoll P ON S.WorkDate between P.BegDate and P.EndDate
	where S.VACATION < 2
	group by S.EMPLOYEECODE, S.WorkDate, S.KowCode, L.KowType, P.DowCode
--SELECT * FROM #lstOfPayRoll
--SELECT * FROM #emp_daynum
--SELECT * FROM #emp_daynum_kowds
--SELECT * FROM #emp_days_d
--SELECT @TSIsHolidayKow
--SELECT @TSHolidayKowCode
	IF @TSIsHolidayKow = 1--Có thêm 1 ngày công @TSHolidayKowCode sau khi quy đổi công cho ngày lễ
	BEGIN
		delete K from EmpKowDays K 
		inner join #emp_daynum_kowds T ON K.EmployeeCode = T.EmployeeCode and K.WorkDay = T.WorkDate and K.KowCode = T.KowCode
		LEFT JOIN #emp_days_d S ON S.EmployeeCode = K.EmployeeCode AND S.WorkDate = K.WorkDay
		where K.WorkDay between @BegDate and @EndDate and K.KowCode = @TSHolidayKowCode AND ISNULL(S.IsLastPayroll,0) = 0

		DELETE K FROM EmpKowDsLastPayroll K 
		INNER JOIN #emp_daynum_kowds T ON K.EmployeeCode = T.EmployeeCode AND K.WorkDate = T.WorkDate AND K.KowCode = T.KowCode
		LEFT JOIN #emp_days_d S ON S.EmployeeCode = K.EmployeeCode AND S.WorkDate = K.WorkDate
		WHERE K.WorkDate BETWEEN @BegDate AND @EndDate AND K.KowCode = @TSHolidayKowCode AND ISNULL(S.IsLastPayroll,0) = 1
	END
	--SELECT * FROM dbo.EmpKowDays
	--SELECT * FROM dbo.EmpKowDays WHERE EmployeeCode = '__NV001__' AND WorkDate = '2020/11/03'
	--Insert số phút đi trễ về sớm
	--Những ngày có xin phép thì trừ lại Đi trễ-về sớm.
	SELECT  S.EmployeeCode, S.WorkDate, SUM(S.DateNum) AS DateNum, S.LeavePeriod INTO #tblEmpDayOff
	FROM
	(
		SELECT F.EmployeeCode, F.WorkDate, F.DayNum * 8 * 60 as DateNum, F.LeavePeriod 
		FROM EmployeeDayOffs_detailDay F WITH(NOLOCK) INNER JOIN #Emp E ON E.EmployeeCode = F.EmployeeCode
		WHERE F.WorkDate BETWEEN @BegDate and @EndDate
	) S GROUP BY S.EmployeeCode, S.WorkDate, S.LeavePeriod

	--xoa cho truong hop nghi nguyen ngay hoac nghi 1 buoi va buoi con lai ko co DTVS
	--SELECT * FROM #emp_ditre_vesom

	DELETE S FROM #emp_ditre_vesom S INNER JOIN #tblEmpDayOff F ON F.EmployeeCode = S.EmployeeCode AND F.WorkDate = S.WorkDate
	WHERE F.LeavePeriod = 1 OR (F.LeavePeriod = 2 AND S.DiTre <= F.DateNum AND S.VeSom = 0) 
			OR (F.LeavePeriod = 3 AND S.DiTre = 0 AND S.VeSom <= F.DateNum)
			OR (F.LeavePeriod = 4 AND S.DiTre + S.VeSom <= F.DateNum)

	--SELECT 'TSIsLateEarlyAllowShift',@TSIsLateEarlyAllowShift
	--update Di tre
	UPDATE S SET S.DiTre = CASE WHEN S.DiTre <= F.DateNum THEN 0 ELSE S.DiTre - F.DateNum END 
	FROM #emp_ditre_vesom S 
	INNER JOIN #tblEmpDayOff F ON F.EmployeeCode = S.EmployeeCode AND F.WorkDate = S.WorkDate
	WHERE S.DiTre > 0 AND F.LeavePeriod = 2
	--update ve som
	UPDATE S SET S.VeSom = CASE WHEN S.VeSom <= F.DateNum THEN 0 ELSE S.VeSom - F.DateNum END 
	FROM #emp_ditre_vesom S 
	INNER JOIN #tblEmpDayOff F ON F.EmployeeCode = S.EmployeeCode AND F.WorkDate = S.WorkDate
	WHERE S.VeSom > 0 AND F.LeavePeriod = 3

	--SELECT * FROM #emp_daynum_kowds
	if exists (select 1 from #EmpDayOff)
    begin
        declare @DayNumLeave float, @DayNumKow float, @kCode nvarchar(20)
        declare curtgTS001 cursor for
                select S.EmployeeCode,S.WorkDate, case when S.gSGMC <> 1 then max(F.SOCONG) else max(F.SOCONG)*8 end as DayNum
                from #emp_daynum_kowds S 
				INNER join (SELECT EmployeeCode,WorkDate,SUM(SOCONG) AS SOCONG FROM #EmpDayOff GROUP BY EmployeeCode,WorkDate) F on F.EmployeeCode = S.EmployeeCode and F.WorkDate = S.WorkDate
                where S.KowType in (1,3) group by S.EmployeeCode,S.WorkDate,S.gSGMC
        open curtgTS001
        fetch next from curtgTS001 into @EmployeeCode,@WDate,@DayNumLeave
        while @@FETCH_STATUS=0
        begin
            declare curtgTS002 cursor for
                select S.KowCode, S.DayNum from #emp_daynum_kowds S
                where S.KowType in (1,3) AND S.EmployeeCode = @EmployeeCode AND S.WorkDate = @WDate
				ORDER by S.DayNum desc
            open curtgTS002
            fetch next from curtgTS002 into @kCode,@DayNumKow
            while @@FETCH_STATUS=0
            begin
                if @DayNumLeave <= 0 goto nextSubLeave
                if @DayNumKow > @DayNumLeave
                begin
					update #emp_daynum_kowds set DayNum = DayNum - @DayNumLeave where EmployeeCode = @EmployeeCode and WorkDate = @WDate and KowCode = @kCode
					set @DayNumLeave = 0
                END
                else
                begin
                    set @DayNumLeave = @DayNumLeave - @DayNumKow
                    delete from #emp_daynum_kowds where EmployeeCode = @EmployeeCode and WorkDate = @WDate and KowCode = @kCode
                END

                nextSubLeave:
                fetch next from curtgTS002 into @kCode,@DayNumKow
            end
            close curtgTS002
            deallocate curtgTS002

            fetch next from curtgTS001 into @EmployeeCode,@WDate,@DayNumLeave
        end
        close curtgTS001
        deallocate curtgTS001
    END


	--SELECT * FROM #emp_daynum
	--SELECT * FROM #emp_daynum_kowds
	--SELECT @KOW2LastPayroll
	insert INTO EmpKowDays(EmployeeCode, WorkDay, KowCode, DayNum, IsPay, CreatedBy)
	select S.EMPLOYEECODE, S.WorkDate, S.KowCode, S.DayNum, ISNULL(S.IsPay,0) as IsPay , @UserID
	from #emp_daynum_kowds S 
	INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate
	where S.DayNum > 0 AND (@KOW2LastPayroll <> '1' OR (@KOW2LastPayroll = '1' AND S.KowType <> 5)) AND ISNULL(wd.IsLastPayroll,0) = 0
	
	insert INTO EmpKowDsLastPayroll(EMPLOYEECODE, WorkDate, KowCode, DayNum, DowCode, Ordinal, IsPay, CreatedBy)
	select S.EMPLOYEECODE, S.WorkDate, S.KowCode, ROUND(S.DayNum - ISNULL(K.DayNum,0),@gSSLNC), S.DowCode, S.OrdinalForKowDs, ISNULL(S.IsPay,0) as IsPay , @UserID
	from #emp_daynum_kowds S 
	INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate
	LEFT JOIN dbo.EmpKowDays K WITH(NOLOCK) ON K.EmployeeCode = S.EmployeeCode AND K.WorkDay = S.WorkDate AND K.KowCode = S.KowCode
	where S.DayNum > 0 AND (@KOW2LastPayroll <> '1' OR (@KOW2LastPayroll = '1' AND S.KowType <> 5)) AND ISNULL(wd.IsLastPayroll,0) = 1
		AND S.DayNum <> ISNULL(K.DayNum,0)

	--update cho truong hop nghi hang ngay theo gio
	UPDATE S SET S.DiTre = CASE WHEN S.DiTre <= F.DateNum THEN 0 ELSE S.DiTre - F.DateNum END,
				S.VeSom = CASE WHEN S.DiTre < F.DateNum THEN 
									CASE WHEN F.DateNum - S.DiTre  >= S.VeSom THEN 0 ELSE S.VeSom - (F.DateNum - S.DiTre) END
								ELSE 
									S.VeSom
								END
	FROM #emp_ditre_vesom S 
	INNER JOIN #tblEmpDayOff F ON F.EmployeeCode = S.EmployeeCode AND F.WorkDate = S.WorkDate
	WHERE F.LeavePeriod = 4

	--SELECT * FROM #emp_days_d
	--tru lai so phut lam bu trong ngay(Thanh buoi)
	--SELECT * FROM #emp_ditre_vesom
	IF EXISTS (SELECT 1 FROM #lstOfSoPhutLamBu)
	BEGIN
		
		INSERT INTO EmpKowLateEarly(EmployeeCode, DowCode, WorkDate, TimeInLate, TimeOutEarly, CreatedOn, CreatedBy, ShiftCode, gSGMC,Vacation, MinMaxAllowLateInMonth)
		SELECT S.EmployeeCode, P.DowCode, S.WorkDate, 
				CASE WHEN ISNULL(S.DiTre,0) > 0 THEN CASE WHEN ISNULL(S.DiTre,0) <= ISNULL(T.SoPhutThucTeDcTinh,0) THEN 0 ELSE ISNULL(S.DiTre,0) - ISNULL(T.SoPhutThucTeDcTinh,0) end ELSE 0 END AS DiTre,
				CASE WHEN ISNULL(S.VeSom,0) > 0 THEN CASE WHEN ISNULL(S.VeSom,0) <= ISNULL(T.SoPhutThucTeDcTinh,0) THEN 0 ELSE ISNULL(S.VeSom,0) - ISNULL(T.SoPhutThucTeDcTinh,0) end ELSE 0 END AS VeSom,
				GETDATE(), @UserID, E.ShiftCode, E.gSGMC, E.Vacation, S.MinMaxAllowLateInMonth
		FROM #emp_ditre_vesom S LEFT JOIN #lsPayrollDow P ON S.WorkDate BETWEEN P.BegDay AND P.EndDay
		LEFT JOIN #emp_days_d E ON E.EmployeeCode = S.EmployeeCode AND E.WorkDate = S.WorkDate
		LEFT JOIN #lstOfSoPhutLamBu T ON T.EmployeeCode = S.EmployeeCode AND T.WorkDate = S.WorkDate
		WHERE (ISNULL(S.DiTre,0) > 0 OR ISNULL(S.VeSom,0) > 0 OR ISNULL(S.MinMaxAllowLateInMonth,0) > 0) AND ISNULL(E.Vacation,0) < 2

		--update bang dang ky lam bu
		UPDATE S SET s.RealHourNum = T.SoPhutThucTeDcTinh FROM dbo.EmpRegisterExtraWorkDay S
		INNER JOIN #lstOfSoPhutLamBu T ON T.EmployeeCode = S.EmployeeCode AND T.WorkDate = S.WorkDate

		IF ISNULL(@KowCodeExtraWorkDay,'') <> ''  AND ISNULL(@IsExtraWordInOneDays,0) = 0
		BEGIN
			--add cong lam bu tuong ung DTVS cho cac ngay vua tinh dc
			SELECT S.EmployeeCode,S.WorkDate, CASE WHEN K.gSGMC <> 1 THEN 1 ELSE K.gSGMC END AS MaxDayNum, K.Vacation,
				ROUND(CASE WHEN K.gSGMC = 1 then K.TimeInLate/60.00 ELSE K.TimeInLate/60.00/K.gSGMC END, @gSSLNC) AS DayNum,
				CASE WHEN K.Vacation = 1 THEN 2.0 ELSE 1.0 END AS CaNuaNgay
			INTO #lstOfKowLamBu
			FROM
			(
				SELECT EmployeeCode,ForDate AS WorkDate,SoPhutThucTeDcTinh AS HourNum
				FROM #lstOfSoPhutLamBu WHERE ISNULL(SoPhutThucTeDcTinh,0) > 0
				UNION
				SELECT R.EmployeeCode,R.ForDate AS WorkDate,R.RealHourNum
				FROM dbo.EmpRegisterExtraWorkDay R WITH(NOLOCK)
				INNER JOIN #Emp E ON E.EmployeeCode = R.EmployeeCode
				LEFT JOIN #lstOfSoPhutLamBu L ON L.EmployeeCode = R.EmployeeCode AND L.WorkDate = R.WorkDate AND l.ForDate =R.ForDate
				WHERE R.ForDate BETWEEN @BegDate AND @EndDate AND ISNULL(R.RealHourNum,0) > 0 AND L.EmployeeCode IS NULL
			) S INNER JOIN dbo.EmpKowLateEarly K WITH(NOLOCK) ON K.EmployeeCode = S.EmployeeCode AND K.WorkDate=S.WorkDate
			WHERE ISNULL(K.TimeInLate,0) > 0

			--Tinh cong tong binh thuowng trong ngay
			SELECT K.EmployeeCode EmployeeCode,K.WorkDay WorkDate, K.KowCode,K.DayNum AS DayNum 
			INTO #EmpKowDays_Normal_detail
			FROM dbo.EmpKowDays K WITH(NOLOCK)
			INNER JOIN #lstOfKowLamBu LB ON LB.EmployeeCode = K.EmployeeCode AND LB.WorkDate = K.WorkDay
			INNER JOIN dbo.LsKows L WITH(NOLOCK) ON L.KowCode = K.KowCode
			WHERE L.KowType IN (1,3)
			UNION ALL
			SELECT K.EmployeeCode,K.WorkDate, K.KowCode,K.DayNum AS DayNum 
			FROM dbo.EmpKowDsLastPayroll K WITH(NOLOCK)
			INNER JOIN #lstOfKowLamBu LB ON LB.EmployeeCode = K.EmployeeCode AND LB.WorkDate = K.WorkDate
			INNER JOIN dbo.LsKows L WITH(NOLOCK) ON L.KowCode = K.KowCode
			WHERE L.KowType IN (1,3)

			SELECT EmployeeCode,WorkDate,SUM(DayNum) AS DayNum INTO #EmpKowDays_Normal FROM #EmpKowDays_Normal_detail GROUP BY EmployeeCode,WorkDate

			--SELECT * FROM #EmpKowDays_Normal
			--SELECT @KowCodeExtraWorkDay
			--DELETE K FROM EmpKowDays K INNER JOIN #lstOfKowLamBu L ON L.EmployeeCode = K.EmployeeCode AND L.WorkDate = K.WorkDate
			--WHERE K.KowCode = @KowCodeExtraWorkDay

			UPDATE K SET K.DayNum = CASE WHEN K.DayNum + ISNULL(L.DayNum,0) >= L.MaxDayNum/CaNuaNgay THEN L.MaxDayNum/CaNuaNgay ELSE K.DayNum + ISNULL(L.DayNum,0) END 
			FROM EmpKowDays K 
			INNER JOIN #lstOfKowLamBu L ON L.EmployeeCode = K.EmployeeCode AND L.WorkDate = K.WorkDay
			WHERE K.KowCode = @KowCodeExtraWorkDay

			UPDATE K SET K.DayNum = CASE WHEN K.DayNum + ISNULL(L.DayNum,0) >= L.MaxDayNum/CaNuaNgay THEN L.MaxDayNum/CaNuaNgay ELSE K.DayNum + ISNULL(L.DayNum,0) END 
			FROM EmpKowDsLastPayroll K 
			INNER JOIN #lstOfKowLamBu L ON L.EmployeeCode = K.EmployeeCode AND L.WorkDate = K.WorkDate
			WHERE K.KowCode = @KowCodeExtraWorkDay

			insert INTO EmpKowDays(EmployeeCode, WorkDay, KowCode, DayNum, IsPay, CreatedBy)
			SELECT S.EmployeeCode, S.WorkDate, @KowCodeExtraWorkDay, S.DayNum, 0, @UserID
			FROM (
				SELECT LB.EmployeeCode, LB.WorkDate, CASE WHEN LB.DayNum + ISNULL(K.DayNum,0) >= LB.MaxDayNum/CaNuaNgay 
												THEN LB.MaxDayNum/CaNuaNgay-ISNULL(K.DayNum,0) ELSE LB.DayNum END AS DayNum
				FROM #lstOfKowLamBu LB
				LEFT JOIN #EmpKowDays_Normal K ON K.EmployeeCode = LB.EmployeeCode AND K.WorkDate = LB.WorkDate
				LEFT JOIN #EmpKowDays_Normal_detail D ON D.EmployeeCode = LB.EmployeeCode AND D.WorkDate = LB.WorkDate AND D.KowCode = @KowCodeExtraWorkDay
				WHERE D.EmployeeCode IS NULL
			) S inner JOIN #lstOfPayRoll P ON S.WorkDate between P.BegDate and P.EndDate
			INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate
			WHERE S.DayNum > 0 AND ISNULL(wd.IsLastPayroll,0) = 0

			insert INTO EmpKowDsLastPayroll(EMPLOYEECODE, WorkDate, KowCode, DayNum, DowCode, Ordinal, IsPay, CreatedBy)
			SELECT S.EmployeeCode, S.WorkDate, @KowCodeExtraWorkDay, S.DayNum, P.DowCode, 0, 0, @UserID
			FROM (
				SELECT LB.EmployeeCode, LB.WorkDate, CASE WHEN LB.DayNum + ISNULL(K.DayNum,0) >= LB.MaxDayNum/CaNuaNgay 
												THEN LB.MaxDayNum/CaNuaNgay-ISNULL(K.DayNum,0) ELSE LB.DayNum END AS DayNum
				FROM #lstOfKowLamBu LB
				LEFT JOIN #EmpKowDays_Normal K ON K.EmployeeCode = LB.EmployeeCode AND K.WorkDate = LB.WorkDate
				LEFT JOIN #EmpKowDays_Normal_detail D ON D.EmployeeCode = LB.EmployeeCode AND D.WorkDate = LB.WorkDate AND D.KowCode = @KowCodeExtraWorkDay
				WHERE D.EmployeeCode IS NULL
			) S inner JOIN #lstOfPayRoll P ON S.WorkDate between P.BegDate and P.EndDate
			INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate
			WHERE S.DayNum > 0 AND ISNULL(wd.IsLastPayroll,0) = 1

			UPDATE K SET K.TimeInLate=0, K.TimeInEarly=K.TimeInLate FROM EmpKowLateEarly K INNER JOIN #lstOfKowLamBu L ON L.EmployeeCode = K.EmployeeCode AND L.WorkDate = K.WorkDate
		END
	END
	ELSE
    BEGIN
		INSERT INTO EmpKowLateEarly(EmployeeCode, DowCode, WorkDate, TimeInLate, TimeOutEarly, CreatedOn, CreatedBy,ShiftCode,gSGMC,Vacation, MinMaxAllowLateInMonth)
		SELECT S.EmployeeCode, P.DowCode, S.WorkDate, S.DiTre, S.VeSom, GETDATE(), @UserID, E.ShiftCode, E.gSGMC,E.Vacation, S.MinMaxAllowLateInMonth
		FROM #emp_ditre_vesom S INNER JOIN #lsPayrollDow P ON S.WorkDate BETWEEN P.BegDay AND P.EndDay
		LEFT JOIN #emp_days_d E ON E.EmployeeCode = S.EmployeeCode AND E.WorkDate = S.WorkDate
		WHERE (ISNULL(S.DiTre,0) > 0 OR ISNULL(S.VeSom,0) > 0  OR ISNULL(S.MinMaxAllowLateInMonth,0) > 0) AND ISNULL(E.Vacation,0) < 2
	END

	--Tự động add công đi trễ về sớm, nếu có khai báo công DTVS.
	IF EXISTS (SELECT TOP 1 1 FROM LsKows WHERE KowType = 6)
	BEGIN
		--select * from #emp_daynum_kowds
		DECLARE @KowLateEarly NVARCHAR(100)
		SELECT TOP(1) @KowLateEarly = KowCode FROM LsKows WHERE KowType = 6 --ORDER BY Ordinal DESC

		SELECT S.EmployeeCode, S.WorkDate, ROUND((ISNULL(S.DiTre,0) + ISNULL(S.VeSom,0))/(60.00*S.gSGMC),@gSSLNC) AS DayNum, P.DowCode
		INTO #DTVS
		FROM #emp_ditre_vesom S 
		INNER JOIN #lstOfPayRoll P ON S.WorkDate BETWEEN P.BegDate AND P.EndDate
		LEFT JOIN #emp_days_d E ON E.EmployeeCode = S.EmployeeCode AND E.WorkDate = S.WorkDate
		WHERE (ISNULL(S.DiTre,0) > 0 OR ISNULL(S.VeSom,0) > 0) AND ISNULL(E.Vacation,0) < 2

		IF EXISTS (SELECT 1 FROM #lstOfSoPhutLamBu)
		BEGIN
			SELECT S.EmployeeCode, S.WorkDate, S.DayNum - ISNULL(LB.DayNum,0) AS DayNum, S.DowCode, wd.IsLastPayroll
			INTO #KowDs_autoLate_1
			FROM
			(
				SELECT S.EmployeeCode, S.WorkDate, 
						ROUND(CASE WHEN ISNULL(S.DayNum,0) + ISNULL(K.DayNum,0) > ISNULL(K.TotalDayNumInDay,1) THEN ISNULL(K.TotalDayNumInDay,1) - ISNULL(K.DayNum,0) 
							 ELSE S.DayNum END, @gSSLNC) AS DayNum, S.DowCode
				FROM #DTVS S
				LEFT JOIN
				(
					SELECT EmployeeCode, WorkDate, SUM(DayNum_RealDay) AS DayNum, ISNULL(MAX(TotalDayNumInDay),1) AS TotalDayNumInDay
					FROM #emp_daynum_kowds 
					WHERE KowType IN (1,3) GROUP BY EmployeeCode, WorkDate
				) K ON S.EmployeeCode = K.EmployeeCode AND S.WorkDate = K.WorkDate
			) S LEFT JOIN EmpKowLateEarly L WITH(NOLOCK) ON L.EmployeeCode = S.EmployeeCode AND L.WorkDate = S.WorkDate
			LEFT JOIN #emp_daynum_kowds LB ON LB.EmployeeCode = S.EmployeeCode AND LB.WorkDate = S.WorkDate AND LB.KowCode = @KowCodeExtraWorkDay
			INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate
			WHERE S.DayNum > 0 AND ISNULL(L.TimeInLate,0) + ISNULL(L.TimeOutEarly,0) > 0 AND S.DayNum - ISNULL(LB.DayNum,0) > 0

			INSERT INTO EmpKowDays(EmployeeCode, WorkDay, KowCode,  DayNum,  IsPay, CreatedBy)
			SELECT S.EmployeeCode, S.WorkDate,  @KowLateEarly,S.DayNum, 0, @UserID
			FROM #KowDs_autoLate_1 S
			WHERE ISNULL(S.IsLastPayroll,0) = 0

			INSERT INTO EmpKowDsLastPayroll(EMPLOYEECODE, WorkDate, KowCode, DayNum, DowCode, Ordinal, IsPay, CreatedBy)
			SELECT S.EmployeeCode, S.WorkDate,  @KowLateEarly,S.DayNum - ISNULL(K.DayNum,0), S.DowCode, 0, 0, @UserID
			FROM #KowDs_autoLate_1 S
			LEFT JOIN dbo.EmpKowDays K WITH(NOLOCK) ON K.EmployeeCode = S.EmployeeCode AND K.WorkDay = S.WorkDate AND K.KowCode = @KowLateEarly
			WHERE ISNULL(S.IsLastPayroll,0) = 1 AND S.DayNum - ISNULL(K.DayNum,0) <> 0
		END
		ELSE
		BEGIN
			SELECT S.EmployeeCode, S.WorkDate,  S.DayNum, S.DowCode, Wd.IsLastPayroll
			INTO #KowDs_autoLate_2
			FROM
			(
				SELECT S.EmployeeCode, S.WorkDate, 
						ROUND(CASE WHEN ISNULL(S.DayNum,0) + ISNULL(K.DayNum,0) > ISNULL(K.TotalDayNumInDay,1) THEN ISNULL(K.TotalDayNumInDay,1) - ISNULL(K.DayNum,0) 
							 ELSE S.DayNum END, @gSSLNC) AS DayNum, S.DowCode
				FROM #DTVS S
				LEFT JOIN
				(
					SELECT EmployeeCode, WorkDate, SUM(DayNum_RealDay) AS DayNum, ISNULL(MAX(TotalDayNumInDay),1) AS TotalDayNumInDay
					FROM #emp_daynum_kowds 
					WHERE KowType IN (1,3) GROUP BY EmployeeCode, WorkDate
				) K ON S.EmployeeCode = K.EmployeeCode AND S.WorkDate = K.WorkDate
			) S LEFT JOIN EmpKowLateEarly L WITH(NOLOCK) ON L.EmployeeCode = S.EmployeeCode AND L.WorkDate = S.WorkDate
			INNER JOIN #emp_days_d Wd ON Wd.EmployeeCode = S.EmployeeCode AND Wd.WorkDate = S.WorkDate
			WHERE S.DayNum > 0 AND ISNULL(L.TimeInLate,0) + ISNULL(L.TimeOutEarly,0) > 0

			INSERT INTO EmpKowDays(EmployeeCode, WorkDay, KowCode, DayNum, IsPay, CreatedBy)
			SELECT S.EmployeeCode, S.WorkDate,  @KowLateEarly,S.DayNum, 0, @UserID
			FROM #KowDs_autoLate_2 S
			WHERE ISNULL(S.IsLastPayroll,0) = 0

			INSERT INTO EmpKowDsLastPayroll(EMPLOYEECODE, WorkDate, KowCode, DayNum, DowCode, Ordinal, IsPay, CreatedBy)
			SELECT S.EmployeeCode, S.WorkDate,  @KowLateEarly,S.DayNum-ISNULL(K.DayNum,0), S.DowCode, 0, 0, @UserID
			FROM #KowDs_autoLate_2 S
			LEFT JOIN dbo.EmpKowDays K WITH(NOLOCK) ON K.EmployeeCode = S.EmployeeCode AND K.WorkDay = S.WorkDate AND K.KowCode = @KowLateEarly
			WHERE ISNULL(S.IsLastPayroll,0) = 1 AND S.DayNum-ISNULL(K.DayNum,0) <> 0
		END
	END
END
GO
/****** Object:  StoredProcedure [dbo].[spMAllowanceType_GetList]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spMAllowanceType_GetList]
AS
BEGIN

	SELECT * From MAllowanceTypes where ISNULL(IsDeleted, 0) = 0
END
GO
/****** Object:  StoredProcedure [dbo].[spMAllowanceTypes_GetList]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spMAllowanceTypes_GetList]
@allowanceId uniqueidentifier
AS
BEGIN

	SELECT * FROM MAllowanceTypeLevels Where MAllowanceTypeId = @allowanceId
END
GO
/****** Object:  StoredProcedure [dbo].[spRegistValuelist]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spRegistValuelist]
(
	@ListName NVARCHAR(50),
	@DefaultValuesVN NVARCHAR(max),
	@DefaultValuesEN NVARCHAR(max),
	@Note NVARCHAR(50),
	@MultiSelect bit
)
AS
BEGIN
	IF NOT EXISTS (SELECT 1 FROM dbo.SysValueList WHERE ListName = @ListName)
	BEGIN
		INSERT INTO SysValueList(Language, ListName, DefaultValues, CustomValues, MultiSelect, CreatedOn, CreatedBy)
		SELECT  'VN', @ListName, @DefaultValuesVN, @DefaultValuesVN, @MultiSelect, GETDATE(), 'application'
		UNION ALL
		SELECT  'EN', @ListName, @DefaultValuesEN, @DefaultValuesEN, @MultiSelect, GETDATE(), 'application'
	END
	ELSE
    BEGIN
		PRINT @ListName + N' is exists'
	END
END
GO
/****** Object:  StoredProcedure [dbo].[spSanCong]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spSanCong]
(
	@strEmp NVARCHAR(max),
	@DowCode NVARCHAR(7),
	@Option INT,--0: san cong, 1: tra lai cong san
	@Err NVARCHAR(max) OUT
)
AS
BEGIN
	SET @Err = ''
	DECLARE @ErrorMessage NVARCHAR(4000);
	DECLARE @ErrorSeverity INT;
	DECLARE @ErrorState INT;
	--tap danh sach nhan vien
	DECLARE @BegDate DATETIME,@EndDate DATETIME
	SELECT @BegDate = BegDate, @EndDate = EndDate 
	FROM dbo.LsDowLists WITH(NOLOCK)
	WHERE DowCode = @DowCode

	--SET @BegDate = '2021/05/03'
	--SET @EndDate = '2021/05/03'


	--SELECT @BegDate,@EndDate
	--
	--SELECT * FROM sysConfigTS
	--ALTER TABLE sysConfigTS ADD MaxOtOfDay_BT FLOAT
	--ALTER TABLE sysConfigTS ADD MaxOtOfDay_Nghi FLOAT
	--ALTER TABLE sysConfigTS ADD MaxOtOfDay_Le FLOAT
	--ALTER TABLE sysConfigTS ADD MaxOtOfWeek FLOAT
	--ALTER TABLE sysConfigTS ADD MaxOtOfMonth FLOAT

	DECLARE @DayBT FLOAT, @DayLe FLOAT,@DayNghi FLOAT,@Week FLOAT, @Month FLOAT
	SET @DayBT = 4
	SET @DayNghi = 12
	SET @DayLe = 12
	SET @Week = 0
	SET @Month = 40
	SELECT TOP(1) @DayBT = MaxOtOfDay_BT,@DayNghi=MaxOtOfDay_Nghi,@DayLe=MaxOtOfDay_Le,@Week=MaxOtOfWeek,@Month=MaxOtOfMonth 
	FROM sysConfigTS WITH(NOLOCK)
	--SELECT @DayBT

	SELECT data AS EmployeeCode, L.LeaveType AS WLeaveDayValue
	INTO #lstOfEmp 
	FROM dbo.fnSplitString(@strEmp,',') S
	INNER JOIN dbo.Employees E WITH(NOLOCK) ON E.EmployeeCode = S.data
	left JOIN dbo.lsLeaveGroups L WITH(NOLOCK) on L.LeaveGroupCode = E.LeaveGroupCode
	option (maxrecursion 0)

	IF @Option = 0
	BEGIN
		SELECT K.EmployeeCode INTO #DaSanCong FROM EmpKowDays_Layer K
		INNER JOIN #lstOfEmp E ON E.EmployeeCode = K.EmployeeCode
		WHERE WorkDay BETWEEN @BegDate AND @EndDate
		GROUP BY K.EmployeeCode

		DELETE E FROM #lstOfEmp E INNER JOIN #DaSanCong K ON K.EmployeeCode = E.EmployeeCode

		SET DATEFIRST 1--xet ngay dau tuan la ngay T2
		SELECT K.Id,K.EmployeeCode,K.WorkDay,K.KowCode,L.KowType, K.DayNum,k.IsPay, K.IsDeleted, K.CreatedBy,
				CASE WHEN Vs.VacationDay IS NOT NULL THEN 3
				WHEN (((E.WLeaveDayValue = 3 or E.WLeaveDayValue = 5) and ISNULL(F.LeavePeriod,0) NOT IN (1,2)) AND datepart(dw,K.WorkDay) = 7) or (ISNULL(F.LeavePeriod,0) IN (2,3)) THEN 1 
				WHEN ISNULL(F.LeavePeriod,0) = 1 
					or (E.WLeaveDayValue IN (3,5) and datepart(dw,K.WorkDay) = 7 and ISNULL(F.LeavePeriod,0) IN (1,2))
					OR (E.WLeaveDayValue IN (1,2,3) AND datepart(dw,K.WorkDay) = 1) 
					OR (E.WLeaveDayValue = 1 AND datepart(dw,K.WorkDay) = 7) THEN 2
				else 0 END as Vacation,
				ROW_NUMBER()OVER(PARTITION BY K.EmployeeCode,K.WorkDay,L.KowType ORDER BY L.BasicSalRate,K.KowCode) AS RowNumber,
				 DATEPART(ww, WorkDay) AS Tuan
		INTO #Kowds
		FROM dbo.EmpKowDays K 
		INNER JOIN #lstOfEmp E ON E.EmployeeCode = K.EmployeeCode
		INNER JOIN dbo.LsKows L ON L.KowCode = K.KowCode
		left JOIN dbo.LsVacationDays Vs with(NOLOCK) on Vs.VacationDay = K.WorkDay 
		left JOIN dbo.EmployeeWeekOffs F with(NOLOCK) on F.EmployeeCode = K.EmployeeCode and F.WorkDate = K.WorkDay
		WHERE K.WorkDay BETWEEN DATEADD(DAY,-7,@BegDate) AND DATEADD(DAY,7,@EndDate)

		SELECT * INTO #Kowds_CongChuyenQuy FROM #Kowds WHERE 1=0
		--SELECT @BegDate,@EndDate
		--SELECT * FROM EmpKowDays WHERE WorkDay BETWEEN @BegDate AND @EndDate
		--SELECT * FROM #Kowds
		--so gio trong ngay
		--le
		CREATE TABLE #KowDD(EmployeeCode NVARCHAR(30),WorkDay DATETIME,DayNum FLOAT)
		IF @DayLe > 0
		BEGIN
			INSERT INTO #KowDD(EmployeeCode,WorkDay,DayNum)
			SELECT EmployeeCode,WorkDay,SUM(DayNum)-@DayLe AS DayNum FROM #Kowds 
			WHERE Vacation=3 AND KowType = 5 
			GROUP BY EmployeeCode,WorkDay
			HAVING SUM(DayNum) > @DayLe

			EXEC spSanCong_Ngay @DayLe, @BegDate, @EndDate

			--SELECT 'san cong ngay le',* FROM #Kowds
		END
		IF @DayNghi > 0
		BEGIN
			INSERT INTO #KowDD(EmployeeCode,WorkDay,DayNum)
			SELECT EmployeeCode,WorkDay,SUM(DayNum)-@DayNghi AS DayNum FROM #Kowds 
			WHERE Vacation=2 AND KowType = 5 
			GROUP BY EmployeeCode,WorkDay
			HAVING SUM(DayNum) > @DayNghi

			EXEC spSanCong_Ngay @DayNghi, @BegDate, @EndDate
			--SELECT 'san cong ngay nghi',* FROM #Kowds
		END
		IF @DayBT > 0
		BEGIN
			--SELECT 'gggg'
			--SELECT * FROM #Kowds
			INSERT INTO #KowDD(EmployeeCode,WorkDay,DayNum)
			SELECT EmployeeCode,WorkDay,SUM(DayNum)-@DayBT AS DayNum FROM #Kowds 
			WHERE Vacation<2 AND KowType = 5 
			GROUP BY EmployeeCode,WorkDay
			HAVING SUM(DayNum) > @DayBT

			EXEC spSanCong_Ngay @DayBT, @BegDate, @EndDate
			--SELECT 'san cong ngay BT',* FROM #Kowds
		END

		--san cong tuan
		IF ISNULL(@Week,0) > 0
		BEGIN
			
			SELECT S.EmployeeCode, S.Tuan, MIN(S.WorkDay) AS FirdDateOfWeek, SUM(S.DayNum) AS TotalDayNumOfWW INTO #KowdsOfWeek
			FROM #Kowds S 
			WHERE S.KowType = 5 and S.WorkDay BETWEEN @BegDate AND @EndDate
			GROUP BY S.EmployeeCode, S.Tuan

			IF EXISTS(SELECT 1 FROM #KowdsOfWeek WHERE TotalDayNumOfWW > @Week)
			BEGIN
				--tong cong ot cua tuan dau vs tuan cuoi
				SELECT K.EmployeeCode,K.Tuan,SUM(k.DayNum) AS TotalDayNumTruocBegDate
				INTO #TongOTtruocBegDate
				FROM #Kowds K
				WHERE K.WorkDay < @BegDate
				GROUP BY K.EmployeeCode,K.Tuan

				--tong cong ot cua tuan dau vs tuan cuoi
				SELECT K.EmployeeCode,K.Tuan,SUM(k.DayNum) AS TotalDayNumSumEndDate
				INTO #TongOTSauEndDate
				FROM #Kowds K
				WHERE K.WorkDay > @EndDate
				GROUP BY K.EmployeeCode,K.Tuan

				SELECT S.*, 
					S.TotalWeek - SUM(S.DayNum) OVER (PARTITION BY S.EmployeeCode,S.Tuan ORDER BY S.WorkDay, S.RowNumber DESC ROWS UNBOUNDED PRECEDING) as Baland
				INTO #balandWW
				FROM (
					SELECT K.*, w.TotalDayNumOfWW, @Week - ISNULL(tr.TotalDayNumTruocBegDate,0) - ISNULL(SA.TotalDayNumSumEndDate,0) AS TotalWeek
					FROM #Kowds K
					INNER JOIN #KowdsOfWeek W ON W.EmployeeCode=K.EmployeeCode AND w.Tuan = K.Tuan
					LEFT JOIN #TongOTtruocBegDate Tr ON Tr.EmployeeCode = K.EmployeeCode AND tr.Tuan = K.Tuan
					LEFT JOIN #TongOTSauEndDate Sa ON Sa.EmployeeCode = K.EmployeeCode AND Sa.Tuan = K.Tuan
					WHERE K.WorkDay BETWEEN @BegDate AND @EndDate
				) S WHERE S.TotalWeek < S.TotalDayNumOfWW

				SELECT *,CASE WHEN Baland >= 0 THEN DayNum WHEN Baland + DayNum>0 THEN Baland + DayNum ELSE 0 END AS NumOfKowd,
						 CASE WHEN Baland >= 0 THEN 0 WHEN Baland + DayNum>0 THEN -1 * Baland ELSE DayNum END AS NumSubKowd
				INTO #balandWWSub
				FROM #balandWW

				DELETE K FROM #Kowds K INNER JOIN #balandWWSub T ON T.ID = K.ID WHERE T.NumOfKowd <= 0 AND k.WorkDay BETWEEN @BegDate AND @EndDate
				UPDATE K SET K.daynum=T.NumOfKowd FROM #Kowds K INNER JOIN #balandWWSub T ON T.ID = K.ID WHERE T.NumOfKowd > 0 AND k.WorkDay BETWEEN @BegDate AND @EndDate
			
				INSERT INTO #Kowds_CongChuyenQuy(id,EmployeeCode,WorkDay,KowCode,KowType,DayNum,Vacation,RowNumber,IsPay,IsDeleted)
				SELECT NEWID(), K.EmployeeCode,K.WorkDay, K.KowCode, K.KowType, T.NumSubKowd, K.Vacation, 0,k.IsPay, K.IsDeleted
				FROM #Kowds K 
				INNER JOIN #balandWWSub T ON T.ID = K.ID 
				WHERE T.NumSubKowd > 0 AND K.WorkDay BETWEEN @BegDate AND @EndDate

				--SELECT 'san cong tuan',* FROM #Kowds
			END
		END

		--san cong thang
		IF(ISNULL(@Month,0) > 0)
		BEGIN
			SELECT S.EmployeeCode,SUM(s.DayNum) AS TotalDayNumOfMonth INTO #kowdsOfMonth
			FROM #Kowds S
			WHERE S.WorkDay BETWEEN @BegDate AND @EndDate
			GROUP BY S.EmployeeCode
			HAVING SUM(s.DayNum) > @Month
			IF EXISTS	 (SELECT 1 FROM #kowdsOfMonth)
			BEGIN
				SELECT S.*,
					@Month - SUM(S.DayNum) OVER (PARTITION BY S.EmployeeCode ORDER BY S.WorkDay, S.RowNumber DESC ROWS UNBOUNDED PRECEDING) as Baland
				INTO #balandMM
				FROM #Kowds S
				INNER JOIN #kowdsOfMonth M ON M.EmployeeCode = S.EmployeeCode
				WHERE S.WorkDay BETWEEN @BegDate AND @EndDate

				SELECT *,CASE WHEN Baland >= 0 THEN DayNum WHEN Baland + DayNum>0 THEN Baland + DayNum ELSE 0 END AS NumOfKowd,
						 CASE WHEN Baland >= 0 THEN 0 WHEN Baland + DayNum>0 THEN -1 * Baland ELSE DayNum END AS NumSubKowd
				INTO #balandMMSub
				FROM #balandMM

				DELETE K FROM #Kowds K INNER JOIN #balandMMSub T ON T.ID = K.ID WHERE T.NumOfKowd <= 0 AND k.WorkDay BETWEEN @BegDate AND @EndDate
				UPDATE K SET K.daynum=T.NumOfKowd FROM #Kowds K INNER JOIN #balandMMSub T ON T.ID = K.ID WHERE T.NumOfKowd > 0 AND k.WorkDay BETWEEN @BegDate AND @EndDate
			
				INSERT INTO #Kowds_CongChuyenQuy(id,EmployeeCode,WorkDay,KowCode,KowType,DayNum,Vacation,RowNumber,IsPay,IsDeleted)
				SELECT NEWID(), K.EmployeeCode,K.WorkDay, K.KowCode, K.KowType, T.NumSubKowd, K.Vacation, 0, k.IsPay, K.IsDeleted
				FROM #Kowds K 
				INNER JOIN #balandMMSub T ON T.ID = K.ID 
				WHERE T.NumSubKowd > 0 AND K.WorkDay BETWEEN @BegDate AND @EndDate

				SELECT 'san cong thang',* FROM #Kowds
			END
		END
		BEGIN TRY
			BEGIN TRANSACTION
			--chuyen vao cong ao
			INSERT INTO dbo.EmpKowDays_Layer( EmployeeCode,WorkDay,KowCode,DayNum,IsPay,CreatedOn,CreatedBy,Note,IsDeleted,DeletedDate,Layer)
			SELECT K.EmployeeCode,K.WorkDay,K.KowCode,K.DayNum,ISNULL(K.IsPay,0) AS IsPay,GETDATE(),K.CreatedBy,K.Note,K.IsDeleted,K.DeletedDate,0 
			FROM EmpKowDays  K
			 INNER JOIN #lstOfEmp E ON E.EmployeeCode = K.EmployeeCode 
			 WHERE K.WorkDay BETWEEN @BegDate AND @EndDate
		
			DELETE K FROM dbo.EmpKowDays K INNER JOIN #lstOfEmp E ON E.EmployeeCode = K.EmployeeCode WHERE K.WorkDay BETWEEN @BegDate AND @EndDate

			INSERT INTO dbo.EmpKowDays( EmployeeCode,WorkDay,KowCode,DayNum,IsPay,CreatedOn,CreatedBy,Note,IsDeleted)
			SELECT K.EmployeeCode,K.WorkDay, K.KowCode, K.DayNum, K.IsPay,GETDATE(), K.CreatedBy, N'San cong', K.IsDeleted
			FROM #Kowds K
			WHERE K.WorkDay BETWEEN @BegDate AND @EndDate
			COMMIT
		END TRY
		BEGIN CATCH
				ROLLBACK
				SELECT @ErrorMessage = ERROR_MESSAGE(),
					   @ErrorSeverity = ERROR_SEVERITY(),
					   @ErrorState = ERROR_STATE();

				RAISERROR (@ErrorMessage, 16,1); -- Second substitution argument.
		END CATCH
	END
	ELSE--tra lai cong
	BEGIN
		SELECT E.EmployeeCode INTO #lstOfTracong
		FROM #lstOfEmp E INNER JOIN dbo.EmpKowDays_Layer K ON K.EmployeeCode = E.EmployeeCode
		WHERE K.WorkDay BETWEEN @BegDate AND @EndDate
		GROUP BY E.EmployeeCode
		IF EXISTS (SELECT 1 FROM #lstOfTracong)
		BEGIN
			BEGIN TRY
				BEGIN TRANSACTION
					DELETE K FROM dbo.EmpKowDays K INNER JOIN #lstOfTracong E ON E.EmployeeCode = K.EmployeeCode WHERE K.WorkDay BETWEEN @BegDate AND @EndDate
					INSERT INTO dbo.EmpKowDays( EmployeeCode,WorkDay,KowCode,DayNum,IsPay,CreatedOn,CreatedBy,Note,IsDeleted)
					SELECT K.EmployeeCode,K.WorkDay,K.KowCode,K.DayNum,K.IsPay,GETDATE(),K.CreatedBy,K.Note,K.IsDeleted
					FROM EmpKowDays_Layer K
					INNER JOIN #lstOfTracong E ON E.EmployeeCode = K.EmployeeCode
					WHERE K.WorkDay  BETWEEN @BegDate AND @EndDate
					DELETE K FROM dbo.EmpKowDays_Layer K INNER JOIN #lstOfTracong E ON E.EmployeeCode = K.EmployeeCode WHERE K.WorkDay BETWEEN @BegDate AND @EndDate
				COMMIT
			END TRY
			BEGIN CATCH
					ROLLBACK
					SELECT @ErrorMessage = ERROR_MESSAGE(),
							@ErrorSeverity = ERROR_SEVERITY(),
							@ErrorState = ERROR_STATE();

					RAISERROR (@ErrorMessage,
							16, -- Severity.
							1); -- Second substitution argument.
			END CATCH
		END
	END
END
GO
/****** Object:  StoredProcedure [dbo].[spSanCong_Ngay]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[spSanCong_Ngay]
(
	@Num FLOAT,
	@BegDate DATETIME,
	@EndDate DATETIME
)
AS
BEGIN
	--SELECT * FROM #KowDD
	SELECT K.ID,K.EmployeeCode,K.WorkDay,K.KowCode,K.DayNum,@Num AS TongCong,
			@Num - SUM(K.DayNum) OVER (PARTITION BY K.EmployeeCode,K.WorkDay ORDER BY K.RowNumber DESC ROWS UNBOUNDED PRECEDING) as Baland
	INTO #balandDD
	FROM #Kowds K
	INNER JOIN #KowDD T ON T.EmployeeCode = K.EmployeeCode AND T.WorkDay=K.WorkDay
	WHERE K.KowType=5 and K.WorkDay BETWEEN @BegDate AND @EndDate

	SELECT *,CASE WHEN Baland >= 0 THEN DayNum WHEN Baland + DayNum>0 THEN Baland + DayNum ELSE 0 END AS NumOfKowd,
			 CASE WHEN Baland >= 0 THEN 0 WHEN Baland + DayNum>0 THEN -1 * Baland ELSE DayNum END AS NumSubKowd
	INTO #balandDDSub
	FROM #balandDD
	
	DELETE K FROM #Kowds K INNER JOIN #balandDDSub T ON T.ID = K.ID WHERE T.NumOfKowd <= 0 AND k.WorkDay BETWEEN @BegDate AND @EndDate
	UPDATE K SET K.daynum=T.NumOfKowd FROM #Kowds K INNER JOIN #balandDDSub T ON T.ID = K.ID WHERE T.NumOfKowd > 0 AND k.WorkDay BETWEEN @BegDate AND @EndDate

	--SELECT * FROM #Kowds
	INSERT INTO #Kowds_CongChuyenQuy(id,EmployeeCode,WorkDay,KowCode,KowType,DayNum,Vacation,RowNumber,IsPay,IsDeleted)
	SELECT NEWID(), K.EmployeeCode,K.WorkDay, K.KowCode, K.KowType, T.NumSubKowd, K.Vacation, 0, K.IsPay, K.IsDeleted
	FROM #Kowds K 
	INNER JOIN #balandDDSub T ON T.ID = K.ID 
	WHERE T.NumSubKowd > 0 AND K.WorkDay BETWEEN @BegDate AND @EndDate

	--SELECT * FROM #Kowds_CongChuyenQuy
END
GO
/****** Object:  StoredProcedure [dbo].[spUpDateDayOffEmpInToKowDs]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec spUpDateDayOffEmpInToKowDs '','','E000001','2021/05/01','2021/05/30',1,null
*/
CREATE PROC [dbo].[spUpDateDayOffEmpInToKowDs]
(
	@UserID NVARCHAR(200),
	@FunctionID NVARCHAR(50),
	@strEmpID NVARCHAR(MAX),
	@BegDate DATETIME,
	@EndDate DATETIME,
	@IsUpdateKowNor BIT,
	@Err NVARCHAR(MAX) OUT
)
AS
BEGIN
	SET @Err = ''
	SET NOCOUNT ON

	CREATE TABLE #lstOfLockTimeSheet(DepartmentCode NVARCHAR(30), BegDate DATETIME, EndDate DATETIME)

	DECLARE @gSSLNC INT SET @gSSLNC = 2
	DECLARE @TSIsNightByHour BIT --TTChung/ Công làm dêm tính theo gi?
	DECLARE @IsSGMC_AllowShift BIT SET @IsSGMC_AllowShift = 0 --Sô´ gio` mô?t công thay dô?i theo ca
	DECLARE @WLeaveDayValue INT

	--Get thông tin thiê´t lâ?p chung
	SELECT @gSSLNC = ISNULL(S.TSDecPlaceWD,0),@IsSGMC_AllowShift = ISNULL(S.TSIsChangeHoursPerWDByShift,0), 
			@TSIsNightByHour = ISNULL(S.TSIsNightByHour,0)
	FROM dbo.sysConfigTS S WITH(NOLOCK)

	--Tap nhan vien can tinh
	CREATE TABLE #Emp(EmployeeCode NVARCHAR(100), DepartmentCode NVARCHAR(100), JobWCode NVARCHAR(100), JoinDate DATETIME, EndDate DATETIME, GroupSalCode NVARCHAR(100), 
			IsNotScan BIT, IsNotLateEarly BIT, IsNotOTKow BIT, Alt_Shift BIT, ShiftCode NVARCHAR(100), WLeaveDayValue INT)
	INSERT INTO #Emp(EmployeeCode, Alt_Shift, ShiftCode, WLeaveDayValue, DepartmentCode)
	SELECT E.EmployeeCode as EmployeeCode, ISNULL(E.Alt_Shift,0), E.ShiftCode, S.LeaveType, E.DepartmentCode
	FROM dbo.Employees E  WITH(NOLOCK)
	INNER JOIN dbo.fnSplitString(@strEmpID,',') F  ON F.data = E.EmployeeCode
	LEFT JOIN dbo.lsLeaveGroups S WITH(NOLOCK) ON S.LeaveGroupCode = E.LeaveGroupCode
	OPTION (MAXRECURSION 0)

	--SELECT * FROM #Emp
	DECLARE @TSHoursPerWD FLOAT SET @TSHoursPerWD = 8
	--Lâ´y tâ?p công trong nga`y.
	SELECT S.EmployeeCode, S.WorkDate AS WorkDate, 
			S.DayNum AS DayNum, S.LeavePeriod, 
			CASE WHEN Vs.VacationDay IS NOT NULL THEN 3
				WHEN ((S.WLeaveDayValue = 3 OR S.WLeaveDayValue = 5) AND DATEPART(dw,S.WorkDate) = 7) OR ISNULL(F.LeavePeriod,0) IN (2,3) THEN 1 
				WHEN F.EmployeeCode IS NOT NULL OR (S.WLeaveDayValue IN (1,2,3) AND DATEPART(dw,S.WorkDate) = 1) OR (S.WLeaveDayValue = 1 AND DATEPART(dw,S.WorkDate) = 7) THEN 2
				ELSE 0 END AS Vacation, S.Alt_Shift, S.ShiftCode, S.KowCode, @TSHoursPerWD AS gSGMC, S.KowType, S.NgayTaoPhieu
	INTO #EmpDayOff_d
	FROM
	(
		SELECT F.EmployeeCode as EmployeeCode, R.WorkDate, R.DayNum AS DayNum, R.LeavePeriod AS LeavePeriod, 
				E.Alt_Shift, E.ShiftCode, ISNULL(R.KowCode,F.KowCode) AS KowCode, E.WLeaveDayValue, L.KowType, F.CreatedOn AS NgayTaoPhieu
		FROM dbo.EmployeeDayOffs F 
		INNER JOIN dbo.EmployeeDayOffs_detailDay R WITH(NOLOCK) ON R.RecordID = F.Id
		INNER JOIN #Emp E ON F.EmployeeCode = E.EmployeeCode
		INNER JOIN dbo.LsKows L WITH(NOLOCK) ON L.KowCode = F.KowCode
		LEFT JOIN #lstOfLockTimeSheet LK ON LK.DepartmentCode=E.DepartmentCode AND R.WorkDate BETWEEN LK.BegDate AND LK.EndDate
		WHERE R.WorkDate BETWEEN @BegDate AND @EndDate AND LK.DepartmentCode IS NULL
	) S
	LEFT JOIN dbo.LsVacationDays Vs WITH(NOLOCK) ON Vs.VacationDay = S.WorkDate
	LEFT JOIN dbo.EmployeeWeekOffs F WITH(NOLOCK) ON F.EmployeeCode = S.EmployeeCode AND F.WorkDate = S.WorkDate
	LEFT JOIN dbo.LsDowLists P ON S.WorkDate BETWEEN P.BegDate AND P.EndDate
	
	--SELECT * FROM #EmpDayOff_d
	--DELETE CONG NGHI? TRUO´C KHI CÂ?P NHÂ?T LA?I.
	DELETE K FROM dbo.EmpKowDays k INNER JOIN dbo.LsKows L ON L.KowCode = k.KowCode
	INNER JOIN #Emp E ON E.EMPLOYEECODE = k.EmployeeCode
	LEFT JOIN #lstOfLockTimeSheet LK ON LK.DepartmentCode=E.DepartmentCode AND K.WorkDay BETWEEN LK.BegDate AND LK.EndDate
	LEFT JOIN dbo.LsVacationDays Vs WITH(NOLOCK) ON Vs.VacationDay = K.WorkDay
	INNER JOIN #EmpDayOff_d D ON D.EmployeeCode = K.EmployeeCode AND D.WorkDate = K.WorkDay
	WHERE k.WorkDay BETWEEN @BegDate AND @EndDate AND L.KowType NOT IN (1,2,3,5,6,25) AND LK.DepartmentCode IS NULL 
		AND (Vs.VacationDay IS NULL OR (Vs.VacationDay IS NOT NULL AND L.KowType IN (9,22)))

	--SELECT * FROM #EmpDayOff_d
	--Danh sach chi tiet cac ngay xin nghi phep va so cong xin nghi.
	SELECT  S.EmployeeCode, S.WorkDate, S.KowCode, SUM(S.DayNum) AS DayNum,
			@TSHoursPerWD AS gSGMC, 
			S.Vacation, L.ShiftCode, S.IsLastPayroll
	INTO #EmpDayOff
	FROM
	(
		SELECT S.EmployeeCode, S.WorkDate, S.KowCode, CASE WHEN S.Alt_Shift = 1 THEN H.ShiftCode ELSE S.ShiftCode END AS ShiftCode, 
						S.DayNum AS DayNum, S.LeavePeriod, S.Vacation, 0 AS IsLastPayroll
		FROM #EmpDayOff_d S 
		LEFT JOIN dbo.EmployeeShifts H WITH(NOLOCK) ON H.EmployeeCode = S.EmployeeCode AND H.WorkDate = S.WorkDate
		WHERE S.Vacation < 2 OR (S.KowType IN (9,22) AND S.Vacation = 3)
	) S LEFT JOIN dbo.LsShifts L WITH(NOLOCK) ON L.ShiftCode = S.ShiftCode
	GROUP BY S.EmployeeCode, S.WorkDate, S.KowCode,S.Vacation, L.ShiftCode, S.IsLastPayroll
	--LÂ´Y BA?NG CÔNG(CÔNG ÐI LA`M+DTVS) TRUO´C KHI INSERT CÔNG NGHI?

	select S.EmployeeCode,S.WorkDate,S.Vacation,gSGMC,case when Vacation = 1 then TongCongTrongNgay/2.0 else TongCongTrongNgay end as TongCongTrongNgay
	into #EmpDayOff_days
	from (
		select EmployeeCode, WorkDate, Vacation,gSGMC, case when gSGMC = 1 then 8.0 else 1 end as TongCongTrongNgay
		from #EmpDayOff
		group by EmployeeCode, WorkDate, Vacation,gSGMC
	) S

	--INSERT TÂ?P CÔNG NGHI? VA`O BA?NG CÔNG
	CREATE TABLE #lstOfDayOffSC(EmployeeCode NVARCHAR(30), WorkDate DATETIME, KowCode NVARCHAR(20), DayNum FLOAT, IsNoon INT, Ordinal INT, DowCode NVARCHAR(7))

	SELECT K.EmployeeCode as EmployeeCode,K.WorkDay as WorkDate, K.KowCode, K.DayNum INTO #ksKowds
	FROM dbo.EmpKowDays K WITH(NOLOCK)
	INNER JOIN #Emp E ON E.EmployeeCode = K.EmployeeCode
	INNER JOIN #EmpDayOff_d D ON D.EmployeeCode = K.EmployeeCode AND D.WorkDate = K.WorkDay
	WHERE K.WorkDay BETWEEN @BegDate AND @EndDate

	INSERT INTO EmpKowDays(EmployeeCode, WorkDay, KowCode, DayNum, IsPay, CreatedOn, CreatedBy)
	SELECT S.EmployeeCode, S.WorkDate, S.KowCode, ROUND(CASE WHEN S.gSGMC <> 1 THEN S.DayNum ELSE S.DayNum * isnull(E.TongCongTrongNgay, 8.00) END, @gSSLNC), 0, GETDATE(), @UserID
	FROM #EmpDayOff S 
	left join #EmpDayOff_days E on E.EmployeeCode = S.EmployeeCode and E.WorkDate = S.WorkDate
	WHERE ROUND(CASE WHEN S.gSGMC <> 1 THEN isnull(S.DayNum,0) ELSE isnull(S.DayNum,0) * 8.00 END, @gSSLNC) > 0

	--xet công công tác trong ngày xem có ko?
	SELECT T.EmployeeCode, T.WorkDate, SUM(T.DayNum) AS DayNum
	into #pCongtac
	FROM (
		SELECT K.EmployeeCode EmployeeCode, K.WorkDay WorkDate, SUM(K.DayNum) AS DayNum
		from EmpKowDays K WITH(NOLOCK)
		inner JOIN #Emp E ON E.EmployeeCode = K.EmployeeCode
		inner JOIN LsKows L WITH(NOLOCK) on L.KowCode = K.KowCode
		where K.WorkDay BETWEEN @BegDate and @EndDate and L.KowType = 2
		GROUP BY K.EmployeeCode, K.WorkDay
	) T GROUP BY T.EmployeeCode, T.WorkDate

	--MaxKowNorRemain: Tô?ng công trong nga`y - tô?ng công nghi?.(Sô´ công bi`nh thuo`ng + DTVS co`n la?i) gia´ tri? na`y dê? tru` la?i công bi`nh thuo`ng sau khi câ?p nhâ?t công nghi?
	SELECT S.EmployeeCode,S.WorkDate, S.KowCode, S.DayNum, S.RecID, S.IsNotKowds , S.IsNoon, L.KowType
	INTO #dfEmpKowDays_sub
	FROM (
		SELECT K.EmployeeCode EmployeeCode,K.WorkDay WorkDate, K.KowCode, K.DayNum, K.Id as RecID, 0 AS IsNotKowds, 0 AS IsNoon
		FROM dbo.EmpKowDays K WITH(NOLOCK)
		INNER JOIN #Emp E ON E.EmployeeCode = K.EmployeeCode
		INNER JOIN #EmpDayOff_d D ON D.EmployeeCode = K.EmployeeCode AND D.WorkDate = K.WorkDay
		WHERE K.WorkDay BETWEEN @BegDate AND @EndDate
	) S LEFT JOIN dbo.LsKows L ON L.KowCode = S.KowCode

	SELECT K.EmployeeCode, K.WorkDate, K.KowCode, 
		CASE WHEN @TSIsNightByHour = 1 AND L.KowType = 3 AND F.gSGMC <> 1 THEN K.DayNum/(1.00* F.gSGMC) ELSE K.DayNum END as DayNum, 
		F.gSGMC, CASE WHEN F.gSGMC = 1 then F.DayNumLeave * 8 ELSE F.DayNumLeave END as DayNumLeave,
					CASE WHEN F.gSGMC = 1 THEN isnull(E.TongCongTrongNgay,8) - F.DayNumLeave * isnull(E.TongCongTrongNgay,8) - ISNULL(CT.DayNum,0) * isnull(E.TongCongTrongNgay,8) ELSE isnull(E.TongCongTrongNgay,1) - F.DayNumLeave - ISNULL(CT.DayNum,0) END as MaxKowNorRemain, 
		L.KowType, row_number()OVER(PARTITION BY K.EmployeeCode, K.WorkDate order BY L.KowType DESC) as RowIndex,
		ISNULL(K.IsNoon,0) AS IsNoon, K.RecID, K.IsNotKowds
	into #pEmpKowDays
	from #dfEmpKowDays_sub K 
	inner JOIN (SELECT EmployeeCode, WorkDate, gSGMC, sum(DayNum) AS DayNumLeave FROM #EmpDayOff GROUP BY EmployeeCode, WorkDate, gSGMC) F on F.EmployeeCode = K.EmployeeCode and F.WorkDate = K.WorkDate
	inner JOIN LsKows L WITH(NOLOCK) on L.KowCode = K.KowCode
	LEFT JOIN #pCongtac CT ON CT.EmployeeCode = K.EmployeeCode AND k.WorkDate = CT.WorkDate
	left join #EmpDayOff_days E on E.EmployeeCode = K.EmployeeCode and E.WorkDate = K.WorkDate
	where K.WorkDate BETWEEN @BegDate and @EndDate and L.KowType in (1,3,6)

	--TRU` LA?I CÔNG BI`NH THUO`NG.
	IF @IsUpdateKowNor = 1
	BEGIN
		--LÂ´Y TÂ?P DANH SA´CH CA´C NGA`Y CÂ`N CÂ?P NHÂ?T LA?I (CA´C NGA`Y CO´ "TÔ?NG SÔ´ CÔNG ÐI LA`M" + "TÔ?NG SÔ´ CÔNG NGHI?" > "TÔ?NG SÔ´ CÔNG MAX CU?A 1 NGA`Y")
		--HIEUSO: sô´ công pha?i tru` la?i.
		SELECT K.EmployeeCode, K.WorkDate, SUM(K.DayNum) - MAX(K.MaxKowNorRemain) AS HIEUSO
		INTO #pEmpKowDays_hieuso
		FROM #pEmpKowDays k
		GROUP BY K.EmployeeCode, K.WorkDate
		HAVING SUM(K.DayNum) > MAX(K.MaxKowNorRemain)

		SELECT K.EmployeeCode, K.WorkDate, K.KowCode, K.DayNum, H.HieuSo, K.KowType, K.RowIndex, K.gSGMC , K.IsNoon, K.RecID, K.IsNotKowds,P.DowCode
		INTO #pKowds
		FROM #pEmpKowDays K INNER JOIN #pEmpKowDays_hieuso H ON K.EmployeeCOde = H.EmployeeCode AND K.WorkDate = H.WorkDate
		LEFT JOIN dbo.LsDowLists P ON K.WorkDate BETWEEN P.BegDate AND P.EndDate
		
		SELECT K.EmployeeCode, K.WorkDate, K.KowCode, K.DayNum, K.KowType, K.gSGMC, K.RowIndex, k.IsNoon, K.RecID, K.IsNotKowds, K.DowCode
		INTO #UpdateKowds FROM #pKowds K

		DECLARE @MaxIndex INT, @i INT SET @i = 1
		SELECT @MaxIndex = MAX(RowIndex) FROM #pKowds
		CREATE TABLE #tmp(EmployeeCode NVARCHAR(100), WorkDate DATETIME, KowCode NVARCHAR(100), HieuSo DECIMAL(18,5), DayNum DECIMAL(18,5))
		WHILE(@i <= @MaxIndex)
		BEGIN
			IF EXISTS (SELECT TOP 1 1 FROM #pKowds K WHERE K.RowIndex = @i AND K.HieuSo > 0)
			BEGIN
				DELETE FROM #tmp
				INSERT INTO #tmp(EmployeeCode, WorkDate, KowCode, HieuSo, DayNum)
				SELECT K.EmployeeCOde, K.WorkDate, K.KowCode, ROUND(K.HieuSo,@gSSLNC), ROUND(K.DayNum,@gSSLNC) FROM #pKowds K WHERE K.RowIndex = @i
				
				DELETE K FROM #pKowds K INNER JOIN #tmp T ON K.EmployeeCode = T.EmployeeCode AND K.WorkDate = T.WorkDate AND K.Kowcode = T.Kowcode
				WHERE T.HieuSo >= T.DayNum AND K.RowIndex = @i

				UPDATE K SET K.HieuSo = T.HieuSo - T.DayNum FROM #pKowds K INNER JOIN #tmp T ON K.EmployeeCode = T.EmployeeCode AND K.WorkDate = T.WorkDate
				WHERE T.HieuSo >= T.DayNum AND K.RowIndex > @i

				UPDATE K SET K.DayNum = T.DayNum - T.HieuSo FROM #pKowds K INNER JOIN #tmp T ON K.EmployeeCode = T.EmployeeCode AND K.WorkDate = T.WorkDate
				WHERE T.HieuSo < T.DayNum AND K.RowIndex = @i

				UPDATE K SET K.HieuSo = 0 FROM #pKowds K INNER JOIN #tmp T ON K.EmployeeCode = T.EmployeeCode AND K.WorkDate = T.WorkDate
				WHERE T.HieuSo < T.DayNum AND K.RowIndex >= @i
			END
			SET @i=@i + 1
		END
		
		UPDATE S SET S.DayNum = ISNULL(T.DayNum,0)
		FROM #UpdateKowds S 
		LEFT JOIN #pKowds T ON S.EMployeeCode = T.EmployeeCode AND S.WOrkDate = T.WorkDate AND S.Kowcode = T.KowCode

		DELETE K FROM EmpKowDays K INNER JOIN #UpdateKowds T ON T.EmployeeCode = K.EmployeeCode AND T.WorkDate = K.WorkDay AND T.KowCode = K.KowCode
		WHERE isnull(T.DayNum,0) <= 0 
			
		UPDATE K SET K.DayNum = ROUND(CASE WHEN ISNULL(T.KowType,0) = 3 AND T.gSGMC <> 1 AND @TSIsNightByHour = 1 THEN T.DayNum * T.gSGMC ELSE T.DayNum END, @gSSLNC)
		FROM EmpKowDays K INNER JOIN #UpdateKowds T ON T.EmployeeCode = K.EmployeeCode AND T.WorkDate = K.WorkDay AND T.KowCode = K.KowCode
		WHERE isnull(T.DayNum,0) > 0 
	END
END
GO
/****** Object:  StoredProcedure [dbo].[SYS_DataDomainsUpdateLevelCode]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[SYS_DataDomainsUpdateLevelCode]
	@ID int
AS
BEGIN

	DECLARE @ParentLeveCode nvarchar(max), @Child int, @ParentID INT, @ParentCode NVARCHAR(20), @LevelCode nvarchar(max)

	-- Find Parent Node
	SELECT @ParentLeveCode = LevelCode, @ParentID = DDID from SYS_DataDomains 
	WHERE DDID = (SELECT isnull(ParentID,0) from SYS_DataDomains WHERE DDID = @ID)

	SET @ParentCode = null
	SELECT TOP(1) @ParentCode = DDCode FROM SYS_DataDomains WHERE DDID = @ParentID

	--
	set @LevelCode = isnull(@ParentLeveCode,N'.') + cast(@ID AS nvarchar(40)) + N'.'
	UPDATE SYS_DataDomains SET LevelCode = @LevelCode, [Level] = LEN(@LevelCode) - LEN(REPLACE(@LevelCode, '.', '')) - 1,
		ParentCode = @ParentCode
	WHERE DDID = @ID  
	--
	IF exists(select top(1) 1 from SYS_DataDomains where ParentID = @ID)
	begin 
		DECLARE Children CURSOR LOCAL FOR
			SELECT DDID from SYS_DataDomains where ParentID = @ID 
		OPEN Children;
		FETCH FROM Children INTO @Child;	
		while @@FETCH_STATUS=0
		begin
			-- exec recursive
			EXEC SYS_DataDomainsUpdateLevelCode @Child
			--
			FETCH NEXT FROM Children INTO @Child
		end	
		CLOSE Children
		DEALLOCATE Children
	end
end
GO
/****** Object:  StoredProcedure [dbo].[SYS_spLogin_CheckUser]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec SYS_spLogin_CheckUser @UserName,@PassWord,@Lang
	exec SYS_spLogin_CheckUser 'hntruong',null,'vn'

*/
CREATE PROC [dbo].[SYS_spLogin_CheckUser]
(
	@UserName NVARCHAR(250),
	@PassWord NVARCHAR(max),
	@Lang NVARCHAR(10)
)
AS
BEGIN
	SELECT * FROM dbo.sys_Users WHERE UserName=@UserName AND ISNULL(Password,'') = ISNULL(@PassWord,'')
END
GO
/****** Object:  StoredProcedure [dbo].[SYS_spPermissions_GetDataWithUserIDvsFunctionID]    Script Date: 10-Aug-21 11:56:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
	exec SYS_spPermissions_GetDataWithUserIDvsFunctionID 'hntruong','','', 'VN'
*/
CREATE PROC [dbo].[SYS_spPermissions_GetDataWithUserIDvsFunctionID]
(
	@UserID varchar(20)='hntruong',
	@FunctionID varchar(20)='LS0000',
	@Module VARCHAR(20)='LS',
	@Lang VARCHAR(10) = 'VN'
)
AS
	SELECT P.RoleID,P.FunctionID, F.Module, ISNULL(DF.CustomName,DF.DefaultName) AS FunctionName,
		CAST(P.[View] AS INT) AS [View], CAST(P.[Add] AS INT) AS [Add],
		CAST(P.[Delete] AS INT) AS [Delete],
		CAST(P.Export AS INT) AS Export,
		CAST(P.Import AS INT) AS Import,
		CAST(P.Upload AS INT) AS Upload,
		CAST(P.Download AS INT) AS Download,
		CAST(P.[Copy] AS INT) AS [Copy],
		CAST(P.[Print] AS INT) AS [Print],F.Url
	INTO #sys_UserRoles
	FROM dbo.sys_UserRoles R
	INNER JOIN dbo.SYS_Permissions P ON P.RoleID = R.RoleID 
	INNER JOIN dbo.SYS_FunctionList F ON F.FunctionID = P.FunctionID
	LEFT JOIN dbo.SYS_FunctionListLabel DF ON DF.FunctionID = P.FunctionID AND DF.Language = @Lang
	WHERE R.UserID = @UserID AND (P.FunctionID = @FunctionID OR ISNULL(@FunctionID,'') = '')
			AND (F.Module =@Module OR ISNULL(@Module,'') = '')

	SELECT P.RoleID, P.FunctionID, P.Module, P.FunctionName, P.[Url], 
			MAX(P.[View]) AS [View], MAX(P.[Delete]) AS [Delete], MAX(P.[Add]) AS [Add], 
			MAX(P.Export) AS Export, MAX(P.Import) AS Import, 
			MAX(P.Download) AS Download, MAX(P.Upload) AS Upload, 
			MAX(P.[Copy]) AS [Copy], MAX(P.[Print]) AS [Print] 
	FROM #sys_UserRoles P
	GROUP BY P.RoleID, P.FunctionID, P.Module, P.FunctionName, P.Url
GO

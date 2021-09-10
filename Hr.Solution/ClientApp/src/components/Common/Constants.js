
export class Currency {
    static VND = 1;
    static JPY = 2;
    static USD = 3;
    static EUR = 4;
    static All = [
        { id: this.VND, name: "Việt nam đồng" },
        { id: this.JPY, name: "Yên nhật" },
        { id: this.USD, name: "Đô la mỹ" },
        { id: this.EUR, name: "Bảng anh" },
    ];
}

export class TypeValidation{
    static required = "required";
    static REQUIRED = 1;
}

export class Error {
    static PasswordRequiresNonAlphanumeric = 'PasswordRequiresNonAlphanumeric';
    static PasswordTooShort = 'PasswordTooShort';
    static PasswordRequiresDigit = 'PasswordRequiresDigit';
    static PasswordRequiresLower = 'PasswordRequiresLower';
    static PasswordRequiresUpper = 'PasswordRequiresUpper';
    static NOT_FOUND_USER = 'NOT_FOUND_USER';
    static INVALID_PASSWORD = 'INVALID_PASSWORD';
    static All = [
        { code: this.PasswordRequiresNonAlphanumeric, message: "Mật khẩu phải chứa 1 ký tự đặc biệt!" },
        { code: this.PasswordTooShort, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
        { code: this.PasswordRequiresDigit, message: "Mật khẩu phải có ít nhất một chữ số ('0' - '9')!" },
        { code: this.PasswordRequiresLower, message: "Mật khẩu phải có ít nhất một chữ thường ('a' - 'z')!" },
        { code: this.PasswordRequiresUpper, message: "Mật khẩu phải có ít nhất một chữ hoa ('A' - 'Z')!" },
        { code: this.NOT_FOUND_USER, message: "Không tìm thấy người dùng!" },
        { code: this.INVALID_PASSWORD, message: "Mật khẩu hiện tại không đúng!" },
    ]
}

export class Function {
    static ADM000 = "ADM000";
    static ADM001 = "ADM001";
    static ADM002 = "ADM002";
    static ADM003 = "ADM003";
    static EMP000 = "EMP000";
    static EMP001 = "EMP001";
    static EMP002 = "EMP002";
    static LS000 = "LS000";
    static LS0001 = "LS0001";
    static LSEM100 = "LSEM100";
    static LSEM101 = "LSEM101";
    static LSEM102 = "LSEM102";
    static LSEM104 = "LSEM104";
    static LSEM105 = "LSEM105";
    static LSEM106 = "LSEM106";
    static LSEM107 = "LSEM107";
    static LSEM108 = "LSEM108";
    static LSEM109 = "LSEM109";
    static LSEM110 = "LSEM110";
    static LSEM111 = "LSEM111";
    static LSEM112 = "LSEM112";
    static LSEM113 = "LSEM113";
    static LSEM115 = "LSEM115";
    static LSEM116 = "LSEM116";
    static LSEM117 = "LSEM117";
    static LSEM118 = "LSEM118";
    static LSEM119 = "LSEM119";
    static LSEM120 = "LSEM120";
    static LSEM121 = "LSEM121";
    static LSEM122 = "LSEM122";
    static LSEM123 = "LSEM123";
    static LSEM124 = "LSEM124";
    static LSEM125 = "LSEM125";
    static LSEM126 = "LSEM126";
    static LSEM127 = "LSEM127";
    static LSEM128 = "LSEM128";
    static LSEM129 = "LSEM129";
    static LSEM131 = "LSEM131";
    static LSEM132 = "LSEM132";
    static LSEM133 = "LSEM133";
    static LSEM134 = "LSEM134";
    static LSEM135 = "LSEM135";
    static LSEM137 = "LSEM137";
    static LSEM140 = "LSEM140";
    static LSEM141 = "LSEM141";
    static LSEM142 = "LSEM142";
    static LSEM143 = "LSEM143";
    static LSEM144 = "LSEM144";
    static LSEM145 = "LSEM145";
    static LSEM149 = "LSEM149";
    static LSEM153 = "LSEM153";
    static LSEM155 = "LSEM155";
    static LSEM157 = "LSEM157";
    static LSEM158 = "LSEM158";
    static LSEM159 = "LSEM159";
    static LSEM160 = "LSEM160";
    static LSEM161 = "LSEM161";
    static LSEM162 = "LSEM162";
    static LSEM163 = "LSEM163";
    static LSEM164 = "LSEM164";
    static LSEM165 = "LSEM165";
    static LSEM168 = "LSEM168";
    static LSEM169 = "LSEM169";
    static LSEM170 = "LSEM170";
    static LSEM171 = "LSEM171";
    static LSEM172 = "LSEM172";
    static LSEM173 = "LSEM173";
    static LSEM174 = "LSEM174";
    static LSEM324 = "LSEM324";
    static LSEM325 = "LSEM325";
    static LSEM400 = "LSEM400";
    static LSEM401 = "LSEM401";
    static LSEMKN1 = "LSEMKN1";
    static LSPR101 = "LSPR101";
    static LSPR102 = "LSPR102";
    static LSPR103 = "LSPR103";
    static LSPR104 = "LSPR104";
    static LSPR105 = "LSPR105";
    static LSPR106 = "LSPR106";
    static LSPR107 = "LSPR107";
    static LSPR108 = "LSPR108";
    static LSPR109 = "LSPR109";
    static LSPR110 = "LSPR110";
    static LSPR111 = "LSPR111";
    static LSPR112 = "LSPR112";
    static LSPR113 = "LSPR113";
    static LSPR114 = "LSPR114";
    static LSPR115 = "LSPR115";
    static LSPR116 = "LSPR116";
    static LSPR117 = "LSPR117";
    static LSPR118 = "LSPR118";
    static LSPR170 = "LSPR170";
    static LSPR250 = "LSPR250";
    static LSSI100 = "LSSI100";
    static LSSI146 = "LSSI146";
    static LSSI900 = "LSSI900";
    static LSTAS300 = "LSTAS300";
    static LSTS100 = "LSTS100";
    static LSTS101 = "LSTS101";
    static LSTS102 = "LSTS102";
    static LSTS103 = "LSTS103";
    static SYS000 = "SYS000";




}
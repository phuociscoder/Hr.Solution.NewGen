using Hr.Solution.Application.Authentication;
using Hr.Solution.Application.Authentication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Hr.Solution.Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration configuration;

        public AuthenticateController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] LoginModel model)
        {
            var user = await userManager.FindByNameAsync(model.UserName);

            if (user == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { Status = "INVALID", Message = "Wrong username or password" });
            }

            if (!user.IsNeverLock && (user.AccessFailedCount >= user.LockAfter || user.IsLock))
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { Status = "LOCKED", Message = "User has been locked" });
            }

            if (!user.IsActive)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { Status = "DEACTIVATED", Message = "User has been Deactived" });
            }

            if (await userManager.CheckPasswordAsync(user, model.Password))
            {
                await userManager.ResetAccessFailedCountAsync(user);
                var userRoles = await userManager.GetRolesAsync(user);
                var authClaims = new List<Claim> {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                            issuer: configuration["JWT:ValidIssuer"],
                            audience: configuration["JWT:ValidAudience"],
                            expires: DateTime.Now.AddHours(1),
                            claims: authClaims,
                            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    userClaim = user

                });
            }

            if (!user.IsNeverLock)
            {
                await userManager.AccessFailedAsync(user);
            }

            return Unauthorized();
        }

        [HttpPut]
        [Route("/unlock/{id}")]
        [Authorize]
        public async Task<ActionResult> UnLock(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return StatusCode(StatusCodes.Status404NotFound, new Response { Status = "NOTFOUND", Message = "User Not Found" });
            user.AccessFailedCount = 0;
            user.IsLock = false;
            var result = await userManager.UpdateAsync(user);
            if (result.Succeeded) return Ok(user);
            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "ERROR", Message = "Cannot unlock user" });
        }

        [HttpPost]
        [Route("")]
        [Authorize]
        public async Task<ActionResult> RegisterUser([FromBody] RegisterUserModel model)
        {
            var existsUser = await userManager.FindByNameAsync(model.UserName);
            if (existsUser != null)
            {
                return StatusCode(StatusCodes.Status406NotAcceptable, new Response { Status = "Error", Message = $"User create fail, user with email {model.Email} is existing !" });
            }

            ApplicationUser user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName,
                IsActive = model.IsActive,
                IsAdmin = model.IsAdmin,
                IsDomain = model.IsDomain,
                Avatar = model.Avatar,
                Code = model.Code,
                IsFirstLogin = true,
                IsLock = model.IsLock,
                IsNeverLock = model.IsNeverLock,
                LockAfter = model.LockAfter,
                ValidDate = model.ValidDate,
                SecurityStamp = Guid.NewGuid().ToString()

            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Cannot create user , error from API" });
            }
            return Ok(new Response { Status = "Successed", Message = "Create user successfully." });
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public async Task<ActionResult> Update(string id, [FromBody] UpdateUserModel model)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return StatusCode(StatusCodes.Status404NotFound, new Response { Status = "Error", Message = $"Cannot found user." });

            user.Avatar = model.Avatar ?? user.Avatar;
            user.Email = model.Email ?? user.Email;
            user.IsActive = model.IsActive;
            user.IsAdmin = model.IsAdmin;
            user.IsDomain = model.IsDomain;
            user.IsLock = model.IsLock;
            user.LockAfter = model.LockAfter;
            user.IsNeverLock = model.IsNeverLock;
            user.FullName = model.FullName;
            user.ValidDate = model.ValidDate;

            var result = await userManager.UpdateAsync(user);
            if (result.Succeeded) return Ok(user);
            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Update User Fail" });
        }

        [HttpPut, Route("/changePassword/{id}")]
        [Authorize]
        public async Task<ActionResult> ChangePassword(string id, [FromBody] ChangePasswordModel model)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return StatusCode(StatusCodes.Status404NotFound, new Response { Status = StatusCodes.Status404NotFound.ToString(), Message = "User Not Found" });
            var result = await userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (result.Succeeded) return Ok(user);
            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = StatusCodes.Status500InternalServerError.ToString(), Message = "Cannot change password" });
        }
    }
}

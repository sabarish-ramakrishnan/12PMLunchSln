using _12PMLunch.API.DAL;
using _12PMLunch.API.Handlers;
using _12PMLunch.API.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Filters;
using System.Web.Http.Results;

namespace _12PMLunch.API.Filters
{
    public class AuthenticationFilter : Attribute, IAuthenticationFilter
    {
        private readonly string realm;
        public bool AllowMultiple { get { return false; } }

        public AuthenticationFilter()
        {

        }
        public AuthenticationFilter(string realm)
        {
            this.realm = "realm=" + realm;
        }


        public Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            var authType = "Basic";
            var req = context.Request;
            if (HasAnonymousAttribute(req) || IsAuthDisabled(req))
            {
                return Task.FromResult(0);
            }

            else if (req.Headers.Authorization != null &&
                    req.Headers.Authorization.Scheme.Equals(
                              authType, StringComparison.OrdinalIgnoreCase))
            {
                string authParameter = Common.returnDecodedString(req.Headers.Authorization
                                                       .Parameter);
                string[] parts = authParameter.Split(new char[] { ':' }, StringSplitOptions.RemoveEmptyEntries);
                if (parts == null || parts.Length < 2)
                    return Task.FromResult(0);

                string loginToken = parts[0].Trim();
                string dateInMMddYY = parts[1].Trim();
                string userEmailId = string.Empty;
                if (validateUserToken(loginToken, ref userEmailId)
                    && dateInMMddYY == Common.GetCSTTime().ToString(Constants.Common.DateFormat))
                {
                    //SetPrincipal(context, authType, userEmailId);
                    var claims = new List<Claim>() {
                        new Claim(ClaimTypes.Email, userEmailId)
                    };
                    var id = new ClaimsIdentity(claims, authType);
                    var principal = new ClaimsPrincipal(new[] { id });
                    context.Principal = principal;
                }
                else
                {
                    context.ErrorResult = new UnauthorizedResult(
                         new AuthenticationHeaderValue[0],
                                              context.Request);
                }
            }
            else
            {
                context.ErrorResult = new UnauthorizedResult(
                         new AuthenticationHeaderValue[0],
                                              context.Request);
            }
            return Task.FromResult(0);
        }

        private static void SetPrincipal(HttpAuthenticationContext context, string authType, string userEmailId)
        {
            var claims = new List<Claim>() {
                        new Claim(ClaimTypes.Email, userEmailId)
                    };
            var id = new ClaimsIdentity(claims, authType);
            var principal = new ClaimsPrincipal(new[] { id });
            context.Principal = principal;
        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            context.Result = new ResultWithChallenge(context.Result, realm);
            return Task.FromResult(0);
        }

        private bool validateUserToken(string userToken, ref string userEmailId)
        {
            User user = LunchDBEntity.Instance.Users.ToList()
               .FirstOrDefault(x => Convert.ToString(x.LoginToken) == userToken
                                && x.IsActive
                                && x.LoginTokenExpiry >= Common.GetCSTTime());
            if (user == null)
                return false;
            userEmailId = user.EmailId;
            return true;
        }

        private bool IsAuthDisabled(HttpRequestMessage request)
        {
            if (request.GetActionDescriptor().GetCustomAttributes<AllowAnonymousAttribute>().Any()
                          || request.GetActionDescriptor().ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any())
                return true;

            IEnumerable<string> disableAuth = Enumerable.Empty<string>();
            if (request.Headers.TryGetValues("x-disable-auth", out disableAuth))
            {
                return Convert.ToBoolean(disableAuth.FirstOrDefault());
            }
            return false;
        }
        private bool HasAnonymousAttribute(HttpRequestMessage request)
        {
            return (request.GetActionDescriptor().GetCustomAttributes<AllowAnonymousAttribute>().Any()
                          || request.GetActionDescriptor().ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any());
        }
    }
}
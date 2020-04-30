using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using NuoJinFirst.JwtTools;
using NuoJinFirst.Models.Auth;


namespace NuoJinFirst.Fiultes
{
    public class MyauthAttribute : Attribute, IAuthorizationFilter
    {
        public bool AllowMultiple { get; }


        public async Task<HttpResponseMessage> ExecuteAuthorizationFilterAsync(HttpActionContext actionContext, CancellationToken cancellationToken, Func<Task<HttpResponseMessage>> continuation)
        {
            IEnumerable<string> headres;
            if (actionContext.Request.Headers.TryGetValues("token", out headres))
            {

                var LoginNmae =Jwttool.EnDecode(headres.First())["LoginName"].ToString();
                var UserId = int.Parse(Jwttool.EnDecode(headres.First())["UserId"].ToString());
                (actionContext.ControllerContext.Controller as ApiController).User = new ApplicationUser(LoginNmae, UserId);
                return await continuation();
            }
            return new HttpResponseMessage(HttpStatusCode.Unauthorized);
        }
    }
}
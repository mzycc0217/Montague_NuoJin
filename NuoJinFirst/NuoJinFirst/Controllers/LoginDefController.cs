using NuoJinFirst.Models.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace NuoJinFirst.Controllers
{

    [RoutePrefix("Api/logins")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LoginDefController : ApiController
    {
       private DB_CateringEntities db = new DB_CateringEntities();
        /// <summary>
        /// 获取角色
        /// </summary>
        /// <returns></returns>
        [Route("jaose")]
        [HttpGet]
        public async Task<IHttpActionResult> ActionResult()
        {
            var list =await Task.Run(()=> from p in db.User_Type_T
                       select new
                       {
                           p.User_TyID,
                           p.User_TyName,
                           p.Icon,
                       });

            return Json(list);
           // return Json(list);
            

        }
    }
}

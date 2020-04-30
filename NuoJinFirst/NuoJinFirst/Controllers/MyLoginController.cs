using NuoJinFirst.Fiultes;
using NuoJinFirst.Models.Auth;
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


    [RoutePrefix("Api/Login")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MyLoginController : ApiController
    {

       
        private DB_CateringEntities db = new DB_CateringEntities();
        /// <summary>
        /// 我的页面
        /// </summary>
        /// <returns></returns>
         [Myauth]
        [HttpGet]
        [Route("my")]
        public async Task< IHttpActionResult> httpActionResult()
        {
            int id = ((UserIdentity)User.Identity).Id;
            var list = await Task.Run(()=> from p in db.User_Information_T.Where(p=>p.User_ID == id)
                       join s in db.User_Vip_T on p.User_ID equals s.User_Vip_ID
                       select new
                       {
                           
                           p.User_Bieming,
                           p.User_Image,
                           p.User_Phone,
                           s.User_Vip_Name,

                       });
            return Json(list);
        }
    }
}

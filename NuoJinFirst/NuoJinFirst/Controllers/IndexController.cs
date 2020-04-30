using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using NuoJinFirst.Fiultes;
using NuoJinFirst.Models.Auth;
using NuoJinFirst.Models.DB;
namespace NuoJinFirst.Controllers
{
    [RoutePrefix("Api/Index")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class IndexController : ApiController
    {
        private DB_CateringEntities db = new DB_CateringEntities();
        [Route("defalut")]
       [Myauth]
        public IHttpActionResult GetAll(int News_Type_ID)
        {
            //首页新闻显示
            //根据个人id  ->  角色 -> 新闻类型 -> 新闻 
            int id = ((UserIdentity)User.Identity).Id;
            var rest = from p in db.User_Information_T.Where(p => p.User_ID == id)
                       join u in db.User_Type_T on p.User_TyID equals u.User_TyID
                      join s in db.News_T on u.User_TyID equals s.User_TyID where s.News_Type_ID==News_Type_ID
                      select new {
                           s.News_Type_ID,
                           s.News_Title,
                           s.News_Image,
                           s.News_ID,
                           s.News_Describe,
                           s.News_Releasetime
                          // children =s
                       };
            return Json(rest);
        }
        [Route("Header")]
        [HttpGet]
       // [Myauth]
        public IHttpActionResult Headerl()
        {
            var list = from p in db.News_Type_T
                       select new
                       {
                           p.News_Type_ID,
                           p.News_Type_Name
                       };
            return Json(list);
        }
    }
}

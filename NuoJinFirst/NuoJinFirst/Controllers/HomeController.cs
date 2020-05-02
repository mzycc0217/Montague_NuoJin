using NuoJinFirst.Fiultes;
using NuoJinFirst.Models.Auth;
using NuoJinFirst.Models.DB;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace NuoJinFirst.Controllers
{
    [RoutePrefix("Api/Home")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HomeController : ApiController
    { 
        public long? idd { get; set; }
        private DB_CateringEntities db = new DB_CateringEntities();
        /// <summary>
        /// 资讯发布
        /// </summary>
        /// <returns></returns>
        [Route("content")]
       // [Myauth]

        [HttpPost]
       
        public async Task<IHttpActionResult>  AllForm()

        {




            if (!Request.Content.IsMimeMultipartContent())
            {
                return Json(new { messg = "您的信息为空" });
            }
            else
            {
                var s = DateTime.Now.ToString();
            HttpPostedFile file = HttpContext.Current.Request.Files["file"];

            string News_Title = HttpContext.Current.Request["News_Title"];
            string News_Content = HttpContext.Current.Request["News_Content"];
            string News_Describe = HttpContext.Current.Request["News_Describe"];
            int News_Type_ID = int.Parse(HttpContext.Current.Request["News_Type_ID"].ToString());
            string name = file.FileName;
            string[] names = name.Split('.');
            string filest = names[names.Length - 1];
            string sts = s.Replace('/', '0');
            string stsc = sts.Replace(' ', '0');
            string stscd = stsc.Replace(':', '0');
            string st = stscd + "." + filest;
            string path = HttpContext.Current.Server.MapPath("~/image/");

            file.SaveAs(path + st);
            int id = ((UserIdentity)User.Identity).Id;
            var list = from T in db.User_Information_T.Where(T => T.User_ID == id) select T;
            foreach (var item in list)
            {
                this.idd = item.User_TyID;
            }
            var time = DateTime.Now;
            News_T news = await Task.Run(() => new News_T
            {
                User_ID = id,
                User_TyID =this.idd,
                 News_Type_ID = News_Type_ID,//自己选择
                News_Title = News_Title,
                News_Describe = News_Describe,
                News_Content = News_Content,
                News_IsorNo = "0",
                News_Releasetime = time,
                News_Image = "/image/" + st,

            }) ;
            db.News_T.Add(news);
            if (db.SaveChanges() > 0)
            {
                return Json(new { messg = "更新成功" });
            }
            else



                return Json(new { messg = "更新失败" });
            }
 
        }
        [Route("Allpage")]
        // [Myauth]
        [HttpGet]
        public IHttpActionResult Allpage()
        {
           // int id = 1;
            //if (guoluo.page.Stu(1) == false)
            //{
            //    return Json(new { messge = "您没有权限", code = 300 });
            //}

            //else
            //{
                return Json(new { code = 200 });
            //}

        }
    }
}

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

    [RoutePrefix("Api/Myedit")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MyEditController : ApiController
    {
        private DB_CateringEntities db = new DB_CateringEntities();
        /// <summary>
        /// 查看个人发布帖子
        /// </summary>
        /// <returns></returns>
        [Route("Alledit")]
        // [Myauth]
        [HttpGet]
        public async Task< IHttpActionResult> GetsAll()
        {
           // int id = ((UserIdentity)User.Identity).Id;
          
            var res = await Task.Run(()=> from p in db.News_T.Where(p => p.User_ID == 1) select new {
                
                p.News_ID,
                p.News_Title,
                p.News_Image,
                p.News_Content,
                p.News_Describe,
                p.News_Releasetime,
            
            });
            var ts = res.Count();
            return Json(new {Data=res, count=ts });

        }
        /// <summary>
        /// 行业文章
        /// </summary>
        /// <returns></returns>
        //[Route("Edit")]
        //// [Myauth]
        //[HttpGet]
        //public async Task<IHttpActionResult> AllGets()
        //{
        //    // int id = ((UserIdentity)User.Identity).Id;
        //   // var list=from p in db.User_Information_T.Where(p=>p.)

        //}
        /// <summary>
        /// 添加评论
        /// </summary>
        /// <returns></returns>
        [Route("Alledits")]
        // [Myauth]
        [HttpPost]
        public async Task<IHttpActionResult> SetsAlls(Pinglun_T pinglun)
        {
            try
            {
                if (pinglun != null)
                {


                    //   int id = ((UserIdentity)User.Identity).Id;     
                    var ad = DateTime.Now;

                    Pinglun_T pinglun_T1 = await Task.Run(() => new Pinglun_T
                    {
                        Pinglun_Countent = pinglun.Pinglun_Countent,
                        Pinglun_time = ad,
                        Shop_Information_Id = 2,
                        User_ID = 1



                    });
                    db.Pinglun_T.Add(pinglun_T1);
                    if (db.SaveChanges() > 0)
                    {
                        return Json(new { code = 200 });
                    }
                    else
                    {
                        return Json(new { code = 400 });
                    }

                }
                else
                {
                    return Json(new { code = 401 });
                }
            



            }
            catch (Exception ex)
            {

                return Json(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message));
            }


        }


        /// <summary>
        /// 删除评论
        /// </summary>
        /// <returns></returns>
        //[Route("Deletedits")]
        //// [Myauth]
        //[HttpPost]
        //public async Task<IHttpActionResult> Setsping(int id)
        //{
        //    try
        //    {
        //        if (id != null)
        //        {
        //        //   int id = ((UserIdentity)User.Identity).Id; 
                


        //        }



        //    }
        //    catch (Exception ex)
        //    {

        //        return Json(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message));
        //    }


        //}

    }
}

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
    [RoutePrefix("Api/getInfor")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HuoQuController : ApiController
    {
        private DB_CateringEntities db = new DB_CateringEntities();

        /// <summary>
        /// 获取文章
        /// </summary>
        /// <returns></returns>
        [Route("Content")]
        [HttpGet]
        public async Task<IHttpActionResult> GetwenZhang()
        {
            // int id = ((UserIdentity)User.Identity).Id;
            
            var list =await Task.Run(()=>from s in db.wenzhang_T  orderby  s.wenzhang_number descending select new { 
            s.wenzhang_Content,
            s.wenzhang_Describe,
            s.wenzhang_image,
            s.wenzhang_time,
            s.wenzhang_title,
            s.wenzhang_number
            
            
            } );
            return Json(list);
          
        
        }
        /// <summary>
        /// 获取video
        /// </summary>
        /// <returns></returns>

        [Route("Contents")]
        [HttpGet]
        public async Task<IHttpActionResult> GetVideo()
        {
            // int id = ((UserIdentity)User.Identity).Id;

            var list = await Task.Run(() => from s in db.Video_T
                                            orderby s.Video_number descending
                                            select new
                                            {
                                               s.Video_number,
                                               s.Video_title,
                                               s.Video_Content,
                                               s.Video_time,
                                                s.Video_image



                                            });
            return Json(list);


        }



        [Route("setZan")]
        [HttpGet]
        public async Task<IHttpActionResult> setZan(int id)
        {
            // int id = ((UserIdentity)User.Identity).Id;

        }


    }
}

using NuoJinFirst.Models.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace NuoJinFirst.Controllers
{

    [RoutePrefix("Api/Fabu")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class FabuController : ApiController
    {



        private DB_CateringEntities db = new DB_CateringEntities();
        /// <summary>
        /// 文章发布
        /// </summary>
        /// <returns></returns>
        // [Myauth]
        [Route("Content")]
        [HttpPost]
        public async Task<IHttpActionResult> Setwenzhang()

        {

            if (!Request.Content.IsMimeMultipartContent())
            {
                return Json(new { messg = "您的信息为空" });
            }
            else
            {
                var s = DateTime.Now.ToString();
                HttpPostedFile file = HttpContext.Current.Request.Files["file"];

                string wenzhang_title = HttpContext.Current.Request["wenzhang_title"];
                string wenzhang_Content = HttpContext.Current.Request["wenzhang_Content"];
                string wenzhang_Describe = HttpContext.Current.Request["wenzhang_Describe"];
                
                string name = file.FileName;
                string[] names = name.Split('.');
                string filest = names[names.Length - 1];
                string sts = s.Replace('/', '0');
                string stsc = sts.Replace(' ', '0');
                string stscd = stsc.Replace(':', '0');
                string st = stscd + "." + filest;
                string path = HttpContext.Current.Server.MapPath("~/image/image_wenzhang/");
                file.SaveAs(path + st);
                // int id = ((UserIdentity)User.Identity).Id;
              
                var time = DateTime.Now;
                var wenzhang = await Task.Run(() => new wenzhang_T
                {
                    User_ID = 1,
                   wenzhang_title= wenzhang_title,
                   wenzhang_Content = wenzhang_Content,
                    wenzhang_Describe = wenzhang_Describe,
                    wenzhang_image = "/image/image_wenzhang/" + st,
                    wenzhang_time=time

                });
                db.wenzhang_T.Add(wenzhang);
               
                if (db.SaveChanges() > 0)
                {
                    return Json(new { messg = "更新成功" });
                }
                else



                    return Json(new { messg = "更新失败" });
            }
}

        /// <summary>
        /// 视频发布
        /// </summary>
        /// <returns></returns>
        [Route("Contents")]
        [HttpPost]
        public async Task<IHttpActionResult> SetVideo()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                return Json(new { messg = "您的信息为空" });
            }
            else
            {
                var s = DateTime.Now.ToString();
                // int id = ((UserIdentity)User.Identity).Id;
                HttpPostedFile file = HttpContext.Current.Request.Files["file"];
                string Video_title= HttpContext.Current.Request["Video_title"];
                string Video_Content = HttpContext.Current.Request["Video_Content"];

                string name = file.FileName;
                string[] names = name.Split('.');
                string filest = names[names.Length - 1];
                string sts = s.Replace('/', '0');
                string stsc = sts.Replace(' ', '0');
                string stscd = stsc.Replace(':', '0');
                string st = stscd + "." + filest;
                string path = HttpContext.Current.Server.MapPath("~/Video/video_user/");
                file.SaveAs(path + st);
                var time = DateTime.Now;
                Video_T video_T = await Task.Run(() => new Video_T
                {
                    User_ID=1,
                    Video_time= time,
                    Video_title=Video_title,
                    Video_Content = Video_Content,
                    Video_image= "/Video/video_user/"+st

                }) ;
                db.Video_T.Add(video_T);

                if (db.SaveChanges() > 0)
                {
                    return Json(new { messg = "更新成功" });
                }
                else



                    return Json(new { messg = "更新失败" });

            }

            }
        /// <summary>
        /// 设置地址
        /// </summary>
        /// <param name="adddress_T"></param>
        /// <returns></returns>


        [Route("SetAddress")]
        [HttpPost]
        public async Task<IHttpActionResult> SetAddress(Adddress_T adddress_T)
        {
            // int id = ((UserIdentity)User.Identity).Id;
            var address_T =await Task.Run(()=> new Adddress_T
            {
                Address_City = adddress_T.Address_City,//省市县地址
                Address_Diqu = adddress_T.Address_Diqu,//详细地址
                Address_Lianxiren = adddress_T.Address_Lianxiren,//联系人
                Address_Phone = adddress_T.Address_Phone,//联系人电话
                User_ID = 1,//对应id

            });
            db.Adddress_T.Add(adddress_T);
            if (db.SaveChanges() > 0)
            {
                return Json(new { code = 200 });
            }
            else
                return Json(new { code = 400 });



        }
        /// <summary>
        /// 删除地址
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Route("delAddress")]
        [HttpPost]
        public async Task<IHttpActionResult> delAddress(int? id)
        {
            // int id = ((UserIdentity)User.Identity).Id;
            if (id!=null)
            {
                var res =await Task.Run(()=> db.Adddress_T.Find(id));
                if (res!=null)
                { 
                    db.Adddress_T.Remove(res);

                    if (db.SaveChanges() > 0)
                    {
                        return Json(new { code = 200 });
                    }
                    else
                        return Json(new { code = 400 });
                   
                }
                else
                {
                    return Json(new { message = "没有这个消息" });
                }
              
                
            }
            else
            {
                return Json(new { code = 400 });
            }



        }

        /// <summary>
        /// 修改地址
        /// </summary>
        /// <param name="adddress"></param>
        /// <returns></returns>

        [Route("xiuAdress")]
        [HttpPost]
        public async Task<IHttpActionResult> xiuAdress(Adddress_T adddress)
        {
            // int id = ((UserIdentity)User.Identity).Id;
            if (adddress != null)
            {
                var res = await Task.Run(() =>db.Adddress_T.Where(p=>p.Address_Id == adddress.Address_Id).ToList());
                foreach (var item in res)
                {
                    item.Address_City = adddress.Address_City;
                    item.Address_Diqu = adddress.Address_Diqu;
                    item.Address_Lianxiren = adddress.Address_Lianxiren;
                    item.Address_Phone = adddress.Address_Phone;
                }
                if (db.SaveChanges()>0)
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
                return Json(new { code = 400,message="修改信息为空" });
            }



        }

        /// <summary>
        /// 获取地址
        /// </summary>
        /// <returns></returns>

        [Route("GetAdress")]
        [HttpPost]
        public async Task<IHttpActionResult> GetAdress()
        {
            try
            {  
                // int id = ((UserIdentity)User.Identity).Id;
             var list =await Task.Run(()=> db.Adddress_T.Where(s => s.User_ID == 1));
            return Json(list);
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
          
           


        }


    }
}

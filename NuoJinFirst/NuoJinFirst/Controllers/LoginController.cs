using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using NuoJinFirst.Models.Auth;
using NuoJinFirst.Models.DB;

namespace NuoJinFirst.Controllers
{
    [RoutePrefix("Api/Login")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LoginController : ApiController
    {
        private DB_CateringEntities db = new DB_CateringEntities();
        [Route("login")]
        [HttpPost]
        public async Task<IHttpActionResult> Login(User_Information_T information_T)
        {


            string s = DateTime.Now.ToString();
            if (ModelState.IsValid)
            {
                var rest =await Task.Run(()=>db.User_Information_T.Where(p => p.User_Name == information_T.User_Name && p.User_PassWord == information_T.User_PassWord).ToList());
            
                
                foreach (var T in rest)
                {
                   
                    var t = (T.User_ID).ToString();
                    if (new RedisHelper().IsSet(t) == false)
                    {

                        T.User_JIfen = T.User_JIfen + 20;
                        if (db.SaveChanges()>0) {
                        
                         new RedisHelper().Set(t, s, 1);
                        }
                        else
                        {
                           
                           return Json(new { code = 400 }) ;
                        }
                        
                  
                       
                    
                    //  var LoginName = user_T.User_Name;
                    return Ok(new ReponseData()
                    {
                        Data = JwtTools.Jwttool.Encode(new Dictionary<string, object>()
                  {
                                 {"LoginName",T.User_Name },
                                  {"UserId",T.User_ID}
                  }),
                        LoginName = T.User_Bieming,
                        images = T.User_Image
                    });
                    }
                    else
                    {
                          return Ok(new ReponseData()
                        {
                            Data = JwtTools.Jwttool.Encode(new Dictionary<string, object>()
                  {
                                 {"LoginName",T.User_Name },
                                  {"UserId",T.User_ID}
                  }),
                            LoginName = T.User_Bieming,
                            images = T.User_Image
                        });
                    }
                }
            }
           


            return Ok(new ReponseData() { Code = 500, ErrorMessage = "账号密码有误" });
        }
        [Route("loginss")]
        [HttpGet]
        // [Myauth]
        public async Task<IHttpActionResult> DefLogin()
        {
          //  int id = ((UserIdentity)User.Identity).Id;
            var res = await Task.Run(() => (from p in db.User_Information_T.Where(p => p.User_ID ==1)
                                            select new
                                            {
                                                p.User_Image,
                                                p.User_JIfen,
                                                p.User_Bieming,
                                                

                                            }));
            return Json(res);
        }
        }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using JWT;
using JWT.Serializers;
using JWT.Algorithms;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace NuoJinFirst.JwtTools
{
    public class Jwttool
    {
        public static string Key { get; set; } = "nuojinkejiyouxiangongsi";
        
        public static string Encode(Dictionary<string, object> payload, string key =null)
        {
            if (string.IsNullOrEmpty(key))
            {
                key = Key;
            }
            var secret = key;
            IJwtAlgorithm algorithm = new HMACSHA256Algorithm();//256加密算法
            IJsonSerializer serializer = new JsonNetSerializer();//加密器，json序列化
            IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
            IJwtEncoder jwtEncoder = new JwtEncoder(algorithm, serializer, urlEncoder);
            payload.Add("timeout", DateTime.Now.AddDays(1));
            return jwtEncoder.Encode(payload, key);
        }
        public static Dictionary<string, object> EnDecode(string jwtStr,string key=null)
        {
            if (string.IsNullOrEmpty(key))
            {
                key = Key;
            }
            try
            {
                IJsonSerializer serializer = new JsonNetSerializer();
                IDateTimeProvider provider = new UtcDateTimeProvider();
                IJwtValidator validator = new JwtValidator(serializer, provider);
                IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
                IJwtDecoder decoder = new JwtDecoder(serializer, validator, urlEncoder);
                var json = decoder.Decode(jwtStr, key,verify:true);
                //把一个字符串反向生成对应的对象内容
               var reslut= JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                if ((DateTime)reslut["timeout"] < DateTime.Now)
                    throw new Exception("jwt已经过期，请重新登陆");
                reslut.Remove("timeout");
                return reslut;

            }
            catch (TokenExpiredException)
            {
                
                throw;
            }
            catch (SignatureVerificationException)
            {
               
                throw;
            }
        }

       
        //public static string ValideLogined(HttpRequestHeaders headers)
        //{
        //    if (headers.GetValues("token") == null || !headers.GetValues("token").Any()) 
        //       throw new Exception("请登录");
        //    return EnDecode(headers.GetValues("token").First(),key);
            
        //}




    }
}
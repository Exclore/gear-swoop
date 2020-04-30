using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NLua;

namespace GearSwop
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var items = LoadLuaResource("./Temp/items.lua");
            var itemDescriptions = LoadLuaResource("./Temp/item_descriptions.lua");

            var id = 22063;
            Console.WriteLine(items[id]["en"]);
            Console.WriteLine(itemDescriptions[id]["en"]);
            CreateHostBuilder(args).Build().Run();
        }

        private static Dictionary<int, Dictionary<string, string>> LoadLuaResource(string filepath)
        {
            var lua = new Lua();
            lua.LoadCLRPackage();
            var result = lua.DoFile(filepath);
            LuaTable resultLuaTable = (LuaTable)result[0];
            
            var items = new Dictionary<int, Dictionary<string, string>>();
            Dictionary<object, object> itemsDict = lua.GetTableDict(resultLuaTable);
            foreach (KeyValuePair<object, object> itemPair in itemsDict)
            {
                Dictionary<object, object> objectDict = lua.GetTableDict((LuaTable) itemPair.Value);
                var json = JsonConvert.SerializeObject(objectDict);
                var item = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
                items[Int32.Parse(item["id"])] = item;
            }

            return items;
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }
}
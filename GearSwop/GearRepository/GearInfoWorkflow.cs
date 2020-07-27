using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Newtonsoft.Json;

namespace GearSwop.GearRepository
{
    
    public interface IGearInfoWorkflow
    {
        Item GetGearInfo(int itemId);
        Dictionary<int, Item> ParseItemJson();
        List<ItemMap> GetItemMap();
        List<string> GetGearSuggestions(string job, string slot, string query);
    }
    
    public class GearInfoWorkflow: IGearInfoWorkflow
    {
        private Dictionary<int, Item> AllItems;
        private List<ItemMap> MappedItems;
        
        public GearInfoWorkflow()
        {
            AllItems = ParseItemJson();
            MappedItems = MapItems(AllItems);
        }

        public List<string> GetGearSuggestions(string job, string slot, string query)
        {
            if(slot == "Ear1")
            {
                slot = "Left Ear";
            }
            if(slot == "Ear2")
            {
                slot = "Right Ear";
            }
            if (slot == "Ring1")
            {
                slot = "Left Ring";
            }
            if(slot == "Ring2")
            {
                slot = "Right Ring";
            }
            query = query.ToLower();
            var reducedMap = MappedItems.Where(x => x.Jobs.Contains(job))
                .Where(x => x.ItemSlot.Contains(slot))
                .Where(x => x.ItemLongName.ToLower().StartsWith(query) || x.ItemShortName.ToLower().StartsWith(query))
                .ToList();

            return reducedMap.Select(x => x.ItemLongName).ToList();
        }
        
        public Item GetGearInfo(int itemId)
        {
            return AllItems[itemId];
        }

        public List<ItemMap> GetItemMap()
        {
            return MappedItems;
        }

        public List<ItemMap> MapItems(Dictionary<int, Item> dictionary)
        {
            var result = new List<ItemMap>();
            foreach (var item in dictionary)
            {
                result.Add(new ItemMap
                {
                    ItemId = item.Key,
                    ItemShortName = item.Value.Name,
                    ItemLongName = item.Value.LName,
                    ItemSlot = item.Value.Slots,
                    Jobs = item.Value.Jobs
                });
            }

            return result;
        }

        public Dictionary<int, Item> ParseItemJson()
        {
            const string filePath = @"./GearRepository/items.json";
            var streamReader = File.OpenText(filePath);
            var itemsText = streamReader.ReadToEnd();

            return JsonConvert.DeserializeObject<Dictionary<int, Item>>(itemsText);
        }
    }

    public class ItemMap
    {
        public int ItemId { get; set; }
        public string ItemShortName { get; set; }
        public string ItemLongName { get; set; }
        public List<string> ItemSlot { get; set; }
        public List<string> Jobs { get; set; }
    }
    
}
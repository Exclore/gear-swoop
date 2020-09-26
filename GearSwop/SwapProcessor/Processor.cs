using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text.RegularExpressions;
using GearSwop.Controllers;

namespace GearSwop.SwapProcessor
{
    public interface IProcessor
    {
        Swap ProcessGearSwap(GearSwapRequest request);
    }
    
    public class Processor: IProcessor
    {
        public Swap ProcessGearSwap(GearSwapRequest request)
        {
            return new Swap
            {
                CharacterName = request.CharacterName,
                Job = request.CharacterJob,
                FileContent = GenerateLua(request.CharacterJob, request.GearSets)
            };
        }

        private string GenerateLua(string job, List<GearSet> sets)
        {
            var baseText = GetJobFile(job);
            var setLuas = GenerateGearSetLua(sets);
            var regex = new Regex(Regex.Escape("--[[%%GearsetsAnchor%%]]"));
            var finalLuaText = regex.Replace(baseText, String.Join("\n\n", setLuas.ToArray()), 1);

            return finalLuaText;
        }
    
        private List<string> GenerateGearSetLua(List<GearSet> rawSets)
        {
            var keyMap = new Dictionary<string, string>{
                ["Main"] = "main",
                ["Sub"] = "sub",
                ["Ranged"] = "range",
                ["Ammo"] = "ammo",
                ["Head"] = "head",
                ["Body"] = "body",
                ["Hands"] = "hands",
                ["Legs"] = "legs",
                ["Feet"] = "feet",
                ["Neck"] = "neck",
                ["Waist"] = "waist",
                ["LeftEar"] = "left_ear",
                ["RightEar"] = "right_ear",
                ["LeftRing"] = "left_ring",
                ["RightRing"] = "right_ring",
                ["Back"] = "back",

            };
            var luaSets = new List<string>();

            foreach(GearSet rawSet in rawSets)
            {
                
                var processedSet = $"\tsets.{rawSet.Mode}.{rawSet.SetName} = {{";
                foreach(string key in keyMap.Keys.ToArray<string>())
                {
                    var item = (GearItem)rawSet.GetType().GetProperty(key).GetValue(rawSet);
                    if (item != null)
                    {
                        if (item?.Augments == "" || item?.Augments == null)
                        {
                            processedSet += $"\n\t\t{keyMap[key]}=\"{item.Name}\",";
                        }
                        else
                        {
                            processedSet += $"\n\t\t{keyMap[key]}={{name=\"{item.Name}\",augments={{{item.Augments}}}}},";
                        }
                    }
                }
                processedSet += $"\n\t}}";
                luaSets.Add(processedSet);
            }

            return luaSets;
        }

        private string GetJobFile(string job)
        {
            return File.ReadAllText($"./BaseLuas/{job}.lua");
        }
    }
}


/*
 *             foreach(GearSet rawSet in rawSets)
            {
                var processedSet = $@"sets.{rawSet.Mode}.{rawSet.SetName} = {{
    main=""{rawSet.Main?.Name}{(rawSet.Main.Augments ? "augments=""{rawSet.Main.Augments}""" : "")}"",
    {Boolean.Parse(rawSet.Main.Augments) ? : main="{rawSet.Sub?.Name}",}
    sub =""{rawSet.Sub?.Name}"",
    ranged=""{rawSet.Ranged?.Name}"",
    ammo=""{rawSet.Ammo?.Name}"",
    head=""{rawSet.Head?.Name}"",
    body=""{rawSet.Body?.Name}"",
    hands=""{rawSet.Hands?.Name}"",
    legs=""{rawSet.Legs?.Name}"",
    feet=""{rawSet.Feet?.Name}"",
    neck=""{rawSet.Neck?.Name}"",
    waist=""{rawSet.Waist?.Name}"",
    left_ear=""{rawSet.LeftEar?.Name}"",
    right_ear=""{rawSet.RightEar?.Name}"",
    left_ring=""{rawSet.LeftRing?.Name}"",
    right_ring=""{rawSet.RightRing?.Name}"",
    back=""{rawSet.Back?.Name}"",
}}";
*/
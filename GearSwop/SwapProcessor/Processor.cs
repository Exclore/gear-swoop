using System;
using System.Collections.Generic;
using System.IO;
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
            var luaSets = new List<string>();

            foreach(GearSet rawSet in rawSets)
            {
                var processedSet = $@"sets.{rawSet.Mode}.{rawSet.SetName} = {{
    main=""{rawSet.Main}"",
    sub=""{rawSet.Sub}"",
    ranged=""{rawSet.Ranged}"",
    ammo=""{rawSet.Ammo}"",
    head=""{rawSet.Head}"",
    body=""{rawSet.Body}"",
    hands=""{rawSet.Hands}"",
    legs=""{rawSet.Legs}"",
    feet=""{rawSet.Feet}"",
    neck=""{rawSet.Neck}"",
    waist=""{rawSet.Waist}"",
    left_ear=""{rawSet.LeftEar}"",
    right_ear=""{rawSet.RightEar}"",
    left_ring=""{rawSet.LeftRing}"",
    right_ring=""{rawSet.RightRing}"",
    back=""{rawSet.Back}"",
}}";
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

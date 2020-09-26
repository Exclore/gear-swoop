namespace GearSwop
{
    public class GearSet
    {
        public string Mode { get; set; }
        public string SetName { get; set; }
        public GearItem Main { get; set; }
        public GearItem Sub { get; set; }
        public GearItem Ranged { get; set; }
        public GearItem Ammo { get; set; }
        public GearItem Head { get; set; }
        public GearItem Body { get; set; }
        public GearItem Hands { get; set; }
        public GearItem Legs { get; set; }
        public GearItem Feet { get; set; }
        public GearItem Neck { get; set; }
        public GearItem Waist { get; set; }
        public GearItem LeftEar { get; set; }
        public GearItem RightEar { get; set; }
        public GearItem LeftRing { get; set; }
        public GearItem RightRing { get; set; }
        public GearItem Back { get; set; }
    }

    public class GearItem
    {
        public string Name { get; set; }
        public string Augments { get; set; }
    }
}

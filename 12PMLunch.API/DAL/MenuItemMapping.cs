//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace _12PMLunch.API.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class MenuItemMapping
    {
        public int MenuItemMappingId { get; set; }
        public int ItemId { get; set; }
        public string ItemType { get; set; }
        public decimal ItemPrice { get; set; }
        public int SortOrder { get; set; }
        public int MenuTypeId { get; set; }
    
        public virtual Item Item { get; set; }
        public virtual MenuType MenuType { get; set; }
    }
}

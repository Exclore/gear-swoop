-- Initialization function for this job file.
function get_sets()
    mote_include_version = 2
    include('Mote-Include.lua')
end
 
function binds_on_load()

end
 
function user_setup()
    -- Options: Override default values
    state.OffenseMode:options('Normal', 'LowAcc', 'MidAcc', 'HighAcc')
    state.WeaponskillMode:options('Normal', 'Acc')
    state.HybridMode:options('Normal', 'PDT')
    state.CastingMode:options('Normal', 'Resistant')
    state.IdleMode:options('Normal','PDT')
    state.PhysicalDefenseMode:options('PDT', 'MDT')
        
    update_combat_form()
end
 
-- Called when this job file is unloaded (eg: job change)
function file_unload()

end
 
-- Define sets and vars used by this job file.
function init_gear_sets()
	--[[%%GearsetsAnchor%%]]
end
 
-- Job-specific hooks for standard casting events.
function job_midcast(spell, action, spellMap, eventArgs)
  
end
 
-- Called when the player's status changes.
function job_state_change(field, new_value, old_value)
 
end
 
function update_combat_form()
    -- Check Weapontype
    if  Rag_weapons:contains(player.equipment.main) then
        state.CombatForm:set('Ragnarok')
    elseif
        Shield_weapons:contains(player.equipment.sub) then
        state.CombatForm:set('Blurred')
    else
        state.CombatForm:reset()
    end
end
 
function job_update(cmdParams, eventArgs)
    update_combat_form()
end
 
-- Called by the 'update' self-command, for common needs.
-- Set eventArgs.handled to true if we don't want automatic equipping of gear.
function job_update(cmdParams, eventArgs)
    update_combat_form()
end
 
-- eventArgs is the same one used in job_precast, in case information needs to be persisted.
moonshade_WS = S{"Resolution", "Torcleaver"}
 
function job_post_precast(spell, action, spellMap, eventArgs)
    if spell.type == 'WeaponSkill' then
        if world.time >= (17*60) or world.time <= (7*60) then
            equip({ear1="Lugra Earring +1",ear2="Lugra Earring"})
        end
        if moonshade_WS:contains(spell.english) and player.tp<2950 then  
            equip({ear2="Moonshade Earring"})
        end
        if buffactive['Mighty Strikes'] then 
            if sets.precast.WS[spell] then
                equipSet = sets.precast.WS[spell]
                equipSet = set_combine(equipSet,sets.MS_WS)
                equip(equipSet)
            else
                equipSet = sets.precast.WS
                equipSet = set_combine(equipSet,sets.MS_WS)
                equip(equipSet)
            end
        end
    end
end
     
-- eventArgs is the same one used in job_midcast, in case information needs to be persisted.
function job_post_midcast(spell, action, spellMap, eventArgs)
    if spellMap == 'Cure' and spell.target.type == 'SELF' then
        equip(sets.midcast.CureSelf)
    end
end
 
-- Select default macro book on initial load or subjob change.
function select_default_macro_book()
    -- Default macro set/book
    if player.sub_job == 'SAM' then
        set_macro_page(1, 7)
    elseif player.sub_job == 'NIN' then
        set_macro_page(3, 7)
    elseif player.sub_job == 'RDM' then
        set_macro_page(4, 7)
    elseif player.sub_job == 'THF' then
        set_macro_page(2, 7)
    else
        set_macro_page(1, 7)
    end
end
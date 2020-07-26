--[[ Info
Commands
	//gs debugmode
	//gs showswaps
	//gs validate - looks for gear in your sets that isnt in inventory.
--]]
--[[ Self-Skillchains

    Light
	2-Step	Geirskogul → Geirskogul
	2-Step	Camlann's Torment → Camlann's Torment
	3-Step	Camlann's Torment → Drakesbane / Wheeling Thrust → Camlann's Torment
	3-Step	Impulse Drive → Vorpal Thrust → Wheeling Thrust
	4-Step	Stardiver → Camlann's Torment → Drakesbane → Camlann's Torment
	6-Step 	Geirskogul → Sonic Thrust → Stardiver → Camlann's Torment → Drakesbane → Camlann's Torment
	7-Step	Stardiver → Sonic Thrust → Drakesbane → Stardiver → Camlann's Torment → Drakesbane → Camlann's Torment

	Dark
	2-Step	Stardiver → Stardiver = Dark
	
	Radiance (Requires Trishula)
	6-Step Geirskogul → Sonic Thrust → Stardiver → Camlann's Torment → Drakesbane → Camlann's Torment	
	
	Umbra (Requires Trishula)
	2-Step	Stardiver → Stardiver → Stardiver
	4-Step	Stardiver → Sonic Thrust → Stardiver → Stardiver
	5-Step	Penta Thrust → Stardiver → Sonic Thrust → Stardiver → Stardiver
--]]

-- Initialization function for this job file.
function get_sets()
    mote_include_version = 2
-- Load and initialize the include file.
    include('Mote-Include.lua')
end

-- Called when this job file is unloaded (eg: job change)
function file_unload()

end

-- Setup vars that are user-independent.
function job_setup()

	-- Dragoon buffs
	state.Buff['Fly High'] = buffactive['Fly High'] or false
    state.Buff['Spirit Surge'] = buffactive['Spirit Surge'] or false
	
	-- Samurai Buffs
    state.Buff.Hasso = buffactive.Hasso or false
    state.Buff.Seigan = buffactive.Seigan or false
    state.Buff.Sekkanoki = buffactive.Sekkanoki or false
	
	-- Dark Knight Buffs
	state.Buff['Dark Seal'] = buffactive['Dark Seal'] or false
	state.Buff['Last Resort'] = buffactive['Last Resort'] or false
	
	-- Warrior Buffs
	state.Buff.Defender = buffactive.Defender or false

	-- Misc. State Buffs
	state.Buff['Doom'] = buffactive['Doom'] or false
	state.Buff['Curse'] = buffactive['Curse'] or false
    state.Buff.Aftermath = buffactive.Aftermath or false
    state.Buff.Souleater = buffactive.Souleater or false

	-- Define Weapons for Custom Sets

	Relic_weapons = S{'Gungnir'}
	Mythic_weapons = S{'Ryunohige'}
	Empyrean_weapons = S{'Rhongomiant'}
	Aeonic_weapons = S{'Trishula'}
	Dual_weapons = S{'Naegling'}

	get_combat_form()
	get_combat_weapon()

end

-- Setup vars that are user-dependent.
function user_setup()
    state.OffenseMode:options('Normal', 'Acc', 'MidAcc', 'MaxAcc')
	state.HybridMode:options('Normal', 'Hybrid','DamageTaken')
    state.IdleMode:options('Normal','DamageTaken', 'Refresh')
	state.WeaponskillMode:options('Normal', 'Acc', 'MidAcc', 'MaxAcc')
end

-- Define sets and vars used by this job file.
function init_gear_sets()
	--[[%%GearsetsAnchor%%]]
end


-- Set eventArgs.handled to true if we don't want any automatic gear equipping to be done.
-- Set eventArgs.useMidcastGear to true if we want midcast gear equipped on precast.
function job_precast(spell, action, spellMap, eventArgs)

end


-- Job-specific hooks for standard casting events.
function job_midcast(spell, action, spellMap, eventArgs)
 
end


-- Set eventArgs.handled to true if we don't want any automatic gear equipping to be done.
function job_aftercast(spell, action, spellMap, eventArgs)
 
end

function job_post_aftercast(spell, action, spellMap, eventArgs)

end

---------------------------------------------------------------------
-- Customization hooks for idle and melee sets, after they've been automatically constructed.
---------------------------------------------------------------------

-- Called before the Include starts constructing melee/idle/resting sets.
-- Can customize state or custom melee class values at this point.
-- Set eventArgs.handled to true if we don't want any automatic gear equipping to be done.
function job_handle_equipping_gear(status, eventArgs)

end

---------------------------------------------------------------------
-- General hooks for other events.
---------------------------------------------------------------------

-- Called when the player's status changes.
function job_status_change(newStatus, oldStatus, eventArgs)

end

-- Called when a player gains or loses a buff.
-- buff == buff gained or lost
-- gain == true if the buff was gained, false if it was lost.
function job_buff_change(buff, gain)
	if state.Buff[buff] ~= nil then
        handle_equipping_gear(player.status)
    end
	if buff == "Doom" or buff == "Curse" then
		if gain then
			equip(sets.Doom)
			send_command('@input /p Doomed.')
			disable('ring1','ring2','waist')
		else
			enable('ring1','ring2','waist')
			handle_equipping_gear(player.status)
		end
	end
end

----------------------------------------------------------------------
-- User code that supplements self-commands.
-----------------------------------------------------------------------

-- Called by the 'update' self-command, for common needs.
-- Set eventArgs.handled to true if we don't want automatic equipping of gear.
function job_update(cmdParams, eventArgs)
	get_combat_form()
	get_combat_weapon()
end

----------------------------------------------------------------------
-- Utility functions specific to this job.
-----------------------------------------------------------------------
function get_combat_form()
    -- Check Weapontype
	if  Relic_weapons:contains(player.equipment.main) then
		state.CombatForm:set('Gungnir')
	elseif
		Empyrean_weapons:contains(player.equipment.main) then
		state.CombatForm:set('Rhongomiant')
	elseif
		Mythic_weapons:contains(player.equipment.main) then
		state.CombatForm:set('Ryunohige')
	elseif
		Aeonic_weapons:contains(player.equipment.main) then
		state.CombatForm:set('Trishula')
	elseif
		player.sub_job == 'NIN' or player.sub_job == 'DNC' and
		Dual_weapons:contains(player.equipment.main) then
		state.CombatForm:set('DualWield')
	else
		state.CombatForm:reset()
    end
end

function get_combat_weapon()
	if  Relic_weapons:contains(player.equipment.main) then
		state.CombatWeapon:set('Gungnir')
	elseif Empyrean_weapons:contains(player.equipment.main) then
		state.CombatWeapon:set('Rhongomiant')
	elseif Mythic_weapons:contains(player.equipment.main) then
		state.CombatWeapon:set('Ryunohige')
	elseif Aeonic_weapons:contains(player.equipment.main) then
		state.CombatForm:set('Trishula')
	else -- Use regular set.
		state.CombatWeapon:reset()
    end
end

function update_melee_groups()

end

-- Set eventArgs.handled to true if we don't want the automatic display to be run.
-- Handle notifications of general user state change.
function job_state_change(stateField, newValue, oldValue)

end

-- Modify the default idle set after it was constructed.
function customize_idle_set(idleSet)
    if state.Buff['Doom'] or state.Buff['Curse'] then
        idleSet = set_combine(idleSet, sets.Doom)
	end
	return idleSet
end

-- Modify the default melee set after it was constructed.
function customize_melee_set(meleeSet)
	if state.Buff['Doom'] or state.Buff['Curse'] then
		meleeSet = set_combine(meleeSet, sets.Doom)
	end
	return meleeSet
end

-- Select default macro book on initial load or subjob change.
function select_default_macro_book()
    -- Default macro set/book
    if player.sub_job == 'SAM' then
        set_macro_page(1, 1)
    elseif player.sub_job == 'WAR' then
        set_macro_page(2, 1)
    elseif player.sub_job == 'NIN' then
        set_macro_page(3, 1)
    elseif player.sub_job == 'DNC' then
        set_macro_page(4, 1)
    elseif player.sub_job == 'THF' then
        set_macro_page(5, 1)
    else
        set_macro_page(1, 1)
    end
end
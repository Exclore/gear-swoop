-- Initialization function for this job file.
function get_sets()
    mote_include_version = 2
	 -- Load and initialize the include file.
    include('Mote-Include.lua')
end

function binds_on_load()

end
 
-- Setup vars that are user-independent.
function job_setup()
    state.Buff.Aftermath = buffactive.Aftermath or false
    state.Buff.Souleater = buffactive.Souleater or false
	state.Buff['Dark Seal'] = buffactive['Dark Seal'] or false
	state.Buff['Last Resort'] = buffactive['Last Resort'] or false
	state.Buff['Doom'] = buffactive['Doom'] or false
	state.Buff['Curse'] = buffactive['Curse'] or false

	get_combat_form()
	get_combat_weapon()

	LowTierNuke = S{
		'Stone', 'Water', 'Aero', 'Fire', 'Blizzard', 'Thunder',
		'Stone II', 'Water II', 'Aero II', 'Fire II', 'Blizzard II', 'Thunder II',
		'Stone III', 'Water III', 'Aero III', 'Fire III', 'Blizzard III', 'Thunder III',
		'Stonega', 'Waterga', 'Aeroga', 'Firaga', 'Blizzaga', 'Thundaga',
		'Stonega II', 'Waterga II', 'Aeroga II', 'Firaga II', 'Blizzaga II', 'Thundaga II'}
		
	Absorbs = S{'Absorb-STR', 'Absorb-DEX', 'Absorb-VIT', 'Absorb-AGI', 'Absorb-INT', 'Absorb-MND', 'Absorb-CHR', 'Absorb-Attri', 'Absorb-ACC', 'Absorb-TP'}
		
end

-- Setup vars that are user-dependent.  Can override this function in a sidecar file.
function user_setup()
    -- Options: Override default values
    state.OffenseMode:options('Normal', 'LowAcc', 'MidAcc', 'HighAcc')
    state.WeaponskillMode:options('Normal', 'Acc', 'Fotia')
    state.HybridMode:options('Normal', 'DamageTaken')
    state.CastingMode:options('Normal', 'Resistant')
    state.IdleMode:options('Normal','DamageTaken')
end

-- Called when this job file is unloaded (eg: job change)
function file_unload()

end

-- Define sets and vars used by this job file.
function init_gear_sets()
	--[[%%GearsetsAnchor%%]]
end

function job_pretarget(spell, action, spellMap, eventArgs)
    if spell.type:endswith('Magic') and buffactive.silence then
        eventArgs.cancel = true
        send_command('input /item "Echo Drops" <me>')
    end
end

-- Set eventArgs.handled to true if we don't want any automatic gear equipping to be done.
-- Set eventArgs.useMidcastGear to true if we want midcast gear equipped on precast.
function job_precast(spell, action, spellMap, eventArgs)

end

function job_post_precast(spell, action, spellMap, eventArgs)
	-- Make sure abilities using head gear don't swap 
    if spell.type:lower() == 'weaponskill' then
        if player.tp > 2999 then
            equip(sets.BrutalLugra)
        else -- use Lugra + moonshade
		if world.time >= (17*60) or world.time <= (7*60) then
			equip(sets.Lugra)
		else
			-- do nothing.
		end
        end
    end
end


-- Job-specific hooks for standard casting events.
function job_midcast(spell, action, spellMap, eventArgs)
 
end

-- Run after the default midcast() is done.
-- eventArgs is the same one used in job_midcast, in case information needs to be persisted.
function job_post_midcast(spell, action, spellMap, eventArgs)
	if spellMap == 'Cure' and spell.target.type == 'SELF' then
		equip(sets.midcast.CureSelf)
	end
	if buffactive['Dark Seal'] and S{"Drain III"}:contains(spell.english)then
        equip({head="Fallen's Burgeonet +1"})
    end
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

-- Modify the default idle set after it was constructed.
function customize_idle_set(idleSet)
    if state.Buff['Doom'] or state.Buff['Curse'] then
        idleSet = set_combine(idleSet, sets.Doom)
	end
	return idleSet
end

-- Modify the default melee set after it was constructed.
function customize_melee_set(meleeSet)
	if state.Buff.Souleater then
		meleeSet = set_combine(meleeSet, sets.Souleater)
	end
	if state.Buff['Doom'] or state.Buff['Curse'] then
		meleeSet = set_combine(meleeSet, sets.Doom)
	end
	return meleeSet
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
	if buff == "Souleater" then
        handle_equipping_gear(player.status)
    end
	if buff == "Doom" or buff == "Curse" then
		if gain then
			equip(sets.doom)
		else
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
	if  Apoc_weapons:contains(player.equipment.main) then
		state.CombatForm:set('Apocalypse')
	elseif
		Anguta_weapons:contains(player.equipment.main) then
		state.CombatForm:set('Anguta')
	elseif
		GS_weapons:contains(player.equipment.main) then
		state.CombatForm:set('GreatSword')
	elseif
		Lib_weapons:contains(player.equipment.main) then
		state.CombatForm:set('Liberator')
	else
		state.CombatForm:reset()
    end
end

function get_combat_weapon()
	if  Apoc_weapons:contains(player.equipment.main) then
		state.CombatWeapon:set('Apocalypse')
	elseif Anguta_weapons:contains(player.equipment.main) then
		state.CombatWeapon:set('Anguta')
	elseif GS_weapons:contains(player.equipment.main) then
		state.CombatWeapon:set('GreatSword')
	elseif
		Lib_weapons:contains(player.equipment.main) then
		state.CombatForm:set('Liberator')
	else -- Use regular set.
		state.CombatWeapon:reset()
    end
end

-- Set eventArgs.handled to true if we don't want the automatic display to be run.
-- Handle notifications of general user state change.
function job_state_change(stateField, newValue, oldValue)

end

-- Custom spell mapping.
function job_get_spell_map(spell, default_spell_map)
	if spell.skill == 'Dark Magic' and Absorbs:contains(spell.english) then
		return 'Absorb'
	end

	if spell.skill == 'Elemental Magic' and default_spell_map ~= 'ElementalEnfeeble' then
		if LowTierNuke:contains(spell.english) then
			return 'LowTierNuke'
		else
			return 'HighTierNuke'
		end
	end
end

function select_earring()
    if world.time >= (17*60) or world.time <= (7*60) then
        return sets.Lugra
    else
        -- do nothing
    end
end

function update_melee_groups()

end

-- Select default macro book on initial load or subjob change.
function select_default_macro_book()
    -- Default macro set/book
    if player.sub_job == 'WAR' then
        set_macro_page(1, 2)
    elseif player.sub_job == 'RDM' then
        set_macro_page(2, 2)
    elseif player.sub_job == 'NIN' then
        set_macro_page(3, 2)
    elseif player.sub_job == 'THF' then
        set_macro_page(4, 2)
    else
        set_macro_page(1, 2)
    end
end
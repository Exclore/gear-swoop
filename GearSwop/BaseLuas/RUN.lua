
--==============================================================--
--      __                       ___                            --
--     /  |                     /                               --
--    (___|      ___  ___      (___  ___  ___  ___  ___  ___    --
--    |\   |   )|   )|___)     |    |___)|   )|    |___)|   )   --
--    | \  |__/ |  / |__       |    |__  |  / |__  |__  |       --
--==============================================================--


-- Initialization function for this job file.
function get_sets()
    mote_include_version = 2
	
	-- Load and initialize the include file.
	include('Mote-Include.lua')
	 include('organizer-lib')
end

-- Setup vars that are user-independent.
function job_setup()
    -- entry = rune, index, expires

    if player.main_job_level >= 65 then
        max_runes = 3
    elseif player.main_job_level >= 35 then
        max_runes = 2
    elseif player.main_job_level >= 5 then
        max_runes = 1
    else
        max_runes = 0
    end
end

--================================================--
--                                                --
--      |     |        ,---.     |                --
--      |,---.|---.    `---.,---.|--- .   .,---.  --
--      ||   ||   |        ||---'|    |   ||   |  --
--  `---'`---'`---'    `---'`---'`---'`---'|---'  --
--                                         |      --
--================================================--

function user_setup()
    state.HybridMode:options('DT', 'MDT', 'Hybrid', 'DD')
    state.IdleMode:options('Normal', 'DT')
end

function binds_on_load()

end

function file_unload()
end

function init_gear_sets()
	--[[%%GearsetsAnchor%%]]
end
	
--==================================================================--
--   _____                          _     _                         --
--  |  ___|  _   _   _ __     ___  | |_  (_)   ___    _ __    ___   --
--  | |_    | | | | | '_ \   / __| | __| | |  / _ \  | '_ \  / __|  --
--  |  _|   | |_| | | | | | | (__  | |_  | | | (_) | | | | | \__ \  --
--  |_|      \__,_| |_| |_|  \___|  \__| |_|  \___/  |_| |_| |___/  --
--==================================================================--


-- Run after the default midcast() is done.
-- eventArgs is the same one used in job_midcast, in case information needs to be persisted.
function job_post_midcast(spell, action, spellMap, eventArgs)
    if spell.english == 'Lunge' or spell.english == 'Swipe' then
        local obi = get_obi(get_rune_obi_element())
        if obi then
            equip({waist=obi})
        end
    end
end


function job_midcast(spell, action, spellMap, eventArgs)
	if spell.english == 'Jettatura' or spell.english == 'Geist Wall' 
	or spell.english == 'Soporific' or spell.english == 'Blank Gaze' 
	or spell.english == 'Sheep Song' or spell.english == 'Chaotic Eye' 
	or spell.english == 'Cursed Sphere' or spell.english == 'Flash' then
	equip(sets.midcast.Flash)
	end
	end
	

function display_current_job_state(eventArgs)
    local msg = 'Melee'
    
    if state.CombatForm.has_value then
        msg = msg .. ' (' .. state.CombatForm.value .. ')'
    end
    
    msg = msg .. ': '
    
    msg = msg .. state.OffenseMode.value
    if state.HybridMode.value ~= 'Normal' then
        msg = msg .. '/' .. state.HybridMode.value
    end
    msg = msg .. ', WS: ' .. state.WeaponskillMode.value
    
    if state.DefenseMode.value ~= 'None' then
        msg = msg .. ', Defense: ' .. state.DefenseMode.value .. ' (' .. state[state.DefenseMode.value .. 'DefenseMode'].value .. ')'
    end
	
    add_to_chat(122, msg)

    eventArgs.handled = true
end
--=-----------------------------=--
--          __   __   __   __    --
--    /|/| /  | /    /  | /  |   --
--   ( / |(___|(    (___|(   |   --
--   |   )|   )|   )|\   |   )   --
--   |  / |  / |__/ | \  |__/    --
--=-----------------------------=--

-- Select default macro book on initial load or subjob change.
function select_default_macro_book()
	-- Default macro set/book
	if player.sub_job == 'WAR' then
		set_macro_page(7, 6)
	elseif player.sub_job == 'NIN' then
		set_macro_page(5, 6)
	elseif player.sub_job == 'SAM' then
		set_macro_page(3, 6)
	else
		set_macro_page(1, 14)
	end
end


function customize_idle_set(idleSet)
	if player.mpp < 51 then
		idleSet = set_combine(idleSet, sets.latent_refresh)
	else return idleSet
	end
end



function get_rune_obi_element()
    weather_rune = buffactive[elements.rune_of[world.weather_element] or '']
    day_rune = buffactive[elements.rune_of[world.day_element] or '']

    local found_rune_element

    if weather_rune and day_rune then
        if weather_rune > day_rune then
            found_rune_element = world.weather_element
        else
            found_rune_element = world.day_element
        end
    elseif weather_rune then
        found_rune_element = world.weather_element
    elseif day_rune then
        found_rune_element = world.day_element
    end

    return found_rune_element
end

function get_obi(element)
    if element and elements.obi_of[element] then
        return (player.inventory[elements.obi_of[element]] or player.wardrobe[elements.obi_of[element]]) and elements.obi_of[element]
    end
end
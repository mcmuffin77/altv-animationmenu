import * as alt from 'alt-client';
import * as game from 'natives';
import * as NativeUI from './includes/NativeUI/NativeUI';
import {AvailableDances, AvailableAnimations} from './includes/emotes.js';
let prop = null;
const menu = new NativeUI.Menu("Animationsmenü", "", new NativeUI.Point(50, 50));
menu.GetTitle().Scale = 1.5;
menu.GetTitle().DropShadow = true;
menu.AddItem(new NativeUI.UIMenuItem("Stop", ""));




let menuDanceItem = new NativeUI.UIMenuItem("Tänze", "Alle verfügbaren Tänze.");
menu.AddItem(menuDanceItem);

const DanceMenu = new NativeUI.Menu("Tänze", "Tanz:", new NativeUI.Point(50, 50));
DanceMenu.Visible = false;
DanceMenu.GetTitle().Scale = 0.9;

menu.AddSubMenu(DanceMenu, menuDanceItem);

AvailableDances.forEach(element => {
	let DanceItem = new NativeUI.UIMenuItem(element.name, "Alle verfügbaren Tänze.");
	DanceMenu.AddItem(DanceItem);
});

let menuAniamtionItem = new NativeUI.UIMenuItem("Animationen", "Alle verfügbaren Animationen.");
menu.AddItem(menuAniamtionItem);

const AnimationMenu = new NativeUI.Menu("Animationen", "Animation:", new NativeUI.Point(50, 50));
AnimationMenu.Visible = false;
AnimationMenu.GetTitle().Scale = 0.9;

menu.AddSubMenu(AnimationMenu, menuAniamtionItem);

AvailableAnimations.forEach(element => {
	let DanceItem = new NativeUI.UIMenuItem(element.name, "Alle verfügbaren Animationen.");
	AnimationMenu.AddItem(DanceItem);
});


menu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && item.Text == "Stop") {
		game.clearPedTasks(alt.Player.local.scriptID);
		if (!prop || prop == null) return;
			alt.setTimeout(() => {
				game.detachEntity(prop, true, false);
				game.deleteObject(prop);
				prop = null;
			}, 800);
	}
    else {

    }
});


DanceMenu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && selectedItemIndex < AvailableDances.length) {
		
		let SelectedDance = AvailableDances[selectedItemIndex];
		
		
		playAnimation(SelectedDance.dict, SelectedDance.anim, 1, 300000);
	}
    else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text);
    }
});

AnimationMenu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && selectedItemIndex < AvailableAnimations.length) {
		
		let SelectedAnimation = AvailableAnimations[selectedItemIndex];

		playAnimation(SelectedAnimation.dict, SelectedAnimation.anim, 1, SelectedAnimation.EmoteDuration);
	}
    else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text);
    }
});






alt.on('keyup', (key) => {
    if (key === 0x54) {
        if (menu.Visible || DanceMenu.Visible || AnimationMenu.Visible)
		{
            menu.Close();
			DanceMenu.Close();
			AnimationMenu.Close();
        }
		else
		{
			menu.Open();
		}
    }
});










function playAnimation(animDict, animName, animFlag, animDuration) {
    if (animDict == undefined || animName == undefined || animFlag == undefined || animDuration == undefined) return;
    game.requestAnimDict(animDict);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(animDict)) {
            alt.clearInterval(interval);
            game.taskPlayAnim(alt.Player.local.scriptID, animDict, animName, 8.0, 1, animDuration, animFlag, 1, false, false, false);
        }
    }, 0);
}

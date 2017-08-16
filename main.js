'use strict';

const desktop = document.querySelector(`#desktop`);

const desktopMenuOnRightClick = ['New Folder'];
const desktopIconMenuOnRightClick = ['Open', 'Delete', 'Rename'];

let folders = [];
let icons = [];
let menuOnRightClick = null;

let lockIcon = null;

function newFolder(x, y){

	folders.push(new Folder(x, y));

}

function MenuOnRightClickButtonFunction(nameF){

	switch(nameF.toLowerCase()){

		case 'new folder':
			newFolder(menuOnRightClick.x, menuOnRightClick.y);

	}

}

function allIconsActiveFalse(){

	for(let obj of icons){

		if(obj.activeState === true){

			obj.obj.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
			obj.obj.children[0].style.backgroundColor = 'rgba(86, 136, 218, 0)';
			obj.obj.children[0].style.color = 'black';
			obj.activeState = false;
			obj.obj.setAttribute('data-active', 'false');

		}

	}

}

function fMenuOnRightClick(typeMenu, id){

	event.preventDefault();
	menuOnRightClick = new MenuOnRightClick(typeMenu, id);

}

function menuOnRightClickClose(id = null){

	if(menuOnRightClick != null){

		menuOnRightClick.close();

	}

	allIconsActiveFalse();

	if(id != null){

		icons.find(obj => obj.id === id).active('true');

	}

}

function lockIconToMouse(id){

	lockIcon = icons.find(obj => obj.id === id);
	lockIcon.coords = lockIcon.obj.getBoundingClientRect();
	lockIcon.coords.x = event.pageX - lockIcon.coords.left;
	lockIcon.coords.y = event.pageY - lockIcon.coords.top;
	allIconsActiveFalse();
	lockIcon.active('true');
	// lockIcon.style.zIndex = '100';

}

function unlockIconToMouse(){

	delete lockIcon.coords;
	lockIcon = null;

}

function moveLockIcon(e){

	if(lockIcon !== null){

		lockIcon.obj.style.left = `${event.pageX - lockIcon.coords.x}px`;
		lockIcon.obj.style.top = `${event.pageY - lockIcon.coords.y}px`;

	}

}


class Folder{

	constructor(xI ,yI){

		menuOnRightClickClose();
		if(xI - 37 < 0)
			this.x = 0
		else if(xI + 37 > document.documentElement.clientWidth)
			this.x = document.documentElement.clientWidth - 78
		else
			this.x = xI - 37

		if(yI - 42 < 0)
			this.y = 0
		else if(yI + 42 > document.documentElement.clientHeight)
			this.y = document.documentElement.clientHeight - 91
		else
			this.y = yI - 42



		// this.name = name;
		this.elem = document.createElement('div');
		this.elem.className = 'folder';
		this.elem.style.left = `${this.x}px`;
		this.elem.style.top = `${this.y}px`;
		this.elem.id = `f${icons.length}`;
		this.elem.setAttribute('oncontextmenu', `fMenuOnRightClick("desktopIcon", 'f${icons.length}')`);
		this.elem.setAttribute('onclick', `menuOnRightClickClose('f${icons.length}')`);
		this.elem.setAttribute('onmousedown', `lockIconToMouse('f${icons.length}')`);
		this.elem.setAttribute('onmouseup', `unlockIconToMouse()`);
		// this.elem.setAttribute('onmousemove', `moveLockIcon()`);
		this.elem.setAttribute('ondragstart', `return false`);
		this.elem.setAttribute('data-active', 'false');
		this.elem.name = document.createElement('textarea');
		this.elem.name.className = 'nameInp';
		this.elem.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
		this.elem.name.style.resize = 'none';
		this.elem.name.setAttribute('rows', `1`);
		this.activeState = true;
		this.elem.setAttribute('data-active', 'true');
		// this.elem.name.innerHTML = this.name;
		this.elem.appendChild(this.elem.name);
		document.body.appendChild(this.elem);

		icons.push({id: `f${icons.length}`, type: 'folder', name: this.name, obj: this.elem, posX: this.x, posY: this.y, childIcons: [], activeState: this.activeState, active: function(state){

			allIconsActiveFalse();

			if(state === 'true'){

				this.obj.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
				this.obj.children[0].style.backgroundColor = 'rgba(86, 136, 218, 1)';
				this.obj.children[0].style.color = 'white';
				this.activeState = true;
				this.obj.setAttribute('data-active', 'true');

			}else{

				this.obj.style.backgroundColor = 'rgba(0, 0, 0, 00)';
				this.obj.children[0].style.backgroundColor = 'rgba(86, 136, 218, 0)';
				this.obj.children[0].style.color = 'black';
				this.activeState = false;
				this.obj.setAttribute('data-active', 'false');

			}

		}});

		delete this.activeState;

	}

}

class MenuOnRightClick{

	constructor(type, id){

		this.x = event.clientX;
		this.y = event.clientY;

		if(menuOnRightClick != null)
			this.close();

		this.elem = document.createElement('div');
		this.elem.className = 'menuOnRightClick';
		this.elem.height = 2;
		this.elem.width = 152;

		if(type === 'desktop'){

			allIconsActiveFalse();
			for(let obj of desktopMenuOnRightClick){

				let element = document.createElement('span');
				element.className = 'button';
				element.setAttribute('onclick', `MenuOnRightClickButtonFunction("${obj}")`);
				element.innerHTML = obj;
				this.elem.appendChild(element);
				this.elem.height += 29;

			}

		}else if(type === 'desktopIcon'){

			let thisFolder = icons.find(obj => obj.id === id);
			allIconsActiveFalse();
			thisFolder.active('true');
			

			for(let obj of desktopIconMenuOnRightClick){

				let element = document.createElement('span');
				element.className = 'button';
				element.setAttribute('onclick', `MenuOnRightClickButtonFunction("${obj}")`);
				element.innerHTML = obj;
				this.elem.appendChild(element);
				this.elem.height += 29;

			}

		}


		if(this.x + this.elem.width > document.documentElement.clientWidth){

			this.elem.style.left = document.documentElement.clientWidth - this.elem.width + 'px';
			// this.x = document.documentElement.clientWidth - this.elem.width;

		}else{

			this.elem.style.left = this.x + 'px';

		}
			
		if(this.y + this.elem.height > document.documentElement.clientHeight){

			this.elem.style.top = document.documentElement.clientHeight - this.elem.height + 'px';
			// this.x = document.documentElement.clientHeight - this.elem.height;

		}else{

			this.elem.style.top = this.y + 'px';

		}

		document.body.appendChild(this.elem);
		

	}

	close(){

		document.body.removeChild(document.querySelector('.menuOnRightClick'));
		

		menuOnRightClick = null;

	}

}

// let folder = new Folder('Портрет');
// let folders = new Folder('Навыки');

'use strict';

const desktop = document.querySelector(`#desktop`);

const desktopMenuOnRightClick = ['New Folder'];
const desktopIconMenuOnRightClick = ['Open', 'Delete', 'Rename'];

let folders = [];
let icons = [];

let menuOnRightClick = null;

let lockIcon = null;
let move = false;

let setNameVariable = null;

function newIcon(type, x, y){

	if(type === 'folder'){

		new Icon(type, x, y);

	}

}

function lookToElement(id){

	// event.preventDefault();
	if(event.keyCode === 13){

		let elem = document.getElementById(id);

		if(setNameVariable != null){

			let myEvent = new CustomEvent("onSetName", {

				detail: {

					name: setNameVariable.elem.value

				}

			});

			setNameVariable.elemEvent.dispatchEvent(myEvent);
			setNameVariable = null;

		}

	}

}

function setName(obj){

	let nameInp = document.createElement('textarea');
	let child = obj.elem.querySelector('.name');

	if(child != null)
		obj.elem.removeChild(child);

	nameInp.className = 'nameInp';
	nameInp.setAttribute('rows', `1`);
	nameInp.setAttribute('value', `icon`);
	nameInp.setAttribute('onkeydown', `lookToElement('${obj.elem.id}')`);
	obj.elem.appendChild(nameInp);
	nameInp.focus();
	setNameVariable = {};
	setNameVariable.elemEvent = obj.elem;
	setNameVariable.elem = nameInp;
	setNameVariable.event = true;

}


function MenuOnRightClickButtonFunction(nameF){

	switch(nameF.toLowerCase()){

		case 'new folder':
			newIcon('folder', menuOnRightClick.x, menuOnRightClick.y);

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

	if(setNameVariable != null){

		let myEvent = new CustomEvent("onSetName", {

			detail: {

				name: setNameVariable.elem.value

			}

		});

		setNameVariable.elemEvent.dispatchEvent(myEvent);

		setNameVariable = null;

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

	if(setNameVariable != null){

		let myEvent = new CustomEvent("onSetName", {

			detail: {

				name: setNameVariable.elem.value

			}

		});

		setNameVariable.elemEvent.dispatchEvent(myEvent);

		setNameVariable = null;

	}

	lockIcon = icons.find(obj => obj.id === id);
	lockIcon.coords = lockIcon.obj.getBoundingClientRect();
	lockIcon.coords.x = event.clientX - lockIcon.coords.left;
	lockIcon.coords.y = event.clientY - lockIcon.coords.top;
	lockIcon.obj.style.zIndex = '100';
	allIconsActiveFalse();
	lockIcon.active('true');	

}

function unlockIconToMouse(){

	lockIcon.posX = event.clientX - lockIcon.coords.x;
	lockIcon.posY = event.clientY - lockIcon.coords.y;

	if(lockIcon.posX - 1 < 0){

		lockIcon.posX = 0;
		lockIcon.obj.style.left = `${lockIcon.posX}px`;

	}else if(lockIcon.posX + 75 > document.documentElement.clientWidth){

		lockIcon.posX = document.documentElement.clientWidth - 80;
		lockIcon.obj.style.left = `${lockIcon.posX}px`;

	}

	if(lockIcon.posY - 1 < 0){

		lockIcon.posY = 0;
		lockIcon.obj.style.top = `${lockIcon.posY}px`;

	}else if(lockIcon.posY + 84 > document.documentElement.clientHeight){

		lockIcon.posY = document.documentElement.clientHeight - 91;
		lockIcon.obj.style.top = `${lockIcon.posY}px`;

	}

	delete lockIcon.coords;
	lockIcon.obj.style.zIndex = '2';
	lockIcon = null;
	move = false;

}

function moveLockIcon(){

	if(lockIcon !== null){


		if(lockIcon.coords.x + 5 <= event.clientX - lockIcon.coords.left){

			move = true;

		}else if(lockIcon.coords.x - 5 >= event.clientX - lockIcon.coords.left){

			move = true;
			
		}

		if(move === true){

			lockIcon.obj.style.left = `${event.clientX - lockIcon.coords.x}px`;
			lockIcon.obj.style.top = `${event.clientY - lockIcon.coords.y}px`;

		}

	}

}

function setDropAndDrag(elem){

	elem.setAttribute('onmousedown', `lockIconToMouse('i${icons.length}')`);
	elem.setAttribute('onmouseup', `unlockIconToMouse()`);
	elem.setAttribute('ondragstart', `return false`);
	elem.setAttribute('data-active', 'true');

}


class Icon{

	constructor(type, xI, yI){

		menuOnRightClickClose();

		this.type = type;
		this.elem = document.createElement('div');

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

		this.elem.style.left = `${this.x}px`;
		this.elem.style.top = `${this.y}px`;

		this.elem.id = `i${icons.length}`;
		this.elem.setAttribute('oncontextmenu', `fMenuOnRightClick("desktopIcon", 'i${icons.length}')`);
		this.elem.setAttribute('onclick', `menuOnRightClickClose('i${icons.length}')`);
		this.elem.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
		this.activeState = true;
		setDropAndDrag(this.elem);

		if(type === 'folder'){

			this.elem.className = 'folder';

		}

		document.body.appendChild(this.elem);
		setName(this);

		let THIS = this;
		this.elem.addEventListener("onSetName", function(data) {

			THIS.name = data.detail.name;

			let nameSpn = document.createElement('span');
			let child = THIS.elem.querySelector('.nameInp');

			if(child != null)
				THIS.elem.removeChild(child);

			nameSpn.className = 'name';
			nameSpn.innerHTML = THIS.name;
			THIS.elem.appendChild(nameSpn);

			icons.push({id: `i${icons.length}`, type: THIS.type, name: THIS.name, obj: THIS.elem, posX: THIS.x, posY: THIS.y, childIcons: [], activeState: THIS.activeState, active: function(state){

				// allIconsActiveFalse();

				if(state === 'true'){

					THIS.elem.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
					THIS.elem.children[0].style.backgroundColor = 'rgba(86, 136, 218, 1)';
					THIS.elem.children[0].style.color = 'white';
					THIS.activeState = true;
					THIS.elem.setAttribute('data-active', 'true');

				}else{

					THIS.elem.style.backgroundColor = 'rgba(0, 0, 0, 0)';
					THIS.elem.children[0].style.backgroundColor = 'rgba(86, 136, 218, 0)';
					THIS.elem.children[0].style.color = 'black';
					THIS.activeState = false;
					THIS.elem.setAttribute('data-active', 'false');

				}

			}});

			icons[icons.length - 1].active('false');

		})	
		
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

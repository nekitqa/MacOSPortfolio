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
let rename = false;

let timeout;

function openWindow(id){

	new Window(icons.find(obj => obj.id === id));

}

function newIcon(type, x, y){

	new Icon(type, x, y);

}

function lookToElement(type, id){

	let typeLowerCase = type.toLowerCase();

	if(typeLowerCase === 'setname'){

		if(event.keyCode === 13){

			let elem = document.getElementById(id);

			if(setNameVariable != null){

				let myEvent = new CustomEvent("onSetName", {

					detail: {

						name: setNameVariable.obj.value

					}

				});

				setNameVariable.elemEvent.dispatchEvent(myEvent);
				setNameVariable = null;

			}

		}

	}else if(typeLowerCase === 'rename'){

		if(event.keyCode === 13){

			let elem = document.getElementById(id);

			if(setNameVariable != null){

				let myEvent = new CustomEvent("onRename", {

					detail: {

						name: setNameVariable.obj.value

					}

				});

				setNameVariable.elemEvent.dispatchEvent(myEvent);
				setNameVariable = null;

			}

		}

	}

}

function MenuOnRightClickButtonFunction(nameF, id){

	let strLowerCase = nameF.toLowerCase();
	if(strLowerCase === 'new folder'){

		newIcon('folder', menuOnRightClick.x, menuOnRightClick.y);

	}else if(strLowerCase === 'rename'){

		icons.find(obj => obj.id === id).rename();;

	}
	
	if(menuOnRightClick != null){

		menuOnRightClick.close();

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

		let myEvent;

		if(setNameVariable.type === 'setname'){

			myEvent = new CustomEvent("onSetName", {

				detail: {

					name: setNameVariable.obj.value

				}

			});

		}else if(setNameVariable.type === 'rename'){

			myEvent = new CustomEvent("onRename", {

				detail: {

					name: setNameVariable.obj.value

				}

			});

		}

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

	let myEvent;

	if(setNameVariable != null){

		if(setNameVariable.type === 'setname'){

			myEvent = new CustomEvent("onSetName", {

				detail: {

					name: setNameVariable.obj.value

				}

			});

		}else if(setNameVariable.type === 'rename'){

			myEvent = new CustomEvent("onRename", {

				detail: {

					name: setNameVariable.obj.value

				}

			});

		}

		setNameVariable.elemEvent.dispatchEvent(myEvent);

		setNameVariable = null;

	}

	lockIcon = icons.find(obj => obj.id === id);
	lockIcon.coords = lockIcon.obj.getBoundingClientRect();
	lockIcon.coords.x = event.clientX - lockIcon.coords.left;
	lockIcon.coords.y = event.clientY - lockIcon.coords.top;
	lockIcon.obj.style.zIndex = '100';
	menuOnRightClickClose(id);

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

function setDropAndDrag(type, elem){

	if(type === 'icon'){

		elem.setAttribute('onmousedown', `lockIconToMouse('i${icons.length}')`);
		elem.setAttribute('onmouseup', `unlockIconToMouse()`);
		elem.setAttribute('ondragstart', `return false`);
		elem.setAttribute('data-active', 'true');

	}else if(type === 'window'){



	}

}

class Icon{

	constructor(type, xI, yI){

		menuOnRightClickClose();

		this.type = type;
		this.name = 'icon';
		this.obj = document.createElement('div');
		this.obj.id = `i${icons.length}`;
		this.obj.setAttribute('oncontextmenu', `fMenuOnRightClick("desktopIcon", 'i${icons.length}')`);
		this.obj.setAttribute('onclick', `menuOnRightClickClose('i${icons.length}')`);
		this.obj.setAttribute('ondblclick', `openWindow('i${icons.length}')`);
		this.obj.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
		this.activeState = true;


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

		this.obj.style.left = `${this.x}px`;
		this.obj.style.top = `${this.y}px`;

		setDropAndDrag('icon', this.obj);

		if(type === 'folder'){

			this.obj.className = 'folder';

		}

		document.body.appendChild(this.obj);
		this.setName();

		let THIS = this;
		this.obj.addEventListener("onSetName", function(data){

			if(data.detail.name.replace(' ', '') != '')
				THIS.name = data.detail.name;
			else
				THIS.name = 'icon';

			let child = THIS.obj.children[0];
			let nameSpn;
			if(child !== undefined){

				if(child.className === 'nameInp'){

					THIS.obj.removeChild(child);
					nameSpn = document.createElement('span');
					nameSpn.className = 'name';
					nameSpn.innerHTML = THIS.name;
					THIS.obj.appendChild(nameSpn);
				
				}else{

					nameSpn = child;
					child.innerHTML = THIS.name;

				}

			}

			let parent;
			if(THIS.obj.parentElement.className !== undefined && THIS.obj.parentElement.className !== '')
				parent = `${THIS.obj.parentElement.tagName}.${THIS.obj.parentElement.className}`;
			else
				parent = `${THIS.obj.parentElement.tagName}`;

			icons.push({id: `i${icons.length}`, type: THIS.type, name: THIS.name, obj: THIS.obj, posX: THIS.x, posY: THIS.y, parent: parent, childIcons: [], activeState: THIS.activeState, active: function(state){

				if(state === 'true'){

					this.obj.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
					this.obj.children[0].style.backgroundColor = 'rgba(86, 136, 218, 1)';
					this.obj.children[0].style.color = 'white';
					this.activeState = true;
					this.obj.setAttribute('data-active', 'true');

				}else{

					this.obj.style.backgroundColor = 'rgba(0, 0, 0, 0)';
					this.obj.children[0].style.backgroundColor = 'rgba(86, 136, 218, 0)';
					this.obj.children[0].style.color = 'black';
					this.activeState = false;
					this.obj.setAttribute('data-active', 'false');

				}

			}, rename: function(){

				let THIS = this;
				this.obj.addEventListener("onRename", function(data){

					if(data.detail.name.replace(' ', '') != '')
						THIS.name = data.detail.name;
					else
						THIS.name = 'icon';

					let child = THIS.obj.children[0];
					let nameSpn;
					if(child !== undefined){

						if(child.className === 'nameInp'){

							THIS.obj.removeChild(child);
							nameSpn = document.createElement('span');
							nameSpn.className = 'name';
							nameSpn.innerHTML = THIS.name;
							THIS.obj.appendChild(nameSpn);
						
						}else{

							nameSpn = child;
							child.innerHTML = THIS.name;

						}

					}

				})

				let nameInp = document.createElement('textarea');
				let child = this.obj.children[0];
				if(child !== undefined)
					if(child.className === 'name')
						this.obj.removeChild(child);

				nameInp.className = 'nameInp';
				nameInp.setAttribute('rows', `1`);
				nameInp.value = this.name;
				nameInp.setAttribute('onkeydown', `lookToElement('rename', '${this.obj.id}')`);
				nameInp.setAttribute('onselectstart', '');
				this.obj.appendChild(nameInp);
				nameInp.focus();
				setNameVariable = {};
				setNameVariable.id = this.obj.id;
				setNameVariable.elemEvent = this.obj;
				setNameVariable.obj = nameInp;
				setNameVariable.type = 'rename';
				setNameVariable.event = true;


			}})	

		})
		
	}

	setName(){

		let nameInp = document.createElement('textarea');
		let child = this.obj.children[0];
		if(child !== undefined)
			if(child.className === 'name')
				this.obj.removeChild(child);

		nameInp.className = 'nameInp';
		nameInp.setAttribute('rows', `1`);
		nameInp.value = this.name;
		nameInp.setAttribute('onkeydown', `lookToElement('setName', '${this.obj.id}')`);
		nameInp.setAttribute('onselectstart', '');
		this.obj.appendChild(nameInp);
		nameInp.focus();
		setNameVariable = {};
		setNameVariable.id = this.obj.id;
		setNameVariable.elemEvent = this.obj;
		setNameVariable.obj = nameInp;
		setNameVariable.type = 'setname';
		setNameVariable.event = true;

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
				element.setAttribute('onclick', `MenuOnRightClickButtonFunction("${obj}", "${id}")`);
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

class Window{

	constructor(whose){

		this.whose = whose;
		
	}

}

// let folder = new Folder('Портрет');
// let folders = new Folder('Навыки');

'use strict';

const desktop = document.querySelector(`#desktop`);

const FAVORITES = [{type: 'desktopFolder', name: 'Desktop'}];
const CHM = ['closeWindow', 'hideWindow', 'minInWindow']; // CLOSE|HIDE|MINIMALIZE = CHM

const desktopMenuOnRightClick = ['New Folder'];
const desktopIconMenuOnRightClick = ['Open', 'Delete', 'Rename'];

let folders = [];
let icons = [];
let trashBin = [];
let windows = [];

let menuOnRightClick = null;

let lockWindow = null;
let lockIcon = null;
let move = false;

let setNameVariable = null;
let rename = false;

let timeout;



let q = 0;




// function renderHtmlToCanvas(html, x, y, width, height) {

// 	let ctx = document.getElementById('canvas').getContext('2d');
// 	let data =  
//   		"data:image/svg+xml;charset=utf-8," +
//     	'<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
//     		'<foreignObject width="100%" height="100%"><style>div{background-color: red;}</style>' +
//     			HtmlToXml(html) +
//     		"</foreignObject>" +
//     	"</svg>";

// 	let img = new Image();

// 	img.onload = function() {

// 		ctx.drawImage(img, x, y);

// 	};

// 	img.src = data;

// }

// function HtmlToXml(html){

//   let doc = document.implementation.createHTMLDocument("");;
//   doc.write(html);

//   doc.documentElement.setAttribute("xmlns", doc.documentElement.namespaceURI);

//   html = new XMLSerializer().serializeToString(doc.body);
//   return html;

// }

function focusFolder(id){

	allIconsActiveFalse();
	if(windows.find(obj => obj.id === id) !== undefined)
		windows.find(obj => obj.id === id).focus();

}

function deleteIcon(id){

	icons.find(obj => obj.id === id).delete();

}

function openWindow(id){

	new Window(icons.find(obj => obj.id === id).type, icons.find(obj => obj.id === id));

}

function closeWindow(id){

	windows.find(obj => obj.id === id).close();

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

		icons.find(obj => obj.id === id).rename();

	}else if(strLowerCase === 'open'){

		openWindow(id);

	}else if(strLowerCase === 'delete'){

		deleteIcon(id);

	}
	
	if(menuOnRightClick != null){

		menuOnRightClick.close();

	}

}

function allIconsActiveFalse(){

	for(let obj of icons){

		if(obj.activeState === true){

			obj.obj.className = obj.obj.className.replace('Active', '');
			obj.activeState = false;
			obj.obj.setAttribute('data-active', 'false');

		}

	}

	if(windows.length !== 0){

		for(let windowObj of windows){

			if(windowObj.activeState === true){

				windowObj.obj.setAttribute('data-active', 'false');
				windowObj.obj.className = 'window';
				windowObj.activeState = false;

			}

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
	
	if(id != null){

		if(setNameVariable !== null){

			if(event.target === icons.find(obj => obj.id === id).obj)
				icons.find(obj => obj.id === id).active('true');

		}else{

			icons.find(obj => obj.id === id).active('true');

		}


	}else{

		allIconsActiveFalse();

	}

}

function moveEl(){

	if(lockIcon === null){

		moveLockWindow();

	}else if(lockWindow === null){

		moveLockIcon();

	}

}

function lockIconToMouse(id){

	let myEvent;

	if(setNameVariable != null){

		if(event.target === setNameVariable.elemEvent){

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
			lockIcon = icons.find(obj => obj.id === id);
			lockIcon.coords = lockIcon.obj.getBoundingClientRect();
			lockIcon.coords.x = event.clientX - lockIcon.coords.left;
			lockIcon.coords.y = event.clientY - lockIcon.coords.top;
			menuOnRightClickClose(id);

		}

	}else{

		lockIcon = icons.find(obj => obj.id === id);
		lockIcon.coords = lockIcon.obj.getBoundingClientRect();
		lockIcon.coords.x = event.clientX - lockIcon.coords.left;
		lockIcon.coords.y = event.clientY - lockIcon.coords.top;
		menuOnRightClickClose(id);

	}

}

function unlockIconToMouse(){

	if(lockIcon !== null){

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

}

function moveLockIcon(){

	if(lockIcon !== null){

		if(move !== true){

			if(lockIcon.coords.x + 5 <= event.clientX - lockIcon.coords.left){

				lockIcon.obj.style.zIndex = '100';
				move = true;

			}else if(lockIcon.coords.x - 5 >= event.clientX - lockIcon.coords.left){

				lockIcon.obj.style.zIndex = '100';
				move = true;
				
			}

		}else if(move === true){

			lockIcon.obj.style.left = `${event.clientX - lockIcon.coords.x}px`;
			lockIcon.obj.style.top = `${event.clientY - lockIcon.coords.y}px`;	

		}

	}

}

function lockWindowToMouse(id){

	if(windows.find(obj => obj.id === id) !== undefined){

		lockWindow = windows.find(obj => obj.id === id);
		lockWindow.coords = lockWindow.obj.getBoundingClientRect();
		lockWindow.coords.x = event.clientX - lockWindow.coords.left;
		lockWindow.coords.y = event.clientY - lockWindow.coords.top;
		menuOnRightClickClose();
		lockWindow.focus();

	}

}

function unlockWindowToMouse(){

	if(lockWindow !== null){

		lockWindow.posX = event.clientX - lockWindow.coords.x;
		lockWindow.posY = event.clientY - lockWindow.coords.y;

		delete lockWindow.coords;

		lockWindow.obj.style.zIndex = '5';
		lockWindow = null;
		move = false;

	}

}

function moveLockWindow(){

	if(lockWindow !== null){

		if(lockWindow.coords.x + 5 <= event.clientX - lockWindow.coords.left){

			lockWindow.obj.style.zIndex = '100';
			move = true;

		}else if(lockWindow.coords.x - 5 >= event.clientX - lockWindow.coords.left){

			lockWindow.obj.style.zIndex = '100';
			move = true;
			
		}

		if(move === true){

			lockWindow.obj.style.left = `${event.clientX - lockWindow.coords.x}px`;
			lockWindow.obj.style.top = `${event.clientY - lockWindow.coords.y}px`;

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

		let top = elem.getElementsByClassName('top')[0];
		top.setAttribute('onmousedown', `lockWindowToMouse('w${windows.length}')`);
		top.setAttribute('onmouseup', `unlockWindowToMouse()`);
		elem.setAttribute('ondragstart', `return false`);
		elem.setAttribute('data-active', 'true');

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
		this.activeState = true;

		if(xI - 37 < 0)
			this.posX = 0
		else if(xI + 37 > document.documentElement.clientWidth)
			this.posX = document.documentElement.clientWidth - 78
		else
			this.posX = xI - 37

		if(yI - 42 < 0)
			this.posY = 0
		else if(yI + 42 > document.documentElement.clientHeight)
			this.posY = document.documentElement.clientHeight - 91
		else
			this.posY = yI - 42

		this.obj.style.left = `${this.posX}px`;
		this.obj.style.top = `${this.posY}px`;

		setDropAndDrag('icon', this.obj);

		if(type === 'folder'){

			this.obj.className = 'folderActive';

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
				THIS.parent = `${THIS.obj.parentElement.tagName}.${THIS.obj.parentElement.className}`;
			else
				THIS.parent = `${THIS.obj.parentElement.tagName}`;

			THIS.id = `i${icons.length}`;
			THIS.childIcons = []; 

			icons.push(THIS);

		})
		
	}

	active(state){

		if(state === 'true'){

			this.obj.className = 'folderActive';
			this.activeState = true;
			this.obj.setAttribute('data-active', 'true');

		}else{

			this.obj.className = 'folder';
			this.activeState = false;
			this.obj.setAttribute('data-active', 'false');

		}

	}

	rename(){

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
		this.obj.appendChild(nameInp);
		nameInp.focus();
		setNameVariable = {};
		setNameVariable.id = this.obj.id;
		setNameVariable.elemEvent = this.obj;
		setNameVariable.obj = nameInp;
		setNameVariable.type = 'rename';
		setNameVariable.event = true;

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
		this.obj.appendChild(nameInp);
		nameInp.focus();
		setNameVariable = {};
		setNameVariable.id = this.obj.id;
		setNameVariable.elemEvent = this.obj;
		setNameVariable.obj = nameInp;
		setNameVariable.type = 'setname';
		setNameVariable.event = true;

	}

	delete(){

		document.body.removeChild(this.obj);
		trashBin.push(icons.splice(icons.findIndex(obj => obj === this), 1)[0]);

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

		}else{

			this.elem.style.left = this.x + 'px';

		}
			
		if(this.y + this.elem.height > document.documentElement.clientHeight){

			this.elem.style.top = document.documentElement.clientHeight - this.elem.height + 'px';

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

	constructor(type, whose){

		menuOnRightClickClose();
		this.whose = whose;
		this.type = type;
		this.id = `w${windows.length}`
		this.name = this.whose.name;
		this.obj = document.createElement('div');
		this.obj.className = 'windowActive';
		this.obj.id = this.id;
		
		this.createElement();

		setDropAndDrag('window', this.obj)

		windows.push(this);

	}

	createElement(){

		if(this.type === 'folder'){

			let topSideBar = document.createElement('div');
			let top = document.createElement('div');
			let buttonsCHM = document.createElement('div')

			for(let id of CHM){

				let obj = document.createElement('div');
				obj.className = 'button';
				obj.id = id;
				obj.setAttribute('onmousedown', `${id}('${this.id}')`);
				buttonsCHM.appendChild(obj);

			}

			let nameFolder = document.createElement('span');
			let resizeWindowBTN = document.createElement('div');

			let bottom = document.createElement('div');
			let toolBar = document.createElement('div');
			let backNext = document.createElement('div');

			for(let i = 0;i < 2; i++){
				
				let button = document.createElement('button');
				let child = document.createElement('div');

				if(i === 0){

					button.className = 'buttons fl-left';
					child.className = 'icon back';
					button.appendChild(child);
					backNext.appendChild(button);

				}else if(i === 1){

					button.className = 'buttons fl-right';
					child.className = 'icon next';
					button.appendChild(child);
					backNext.appendChild(button);

				}

			}

			let displayBlock = document.createElement('div');

			for(let i = 0;i < 2; i++){

				let button = document.createElement('button');
				let child = document.createElement('div');

				if(i === 0){

					button.className = 'buttonsActive fl-left';
					child.className = 'icon tableActive';
					button.appendChild(child);
					displayBlock.appendChild(button);

				}else if(i === 1){

					button.className = 'buttons fl-right';
					child.className = 'icon list';
					button.appendChild(child);
					displayBlock.appendChild(button);

				}

			}

			let search = document.createElement('div');
			let searchINP = document.createElement('input');

			let leftSideBar = document.createElement('div');
			let favoritesBlock = document.createElement('div');
			let favoritesSpan = document.createElement('span');

			let content = document.createElement('div');

			favoritesBlock.appendChild(favoritesSpan);

			for(let obj of FAVORITES){

				let fav = document.createElement('div');
				let name = document.createElement('span');

				if(obj.type === 'folder')
					fav.className = 'favoritesFolder icon folderIcon';
				else if(obj.type === 'desktopFolder')
					fav.className = 'favoritesFolder icon desktopIcon';
				
				name.className = 'name';
				name.innerHTML = obj.name;

				fav.appendChild(name);
				favoritesBlock.appendChild(fav);

			}


			topSideBar.className = 'topSideBar';
			top.className = 'top';
			bottom.className = 'bottom';
			buttonsCHM.className = 'buttonsCHM fl-left';
			nameFolder.className = 'nameFolder';
			resizeWindowBTN.className = 'icon resizeWindowIcon';
			toolBar.className = 'toolBar';
			backNext.className = 'backNext';
			displayBlock.className = 'displayBlock';
			search.className = 'search';
			leftSideBar.className = 'leftSideBar';
			favoritesBlock.className = 'favorites';
			favoritesSpan.className = 'favorites';
			content.className = 'content';

			resizeWindowBTN.id = 'fullSizeWindow';

			nameFolder.innerHTML = this.name;
			favoritesSpan.innerHTML = 'favorites';


			top.appendChild(buttonsCHM);
			top.appendChild(nameFolder);
			top.appendChild(resizeWindowBTN);
			topSideBar.appendChild(top);
			search.appendChild(searchINP);
			toolBar.appendChild(backNext);
			toolBar.appendChild(displayBlock);
			toolBar.appendChild(search);
			bottom.appendChild(toolBar);
			topSideBar.appendChild(bottom);

			leftSideBar.appendChild(favoritesBlock);

			this.obj.appendChild(topSideBar);
			this.obj.appendChild(leftSideBar);
			this.obj.appendChild(content);

			this.obj.setAttribute('onclick', `focusFolder('${this.id}')`);

			this.focus();

			document.body.appendChild(this.obj);

			this.posX = this.obj.getBoundingClientRect().left;
			this.posY = this.obj.getBoundingClientRect().top;

			this.xml = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.obj.offsetWidth}" height="${this.obj.offsetHeight}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" class="windowActive">${this.obj.innerHTML}</div></foreignObject></svg>`

		}

	}

	close(){

		document.body.removeChild(this.obj);
		windows.splice(windows.findIndex(obj => obj === this), 1);

	}

	focus(){

		this.obj.setAttribute('data-active', 'true');
		this.activeState = true;
		this.obj.className = 'windowActive';

	}

}

// let folder = new Folder('Портрет');
// let folders = new Folder('Навыки');

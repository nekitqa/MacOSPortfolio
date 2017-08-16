'use strict';

const desktop = document.querySelector(`#desktop`);

const desktopMenuOnRightClick = ['New Folder'];

let menuOnRightClick = null;

desktop.onclick = function(){

	if(menuOnRightClick != null){

		if(document.elementFromPoint(event.clientX, event.clientY) != menuOnRightClick.elem || document.elementFromPoint(event.clientX, event.clientY).parentNode != menuOnRightClick.elem){
			
			console.log(document.elementFromPoint(event.clientX, event.clientY).parentNode);
			console.log(document.elementFromPoint(event.clientX, event.clientY));
			console.log(menuOnRightClick.elem);
			menuOnRightClick.close();

		}

	}

}

desktop.oncontextmenu = function(){

	event.preventDefault();
	menuOnRightClick = new MenuOnRightClick('desktop');

}

function MenuOnRightClickButtonFunction(type){

	return false;

}

class Folder{

	constructor(name){

		this.name = name;
		this.elem = document.createElement('div');
		this.elem.className = 'folder';
		this.elem.name = document.createElement('span');
		this.elem.name.className = 'name';
		this.elem.name.innerHTML = this.name;
		this.elem.appendChild(this.elem.name);
		desktop.appendChild(this.elem);

	}

}

class MenuOnRightClick{

	constructor(type){

		this.x = event.clientX;
		this.y = event.clientY;
		if(document.elementFromPoint(this.x, this.y) === desktop){

			if(menuOnRightClick != null)
				this.close();

			console.log('this.x = ' + event.clientX);
			console.log('this.y = ' + event.clientY);
			this.elem = document.createElement('div');
			this.elem.className = 'menuOnRightClick';
			this.elem.height = 2;
			this.elem.width = 152;

			if(type === 'desktop')
				for(let obj of desktopMenuOnRightClick){

					let element = document.createElement('span');
					element.className = 'button';
					element.setAttribute('onclick', `MenuOnRightClickButtonFunction("${obj}")`);
					element.innerHTML = obj;
					this.elem.appendChild(element);
					this.elem.height += 29;

				}

			if(this.x + 152 > document.documentElement.clientWidth)
				this.elem.style.left = document.documentElement.clientWidth - this.elem.width + 'px';
			else
				this.elem.style.left = this.x + 'px';
			
			if(this.y + this.elem.height > document.documentElement.clientHeight)
				this.elem.style.top = document.documentElement.clientHeight - this.elem.height + 'px';
			else
				this.elem.style.top = this.y + 'px';

			desktop.appendChild(this.elem);
		
		}

	}

	close(){

		desktop.removeChild(document.querySelector('.menuOnRightClick'));
		menuOnRightClick = null;

	}

}

let folder = new Folder('folders');
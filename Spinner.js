class Spinner {
	constructor() {
		this.speed = 0;
		this.maxSpeedLimit = 120;
		this.minSpeedingLimit = 50;
		this.power = 1;
		this.friction = 0.01;
		this.versions = 5;

		this._friction = this.friction;
		this._rotation = 0;
		this._fullRotations = 0;
		this._distance = 0;
		this._startClientX = 0;
		this._startClientY = 0;

		this.isDragging = false;
		this.isSpeeding = false;
		this.isFloating = false;
		this.isDraggable = false;
		this.isBreaking = false;
		this.isSwitching = false;

		this.$enjoy = document.querySelector('.enjoy');
		this.$spinner = document.querySelector('.spinner');
		this.$grip = document.querySelector('.grip');
		this.$speed = document.querySelector('.speed');
		this.$speedValue = this.$speed.querySelector('._value');
		this.$rotations = document.querySelector('.speed ._rotations');
		this.$speedometer = document.querySelector('.speedometer');
		this.$points = this.$speedometer.querySelectorAll('span');

		this.pointsCount = this.$points.length;
		this.pointChunk = this.maxSpeedLimit / this.$points.length;

		this.$filter = document.querySelector("#blur").firstElementChild;
		
		window.requestAnimationFrame(this.update.bind(this));

		document.addEventListener('mousedown', this.onMouseDown.bind(this));
		document.addEventListener('mousemove', this.onMouseMove.bind(this));
		document.addEventListener('mouseup', this.onMouseUp.bind(this));
	}

	update(timestamp) {
		this.spin();

		window.requestAnimationFrame(this.update.bind(this));
	}

	spin() {
		if(this.speed > 0) {
			this.speed += -this._friction;
		} else {
			this.speed += this._friction;
		}

		this._rotation += this.speed;
		this._fullRotations = Math.floor(Math.abs(this._rotation / 360));

		this.updateUI();
	}

	// -----------------------------

	updateUI() {
		let blur = this.speed / 10;
		let currentPoints = this.speed > 1 ? Math.floor(this.speed / this.pointChunk) : -1;

		this.$points.forEach((item, index) => {
			if(index <= currentPoints)
				item.classList.add('_active');
			else 
				item.classList.remove('_active');
		});

		this.$rotations.textContent = `${this._fullRotations}`;
		this.$filter.setAttribute('stdDeviation',`${blur},${blur}`);
		this.$speedValue.textContent = `${Math.abs(Math.round(this.speed * 2.4))}`;
		this.$spinner.style.transform = `rotateZ(${this._rotation}deg)`;

		if(this.speed > 1) {
			this.$speed.classList.add('_visible');
			this.$speedometer.classList.add('_visible');
		} else {
			this.$speed.classList.remove('_visible');
			this.$speedometer.classList.remove('_visible');
		}
	}

	// ------------------------------
	
	onClickGrip(e) {

		//if(this.speed < this.maxSpeedLimit) this.speed += this.power;
	}

	onClickSpinner(e) {

		this.speed = -this.power;
	}

	onClickJumper(e) {
		document.querySelectorAll('.jumper').forEach(item => item.classList.remove('_active'));
		this.$enjoy.removeAttribute('class');

		let random = Math.floor(Math.random() * 9) + 1;

		this.$enjoy.classList.add('enjoy', `v${random}`);
		e.target.classList.add('_active');
	}

	// ------------------------------

	onMouseDown(e) {
		this._startClientY = e.clientY;
		this._startClientX = e.clientX;
		this._draggingTimer = 0;

		if(e.target.classList.contains('grip')) {
			this.isFloating = true;
		}

		if(e.target.classList.contains('spinner')) {
			this.isDragging = true;
		}

		if(e.target.classList.contains('jumper')) {
			this.isSwitching = true;
			this.onClickJumper(e);
		}

		this.isSpeeding = this.speed > this.minSpeedingLimit ? true : false;
		this.isBreaking = this.isSpeeding && !this.isFloating && !this.isSwitching ? true : false;

		if(this.isBreaking) document.querySelector('body').classList.add('breaking');

		this.interval = setInterval(() => {
			if(this.isBreaking) this._friction += this.friction;

			if(this.isDragging) this._draggingTimer += 0.1;
		}, 100);
	}

	onMouseMove(e) {
		if(this.isDragging && !this.isSpeeding) {
			let CX = e.clientX;
			let CY = e.clientY;
			let DY = Math.abs(CY - this._startClientY);
			let DX = Math.abs(CX - this._startClientX);

			this._distance = Math.max(DY, DX);
			
			if(this.speed < this.maxSpeedLimit && this._draggingTimer > 0) {
				this.speed += (this._distance / 8000) / this._draggingTimer;
			}
		}

		if(this.isFloating) {
			this.$spinner.style.left = `${e.clientX}px`;
			this.$spinner.style.top = `${e.clientY}px`;

			this.$grip.style.left = `${e.clientX}px`;
			this.$grip.style.top = `${e.clientY}px`;
		}
	}

	onMouseUp(e) {
		clearInterval(this.interval);
		document.querySelector('body').classList.remove('breaking');

		this.$spinner.style.left = `50%`;
		this.$spinner.style.top = `50%`;
		this.$grip.style.left = `50%`;
		this.$grip.style.top = `50%`;

		this._friction = this.friction;
		this._startClientY = 0;
		this._startClientX = 0;

		this.isDragging = false;
		this.isFloating = false;
		this.isSwitching = false;
	}
}

window.addEventListener('load', () => { new Spinner(); });
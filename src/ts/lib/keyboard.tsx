import { I, C, Util, DataUtil, SmileUtil, Storage, focus } from 'ts/lib';
import { commonStore, authStore, blockStore } from 'ts/store';

const $ = require('jquery');
const Constant = require('json/constant.json');

class Keyboard {
	
	history: any = null;
	coords: any = { x: 0, y: 0 };
	timeoutPin: number = 0;
	pressed: any = {};
	match: any = {};
	
	isDragging: boolean = false;
	isResizing: boolean = false;
	isFocused: boolean = false;
	isPreviewDisabled: boolean = false;
	isMouseDisabled: boolean = false;
	isBackDisabled: boolean = false;
	
	init (history: any) {
		this.history = history;
		this.unbind();
		
		let win = $(window); 
		win.on('keydown.common', (e: any) => { this.onKeyDown(e); })
		win.on('keyup.common', (e: any) => { this.onKeyUp(e); });
	};
	
	unbind () {
		$(window).unbind('keyup.common keydown.common');
	};
	
	onKeyDown (e: any) {
		const { root } = blockStore;
		const { focused } = focus;
		
		let k = e.which;
		let rootId = this.isEditor() ? this.match.params.id : root;
		
		if (!this.isFocused) {
			if ((k == Key.backspace) && !this.isBackDisabled) {
				e.preventDefault();
				this.history.goBack();
			};
		};
		
		if (k == Key.escape) {
			e.preventDefault();
			commonStore.popupCloseAll();
			commonStore.menuCloseAll();
			Util.linkPreviewHide(false);
		};
		
		if (e.ctrlKey || e.metaKey) {
			
			// Navigation
			if ((k == Key.s) && !e.shiftKey) {
				commonStore.popupOpen('navigation', { 
					data: { 
						type: I.NavigationType.Go, 
					}, 
				});
			};

			if (k == Key.o) {
				commonStore.popupOpen('navigation', { 
					data: { 
						type: I.NavigationType.Go, 
						id: rootId,
					}, 
				});
			};

			// Create new page
			if (k == Key.n) {
				e.preventDefault();
				
				let targetId = '';
				let position = I.BlockPosition.Bottom;
				
				if (this.isEditor()) {
					const fb = blockStore.getLeaf(rootId, focused);
					if (fb) {
						if (fb.isTitle()) {
							const first = blockStore.getFirstBlock(rootId, 1, (it: I.Block) => { return it.isFocusable() && !it.isTitle(); });
							if (first) {
								targetId = first.id;
								position = I.BlockPosition.Top;
							};
						} else 
						if (fb.isFocusable()) {
							targetId = fb.id;
						};
					};
				};
				
				const details = { 
					iconEmoji: SmileUtil.random(), 
					name: Constant.default.name 
				};
				DataUtil.pageCreate(e, { history: this.history }, rootId, targetId, details, position);
			};
		};
		
		this.setPinCheck();
	};
	
	isEditor () {
		return this.match && this.match.params && (this.match.params.page == 'main') && (this.match.params.action == 'edit');
	};
	
	onKeyUp (e: any) {
		let k = e.which;
	};
	
	setPressed (k: number) {
		this.pressed[k] = true;
	};
	
	unsetPressed (k: number) {
		delete(this.pressed[k]);
	};
	
	countPressed () {
		return Util.objectLength(this.pressed);
	};
	
	setFocus (v: boolean) {
		this.isFocused = v;
	};
	
	setResize (v: boolean) {
		this.isResizing = v;
	};
	
	setDrag (v: boolean) {
		this.isDragging = v;
	};
	
	setPinCheck () {
		const { account } = authStore;
		const pin = Storage.get('pin');
		
		if (!pin || !account) {
			return;
		};
		
		window.clearTimeout(this.timeoutPin);
		this.timeoutPin = window.setTimeout(() => {
			const pin = Storage.get('pin');
			if (pin) {
				this.history.push('/auth/pin-check');				
			};
		}, 5 * 60 * 1000);
	};
	
	setMatch (match: any) {
		this.match = match;
	};
	
	disableBack (v: boolean) {
		this.isBackDisabled = v;
	};
	
	disableMouse (v: boolean) {
		this.isMouseDisabled = v;
	};
	
	disablePreview (v: boolean) {
		this.isPreviewDisabled = v;
	};
	
	setCoords (x: number, y: number) {
		this.coords = { x: x, y: y };
	};
	
	isArrow (k: number): boolean {
		return [ Key.up, Key.down, Key.left, Key.right ].indexOf(k) >= 0;
	};
	
	isSpecial (k: number): boolean {
		return this.isArrow(k) || [ Key.backspace, Key.tab, Key.enter ].indexOf(k) >= 0;
	};
	
};

export enum Key {
	backspace	 = 8,
	tab			 = 9,
	enter		 = 13,
	escape		 = 27,
	space		 = 32,
	left		 = 37,
	up			 = 38,
	right		 = 39,
	down		 = 40,
	a			 = 65,
	b			 = 66,
	c			 = 67,
	d			 = 68,
	e			 = 69,
	i			 = 73,
	k			 = 75,
	l			 = 76,
	n			 = 78,
	o			 = 79,
	p			 = 80,
	s			 = 83,
	v			 = 86,
	x			 = 88,
	y			 = 89,
	z			 = 90,
	slash		 = 191,
};

export let keyboard: Keyboard = new Keyboard();
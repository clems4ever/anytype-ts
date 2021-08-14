import * as React from 'react';
import { MenuItemVertical } from 'ts/component';
import { I, keyboard, Key, DataUtil } from 'ts/lib';
import { blockStore } from 'ts/store';

interface Props extends I.Menu {};

const $ = require('jquery');

class MenuBlockBackground extends React.Component<Props, {}> {
	
	n: number = 0;
	
	constructor (props: any) {
		super(props);
		
		this.onClick = this.onClick.bind(this);
	};

	render () {
		const active = this.getActive();
		const items = this.getItems();

		let id = 0;
		return (
			<div>
				{items.map((action: any, i: number) => {
					let inner = <div className={'inner bgColor bgColor-' + action.className} />;
					return (
						<MenuItemVertical 
							id={id++} 
							key={i} 
							{...action} 
							icon="color" 
							inner={inner} 
							checkbox={action.value == active} 
							onClick={(e: any) => { this.onClick(e, action); }} 
							onMouseEnter={(e: any) => { this.onOver(e, action); }} 
						/>
					);
				})}
			</div>
		);
	};
	
	componentDidMount () {
		this.unbind();
		$(window).on('keydown.menu', (e: any) => { this.props.onKeyDown(e); });
	};
	
	componentWillUnmount () {
		this.unbind();
	};
	
	unbind () {
		$(window).unbind('keydown.menu');
	};

	getActive () {
		const { param } = this.props;
		const { data } = param;
		const { blockId, rootId } = data;
		const block = blockStore.getLeaf(rootId, blockId);
		
		return block ? block.bgColor : 0;
	};
	
	getItems () {
		return DataUtil.menuGetBgColors();
	};
	
	onOver (e: any, item: any) {
		if (!keyboard.isMouseDisabled) {
			this.props.setActive(item, false);
		};
	};
	
	onClick (e: any, item: any) {
		const { param, close } = this.props;
		const { data } = param;
		const { onChange } = data;
		
		close();
		onChange(item.value);
	};
	
};

export default MenuBlockBackground;
import * as React from 'react';
import { Icon, Input, Cell } from 'ts/component';
import { I, C, DataUtil, Util } from 'ts/lib';
import { observer } from 'mobx-react';
import { commonStore, blockStore, dbStore } from 'ts/store';

interface Props extends I.BlockComponent {};

@observer
class BlockRelation extends React.Component<Props, {}> {

	refInput: any = null;
	refCell: any = null;

	constructor (props: any) {
		super(props);

		this.onMenu = this.onMenu.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onCellClick = this.onCellClick.bind(this);
	};

	render (): any {
		const { rootId, block, readOnly } = this.props;
		const { content } = block;
		const { key } = content;
		const details = blockStore.getDetails(rootId, rootId);
		const relation = dbStore.getRelation(rootId, key);

		return (
			<div className="wrap">
				{!relation ? 
				(
					<React.Fragment>
						<Icon className="relation default" />
						<Input id={'relation-type-' + block.id} ref={(ref: any) => { this.refInput = ref; }} placeHolder="New relation" onClick={this.onMenu} onKeyUp={this.onKeyUp} />
					</React.Fragment>
				) : 
				(
					<div className="sides">
						<div className="side left">
							<Icon className={'relation c-' + DataUtil.relationClass(relation.format)} />
							<div className="name">{relation.name}</div>
						</div>
						<div className="side right" onClick={this.onCellClick}>
							<Cell 
								id="0"
								ref={(ref: any) => { this.refCell = ref; }}
								rootId={rootId}
								block={block}
								relation={relation}
								data={[ details ]}
								index={0}
								viewType={I.ViewType.Grid}
								readOnly={readOnly}
							/>
						</div>
					</div>
				)}
			</div>
		);
	};

	onKeyUp (e: any) {
		const { menus } = commonStore;
		const menu = menus.find((item: I.Menu) => { return item.id == 'select'; });

		menu.param.data.options = this.getItems();
		commonStore.menuUpdate('select', menu.param);
	};

	onMenu (e: any) {
		const { rootId, block, readOnly } = this.props;
		const options = this.getItems();

		commonStore.menuOpen('select', {
			element: '#relation-type-' + block.id,
			offsetX: 0,
			offsetY: 4,
			type: I.MenuType.Vertical,
			vertical: I.MenuDirection.Bottom,
			horizontal: I.MenuDirection.Left,
			width: 320,
			data: {
				options: options,
				noClose: true,
				onSelect: (event: any, item: any) => {
					if (item.id == 'add') {
						commonStore.menuOpen('blockRelationList', { 
							element: '#menuSelect #item-add',
							type: I.MenuType.Vertical,
							offsetX: 320,
							offsetY: -36,
							vertical: I.MenuDirection.Bottom,
							horizontal: I.MenuDirection.Left,
							onClose: () => {
								commonStore.menuClose('select');
							},
							data: {
								relationKey: '',
								readOnly: readOnly,
								rootId: rootId,
								blockId: block.id, 
							},
						});
					} else {
						C.BlockRelationSetKey(rootId, block.id, item.id);
						commonStore.menuClose('select');
					};
				}
			}
		});
	};

	getItems () {
		const { rootId } = this.props;
		const filter = new RegExp(Util.filterFix(this.refInput.getValue()), 'gi');
		const relations = dbStore.getRelations(rootId);
		
		let options: any[] = [];
		for (let relation of relations) {
			if (relation.isHidden) {
				continue;
			};
			options.push({
				id: relation.key,
				icon: 'relation c-' + DataUtil.relationClass(relation.format),
				name: relation.name,
			});
		};

		if (filter) {
			options = options.filter((it: any) => {
				return it.name.match(filter);
			});
		};

		options.unshift({ id: 'add', icon: 'add', name: 'Add new' });

		return options;
	};

	onCellClick (e: any) {
		if (this.refCell) {
			this.refCell.onClick(e);
		};
	};

};

export default BlockRelation;
import * as React from 'react';
import { I } from 'ts/lib';
import { observer } from 'mobx-react';
import { blockStore } from 'ts/store';

import Cell from './cell';

interface Props extends I.BlockComponentTable {};

const BlockTableRow = observer(class BlockTableRow extends React.Component<Props, {}> {

	render () {
		const { rootId, block, index, getData } = this.props;
		const { columns } = getData();
		const childrenIds = blockStore.getChildrenIds(rootId, block.id);
		const children = blockStore.getChildren(rootId, block.id);
		const length = childrenIds.length;

		return (
			<div id={`row-${block.id}`} className="row">
				{columns.map((column: any, i: number) => {
					const child = children.find(it => it.id == [ block.id, column.id ].join('-'));
					return (
						<Cell 
							key={`cell-${block.id}-${column.id}`} 
							{...this.props}
							block={child}
							index={i}
							rowIdx={index}
							row={block}
							columnIdx={i}
							column={columns[i]}
						/>
					);
				})}
			</div>
		);
	};
	
});

export default BlockTableRow;
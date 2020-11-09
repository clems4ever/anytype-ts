import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { Storage } from 'ts/lib';
import { HeaderMainEdit as Header, FooterMainEdit as Footer, DragProvider, SelectionProvider, EditorPage } from 'ts/component';

interface Props extends RouteComponentProps<any> {};

const $ = require('jquery');

class PageMainEdit extends React.Component<Props, {}> {
	
	refHeader: any = null;

	constructor (props: any) {
		super(props);
		
		this.onOpen = this.onOpen.bind(this);
	};

	render () {
		const { history, location, match } = this.props;
		const rootId = match.params.id;
		
		return (
			<div>
				<SelectionProvider rootId={match.params.id}>
					<DragProvider {...this.props} rootId={rootId}>
						<Header ref={(ref: any) => { this.refHeader = ref; }} {...this.props} rootId={rootId} />
	
						<div className="wrapper">
							<EditorPage key="editorPage" isPopup={false} history={history} location={location} match={match} rootId={rootId} onOpen={this.onOpen} />
						</div>
					</DragProvider>
				</SelectionProvider>
				
				<Footer {...this.props} rootId={rootId} />
			</div>
		);
	};
	
	componentDidMount () {
		this.setId();

		const node = $(ReactDOM.findDOMNode(this));
		node.find('.header').hide();
	};
	
	componentDidUpdate () {
		this.setId();

		const node = $(ReactDOM.findDOMNode(this));
		node.find('.header').hide();
	};
	
	setId () {
		const { match } = this.props;
		Storage.set('pageId', match.params.id);
	};

	onOpen () {
		const node = $(ReactDOM.findDOMNode(this));
		node.find('.header').show();

		if (this.refHeader) {
			this.refHeader.forceUpdate();
		};
	};
	
};

export default PageMainEdit;
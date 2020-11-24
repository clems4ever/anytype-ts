import * as React from 'react';
import { Icon, IconUser, Error } from 'ts/component';
import { authStore } from 'ts/store';
import { observer } from 'mobx-react';
import { I, C, Util, DataUtil, Storage, translate } from 'ts/lib';

interface Props extends I.Menu { history: any; };

interface State {
	error: string;
};

@observer
class MenuAccount extends React.Component<Props, State> {
	
	state = {
		error: ''
	};

	constructor (props: any) {
		super(props);
		
		this.onSelect = this.onSelect.bind(this);
		this.onAdd = this.onAdd.bind(this); 
	};
	
	render () {
		const { account, accounts } = authStore;
		const { error } = this.state;
		
		const Item = (item: any) => (
			<div className={'item ' + (item.id == account.id ? 'active' : '')} onClick={(e) => { this.onSelect(e, item.id); }}>
				<IconUser className="c40" {...item} />
				<div className="info">
					<div className="name">{item.name}</div>
					<div className="description">
						<Icon className="check" />{Util.sprintf(translate('menuAccountPeer'), 0, 30)}
					</div>
				</div>
			</div>
		);
		
		return (
			<div className="items">
				<Error text={error} />

				{accounts.map((item: I.Account, i: number) => (
					<Item key={i} {...item} />
				))}
				
				<div className="item add" onClick={this.onAdd}>
					<Icon className="plus" />
					<div className="name">{translate('menuAccountAdd')}</div>
				</div>
			</div>
		);
	};
	
	componentDidMount () {
		const { path, accounts } = authStore;
		const phrase = Storage.get('phrase');
		
		if (!accounts.length) {
			authStore.accountClear();
			
			C.WalletRecover(path, phrase, (message: any) => {
				C.AccountRecover((message: any) => {
					Util.checkError(message.error.code);
					this.setState({ error: message.error.description });
				});
			});			
		};
	};
	
	onSelect (e: any, id: string) {
		const { path } = authStore;
		
		this.props.close();
		
		C.AccountSelect(id, path, (message: any) => {
			if (message.error.code) {
				Util.checkError(message.error.code);
			} else
			if (message.account) {
				Storage.set('accountId', id);
				authStore.accountSet(message.account);
				
				DataUtil.onAuth();
			};
		});
	};
	
	onAdd (e: any) {
		const { history } = this.props;
		history.push('/auth/register/add');
	};
	
};

export default MenuAccount;
import React, { Component } from 'react';
import Web3 from "web3"
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card} from 'material-ui/Card';


var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var BlockContractABI = [{"constant":true,"inputs":[],"name":"bal","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertiCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"_issuer","type":"address"},{"name":"_certName","type":"bytes32"}],"name":"Verify","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_certi_name","type":"bytes32"},{"name":"issuer_details","type":"bytes32[]"}],"name":"issueCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertificates","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[4][]"}],"payable":false,"type":"function"}]

var BlockContractAddress = '0xb43833ad1d38ef2af76f07eabc4441296b87676a';
var contract = new web3.eth.Contract(BlockContractABI,BlockContractAddress);

class VerifyComponent extends Component {

	constructor() {
		super();

		// Include name of user here too
		this.state = {
			issuer_address: '',
			user_address: '',
			subject: '',
			verified: false
		};
	}

	handleChange = (e) => {
 		let newState = {};

 		newState[e.target.name] = e.target.value;

 		this.setState(newState);
	};

    handleSubmit(event) {
		event.preventDefault();
		console.log(contract.methods.Verify(
				this.state.user_address,
				this.state.issuer_address,
				web3.utils.fromAscii(this.state.subject)
		).call().then(response=>this.setState({verified:response})))
    }

	render() {
		return(
			<div>
				<h1 className="weight-500">Verify Certificates</h1>
			    <form onSubmit={this.handleSubmit.bind(this)} className="formIssue floatCenter">
			    	<Card className="padding20 margin-10">
				        <TextField 
				        	name="user_address" 
				 	       	onChange={this.handleChange.bind(this)}
				        	floatingLabelText="User Address" 
				        	className="margin-10"
				        />
				        <TextField 
				        	name="issuer_address" 
				 	       	onChange={this.handleChange.bind(this)}
				        	floatingLabelText="Issuer Address" 
				        	className="margin-10"
				        />
				        <TextField 
				        	name="subject" 
				 	       	onChange={this.handleChange.bind(this)}
				        	floatingLabelText="Certificate Title" 
				        	className="margin-10 float-left"
				        />
				        <TextField 
				        	name="description" 
				 	       	onChange={this.handleChange.bind(this)}
				        	floatingLabelText="Certificate Description" 
				        	className="width-38"
				        	multiLine={true}
				        />
				    </Card>
			        <RaisedButton label="Verify" primary={true} type='submit' className="margin-10"/>
			    </form>
			    Verified = {String(this.state.verified)}
		    </div>
		)
	}
};

export default VerifyComponent;

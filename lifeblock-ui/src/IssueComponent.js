import React, { Component } from 'react';
import Web3 from "web3"

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var BlockContractABI = [{"constant":true,"inputs":[],"name":"bal","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertiCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"_issuer","type":"address"},{"name":"_certName","type":"bytes32"}],"name":"Verify","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"index","type":"uint256"}],"name":"getCertificate","outputs":[{"name":"certi_name","type":"bytes32"},{"name":"issuer_key","type":"address"},{"name":"issuedOn","type":"uint256"},{"name":"issuerDetails","type":"bytes32[4]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_certi_name","type":"bytes32"},{"name":"issuer_details","type":"bytes32[]"}],"name":"issueCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"}]
var BlockContractAddress = '0x960d22757b563ff7a986cffea8d6d10a1c3b8555';
var contract = new web3.eth.Contract(BlockContractABI,BlockContractAddress);

class IssueComponent extends Component {

	constructor() {
		super();

		this.state = {
			address: '',
			subject: '',
			count:0,
			thisAddress:'',
			issuer_name: '',
			issuer_url: '',
			issuer_telephone: '',
			issuer_email: '',
		};
		web3.eth.getAccounts().then(r=>this.setState({thisAddress:r[0]}))
		contract.methods.getCertiCount('0xbe84a3d5c8b712532192de4b3257453c5b0a740b')
			.call().then((response)=>{this.setState({count:response})})
	}

	handleChange = (e) => {
 		let newState = {};

 		newState[e.target.name] = e.target.value;

 		this.setState(newState);
	};

    handleSubmit(event) {
		event.preventDefault();
		let issuerArray = [
			web3.utils.fromAscii(this.state.issuer_name),
			web3.utils.fromAscii(this.state.issuer_url),
			web3.utils.fromAscii(this.state.issuer_email),
			web3.utils.fromAscii(this.state.issuer_telephone),
		]
		console.log(contract.methods.issueCertificate(
				this.state.address,
				web3.utils.fromAscii(this.state.subject),
				issuerArray
		).send({
			from: this.state.thisAddress, 
			gas:200000
		}).then(p=>{console.log(p)}))
    }

	render() {
		return(
			<div>
				{this.state.count}
				<h1>Issue Certificates</h1>
			    <form onSubmit={this.handleSubmit.bind(this)}>
			    	<label>Address </label>
			        <input type="text" name="address" onChange={this.handleChange.bind(this)}/>
			        <br/>
			        <label>Subject </label>
			        <input type="text" name="subject" onChange={this.handleChange.bind(this)}/>
			        <br/>
			        <h3>Issuer Details</h3>
			        <label>Name </label>
			        <input type="text" name="issuer_name" onChange={this.handleChange.bind(this)}/>
			        <br/>
			        <label>URL </label>
			        <input type="text" name="issuer_url" onChange={this.handleChange.bind(this)}/>
			        <br/>
			        <label>Email </label>
			        <input type="text" name="issuer_email" onChange={this.handleChange.bind(this)}/>
			        <br/>
			        <label>Telephone </label>
			        <input type="text" name="issuer_telephone" onChange={this.handleChange.bind(this)}/>
			        <br/>
			        <input type='submit'/>
			    </form>
			    <hr/>
		    </div>
		)
	}
};

export default IssueComponent;

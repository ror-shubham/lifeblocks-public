import React, { Component } from 'react';
import Web3 from "web3"

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var BlockContractABI = [{"constant":true,"inputs":[],"name":"bal","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertiCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"_issuer","type":"address"},{"name":"_certName","type":"bytes32"}],"name":"Verify","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"index","type":"uint256"}],"name":"getCertificate","outputs":[{"name":"certi_name","type":"bytes32"},{"name":"issuer_key","type":"address"},{"name":"issuedOn","type":"uint256"},{"name":"issuerDetails","type":"bytes32[4]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_certi_name","type":"bytes32"},{"name":"issuer_details","type":"bytes32[]"}],"name":"issueCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"}]

var BlockContractAddress = '0x960d22757b563ff7a986cffea8d6d10a1c3b8555';
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
				<h1>Verify Certificates</h1>
			    <form onSubmit={this.handleSubmit.bind(this)}>
			    	<label>User Address </label>
			        <input type="text" name="user_address" onChange={this.handleChange.bind(this)}/>
			        <br/>
			        <label>Issuer Address </label>
			        <input type="text" name="issuer_address" onChange={this.handleChange.bind(this)}/>
			        <br/>
			        <label>Subject </label>
			        <input type="text" name="subject" onChange={this.handleChange.bind(this)}/>
			        <br/>
			        <input type='submit'/>
			    </form>
			    Verified = {String(this.state.verified)}
			    <hr/>
		    </div>
		)
	}
};

export default VerifyComponent;

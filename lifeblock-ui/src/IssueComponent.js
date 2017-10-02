import React, { Component } from 'react';
import Web3 from "web3"
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card} from 'material-ui/Card';


var BlockContractABI = [{"constant":true,"inputs":[],"name":"bal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertiCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"_issuer","type":"address"},{"name":"_certName","type":"bytes32"}],"name":"Verify","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_certi_name","type":"bytes32"},{"name":"issuer_details","type":"bytes32[]"}],"name":"issueCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertificates","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[4][]"}],"payable":false,"stateMutability":"view","type":"function"}]

var BlockContractAddress = '0x2540a939ed59ddbffde373a5c5e359e2531a538c';

var web3
var contract

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
	
	}

	componentDidMount() {
         window.addEventListener('load', function() {

         // Checking if Web3 has been injected by the browser (Mist/MetaMask)
         	let web3 = window.web3
            if (typeof web3 !== 'undefined') {
                 // Use Mist/MetaMask's provider
                 window.web3 = new Web3(web3.currentProvider);
                 console.log("web3 injected")
             } else {
                 console.log('No web3? You should consider trying MetaMask!')
                 // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
                 window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/I5HrJaXPv6hlCajZDJVD"));
         }
         var contractObject =  web3.eth.contract(BlockContractABI)
         contract = contractObject.at(BlockContractAddress);
         })
    }

	handleChange = (e) => {
 		let newState = {};

 		newState[e.target.name] = e.target.value;

 		this.setState(newState);
	};

    handleSubmit(event) {
    	event.preventDefault()
    	let web3 = window.web3
    	console.log(web3)
		let issuerArray = [
			web3.utils.fromUtf8(this.state.issuer_name),
			web3.utils.fromUtf8(this.state.issuer_url),
			web3.utils.fromUtf8(this.state.issuer_email),
			web3.utils.fromUtf8(this.state.issuer_telephone),
		]
		console.log(this.state)
		console.log(contract.issueCertificate(
				this.state.address,
				web3.utils.fromUtf8(this.state.subject),
				issuerArray
		).send({
			
			gas:200000
		}).then(p=>{console.log(p)}))
    }

	render() {
		return(
			<div className = "margin10">
				<h1 className="weight-500">Issue Certificates</h1>
			    <form onSubmit={this.handleSubmit.bind(this)} className="formIssue floatCenter">
			    	<Card className="padding20 margin-10">
			    	<h4 className="margin-bottom0 padding-top-10 weight-500">Certificate Details</h4>
			    	<TextField 
			        	name="address" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="Recipient Address" 
			        	className="margin-10"
			        />
			        <TextField 
			        	name="subject" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="Certificate Title" 
			        	className="margin-10"
			        />
			        <TextField 
			        	name="description" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="Certificate Description" 
			        	className="width-38"
			        	multiLine={true}
			        	fullWidth={true}
			        />
			        </Card>

			        <Card className="padding20 margin-10">
			        <h4 className="margin-bottom0 padding-top-10 weight-500">Issuer Details</h4>
			        <TextField 
			        	name="issuer_name" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="Name" 
			        	className="margin-10"
			        />

			        <TextField 
			        	name="issuer_url" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="URL" 
			        	className="margin-10"
			        />

			        <TextField 
			        	name="issuer_email" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="Email" 
			        	className="margin-10"
			        />

			        <TextField 
			        	name="issuer_telephone" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="Telephone" 
			        	className="margin-10"
			        />
			        </Card>
			        <RaisedButton label="Issue" primary={true} type='submit' className="margin10"/>
			    </form>
		    </div>
		)
	}
};

export default IssueComponent;

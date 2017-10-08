import React, { Component } from 'react';
import Web3 from "web3"
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card} from 'material-ui/Card';


var BlockContractABI = [{"constant":true,"inputs":[],"name":"bal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertiCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_certi_name","type":"bytes32"},{"name":"_description","type":"bytes32"},{"name":"issuer_details","type":"bytes32[]"}],"name":"issueCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"_issuer","type":"address"},{"name":"_certName","type":"bytes32"},{"name":"_description","type":"bytes32"}],"name":"Verify","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertificates","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[4][]"}],"payable":false,"stateMutability":"view","type":"function"}]

var BlockContractAddress = '0x3bf1ca6f8fb6fd39f5f65a28e76d67ba87523f41';

var web3
var contract

var _ = require('lodash');


class IssueComponent extends Component {

	constructor() {
		super();

		this.state = {
			address: '',
			subject: '',
			description:'',
			count:0,
			thisAddress:'',
			issuer_name: '',
			issuer_url: '',
			issuer_telephone: '',
			issuer_email: '',
			valid:{
				'address':true, 
				'subject':true, 
				'description': true
			}
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
                window.web3 = new Web3(new Web3.providers.HttpProvider(
                	"https://rinkeby.infura.io/I5HrJaXPv6hlCajZDJVD"
                ));
        	}
        	contract = new window.web3.eth.Contract(BlockContractABI,BlockContractAddress);
        	let defaultAccount = window.web3.eth.defaultAccount

        })
        window.onload =() => {
        	console.log(window.web3.eth.getAccounts().then( result=>
        		this.setState({'thisAddress':result[0]})
        	))
        	
        }
        	
         
    }

	handleChange = (e) => {
 		let newState = {};

 		newState[e.target.name] = e.target.value;

 		this.setState(newState);
	};

	handleChangeText = (e) => {
		web3=window.web3
		console.log(web3.version)
 		let newState = {};
 		newState.valid = this.state.valid
 		newState[e.target.name] = e.target.value;
 		newState['valid'][e.target.name] = (e.target.value.length!=0)
 		this.setState(newState);
	};
	handleChangeAddress = (e) => {
		let web3 = window.web3
 		let newState = {};
 		newState.valid = this.state.valid
 		newState[e.target.name] = e.target.value;
 		newState['valid'][e.target.name] = web3.utils.isAddress(e.target.value);
 		this.setState(newState);
 		this.state.valid[e.target.name]=web3.utils.isAddress(e.target.value);
 		console.log(_.every(_.values(this.state.valid), function(v) {return v;}))
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

		let address_valid = web3.utils.isAddress(this.state.address)
		let subject_valid = this.state.subject.length!=0
		let description_valid = this.state.description.length!=0

		console.log(this.state.thisAddress)

		if (address_valid&&subject_valid&&description_valid){
			console.log(contract.methods.issueCertificate(
					this.state.address,
					web3.utils.fromUtf8(this.state.subject),
					web3.utils.fromUtf8(this.state.description),
					issuerArray
			).send({
				from: this.state.thisAddress,
				gas: 4818772
			}).then(result=>{
				this.setState ({
					address: '',
					subject: '',
					description:'',
					count:0,
					issuer_name: '',
					issuer_url: '',
					issuer_telephone: '',
					issuer_email: '',
					valid:{
						'address':true, 
						'subject':true, 
						'description': true
					}
				});
				console.log(result)
			}))
		}else{
			this.setState({
				valid: {
					address:address_valid ,
					subject: subject_valid,
					description: description_valid
				}
			})
		}
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
			 	       	onChange={this.handleChangeAddress.bind(this)}
			        	floatingLabelText="Recipient Address" 
			        	className="margin-10"
			        	value={this.state.address}
			        	errorText={this.state.valid['address']?"":"Enter valid address"}
			        />
			        <TextField 
			        	name="subject" 
			 	       	onChange={this.handleChangeText.bind(this)}
			        	floatingLabelText="Certificate Title" 
			        	className="margin-10"
			        	value={this.state.subject}
			        	errorText={this.state.valid['subject']?"":"This field should not be empty"}
				     
			        />
			        <TextField 
			        	name="description" 
			 	       	onChange={this.handleChangeText.bind(this)}
			        	floatingLabelText="Certificate Description" 
			        	className="width-38"
			        	multiLine={true}
			        	fullWidth={true}
			        	value={this.state.description}
			       		errorText={this.state.valid['description']?"":"This field should not be empty"}
			        />
			        </Card>

			        <Card className="padding20 margin-10">
			        <h4 className="margin-bottom0 padding-top-10 weight-500">Issuer Details</h4>
			        <TextField 
			        	name="issuer_name" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="Name" 
			        	className="margin-10"
			        	value={this.state.issuer_name}
			        />

			        <TextField 
			        	name="issuer_url" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="URL" 
			        	className="margin-10"
			        	value={this.state.issuer_url}
			        />

			        <TextField 
			        	name="issuer_email" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="Email" 
			        	className="margin-10"
			        	value={this.state.issuer_email}
			        />

			        <TextField 
			        	name="issuer_telephone" 
			 	       	onChange={this.handleChange.bind(this)}
			        	floatingLabelText="Telephone" 
			        	className="margin-10"
			        	value={this.state.issuer_telephone}
			        />
			        </Card>
			        <RaisedButton label="Issue" primary={true} type='submit' className="margin10"/>
			    </form>
		    </div>
		)
	}
};

export default IssueComponent;

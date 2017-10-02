import React, { Component } from 'react';
import Web3 from "web3"
import _ from "lodash"
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Card} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var BlockContractABI = [{"constant":true,"inputs":[],"name":"bal","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertiCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"_issuer","type":"address"},{"name":"_certName","type":"bytes32"}],"name":"Verify","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_certi_name","type":"bytes32"},{"name":"issuer_details","type":"bytes32[]"}],"name":"issueCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertificates","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[4][]"}],"payable":false,"type":"function"}]

var BlockContractAddress = '0xb43833ad1d38ef2af76f07eabc4441296b87676a';
var contract = new web3.eth.Contract(BlockContractABI,BlockContractAddress);

class CertificatesComponent extends Component {

	constructor() {
		super();

		// Include name of user here too
		this.state = {
			user_address: '',
			certi_names:[],
			issuer_addresses:[],
			issuedOn:[],
			issuerDetails: []
		};
	}

	handleChange = (e) => {
 		let newState = {};

 		newState[e.target.name] = e.target.value;

 		this.setState(newState);
	};

    handleSubmit(event) {
		event.preventDefault();
		console.log(contract.methods.getCertificates(
				this.state.user_address,
		).call().then(response=>this.setState({
			certi_names: response[0],
			issuer_addresses: response[1],
			issuedOn:response[2],
			issuerDetails:response[3]

		})))
    }

	render() {
		var TableRows = []
		_.each(this.state.certi_names, (value, index)=>{
			var issuerDetails = [];
			_.each(this.state.issuerDetails[index], (value, ind)=>{
				issuerDetails.push(<TableRowColumn>{web3.utils.hexToUtf8(this.state.issuerDetails[index][ind])}</TableRowColumn>)
			})

			var issuedOnDate = new Date(parseInt(this.state.issuedOn[index]))
			var issuedOnString = issuedOnDate.toLocaleDateString()
			TableRows.push(
				<TableRow>
					<TableRowColumn>{web3.utils.hexToUtf8(this.state.certi_names[index])}</TableRowColumn>
					<TableRowColumn>{this.state.issuer_addresses[index]}</TableRowColumn>
					<TableRowColumn>{issuedOnString}</TableRowColumn>
					{issuerDetails}
				</TableRow>
			)
		});

		return(
			<div>
				<h1 className="weight-500">View Your Certificates</h1>
				
			    <form onSubmit={this.handleSubmit.bind(this)} className="formIssue floatCenter margin-bottom-10">
				    <Paper className= "padding10">    
				        <TextField 
				        	name="user_address" 
				 	       	onChange={this.handleChange.bind(this)}
				        	floatingLabelText="Enter User Address" 
				        />
				        <br/>
				        <RaisedButton label="Get" primary={true} type='submit' />      
				    </Paper>  
			    </form>
				
				{this.state.certi_names.length!=0 ? 
					<Table>
			    	<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
			    		<TableRow>
			    			<TableHeaderColumn>Title</TableHeaderColumn>
			    			<TableHeaderColumn>IssuerAddress</TableHeaderColumn>
			    			<TableHeaderColumn>IssuedOn</TableHeaderColumn>
			    			<TableHeaderColumn>IssuerName</TableHeaderColumn>
			    			<TableHeaderColumn>IssuerUrl</TableHeaderColumn>
			    			<TableHeaderColumn>IssuerEmail</TableHeaderColumn>
			    			<TableHeaderColumn>IssuerTelephone</TableHeaderColumn>
			    		</TableRow>
			    	</TableHeader>
			    	<TableBody displayRowCheckbox={false}>
			    		{TableRows}
			    	</TableBody>
			    </Table>
			    :''}
			    
		    </div>
		)
	}
};

export default CertificatesComponent;

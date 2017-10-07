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




var BlockContractABI = [{"constant":true,"inputs":[],"name":"bal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertiCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipient","type":"address"},{"name":"_certi_name","type":"bytes32"},{"name":"_description","type":"bytes32"},{"name":"issuer_details","type":"bytes32[]"}],"name":"issueCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"_issuer","type":"address"},{"name":"_certName","type":"bytes32"},{"name":"_description","type":"bytes32"}],"name":"Verify","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"getCertificates","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[4][]"}],"payable":false,"stateMutability":"view","type":"function"}]

var BlockContractAddress = '0x3bf1ca6f8fb6fd39f5f65a28e76d67ba87523f41';
var web3
var contract

class CertificatesComponent extends Component {

	constructor() {
		super();

		// Include name of user here too
		this.state = {
			user_address: '',
			valid: true,
			certi_names:[],
			descriptions:[],
			issuer_addresses:[],
			issuedOn:[],
			issuerDetails: [],
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
         })
    }

	handleChange = (e) => {
		let web3 = window.web3
		console.log(web3.version)
 		let newState = {};

 		newState[e.target.name] = e.target.value;
 		newState['valid'] = web3.utils.isAddress(e.target.value);
 		this.setState(newState);
	};

    handleSubmit(event) {
		event.preventDefault();
		let web3 = window.web3
		console.log(web3.version)
		let user_address_valid = web3.utils.isAddress(this.state.user_address)
		
		if (user_address_valid){
			console.log(contract.methods.getCertificates(
					this.state.user_address,
			).call().then(response=>{
					this.setState({
						certi_names: response[0],
						descriptions: response[1],
						issuer_addresses: response[2],
						issuedOn:response[3],
						issuerDetails:response[4],
						user_address:''
					});
					if (response[0].length==0){
						alert("Nothing found")
					}
					console.log(response)
				}
			))
		}else{
			this.setState({
				valid:user_address_valid
			})
		}
    }

	render() {
		let web3 = window.web3
		var TableRows = []
		_.each(this.state.certi_names, (value, index)=>{
			var issuerDetails = [];
			_.each(this.state.issuerDetails[index], (value, ind)=>{
				issuerDetails.push(
					<TableRowColumn>
						{web3.utils.toAscii(this.state.issuerDetails[index][ind])}
					</TableRowColumn>
				)
			})

			var issuedOnDate = new Date(parseInt(this.state.issuedOn[index]))
			var issuedOnString = issuedOnDate.toLocaleDateString()
			TableRows.push(
				<TableRow>
					<TableRowColumn>
						{web3.utils.toAscii(this.state.certi_names[index])}
					</TableRowColumn>
					<TableRowColumn>
						{web3.utils.toAscii(this.state.descriptions[index])}
					</TableRowColumn>
					<TableRowColumn>{this.state.issuer_addresses[index]}</TableRowColumn>
					<TableRowColumn>{issuedOnString}</TableRowColumn>
					issuedOnString
					{issuerDetails}
				</TableRow>
			)
		});

		return(
			<div>
				<h1 className="weight-500">View Your Certificates</h1>
				
			    <form 
			    	onSubmit={this.handleSubmit.bind(this)} 
			    	className="formIssue floatCenter margin-bottom-10"
			    >
				    <Paper className= "padding10">    
				        <TextField 
				        	name="user_address" 
				 	       	onChange={this.handleChange.bind(this)}
				        	floatingLabelText="Enter User Address" 
				        	value={this.state.user_address}
				        	errorText={this.state.valid?"":"Enter valid address"}
				        />
				        <br/>
				        <RaisedButton 
				        	label="Get" 
				        	primary={true} 
				        	type='submit' 
				        />      
				    </Paper>  
			    </form>
				
				{this.state.certi_names.length!=0 ? 
					<Table>
			    	<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
			    		<TableRow>
			    			<TableHeaderColumn>Title</TableHeaderColumn>
			    			<TableHeaderColumn>Description</TableHeaderColumn>
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

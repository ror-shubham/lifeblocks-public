import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import IssueComponent from "./IssueComponent"
import VerifyComponent from "./VerifyComponent"
import HomeComponent from "./HomeComponent"
import CertificatesComponent from "./CertificatesComponent"
import Header from './Header'

var Route = require('react-router-dom').Route


class App extends Component {

	
    render() {
    	
        return (
        	<MuiThemeProvider>
	        	<BrowserRouter>
			        <div className="App">
			        	<Header/>
			        	<Route exact path="/" component={HomeComponent}/>
			        	<Route path="/issue" component={IssueComponent}/>
			        	<Route path="/verify" component={VerifyComponent}/>
			        	<Route path="/certificates" component={CertificatesComponent}/>         
			        </div>
			    </BrowserRouter>
			</MuiThemeProvider>
        );
    }
}

export default App;

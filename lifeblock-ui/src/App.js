import React, { Component } from 'react';
import './App.css';
import IssueComponent from "./IssueComponent"
import VerifyComponent from "./VerifyComponent"


class App extends Component {

	
    render() {
    	
        return (
        <div className="App">
        		<IssueComponent/>
        		<VerifyComponent/>            
        </div>
        );
    }
}

export default App;

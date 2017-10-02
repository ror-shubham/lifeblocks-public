import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

var logo =  require('./img/logo.png')

class Header extends Component{
	render(){
		return(
			<div className="">
				<a href="/"><img src={logo} className="logoIcon"></img></a>
				<RaisedButton label="About Us" className="float-right margin10" />
				<div style={{clear:'both'}}></div>
			</div>
		)
	}
}

export default Header;
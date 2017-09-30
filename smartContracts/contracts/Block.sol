pragma solidity ^0.4.0;
contract Block{
    
    mapping (address => User) Users;

    uint public bal = 120;

    struct User{
        Certificate[] certificates;
    }

    struct Certificate{
        bytes32 certi_name;
        bytes32 description;
        Issuer issuer;
        //Recipient recipient;
        uint issuedOn;
        //uint expires;
    }

    struct Issuer{
        address publickey;
        bytes32 name;
        bytes32 url;
        bytes32 email;
        bytes32 telephone;
    }
    
    //just check for address of issuer and certiname for now
    function Verify(
    	address _user, 
    	address _issuer, 
    	bytes32 _certName
    ) public constant returns (bool success){
        var certificates = Users[_user].certificates;
        for (uint i=0; i<certificates.length; i++){
            if (
            	(certificates[i].issuer.publickey==_issuer) && 
            	(sha3(certificates[i].certi_name) == sha3(_certName))
            ){
                return true;
            }
        }
        return false;
    }

    function issueCertificate(
    	address _recipient, 
    	bytes32 _certi_name, 
    	bytes32[] issuer_details
    ) public returns (bool){ 
        User storage u = Users[_recipient];
        Certificate memory certificate;

        certificate.issuer.publickey = msg.sender;
        certificate.issuer.name = issuer_details[0];
        certificate.issuer.url = issuer_details[1];
        certificate.issuer.email = issuer_details[2];
        certificate.issuer.telephone = issuer_details[2];

        certificate.certi_name = _certi_name;

        certificate.issuedOn = now;
        var p = u.certificates;
        p.push(certificate);
        return true;
    }

    function getCertiCount(address _user) public constant returns(uint){
        return Users[_user].certificates.length;
    }
    
    function getCertificate(address _user, uint index) public constant returns(
        bytes32 certi_name,
        address issuer_key,
        uint issuedOn,
        bytes32[4] issuerDetails
    ){
        var length = getCertiCount(_user);
        require(index<length);
        var certificate = Users[_user].certificates[index];
        issuerDetails=[
        	certificate.issuer.name,
        	certificate.issuer.url,
        	certificate.issuer.email,
        	certificate.issuer.telephone
        ];
        return (
        	certificate.certi_name, 
        	certificate.issuer.publickey, 
        	certificate.issuedOn, 
        	issuerDetails
        );
    }

}

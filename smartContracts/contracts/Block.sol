pragma solidity ^0.4.0;
contract Block{
    
    mapping (address => User) Users;

    struct User{
        Certificate[] certificates;
    }

    struct Certificate{
        bytes32 certi_name;
        //bytes32 description;
        Issuer issuer;
        //Recipient recipient;
        uint issuedOn;
        //uint expires;
    }

    struct Issuer{
        address publickey;
        //bytes32 name;
        //bytes32 url;
        //bytes32 email;
        //bytes32 telephone;
    }
    
    //just check for address of issuer and certiname for now
    function Verify(address _user, address _issuer, bytes32 _certName) public constant returns (bool success){
        var certificates = Users[_user].certificates;
        for (uint i=0; i<certificates.length; i++){
            if ((certificates[i].issuer.publickey==_issuer) && (certificates[i].certi_name == _certName)){
                return true;
            }
        }
        return false;
    }

    function issueCertificate(address _recipient, bytes32 _certi_name) public returns (bool){ 
        User storage u = Users[_recipient];
        Certificate memory c;
        c.issuer.publickey = msg.sender;
        c.certi_name = _certi_name;
        c.issuedOn = now;
        var p = u.certificates;
        p.push(c);
        return true;
    }

    function getCertiCount(address _user) public constant returns(uint){
        return Users[_user].certificates.length;
    }
    
    function getCertificate(address _user, uint index) public constant returns(
        bytes32 certi_name,
        address issuer_key,
        uint issuedOn
    ){
        var length = getCertiCount(_user);
        require(index<length);
        var certificate = Users[_user].certificates[index];
        return (certificate.certi_name, certificate.issuer.publickey, certificate.issuedOn);
    }

}

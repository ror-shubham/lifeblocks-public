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
    function Verify(address _user, address _issuer, bytes32 _certName) constant returns (bool success){
        var certificates = Users[_user].certificates;
        for (uint i=0; i<certificates.length; i++){
            if ((certificates[i].issuer.publickey==_issuer) && (certificates[i].certi_name == _certName)){
                return true;
            }
        }
        return false;
    }

    function issueCertificate(address _recipient, bytes32 _certi_name) returns (bool sucess){
        User storage u = Users[_recipient];
        Certificate memory c;
        c.issuer.publickey = msg.sender;
        c.certi_name = _certi_name;
        c.issuedOn = now;
        var p = u.certificates;
        p.push(c);
        return true;
    }
    
}

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
    
    //just for testing
    function getCerti(address _address) constant returns (address _add){
        var p = Users[_address].certificates[0].issuer.publickey;
        return p;
    }
    

    function issueCertificate(address _recipient, bytes32 _certi_name) returns (bool _bool){
        User storage u = Users[_recipient];
        Certificate memory c;
        c.issuer.publickey = msg.sender;
]        c.certi_name = _certi_name;
        c.issuedOn = now;
        var p = u.certificates;
        p.push(c);
        return true ;
    }
    
}

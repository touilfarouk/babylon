import React from "react";
import { Detector } from "react-detect-offline";
import {MdSignalWifiConnectedNoInternet4} from 'react-icons/md';
const CheckConnection =props =>{
    return(<>
    <Detector
    render={({online})=>(
         online?props.children:<div style={{paddingTop:'10px',textAlign:'center',}}>

            <h1 style={{marginBottom:'15px',marginTop:'50px'}}>Erreur de connection  </h1>
            <span style={{fontSize:"70px"}}><MdSignalWifiConnectedNoInternet4/></span>
            <h4>Verifier votre connetion !</h4>
         </div>
    )}
    />

    </>)
}
export default CheckConnection;
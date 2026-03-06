import React from 'react';
import MyWallet from './MyWallet';

// This component renders the MyWallet page with deposit view
export default function Deposit() {
    return <MyWallet isDeposit={true} />;
}
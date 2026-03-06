import React from 'react';
import MyWallet from './MyWallet';

// This component renders the MyWallet page with withdrawal view
export default function Withdrawal() {
    return <MyWallet isDeposit={false} />;
}
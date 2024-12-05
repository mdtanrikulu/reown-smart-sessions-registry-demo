import { toHex } from 'viem';
import { useRegistryContext } from '../context/RegistryContextProvider';
import { getSampleAsyncRegistryPermissions } from '@/utils/RegistryUtils';
import {
  grantPermissions,
  SmartSessionGrantPermissionsRequest,
} from '@reown/appkit-experimental/smart-session';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

export function useRegistry() {
  const { setSmartSession } = useRegistryContext();
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  async function createCommitStrategy() {
    if (!chainId || !address) {
      throw new Error('Wallet not connected');
    }

    const getDappKeyResponse = await fetch('/api/signer', {
      method: 'GET',
    });
    const dappSignerData = await getDappKeyResponse.json();
    const dAppECDSAPublicKey = dappSignerData.key;
    const sampleRegistryPermissions = getSampleAsyncRegistryPermissions();
    const grantRegistryPermissions: SmartSessionGrantPermissionsRequest = {
      // Adding 24 hours to the current time
      expiry: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      chainId: toHex(chainId),
      address: address as `0x${string}`,
      signer: {
        type: 'keys',
        data: {
          keys: [
            {
              type: 'secp256k1',
              publicKey: dAppECDSAPublicKey,
            },
          ],
        },
      },
      permissions: sampleRegistryPermissions['permissions'],
      policies: sampleRegistryPermissions['policies'] || [],
    };
    const approvedPermissions = await grantPermissions(
      grantRegistryPermissions
    );

    setSmartSession({
      grantedPermissions: approvedPermissions,
    });
  }

  return {
    createCommitStrategy,
  };
}

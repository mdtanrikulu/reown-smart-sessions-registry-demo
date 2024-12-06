import { SmartSessionGrantPermissionsRequest } from '@reown/appkit-experimental/smart-session';
import {
  abi as registryContractAbi,
  address as registryContractAddress,
} from './RegistryContract';

export function getSampleAsyncRegistryPermissions(): Omit<
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  SmartSessionGrantPermissionsRequest,
  'signer' | 'chainId' | 'address' | 'expiry'
> {
  return {
    permissions: [
      {
        type: 'contract-call',
        data: {
          address: registryContractAddress,
          abi: registryContractAbi,
          functions: [
            {
              functionName: 'increament1',
            },
            {
              functionName: 'increament2',
            },
          ],
        },
      },
    ],
    policies: [],
  };
}

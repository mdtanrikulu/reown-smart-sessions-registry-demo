import {
  abi as registryContractAbi,
  address as registryContractAddress,
} from '@/utils/RegistryContract';
import { executeActionsWithECDSAKey } from '@/utils/ERC7715PermissionsAsyncUtils';
import { NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { SmartSessionGrantPermissionsResponse } from '@reown/appkit-experimental/smart-session';
import { getChain } from '@/utils/ChainsUtil';

// Helper function to validate request inputs
const validateRequestInputs = (
  permissions: SmartSessionGrantPermissionsResponse,
  privateKey: string | undefined
) => {
  if (!privateKey) throw new Error('No application signer');
  if (!permissions || !permissions.context || !permissions.address)
    throw new Error('No permissions provided');
};

// Helper function to validate chain ID and get chain object
const getValidatedChain = (chainIdHex: string) => {
  const chainId = parseInt(chainIdHex, 16);
  if (!chainId)
    throw new Error('Chain ID not available in granted permissions');

  const chain = getChain(chainId);
  if (!chain) throw new Error('Unknown chainId');
  return chain;
};

// Helper function to construct purchase call data
const getRegistryCommitCallData = () =>
  encodeFunctionData({
    abi: registryContractAbi,
    functionName: 'increament1',
  });

const getRegistryRevealCallData = () =>
  encodeFunctionData({
    abi: registryContractAbi,
    functionName: 'increament2',
  });

// Main handler function for POST request
export async function POST(request: Request) {
  try {
    const {
      permissions,
    }: {
      permissions: SmartSessionGrantPermissionsResponse;
    } = await request.json();
    const APPLICATION_PRIVATE_KEY = process.env
      .APPLICATION_PRIVATE_KEY as `0x${string}`;
    // Validate inputs and get chain
    validateRequestInputs(permissions, APPLICATION_PRIVATE_KEY);

    const chain = getValidatedChain(permissions.chainId);

    // Create purchase call data
    const registryCommitCallData = getRegistryCommitCallData();
    const registryCommitCallDataExecution = [
      {
        to: registryContractAddress as `0x${string}`,
        value: parseEther('0'),
        data: registryCommitCallData,
      },
    ];
    // Execute the actions using ECDSA key
    await executeActionsWithECDSAKey({
      ecdsaPrivateKey: APPLICATION_PRIVATE_KEY,
      actions: registryCommitCallDataExecution,
      chain,
      accountAddress: permissions.address,
      permissionsContext: permissions.context,
    });

    return NextResponse.json(
      { message: 'Successfully executed.' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

// Helper function to handle and log errors
const handleError = (error: unknown) => {
  const errorMessage = getErrorMessage(error);
  console.error('Error interacting with contract:', errorMessage);
  return NextResponse.json(
    { message: errorMessage, error: errorMessage },
    { status: 500 }
  );
};

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return Object.prototype.toString.call(error);
  }
};

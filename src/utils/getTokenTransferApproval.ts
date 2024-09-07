import ERC20_ABI from 'abis/erc20.json'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from 'constants/addresses'
import { JSON_RPC_FALLBACK_ENDPOINTS } from 'constants/jsonRpcEndpoints'
import { BigNumber, ethers } from 'ethers'

import { SupportedChainId } from '..'

export async function getTokenTransferApproval(address: string, amount: BigNumber, chainId: SupportedChainId) {
  // const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_FALLBACK_ENDPOINTS?.[chainId]?.[0])

  const tokenContract = new ethers.Contract(address, ERC20_ABI, provider)

  return tokenContract.approve(NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, amount)
}

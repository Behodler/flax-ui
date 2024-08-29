import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  anvil
} from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '98df940da8fbb420169609217f83e97c',
  chains: [
    mainnet,
    arbitrum,
    anvil,
   
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  // transports: {
  //   [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/...'),
  //   [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/...'),
  // },
  ssr: true,
});
import { Trans } from '@lingui/macro'
import { getChainInfo } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { AlertCircle } from 'react-feather'
import styled, { useTheme } from 'styled-components/macro'

import { ThemedText } from '../../theme'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function FailedNetworkSwitchPopup({ chainId }: { chainId: SupportedChainId }) {
  const chainInfo = getChainInfo(chainId)
  const theme = useTheme()

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        <AlertCircle color={theme.deprecated_red1} size={24} />
      </div>
      <AutoColumn gap="8px">
        <ThemedText.DeprecatedBody fontWeight={500}>
          <Trans>
<<<<<<< HEAD
            Failed to switch networks from theSabswapInterface. In order to useSabswapon {chainInfo.label}, you must
=======
            Failed to switch networks from the Uniswap Interface. In order to use Uniswap on {chainInfo.label}, you must
>>>>>>> 20242fc76106c3e7b5140df5cdf784f98e8d3017
            change the network in your wallet.
          </Trans>
        </ThemedText.DeprecatedBody>
      </AutoColumn>
    </RowNoFlex>
  )
}

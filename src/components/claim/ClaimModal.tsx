import { isAddress } from '@ethersproject/address'
import { Trans } from '@lingui/macro'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { useEffect, useState } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components/macro'

import Circle from '../../assets/images/blue-loader.svg'
import tokenLogo from '../../assets/images/token-logo.png'
import { useModalIsOpen, useToggleSelfClaimModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { useClaimCallback, useUserClaimData, useUserUnclaimedAmount } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { CloseIcon, CustomLightSpinner, ExternalLink, ThemedText, UniTokenAnimated } from '../../theme'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { ButtonPrimary } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import Confetti from '../Confetti'
import { Break, CardBGImage, CardBGImageSmaller, CardNoise, CardSection, DataCard } from '../earn/styled'
import Modal from '../Modal'
import { RowBetween } from '../Row'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #021d43 100%);
`

const ConfirmOrLoadingWrapper = styled.div<{ activeBG: boolean }>`
  width: 100%;
  padding: 24px;
  position: relative;
  background: ${({ activeBG }) =>
    activeBG &&
    'radial-gradient(76.02% 75.41% at 1.84% 0%, rgba(255, 0, 122, 0.2) 0%, rgba(33, 114, 229, 0.2) 100%), #FFFFFF;'};
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

const SOCKS_AMOUNT = 1000
const USER_AMOUNT = 400

export default function ClaimModal() {
  const isOpen = useModalIsOpen(ApplicationModal.SELF_CLAIM)
  const toggleClaimModal = useToggleSelfClaimModal()

  const { account, chainId } = useWeb3React()

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  // get user claim data
  const userClaimData = useUserClaimData(account)

  // monitor the status of the claim from contracts and txns
  const { claimCallback } = useClaimCallback(account)
  const unclaimedAmount: CurrencyAmount<Token> | undefined = useUserUnclaimedAmount(account)
  const { claimSubmitted, claimTxn } = useUserHasSubmittedClaim(account ?? undefined)
  const claimConfirmed = Boolean(claimTxn?.receipt)

  function onClaim() {
    setAttempting(true)
    claimCallback()
      // reset modal and log error
      .catch((error) => {
        setAttempting(false)
        console.log(error)
      })
  }

  // once confirmed txn is found, if modal is closed open, mark as not attempting regradless
  useEffect(() => {
    if (claimConfirmed && claimSubmitted && attempting) {
      setAttempting(false)
      if (!isOpen) {
        toggleClaimModal()
      }
    }
  }, [attempting, claimConfirmed, claimSubmitted, isOpen, toggleClaimModal])

  const nonLPAmount = JSBI.multiply(
    JSBI.BigInt((userClaimData?.flags?.isSOCKS ? SOCKS_AMOUNT : 0) + (userClaimData?.flags?.isUser ? USER_AMOUNT : 0)),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
  )

  return (
    <Modal isOpen={isOpen} onDismiss={toggleClaimModal} maxHeight={90}>
      <Confetti start={Boolean(isOpen && claimConfirmed)} />
      {!attempting && !claimConfirmed && (
        <ContentWrapper gap="lg">
          <ModalUpper>
            <CardBGImage />
            <CardNoise />
            <CardSection gap="md">
              <RowBetween>
                <ThemedText.DeprecatedWhite fontWeight={500}>
                  <Trans>Claim UNI</Trans>
                </ThemedText.DeprecatedWhite>
                <CloseIcon onClick={toggleClaimModal} style={{ zIndex: 99 }} color="white" />
              </RowBetween>
              <ThemedText.DeprecatedWhite fontWeight={700} fontSize={36}>
                <Trans>{unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} UNI</Trans>
              </ThemedText.DeprecatedWhite>
            </CardSection>
            <Break />
            <CardSection gap="sm">
              {userClaimData?.flags?.isSOCKS && (
                <RowBetween>
                  <ThemedText.DeprecatedSubHeader color="white">SOCKS</ThemedText.DeprecatedSubHeader>
                  <ThemedText.DeprecatedSubHeader color="white">
                    <Trans>{SOCKS_AMOUNT} UNI</Trans>
                  </ThemedText.DeprecatedSubHeader>
                </RowBetween>
              )}
              {userClaimData?.flags?.isLP &&
                unclaimedAmount &&
                JSBI.greaterThanOrEqual(unclaimedAmount.quotient, nonLPAmount) && (
                  <RowBetween>
                    <ThemedText.DeprecatedSubHeader color="white">
                      <Trans>Liquidity</Trans>
                    </ThemedText.DeprecatedSubHeader>
                    <ThemedText.DeprecatedSubHeader color="white">
                      <Trans>
                        {unclaimedAmount
                          .subtract(CurrencyAmount.fromRawAmount(unclaimedAmount.currency, nonLPAmount))
                          .toFixed(0, { groupSeparator: ',' })}{' '}
                        UNI
                      </Trans>
                    </ThemedText.DeprecatedSubHeader>
                  </RowBetween>
                )}
              {userClaimData?.flags?.isUser && (
                <RowBetween>
                  <ThemedText.DeprecatedSubHeader color="white">
                    <Trans>User</Trans>
                  </ThemedText.DeprecatedSubHeader>
                  <ThemedText.DeprecatedSubHeader color="white">
                    <Trans>{USER_AMOUNT} UNI</Trans>
                  </ThemedText.DeprecatedSubHeader>
                </RowBetween>
              )}
            </CardSection>
          </ModalUpper>
          <AutoColumn gap="md" style={{ padding: '1rem', paddingTop: '0' }} justify="center">
            <ThemedText.DeprecatedSubHeader fontWeight={500}>
              <Trans>
<<<<<<< HEAD
                As a member of theSabswapcommunity you may claim UNI to be used for voting and governance.
=======
                As a member of the Uniswap community you may claim UNI to be used for voting and governance.
>>>>>>> 20242fc76106c3e7b5140df5cdf784f98e8d3017
                <br />
                <br />
                <ExternalLink href="https://uniswap.org/blog/uni">Read more about UNI</ExternalLink>
              </Trans>
            </ThemedText.DeprecatedSubHeader>
            <ButtonPrimary
              disabled={!isAddress(account ?? '')}
              padding="16px 16px"
              width="100%"
              $borderRadius="12px"
              mt="1rem"
              onClick={onClaim}
            >
              <Trans>Claim UNI</Trans>
            </ButtonPrimary>
          </AutoColumn>
        </ContentWrapper>
      )}
      {(attempting || claimConfirmed) && (
        <ConfirmOrLoadingWrapper activeBG={true}>
          <CardNoise />
          <CardBGImageSmaller desaturate />
          <RowBetween>
            <div />
            <CloseIcon onClick={toggleClaimModal} style={{ zIndex: 99 }} stroke="black" />
          </RowBetween>
          <ConfirmedIcon>
            {!claimConfirmed ? (
              <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
            ) : (
              <UniTokenAnimated width="72px" src={tokenLogo} alt="UNI" />
            )}
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <ThemedText.DeprecatedLargeHeader fontWeight={600} color="black">
                {claimConfirmed ? <Trans>Claimed!</Trans> : <Trans>Claiming</Trans>}
              </ThemedText.DeprecatedLargeHeader>
              {!claimConfirmed && (
                <Text fontSize={36} color={'#ff007a'} fontWeight={800}>
                  <Trans>{unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} UNI</Trans>
                </Text>
              )}
            </AutoColumn>
            {claimConfirmed && (
              <>
                <ThemedText.DeprecatedSubHeader fontWeight={500} color="black">
                  <Trans>
                    <span role="img" aria-label="party-hat">
                      🎉{' '}
                    </span>
                    Welcome to team Unicorn :){' '}
                    <span role="img" aria-label="party-hat">
                      🎉
                    </span>
                  </Trans>
                </ThemedText.DeprecatedSubHeader>
              </>
            )}
            {attempting && !claimSubmitted && (
              <ThemedText.DeprecatedSubHeader color="black">
                <Trans>Confirm this transaction in your wallet</Trans>
              </ThemedText.DeprecatedSubHeader>
            )}
            {attempting && claimSubmitted && !claimConfirmed && chainId && claimTxn?.hash && (
              <ExternalLink
                href={getExplorerLink(chainId, claimTxn?.hash, ExplorerDataType.TRANSACTION)}
                style={{ zIndex: 99 }}
              >
                <Trans>View transaction on Explorer</Trans>
              </ExternalLink>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
    </Modal>
  )
}

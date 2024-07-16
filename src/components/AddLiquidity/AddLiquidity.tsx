import { Trans } from '@lingui/macro'
import Column from 'components/Column'
import Row from 'components/Row'
import SelectToken from './SelectToken'

export default function AddLiquidity() {
  return (
    <div>
      <Column gap={1}>
        <Trans>Select pair</Trans>

        <Row gap={0.5}>
          <SelectToken />
          <SelectToken />
        </Row>
      </Column>
    </div>
  )
}

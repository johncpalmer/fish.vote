import { useMemo } from 'react'
import { Tooltip } from 'react-tippy';

import {
  Header,
  Title,
  Subtitle,
  Wrapper,
} from './styled';

import Button from '../Button'

const Card = ({
  action: {
    name = null,
    handler,
    disabled = false,
    loading = false,
    loadingText = "",
    tooltipText = "",
    background = null,
    color = null,
  } = {},
  children,
  shortMargin,
  subtitle,
  title,
  noPadding,
}) => {

  return (
    <Wrapper shortMargin={shortMargin} noPadding={noPadding}>
      { title ? (
        <Header noPadding={noPadding}>
          <Title>
            {title}
          </Title>
          <div>
            { subtitle ? <Subtitle>{ subtitle }</Subtitle> : null}
            { name ? (
              <Tooltip
                interactive
                useContext
                distance={20}
                position='top'
                trigger='mouseenter'
                disabled={tooltipText === ''}
                html={(
                  <div>{ tooltipText }</div>
                )}
              >
                <Button
                  onClick={handler}
                  background={background ? background : null}
                  color={color ? color : null}
                  disabled={disabled || loading}
                >
                  {!loading ? name : loadingText}
                </Button>
              </Tooltip>
            ) : null}
          </div>
        </Header>
      ) : null}
      <div>{children}</div>
    </Wrapper>
  )
}

export default Card;

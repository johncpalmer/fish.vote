import { useMemo } from 'react'
import { Tooltip } from 'react-tippy';

import {
  Content,
  Header,
  Subtitle,
  Title,
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
        <Header>
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
      <Content noPadding={noPadding}>{children}</Content>
    </Wrapper>
  )
}

export default Card;

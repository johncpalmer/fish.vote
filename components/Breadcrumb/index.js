import dayjs from "dayjs";
import Link from "next/link";
import { isMobile } from 'react-device-detect';

import {
  Header,
  Details,
  Last,
  State,
  Title,
  Wrapper,
} from './styled'

const Breadcrumb = ({
  title,
  lastRoute: { path, name } = {},
  state,
  created,
  proposer,
}) => (
  <Wrapper>
    <Header>
      {path && name ? (
        <Link href={path}>
          <Last>{`<- ${name}`}</Last>
        </Link>
      ) : null}
      {state ? (
        <State>{state}</State>
      ) : null}
    </Header>
    <Title>{title}</Title>

    {created && proposer ? (
      <Details>
        <span>Created {dayjs.unix(created).format("MMMM D, YYYY")}</span>
        <div />
        <span>
          Proposed by
          {" "}
          { !isMobile ? (
            <a
              href={`https://explore.vechain.org/accounts/${proposer}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {proposer}
            </a>
          ) : (
            <a
              href={`https://explore.vechain.org/accounts/${proposer}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {proposer.substr(0, 4) +
                "..." +
                proposer.slice(proposer.length - 4)}
            </a>
          )}
        </span>
      </Details>
    ) : null}
  </Wrapper>
)

export default Breadcrumb;
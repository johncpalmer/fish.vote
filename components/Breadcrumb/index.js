import dayjs from "dayjs";
import Link from "next/link";
import { isMobile } from 'react-device-detect';
import { VEX_NETWORK } from "@utils/constants";
import Address from "@components/Address";
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
              href={`${VEX_NETWORK.explorer_base_url}accounts/${proposer}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {proposer}
            </a>
          ) : (
            <a
              href={`${VEX_NETWORK.explorer_base_url}accounts/${proposer}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Address shorten address={proposer} />
            </a>
          )}
        </span>
      </Details>
    ) : null}
  </Wrapper>
)

export default Breadcrumb;

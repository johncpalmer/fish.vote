import styled from '@emotion/styled';

export const Wrapper = styled.table`
  width: 100%;

  thead {
    text-align: left;
    color: #ACACAB;

    th {
      padding-bottom: 10px;
    }
  }

  tbody {
    color: white;
  }

  td {
    padding: 8px 0;
  }

  td[type="num"],
  td[type="addr"] {
    font-family: "VCR", sans-serif;
  }

  td[type="num"] {
    text-align: right;
  }

  @media screen and (max-width: 600px) {
    td {
      border-bottom: 1px solid #282828;
      display: block;
      text-align: right;

      &::before {
        content: attr(data-label);
        float: left;
        text-transform: uppercase;
        font-size: 14px;
      }
    }

    thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    tr {
      border-bottom: 1px dashed rgba(245, 167, 136, 0.15);
      display: block;
      margin-bottom: 20px;
    }
  }
`;


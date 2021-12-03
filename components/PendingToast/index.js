import { useState, useEffect } from 'react';
import { Wrapper } from './styled'

const PendingToast = ({ tx }) => {
  const [hanging, setHanging] = useState(false);
  const [question, setQuestion] = useState(false);
  const [annoyed, setAnnoyed] = useState(false);

  useEffect(() => {
    setInterval(() => setHanging(true), 10000);
    setInterval(() => setQuestion(true), 15000);
    setInterval(() => setAnnoyed(true), 20000);
  }, [])

  return (
    <Wrapper>
      <div>Pending</div>
      { hanging ? (
        <div style={{ marginTop: '8px' }}>
          This will hang if you don't have enough VTHO to complete the transaction.
        </div>
      ) : null}
      { question ? (
        <div style={{ marginTop: '8px' }}>
          <a 
            href="https://vechaininsider.com/vechain/everything-you-need-to-know-about-vethor-vtho/"
            target="_blank"
            rel="noopener noreferrer"
          >
            What's VTHO?
          </a>
        </div>
      ) : null}
      { annoyed ? (
        <div style={{ marginTop: '8px' }}>
          You can also check the transaction status
          {" "}
          <a 
            href={`https://explore.vechain.org/transactions/${tx?.txid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            here.
          </a>
        </div>
      ) : null}
    </Wrapper>
  )
}
  
export default PendingToast;
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

function ExternalPagePrintComponent() {
  const componentRef = useRef();
  const ExternalPageComponent = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} className='d-none'>
        <h1>External Page Component</h1>
        <p>This is an example of an external page component.</p>
      </div>
    );
  });
  
  return (
    <div>
      <ExternalPageComponent ref={componentRef} />
      <ReactToPrint
        trigger={() => <button>Print</button>}
        content={() => componentRef.current}
      />
    </div>
  );
}

export default ExternalPagePrintComponent;
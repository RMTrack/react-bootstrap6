import * as React from 'react';

interface DialogContextType {
  onHide: () => void;
}

const DialogContext = React.createContext<DialogContextType>({
  onHide() {},
});

DialogContext.displayName = 'DialogContext';

export default DialogContext;

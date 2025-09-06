import { Inbox } from '@novu/react';
import { useNavigate } from 'react-router-dom';

function Novu() {
  const navigate = useNavigate();

  return (
    <Inbox
      applicationIdentifier="v0zkiwVGNbub"
      subscriberId="9bcb42193d55da8fe1e39874a8475bf1"
      routerPush={(path: string) => navigate(path)}
      appearance={{
        variables: {
          colorPrimary: "#DD2450",
          colorForeground: "#0E121B"
        }
      }}
    />
  );
}
export default Novu;
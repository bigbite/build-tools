import LogoSVG from '../static/logo.svg';
import MailIconPNG from '../static/mail-icon.png';

/**
 * Display Component for an example block.
 */
export default () => (
  <>
    <div className="logo">
      <LogoSVG />
    </div>
    <div>Example Block</div>
    <div>
      <img src={MailIconPNG} alt="PNG Mail Icon for testing usage." />
    </div>
  </>
);

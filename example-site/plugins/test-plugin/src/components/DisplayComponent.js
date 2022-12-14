import SVGAsComponent from '@Static/logo.svg';
import SVGAsURL from '@Static/svg-file.svg?url';
import MailIconPNG from '@Static/mail-icon.png';

/**
 * Display Component for an example block.
 */
export default () => (
  <>
    <div className="logo">
      <SVGAsComponent />
      <img src={SVGAsURL} alt="Reference and SVG as the url" />
    </div>
    <div>Example Block</div>
    <div>
      <img src={MailIconPNG} alt="PNG Mail Icon for testing usage." />
    </div>
  </>
);

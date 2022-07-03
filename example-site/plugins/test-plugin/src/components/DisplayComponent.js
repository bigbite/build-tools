import SVGAsComponent from '../static/logo.svg';
import SVGAsURL from '../static/svg-file.svg?url';
import MailIconPNG from '../static/mail-icon.png';

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

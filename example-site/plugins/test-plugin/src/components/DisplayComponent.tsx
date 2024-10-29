import SVGAsComponent from '@Static/logo.svg';
import SVGAsURL from '@Static/svg-file.svg?url';
import MailIconPNG from '@Static/mail-icon.png';
import { __ } from '@wordpress/i18n';

import TestComponent from './TestComponent';

/**
 * Display Component for an example block.
 */
export default (): JSX.Element => {
  // translators: This is some basic alt-text.
  const svgAlt = __("Reference and SVG as the url", 'test-translation');

  return (
  <>
    <div className="logo">
      <SVGAsComponent />
      <img src={SVGAsURL} alt={svgAlt} />
    </div>
    <div>Example Block</div>
    <TestComponent additionalValue="This is not hidden" />
    <div>
      <img src={MailIconPNG} alt="PNG Mail Icon for testing usage." />
    </div>
  </>
);
}

import { ReactComponent as SVGAsComponent } from '@Static/logo.svg';
import SVGAsURL from '@Static/svg-file.svg';
import MailIconPNG from '@Static/mail-icon.png';
import { __, _n, sprintf } from '@wordpress/i18n';

import TestComponent from './TestComponent';

/**
 * Display Component for an example block.
 */
export default ({ attributes: { itemCount = 2 } }) => {
  // General comment.
  // translators: This is some basic alt-text.
  const svgAlt = __("Reference and SVG as the url", 'test-translation');

  // translators: %d is the number of items chosen.
  const translatedValue = sprintf(_n("%d item", "%d items", itemCount, 'test-translation'), itemCount);

  return (
    <>
      <div className="logo">
        <SVGAsComponent />
        <img src={SVGAsURL} alt={svgAlt} />
      </div>
      <div>Example Block</div>
      <TestComponent additionalValue={translatedValue} />
      <div>
        <img src={MailIconPNG} alt="PNG Mail Icon for testing usage." />
      </div>
    </>
  );
}

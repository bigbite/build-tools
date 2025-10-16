import { __, _n, sprintf } from '@wordpress/i18n';

import { ReactComponent as SVGAsComponent } from '../static/logo.svg';
import MailIconPNG from '../static/mail-icon.png';
import SVGAsURL from '../static/svg-file.svg';

import TestComponent from './TestComponent';

/**
 * Display Component for an example block
 *
 * @param {Object} props                      Props for the component
 * @param {Object} props.attributes           Block attributes
 * @param {number} props.attributes.itemCount Number of items selected
 */
export default ({ attributes: { itemCount = 2 } }): JSX.Element => {
  // translators: This is some basic alt-text.
  const svgAlt = __('Reference and SVG as the url', 'test-translation');

  const translatedValue = sprintf(
    // translators: %d is the number of items chosen.
    _n('%d item', '%d items', itemCount, 'test-translation'),
    itemCount,
  );

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
};

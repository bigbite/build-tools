import SVGAsComponent from '../static/logo.svg';
import SVGAsURL from '../static/svg-file.svg?url';

/**
 * Display Component for an example block.
 */
export default () => (
  <>
    <div className="logo">
      <SVGAsComponent />
      <SVGAsURL />
    </div>
    <div>Example Block</div>
  </>
);

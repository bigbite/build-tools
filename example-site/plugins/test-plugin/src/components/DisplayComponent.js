import SVGAsComponent from '../static/logo.svg';
import SVGAsURL from '../static/svg-file.svg?url';

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
  </>
);

/**
 * A simple example for reproducing incorrect JSX issues
 * in ESLint:
 *  - react/react-in-jsx-scope
 *  - react/jsx-filename-extension
 */
export default () => (
  <div>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
);

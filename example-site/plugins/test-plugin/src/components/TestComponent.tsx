import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

interface TestComponentProps {
  hiddenText?: boolean;
  additionalValue: string;
}

/**
 *
 * @param {object} props Props for the component.
 * @param {boolean} props.hiddenText Whether to hide the text.
 * @param {string} props.additionalValue The value to output when text is not hidden.
 * @returns
 */
const TestComponent = ({ hiddenText = false, additionalValue }: TestComponentProps) => {
  if (hiddenText) {
    return <div>{__('Hidden', 'bigbite-build-tools')}</div>;
  }

  return <div>{__(`My additional value is ${additionalValue}`, 'bigbite-build-tools')}</div>;
};

TestComponent.propTypes = {
  hiddenText: PropTypes.bool,
  additionalValue: PropTypes.string.isRequired,
};

export default TestComponent;

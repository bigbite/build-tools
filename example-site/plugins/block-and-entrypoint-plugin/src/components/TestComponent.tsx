/* eslint-disable no-undef */
import { __, sprintf } from '@wordpress/i18n';

interface TestComponentProps {
  hiddenText?: boolean;
  additionalValue: string;
}

/**
 * @param {Object}  props                 Props for the component.
 * @param {boolean} props.hiddenText      Whether to hide the text.
 * @param {string}  props.additionalValue The value to output when text is not hidden.
 */
const TestComponent = ({ hiddenText = false, additionalValue }: TestComponentProps) => {
  if (hiddenText) {
    return <div>{__('Hidden', 'bigbite-build-tools')}</div>;
  }

  return (
    // translators: %1$s is the additional value passed in
    <div>{sprintf(__(`My additional value is %1$s`, 'bigbite-build-tools'), additionalValue)}</div>
  );
};

export default TestComponent;

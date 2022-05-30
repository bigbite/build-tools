import DisplayComponent from '@Components/DisplayComponent';

const { registerBlockType } = wp.block;
const { __ } = wp.i18n;

registerBlockType('bigbite/build-tools-block', {
  title: __('Build Tools Block', 'bigbite-build-tools'),
  category: 'common',
  icon: 'carrot',
  edit: DisplayComponent,
});

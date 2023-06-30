import DisplayComponent from '@Components/DisplayComponent';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import '../styles/index.scss';

registerBlockType('bigbite/build-tools-block', {
  title: __('Build Tools Block', 'bigbite-build-tools'),
  category: 'common',
  icon: 'carrot',
  edit: DisplayComponent,
  attributes: {},
});

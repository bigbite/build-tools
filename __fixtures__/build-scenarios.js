
  /**
   * Test fixtures
   *
   * Should exist in the __fixtures__ directory following the expected build-tools project structure
   *
   * name: The name of the fixture
   * expectedProjects: The expected projects to be built, used to clean the output directories
   * expectedFiles: The expected files to be generated, used to verify the output
   */
module.exports = [
    {
      name: 'single-project',
      expectedProjects: ['.'],
      expectedFiles: ['dist/scripts/main.js', 'dist/styles/main.css', 'inc/asset-settings.php'],
    },
    {
      name: 'single-plugin',
      expectedProjects: ['plugins/test-plugin'],
      expectedFiles: [
        'plugins/test-plugin/dist/scripts/main.js',
        'plugins/test-plugin/dist/styles/main.css',
        'plugins/test-plugin/inc/asset-settings.php',
      ],
    },
    {
      name: 'single-theme',
      expectedProjects: ['plugins/test-theme'],
      expectedFiles: [
        'themes/test-theme/dist/scripts/main.js',
        'themes/test-theme/dist/styles/main.css',
        'themes/test-theme/inc/asset-settings.php',
      ],
    },
    {
      name: 'single-mu-plugin',
      expectedProjects: ['client-mu-plugins/test-mu-plugin'],
      expectedFiles: [
        'client-mu-plugins/test-mu-plugin/dist/scripts/main.js',
        'client-mu-plugins/test-mu-plugin/dist/styles/main.css',
        'client-mu-plugins/test-mu-plugin/inc/asset-settings.php',
      ],
    },
    {
      name: 'multiple-entrypoints',
      expectedProjects: [
        'plugins/test-plugin',
        'plugins/test-theme',
        'client-mu-plugins/test-mu-plugin',
      ],
      expectedFiles: [
        'plugins/test-plugin/dist/scripts/main.js',
        'plugins/test-plugin/dist/styles/main.css',
        'plugins/test-plugin/inc/asset-settings.php',
        'themes/test-theme/dist/scripts/main.js',
        'themes/test-theme/dist/styles/main.css',
        'themes/test-theme/inc/asset-settings.php',
        'client-mu-plugins/test-mu-plugin/dist/scripts/main.js',
        'client-mu-plugins/test-mu-plugin/dist/styles/main.css',
        'client-mu-plugins/test-mu-plugin/inc/asset-settings.php',
      ],
    },
    // test plugin with complex entrypoints and build
    {
        name: 'test-plugin',
        expectedProjects: ['plugins/test-plugin'],
        expectedFiles: [
          'plugins/test-plugin/dist/scripts/main.js',
          'plugins/test-plugin/dist/styles/main.css',
          'plugins/test-plugin/inc/asset-settings.php',
        ],
      },
  ];
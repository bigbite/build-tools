const { getFilteredEntryPoints } = require('../get-filtered-entrypoints');

describe('Get filtered entrypoints', () => {
  it('Return object with empty array if no filtered entry points', () => {
    const projects = 'test-project';
    const result = getFilteredEntryPoints(projects);
    expect(result).toEqual({ 'test-project': [] });
  });

  it('Returns object with array of entrypoints', () => {
    const projects = ['test-project@frontend+editor'];
    const result = getFilteredEntryPoints(projects);
    expect(result).toEqual({ 'test-project': ['frontend', 'editor'] });
  });

  it('Return object with entrypoints where @ is present and empty array if non defined', () => {
    const projects = ['test-project@editor', 'test-project-2'];
    const result = getFilteredEntryPoints(projects);
    expect(result).toEqual({ 'test-project': ['editor'], 'test-project-2': []});
  });
});

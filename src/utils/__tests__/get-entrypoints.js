const { getEntryPoints } = require('../get-entrypoints');

describe('Get package', () => {
  it('Returns empty array if no matching project path found', () => {
    const projects = ['test-project', 'test-project-2'];
    const result = getEntryPoints(projects, 'test-project-3');
    expect(result).toEqual([]);
  });

  it('Returns empty array if no entypoints are defined', () => {
    const projects = ['test-project', 'test-project-2'];
    const result = getEntryPoints(projects, 'test-project');
    expect(result).toEqual([]);
  });

  it('Returns empty array if no entypoints are defined but there\s an @ symbol defined', () => {
    const projects = ['test-project@', 'test-project-2'];
    const result = getEntryPoints(projects, 'test-project');
    expect(result).toEqual([]);
  });

  it('Returns array of entrypoints', () => {
    const projects = ['test-project@frontend+editor', 'test-project-2'];
    const result = getEntryPoints(projects, 'test-project');
    expect(result).toEqual(['frontend', 'editor']);
  });
});

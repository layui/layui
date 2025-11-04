/**
 * Core Unit Tests
 */

// 单元测试将在 Layui 3 开发接近完成阶段完善
describe('Test Demo', () => {
  test('Hello, Layui!', () => {
    const greet = (name) => `Hello, ${name}!`;
    expect(greet('Layui')).toBe('Hello, Layui!');
    expect(greet('World')).toBe('Hello, World!');
  });
});

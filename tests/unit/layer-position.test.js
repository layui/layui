import { applyAxisOffsets } from '../../src/utils/layer-position.js';

describe('layer position offsets', () => {
  test('keeps automatic axes centered and preserves zero offsets', () => {
    const centered = applyAxisOffsets({ offsetTop: 20, offsetLeft: 30 }, [
      'auto',
      'auto',
    ]);
    expect(centered).toEqual({ offsetTop: 20, offsetLeft: 30 });
    expect(
      applyAxisOffsets({ offsetTop: 20, offsetLeft: 30 }, [0, 'auto']),
    ).toEqual({ offsetTop: 0, offsetLeft: 30 });
  });
});

import { LABELS } from '../labels';

test('LABELS object should contain relevant values', () => {
	expect(LABELS).toMatchSnapshot();
});

import { describe, expect, test } from 'vitest'
import { isIncreasingSequence } from './isIncreasingSequence'

describe('isIncreasingSequence', () => {
	test('Возрастающая последовательность 1', () => {
		expect(isIncreasingSequence([1, 2, 3, 4, 5])).toBe(true)
	})
	test('Возрастающая последовательность 2', () => {
		expect(isIncreasingSequence([-2, -1, 3, 4, 5])).toBe(true)
	})
	test('Возрастающая последовательность 3', () => {
		expect(isIncreasingSequence([-1, -2, 3, 4, 5])).toBe(false)
	})
	test('Возрастающая последовательность 4', () => {
		expect(isIncreasingSequence([0, 0, 0])).toBe(true)
	})
	test('Возрастающая последовательность 5', () => {
		expect(isIncreasingSequence([])).toBe(true)
	})
})

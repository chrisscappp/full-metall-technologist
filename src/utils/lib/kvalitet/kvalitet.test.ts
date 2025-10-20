import { describe, expect, test } from 'vitest'
import { kvalitet6 } from './kvalitet'

describe('kvalitet6', () => {
	test('Значение аргумента меньше или равно 3м', () => {
		expect(kvalitet6(2)).toBe(-0.006)
	})
	test('Значение аргумента в промежутке от 4-х до 6-ти', () => {
		expect(kvalitet6(4)).toBe(-0.008)
	})
	test('Значение аргумента в промежутке от 120-ти до 180-ти', () => {
		expect(kvalitet6(121)).toBe(-0.025)
	})
	test('Значение аргумента в промежутке от 250-ти до 315-ти', () => {
		expect(kvalitet6(300)).toBe(-0.032)
	})
	test('Значение аргумента не попадает ни в один промежуток', () => {
		expect(kvalitet6(505)).toBe(-0.04)
	})
})

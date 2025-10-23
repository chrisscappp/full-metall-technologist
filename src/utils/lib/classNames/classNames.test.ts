import { describe, expect, test } from 'vitest'
import { classNames } from './classNames'

describe('classNames', () => {
	test('Стандартный класс', () => {
		expect(classNames('class')).toBe('class')
	})
	test('Класс + допы 1', () => {
		expect(classNames('class', {}, ['additional'])).toBe('class additional')
	})
	test('Класс + допы 2', () => {
		expect(classNames('class', {}, ['additional', 'additional2'])).toBe('class additional additional2')
	})
	test('Класс + допы 3', () => {
		expect(classNames('class', {}, ['additional', undefined])).toBe('class additional')
	})
	test('Класс + моды 1', () => {
		expect(classNames('class', {'mod': true})).toBe('class mod')
	})
	test('Класс + моды 2', () => {
		expect(classNames('class', {'mod': true, 'mod2': false})).toBe('class mod')
	})
	test('Класс + моды + допы 1', () => {
		expect(classNames('class', {'mod': true, 'mod2': false}, [undefined, 'additional'])).toBe('class additional mod')
	})
	test('Класс + моды + допы 2', () => {
		expect(classNames('class', {}, [])).toBe('class')
	})
})

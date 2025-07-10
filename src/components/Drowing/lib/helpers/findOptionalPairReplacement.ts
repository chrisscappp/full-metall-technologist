export function findOptimalPairReplacement(initialArray: number[], target: number) {
	// Проверка входных данных
	if (!Array.isArray(initialArray)) throw new Error('Входные данные должны быть массивом')
	if (initialArray.length < 2) throw new Error('Массив должен содержать минимум 2 элемента')

	// Перебираем все возможные пары чисел (кроме соседних, чтобы сохранить порядок)
	for (let i = 0; i < initialArray.length - 1; i++) {
		for (let j = i + 1; j < initialArray.length; j++) {
			// Фиксируем все числа, кроме выбранной пары
			const fixedProduct = initialArray.reduce(
				(acc, num, index) => index !== i && index !== j ? acc * num : acc, 1
			)
			const pairTarget = target / fixedProduct

			// Границы для первого изменяемого числа (x)
			const xMin = i === 0 ? 0 : initialArray[i - 1] // Больше предыдущего
			const xMax = j === i + 1 ? initialArray[j + 1] || 1 : 1 // Меньше следующего

			// Перебор с оптимальным шагом
			const step = 0.0001
			for (let x = xMin + step; x < xMax; x += step) {
				const y = pairTarget / x

				// Проверяем условия для y
				if (
					y > x && // Для случая, когда i < j
					y > initialArray[j - 1] && // Больше предыдущего
					(j === initialArray.length - 1 || y < initialArray[j + 1]) && // Меньше следующего
					y < 1 // Ограничение сверху
				) {
					const newArray = [...initialArray]
					newArray[i] = parseFloat(x.toFixed(4))
					newArray[j] = parseFloat(y.toFixed(4))

					// Проверяем строгое возрастание
					let isValid = true
					for (let k = 1; k < newArray.length; k++) {
						if (newArray[k] <= newArray[k - 1]) {
							isValid = false
							break
						}
					}

					if (isValid && Math.abs(newArray.reduce((a, b) => a * b, 1) - target) < 0.0001) {
						return newArray
					}
				}
			}
		}
	}

	return null
}

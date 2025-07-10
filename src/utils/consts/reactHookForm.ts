export const basedValidateFormRule = {
	required: 'Поле является обязательным',
	pattern: {
        value: /^-?\d*\.?\d+$/,
        message: 'Введите корректное число'
    }
}

import { classNames, Mods } from '@/utils/functions/classNames'
import { ChangeEvent, FocusEvent, InputHTMLAttributes, memo, useEffect, useRef, useState } from 'react'
import cls from './Input.module.scss'
import { Text } from '../Text/Text'
import { HStack, VStack } from '../Stack'
import { UseFormRegisterReturn } from 'react-hook-form'

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'readOnly' | 'onBlur'>

interface InputProps extends HTMLInputProps {
	className?: string,
	inputClassName?: string,
	fieldId?: string,
	value?: string | number,
	placeholder?: string,
	type?: string,
	onChange?: (value: string) => void,
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void,
	readonly?: boolean,
	autoFocus?: boolean,
	label?: string,

	// hook form
	error?: string,
    register?: UseFormRegisterReturn
}

export const Input = memo((props: InputProps) => {

	const { 
		className,
		inputClassName,
		value,
		placeholder = 'Значение',
		autoFocus,
		type = 'text',
		onChange,
		onBlur,
		readonly,
		label,
		error,
		register,
		...otherProps
	} = props

	const { 
		onBlur: registerOnBlur,
		onChange: registerOnChange,
		...restRegister
	} = register || {}
	
	const [isBlur, setIsBlur] = useState(false)
	const ref = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (autoFocus) {
			ref.current?.focus()
		}
	}, [autoFocus])

	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value)
		registerOnChange?.(e)
	}

	const onFocus = () => {
		setIsBlur(true)
	}

	const onBlurDefault = (e: FocusEvent<HTMLInputElement>) => {
		setIsBlur(false)
		onBlur?.(e)
		registerOnBlur?.(e)
	}

	const mods: Mods = {
		[cls.readonly]: readonly,
		[cls.blur]: isBlur
	}

	return (
    	<VStack className={classNames(cls.wrap, {}, [className])} gap="4" max>
      		{(label || error) && (
				<HStack gap="12" align="center">
					{label && <Text text={label} />}
					{error && <Text text={error} theme="error" size="size_s" />}
				</HStack>
			)}
      		<input
        		className={classNames(cls.Input, mods, [inputClassName])}
        		placeholder={placeholder}
        		readOnly={readonly}
        		type={type}
				onFocus={onFocus}
				onBlur={onBlurDefault}
				onChange={onChangeHandler}
				value={value}
        		{...restRegister}
        		{...otherProps}
      		/>
    	</VStack>
  	)
})

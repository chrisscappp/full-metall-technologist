import { classNames, Mods } from '@/utils/lib/classNames/classNames'
import { ChangeEvent, FocusEvent, InputHTMLAttributes, memo, useEffect, useRef } from 'react'
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
		placeholder='Значение',
		autoFocus,
		type='text',
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

	const onBlurDefault = (e: FocusEvent<HTMLInputElement>) => {
		onBlur?.(e)
		registerOnBlur?.(e)
	}

	const mods: Mods = {
		[cls.readonly]: readonly
	}

	return (
    	<VStack className={classNames(cls.wrap, {}, [className])} gap="4" max>
      		{(label || error) && (
				<HStack gap="8" align="center">
					{label && <Text className={cls.label} text={label} size="size_sm" theme="secondary" upperCase />}
					{error && <Text text={error} size="size_sm" theme="error" upperCase />}
				</HStack>
			)}
      		<input
        		className={classNames(cls.Input, mods, [inputClassName])}
        		placeholder={placeholder}
        		readOnly={readonly}
        		type={type}
				onBlur={onBlurDefault}
				onChange={onChangeHandler}
				value={value}
        		{...restRegister}
        		{...otherProps}
      		/>
    	</VStack>
  	)
})

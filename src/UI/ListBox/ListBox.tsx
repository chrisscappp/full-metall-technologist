import { classNames, Mods } from '@/utils/lib/classNames/classNames'
import cls from './ListBox.module.scss'
import { ChangeEvent, memo, useMemo }  from 'react'
import { VStack } from '../Stack'

export interface ListBoxOption<T extends string> {
	value: T;
	content: string;
}

interface ListBoxProps<T extends string> {
	className?: string;
	label?: string;
	options?: ListBoxOption<T>[];
	value?: T;
	onChange?: (value: T) => void;
	readonly?: boolean;
}

const ListBoxComponent = <T extends string>(props: ListBoxProps<T>) => {

	const { 
		className, 
		label, 
		options,
		onChange,
		value,
		readonly
	} = props

	const mods: Mods = {}

	const optionList = useMemo(() => {
		return options?.map((item) => (
			<option
				key={item.value}
				value={item.value}
				className={cls.option}
			>
				{item.content}
			</option>
		))
	}, [options])

	const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
		onChange?.(e.target.value as T)
	}

	return (
		<VStack className={classNames(cls.SelectWrapper, mods, [className])} gap="4">
			{
				label &&
				(<span className={cls.label}>
					{label}
				</span>)
			}
			<select
				className={classNames(cls.select, {}, [readonly ? cls.readonly : undefined])}
				value={value}
				onChange={onChangeHandler}
				disabled={readonly}
			>
				{optionList}
			</select>
		</VStack>
	)
}

export const ListBox = memo(ListBoxComponent) as <T extends string>(props: ListBoxProps<T>) => JSX.Element

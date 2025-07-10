import { memo, MouseEvent, useCallback } from 'react'
import { OpeningCard } from '@/UI/OpeningCard/OpeningCard'
import { classNames } from '@/utils/functions/classNames'
import { ParseModelVariables } from '@/components/ParseModelVariables'
import { Text } from '@/UI/Text/Text'
import { HStack, VStack } from '@/UI/Stack'
import { Table, TableRowsType } from '@/UI/Table/Table'
import { Button } from '@/UI/Button/Button'
import { invoke } from '@tauri-apps/api/core'
import { InkoveFunction } from '@/utils/consts/inkovedFunctions'
import { ParseDrowingModelResult } from '@/components/ParseModelVariables'
import cls from './ParseModelVariablesGuide.module.scss'

interface ParseModelVariablesGuideProps<T> {
	className?: string,
	onSetParsedValues?: (data: ParseDrowingModelResult<T>) => void,
	title?: string,
	tabId?: string,
	variablesToParse?: TableRowsType,
	sketchImg?: string
}

const ParseModelVariablesGuideComponent = <T extends object>(props: ParseModelVariablesGuideProps<T>) => {
	
	const { 
		className,
		onSetParsedValues,
		tabId,
		title,
		variablesToParse,
		sketchImg
	} = props

	const onOpenDrowingVariablesGuide = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		await invoke(InkoveFunction.OPEN_PARSE_MODEL_VARIABLES_GUIDE)
	}, [])
	
	return (
		<OpeningCard
			className={classNames('', {}, [className])}
			mainContent={<Text id={tabId} title={title ?? 'Работа с моделью'} size='size_s' weight="weight_bold"/>}
			additionalContent={
				<VStack gap="16" max>
					<Text text="Для работы с моделью необходимо в программе КОМПАС 3Д присвоить необходимым характерным размерам значения переменных, представленных ниже:"/>
					<HStack gap="8" max align="start">
						<Table
							items={{
								titles: ['Обозначение', 'Название переменной'],
								rows: variablesToParse
							}} // todo - конфиг на поля таблицы (или вынести логику в Text)
						/>
						{sketchImg && <img src={sketchImg} className={cls.drowingPicture}/>}
					</HStack>
					<Text text="Чтобы открыть инструкцию по назанчению переменных в КОМПАС 3Д, нажмите на кнопку ниже:"/>
					<Button onClick={onOpenDrowingVariablesGuide}>
						Открыть инструкцию
					</Button>
					<ParseModelVariables onSetParsedValues={onSetParsedValues}/>
				</VStack>
			}
		/>
	)
}

export const ParseModelVariablesGuide = memo(ParseModelVariablesGuideComponent) as <T extends object>(props: ParseModelVariablesGuideProps<T>) => JSX.Element

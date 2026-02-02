import { memo, MouseEvent, useCallback } from 'react'
import { classNames } from '@/utils/lib/classNames/classNames'
import { ParseModelVariables } from '@/components/ParseModelVariables'
import { Text } from '@/UI/Text/Text'
import { HStack, VStack } from '@/UI/Stack'
import { Table, TableRowsType } from '@/UI/Table/Table'
import { Button } from '@/UI/Button/Button'
import { invoke } from '@tauri-apps/api/core'
import { InkoveFunction } from '@/utils/consts/inkovedFunctions'
import { ParseDrowingModelResult } from '@/components/ParseModelVariables'
import cls from './ParseModelVariablesGuide.module.scss'
import { Card } from '@/UI/Card/Card'
import { NumericContent } from '@/UI/NumericContent/NumericContent'
import { DesktopComponent } from '@/utils/lib/components/DesktopComponent'

interface ParseModelVariablesGuideProps<T> {
	className?: string,
	onSetParsedValues?: (data: ParseDrowingModelResult<T>) => void,
	title?: string,
	description?: string,
	variablesToParse?: TableRowsType,
	sketchImg?: string
}

export const ParseModelVariablesGuideContent = <T extends object>(props: ParseModelVariablesGuideProps<T>) => {
	
	const { 
		className,
		onSetParsedValues,
		description,
		title,
		variablesToParse
	} = props

	const onOpenDrowingVariablesGuide = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		// для веба сделать аналог
		await invoke(InkoveFunction.OPEN_PARSE_MODEL_VARIABLES_GUIDE)
	}, [])
	
	return (
		<Card className={classNames('', {}, [className])}>
			<VStack gap="20">
				<VStack gap="16">
					<NumericContent number="1">
						<Text title={title ?? 'Работа с моделью'} size='size_s'/>
					</NumericContent>
					<Text text={description} size="size_s" theme="secondary"/>
				</VStack>
			</VStack>
			<VStack className={cls.table} gap="16" max>
				<HStack gap="8" max align="start">
					<Table
						items={{
							titles: ['Обозначение', 'Название переменной'],
							rows: variablesToParse
						}} // todo - конфиг на поля таблицы (или вынести логику в Text)
					/>
				</HStack>
				<ParseModelVariables onSetParsedValues={onSetParsedValues}/>
				<HStack gap="16" max align="center">
					<Button onClick={onOpenDrowingVariablesGuide} theme="tertiary">
						Открыть инструкцию
					</Button>
					<Text
						text="Подробное руководство по назначению переменных в КОМПАС 3D"
						theme="tertiary"
						size="size_s"
					/>
				</HStack>
			</VStack>
		</Card>
	)
}

export const ParseModelVariablesGuide = memo(<T extends object>(props: ParseModelVariablesGuideProps<T>) => {
	return (
		<DesktopComponent>
			<ParseModelVariablesGuideContent {...props}/>
		</DesktopComponent>
	)
}) as <T extends object>(props: ParseModelVariablesGuideProps<T>) => JSX.Element

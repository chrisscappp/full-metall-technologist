import { HStack, VStack } from '@/UI/Stack'
import { memo, useCallback, useState } from 'react'
import { CalculateOperationsCountResult } from '../../lib/types/drowing'
import { classNames } from '@/utils/functions/classNames'
import { Text } from '@/UI/Text/Text'
import cls from './DrowingCountOperations.module.scss'
import { Button } from '@/UI/Button/Button'
import BlackHintIcon from '@/assets/icons/hint-black-64-64.svg'
import WhiteHintIcon from '@/assets/icons/hint-white-64-64.svg'
import { useTheme } from '@/utils/hooks/useTheme'
import { DrowingEditCoeffs } from '../DrowingEditCoeffs/DrowingEditCoeffs'

interface DrowingCountOperationsProps {
	className?: string,
	operationsResult: CalculateOperationsCountResult,
	onChangeOperations?: (value: CalculateOperationsCountResult) => void,
	onCalculateDrowingOperationsData?: () => void
}

export const DrowingCountOperations = memo((props: DrowingCountOperationsProps) => {
	
	const {
		operationsResult,
		onChangeOperations,
		onCalculateDrowingOperationsData,
		className
	} = props

	const { isLightTheme } = useTheme()
	const [isEditCoeff, setIsEditCoeff] = useState(false)

	const onStartEditCoeff = useCallback(() => {
		setIsEditCoeff(true)
	}, [])

	const onStopEditCoeff = useCallback(() => {
		setIsEditCoeff(false)
	}, [])

	const onSaveNewCoeffs = useCallback((value: CalculateOperationsCountResult) => {
		onChangeOperations?.(value)
		onStopEditCoeff()
	}, [onChangeOperations, onStopEditCoeff])
	
	return (
		<VStack className={classNames('', {}, [className])} gap='16'>
			<Text title="Результат расчёта количества операций" weight="weight_bold" />
			<Text
        		textPre
        		text={`Суммарный коэффициент вытяжки: ${operationsResult?.sumDrowingCoeff}
Суммарный коэффициент утонения: ${operationsResult?.sumThinCoeff}
Количество операций: ${operationsResult?.operationsCount}`}
      		/>
			{!isEditCoeff ? (
				<VStack gap='8'>
					<HStack align='center'>
						<Text title="Были подобраны следующие коэфициенты по операциям" size="size_s" weight="weight_bold"/>
						<img src={isLightTheme ? BlackHintIcon : WhiteHintIcon} className={cls.hint} title='Коэффициенты расчитаны программно. Вы можете изменить их вручную'/>
					</HStack>
					<div>
						<Text text={`Вытяжка: ${operationsResult.drowingCoeff.join(', ')}`}/>
						<Text text={`Утонение: ${operationsResult.thinCoeff.join(', ')}`}/>	
					</div>
					<HStack gap='12'>
						<Button onClick={onCalculateDrowingOperationsData}>Произвести расчёт данных по операциям</Button>
						<Button onClick={onStartEditCoeff} theme='outline'>Редактировать коэффиценты</Button>
					</HStack>
				</VStack>
			) : (
				<DrowingEditCoeffs
					operationsResult={operationsResult}
					onSaveNewCoeffs={onSaveNewCoeffs}
					onStopEditCoeff={onStopEditCoeff}
				/>
			)}
		</VStack>
	)
})

import { HStack, VStack } from '@/UI/Stack'
import { memo, useCallback, useState } from 'react'
import { CalculateOperationsCountResult } from '../../lib/types/drowing'
import { classNames } from '@/utils/lib/classNames/classNames'
import { Text } from '@/UI/Text/Text'
import cls from './DrowingCountOperations.module.scss'
import { Button } from '@/UI/Button/Button'
import BlackHintIcon from '@/assets/icons/hint-black-64-64.svg'
import WhiteHintIcon from '@/assets/icons/hint-white-64-64.svg'
import { useTheme } from '@/utils/hooks/useTheme'
import { DrowingEditCoeffs } from '../DrowingEditCoeffs/DrowingEditCoeffs'
import { Card } from '@/UI/Card/Card'

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
		<VStack className={classNames(cls.DrowingCountOperations, {}, [className])} max gap="32">
			<Text title="Результат расчёта количества операций" size="size_l"/>
			<Card>
				<VStack gap="24" max>
					<VStack gap="8">
						<Text title="Коэффициенты" size="size_s"/>
						<Text
        					textPre
        					text={`Суммарный коэффициент вытяжки: ${operationsResult?.sumDrowingCoeff}
Суммарный коэффициент утонения: ${operationsResult?.sumThinCoeff}
Количество операций: ${operationsResult?.operationsCount}`}
							size="size_s"
      					/>
					</VStack>
					<VStack gap="8">
						{!isEditCoeff ? (
							<VStack gap='8'>
								<HStack align='center'>
									<Text title="Были подобраны следующие коэфициенты по операциям" size="size_s"/>
									<img src={isLightTheme ? BlackHintIcon : WhiteHintIcon} className={cls.hint} title='Коэффициенты расчитаны программно. Вы можете изменить их вручную'/>
								</HStack>
								<Text
									textPre
									text={`Вытяжка: ${operationsResult.drowingCoeff.join(', ')}
Утонение: ${operationsResult.thinCoeff.join(', ')}`}
									size="size_s"
								/>
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
				</VStack>
			</Card>
		</VStack>
	)
})

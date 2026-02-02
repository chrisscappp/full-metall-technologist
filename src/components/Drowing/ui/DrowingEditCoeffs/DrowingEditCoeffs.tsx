import { memo, useCallback, useState } from 'react'
import { CalculateOperationsCountResult } from '../../lib/types/drowing'
import { HStack, VStack } from '@/UI/Stack'
import { classNames } from '@/utils/lib/classNames/classNames'
import { Button } from '@/UI/Button/Button'
import { Text } from '@/UI/Text/Text'
import { multiplyNumbers } from '@/utils/lib/multiplyNumbers/multiplyNumbers'
import { EditCoeffInput } from './EditCoeffInput'
import SuccessCoeffsIcon from '@/assets/icons/circle-success-green-64-64.svg'
import UnsuccessCoeffsIcon from '@/assets/icons/circle-cross-red-64-64.svg'
import cls from './DrowingEditCoeffs.module.scss'
import { isIncreasingSequence } from '@/utils/lib/isIncreasingSequence/isIncreasingSequence'

interface DrowingEditCoeffsProps {
	className?: string,
	operationsResult: CalculateOperationsCountResult,
	onSaveNewCoeffs?: (value: CalculateOperationsCountResult) => void,
	onStopEditCoeff?: () => void
}

export const DrowingEditCoeffs = memo((props: DrowingEditCoeffsProps) => {
	
	const { 
		className, 
		operationsResult,
		onSaveNewCoeffs,
		onStopEditCoeff
	} = props

	const copyOperationsResult: CalculateOperationsCountResult = JSON.parse(JSON.stringify(operationsResult))

	const [currentDrowingTotalCoeff, setCurrentDrowingTotalCoeff] = useState(copyOperationsResult.sumDrowingCoeff)
	const [currentThinTotalCoeff, setCurrentThinTotalCoeff] = useState(copyOperationsResult.sumThinCoeff)
	const [currentDrowingCoeffs, setCurrentDrowingCoeffs] = useState(copyOperationsResult.drowingCoeff)
	const [currentThinCoeffs, setCurrentThinCoeffs] = useState(copyOperationsResult.thinCoeff)
	const [isCorrectDrowingCoeffs, setIsCorrectDrowingCoeffs] = useState(true)
	const [isCorrectThinCoeffs, setIsCorrectThinCoeffs] = useState(true)

	const onChangeCurrentDrowingCoeffs = useCallback((value: number, index: number) => {
		setCurrentDrowingCoeffs(prev => {
			prev[index] = value
			const newTotalCoeff = multiplyNumbers(prev)
			setCurrentDrowingTotalCoeff(newTotalCoeff)
			setIsCorrectDrowingCoeffs(newTotalCoeff === copyOperationsResult.sumDrowingCoeff && isIncreasingSequence(prev))

			return prev
		})
	}, [copyOperationsResult.sumDrowingCoeff])

	const onChangeCurrentThinCoeffs = useCallback((value: number, index: number) => {
		setCurrentThinCoeffs(prev => {
			prev[index] = value
			const newTotalCoeff = multiplyNumbers(prev)
			setCurrentThinTotalCoeff(newTotalCoeff)
			setIsCorrectThinCoeffs(newTotalCoeff === copyOperationsResult.sumThinCoeff && isIncreasingSequence(prev))

			return prev
		})
	}, [copyOperationsResult.sumThinCoeff])

	const onSave = () => {
		onSaveNewCoeffs?.({
			...copyOperationsResult,
			drowingCoeff: currentDrowingCoeffs,
			thinCoeff: currentThinCoeffs
		})
	}

	return (
		<VStack className={classNames('', {}, [className])} gap="16">
			<Text title="Ручной ввод коэффициентов" size="size_s"/>
			<VStack gap="8">
				<Text title="ВЫТЯЖКА" size="size_sm" theme="secondary"/>
				<Text text={`Текущее значение суммарного коэффициента = ${currentDrowingTotalCoeff}`} size="size_s"/>
				<HStack gap='8' align="center">
					<img src={isCorrectDrowingCoeffs ? SuccessCoeffsIcon : UnsuccessCoeffsIcon} className={cls.icon}/>
					{copyOperationsResult.drowingCoeff.map((num, index) => (
						<>
							<EditCoeffInput
								key={`drow-edit-${index}`}
								initialValue={num}
								inputIndex={index}
								onChange={onChangeCurrentDrowingCoeffs}
							/>
						</>
					))}
				</HStack>
			</VStack>
			<VStack gap="8">
				<Text title="УТОНЕНИЕ" size="size_sm" theme="secondary"/>
				<Text text={`Текущее значение суммарного коэффициента = ${currentThinTotalCoeff}`} size="size_s"/>
				<HStack gap='8' align="center">
					<img src={isCorrectThinCoeffs ? SuccessCoeffsIcon : UnsuccessCoeffsIcon} className={cls.icon}/>
					{copyOperationsResult.thinCoeff.map((num, index) => (
						<EditCoeffInput
							key={`thin-edit-${index}`}
							initialValue={num}
							inputIndex={index}
							onChange={onChangeCurrentThinCoeffs}
						/>
					))}
				</HStack>
			</VStack>
			<HStack gap='12'>
				<Button onClick={onSave} disabled={!(isCorrectDrowingCoeffs && isCorrectThinCoeffs)}>
					Сохранить
				</Button>
				<Button onClick={onStopEditCoeff} theme='outline'>
					Отмена
				</Button>
			</HStack>
		</VStack>
	)
})

import { Navbar } from '@/components/Navbar'
import { Page } from '@/components/Page'
import { Button } from '@/UI/Button/Button'
import { useTheme } from '@/utils/hooks/useTheme'
import { memo, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import ArrowGoBackWhite from '@/assets/icons/arrow-go-back-white-64-64.svg'
import ArrowGoBackBlack from '@/assets/icons/arrow-go-back-black-64-64.svg'
import { technologistList } from '@/components/Technologist'
import cls from './TechnologistDetailPage.module.scss'
import { Text } from '@/UI/Text/Text'
import { VStack } from '@/UI/Stack'
import { useSidebar } from '@/utils/hooks/useSidebar'
import { DrowingForm, DrowingTabs } from '@/components/Drowing'
import { FellingForm, FellingTabs } from '@/components/Felling'
import { CrimpingForm, CrimpingTabs } from '@/components/Crimping'

export const TechnologistDetailPage = memo(() => {
	
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { isLightTheme } = useTheme()
	const { onMountContent, onUnmountContent } = useSidebar()
	const calculationMethod = technologistList.find(item => item.id === id)

	useEffect(() => {
		switch(calculationMethod?.type) {
			case 'drowing': {
				onMountContent(<DrowingTabs/>)
				break
			}
			case 'crimping': {
				onMountContent(<CrimpingTabs/>)
				break
			}
			case 'felling': {
				onMountContent(<FellingTabs/>)
				break
			}
		}
	}, [calculationMethod?.type, onMountContent])

	useEffect(() => {
		return () => onUnmountContent()
	}, [onUnmountContent])

	const onGoBack = useCallback(() => {
		navigate(-1)
	}, [navigate])

	if (!calculationMethod) {
		return (
			<Page>
				<VStack justify="center" gap="16">
					<Text
						text="Расчётный метод не найден"
						size="size_l"
						align="center"
					/>
					<Button onClick={onGoBack}>
						Назад
					</Button>
				</VStack>
			</Page>
		)
	}

	const renderTechnologistMethod = () => {
		switch(calculationMethod.type) {
			case 'drowing': return <DrowingForm className={cls.detail}/>
			case 'felling': return <FellingForm className={cls.detail}/>
			case 'crimping': return <CrimpingForm className={cls.detail}/>
		}
	}

	return (
		<Page>
			<Navbar
				title={calculationMethod.title}
				content={
					<Button onClick={onGoBack} theme='clear' title="Назад">
						<img 
							src={isLightTheme ? ArrowGoBackWhite : ArrowGoBackBlack}
							className={cls.icon} 
						/>
					</Button>
				}
			/>
			{renderTechnologistMethod()}
		</Page>
	)
})

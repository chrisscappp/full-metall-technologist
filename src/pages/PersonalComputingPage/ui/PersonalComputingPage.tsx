import { Page } from '@/components/Page'
import { memo, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { technologistList } from '@/components/Technologist'
import { Text } from '@/UI/Text/Text'
import { VStack } from '@/UI/Stack'
import { DrowingForm } from '@/components/Drowing'
import { FellingForm } from '@/components/Felling'
import { CrimpingForm } from '@/components/Crimping'
import { TechnologistItem } from '@/components/Technologist/lib/types/technologistTypes'

 const PersonalComputingPage = memo(() => {
	
	const { id } = useParams<{ id: string }>()
	const [calculationMethod, setCalculationMethod] = useState<TechnologistItem>()

	useEffect(() => {
		const finded = technologistList.find(item => item.type === id)
		if (finded) {
			setCalculationMethod(finded)
		}
	}, [id])

	if (!calculationMethod) {
		return (
			<Page>
				<VStack justify="center" gap="16">
					<Text
						text="Расчётный метод не найден"
						size="size_l"
						align="center"
					/>
				</VStack>
			</Page>
		)
	}

	const renderTechnologistMethod = () => {
		switch(calculationMethod.type) {
			case 'drowing': return <DrowingForm />
			case 'felling': return <FellingForm />
			case 'crimping': return <CrimpingForm/>
		}
	}

	return (
		<Page>
			{renderTechnologistMethod()}
		</Page>
	)
})

export default PersonalComputingPage

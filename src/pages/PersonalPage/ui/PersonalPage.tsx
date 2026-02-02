import { Page } from '@/components/Page'
import { TechnologistList } from '@/components/Technologist'
import { VStack } from '@/UI/Stack'
import { Text } from '@/UI/Text/Text'
import { memo } from 'react'
import cls from './PersonalPage.module.scss'
import { Card } from '@/UI/Card/Card'
import { Input } from '@/UI/Input/Input'

const PersonalPage = memo(() => {
	return (
		<Page>
			<VStack tag="article" gap="32">
				<VStack className={cls.header} tag="section" gap="8" max>
					<Text
						title="Технологические расчеты"
						weight="weight_bold"
						size="size_l"
					/>
					<Text
						text="Выберите операцию для перехода к расчету"
						theme="secondary"
						size="size_s"
					/>
				</VStack>
				<TechnologistList/>
				<Card>
					<VStack gap="24" max>
						<Text
							title="Информация о пользователе"
							size="size_s"
						/>
						<VStack gap="20" max>
							<Input
								label="ФИО ИНЖЕНЕР-ТЕХНОЛОГА"
								value="Шаненков А.К."
								readonly
							/>
							<Input
								label="НАЗВАНИЕ ОРГАНИЗАЦИИ"
								value='ООО "БНАЛ"'
								readonly
							/>
						</VStack>
					</VStack>
				</Card>
			</VStack>
		</Page>
	)
})

export default PersonalPage

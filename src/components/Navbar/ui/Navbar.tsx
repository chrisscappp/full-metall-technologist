import { memo } from 'react'
import cls from './Navbar.module.scss'
import { classNames } from '@/utils/lib/classNames/classNames'
import { Text } from '@/UI/Text/Text'
import { HStack, VStack } from '@/UI/Stack'

interface NavbarProps {
	className?: string,
}

// нужны будут разные состояния нав бара в зависимости от маршрута в приложении
export const Navbar = memo(({ className }: NavbarProps) => {
	return (
		<nav className={classNames(cls.Navbar, {}, [className])}>
			<HStack 
				max 
				justify='between'
				align="center"
			>
				<VStack gap="8">
					<Text
						title="Технолог"
						weight="weight_bold"
					/>
					<Text
						text="Технологические расчеты"
						theme="tertiary"
					/>
				</VStack>
				<HStack gap="40">
					<VStack gap="8">
						<Text
							text="57"
							weight="weight_bold"
						/>
						<Text
							text="ВСЕГО РАСЧЕТОВ"
							size="size_s"
							theme="tertiary"
						/>
					</VStack>
					<VStack gap="8">
						<Text
							text="3"
							weight="weight_bold"
						/>
						<Text
							text="СЕГОДНЯ"
							size="size_s"
							theme="tertiary"
						/>
					</VStack>
					<VStack gap="8">
						<Text
							text="12"
							weight="weight_bold"
						/>
						<Text
							text="ЗА НЕДЕЛЮ"
							size="size_s"
							theme="tertiary"
						/>
					</VStack>
					<VStack gap="8">
						<Text
							text="96%"
							weight="weight_bold"
						/>
						<Text
							text="ТОЧНОСТЬ"
							size="size_s"
							theme="tertiary"
						/>
					</VStack>
				</HStack>
				<HStack gap="20" align="center">
					<VStack gap="8">
						<Text
							text="Шаненков А.К."
							weight="weight_bold"
						/>
						<Text
							text="АЛКАШ"
							size="size_s"
							theme="tertiary"
						/>
					</VStack>
					<div className={cls.avatar}/>
				</HStack>
			</HStack>
		</nav>
	)
})

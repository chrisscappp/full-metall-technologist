import { Page } from '@/components/Page'
import { memo } from 'react'
import { Navbar } from '@/components/Navbar'
import { TechnologistList } from '@/components/Technologist'
import cls from './MainPage.module.scss'

export const MainPage = memo(() => {
	return (
		<Page>
			<Navbar title="Главное меню"/>
			<TechnologistList className={cls.list}/>
		</Page>
	)
})

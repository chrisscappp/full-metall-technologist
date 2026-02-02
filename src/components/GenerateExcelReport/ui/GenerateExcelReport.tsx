import { lazy, memo } from 'react'
import { GenerateExcelReportProps } from './GenerateExcelReportContent'
import { DesktopComponent } from '@/utils/components/DesktopComponent'

const GenerateExcelReportContentLazy = lazy(() => import('./GenerateExcelReportContent'))

export const GenerateExcelReport = memo(<T extends object>(props: GenerateExcelReportProps<T>) => {
	return (
		<DesktopComponent>
			<GenerateExcelReportContentLazy {...props} />
		</DesktopComponent>
	)
})

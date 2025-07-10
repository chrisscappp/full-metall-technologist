import { classNames } from '@/utils/functions/classNames'
import { memo, ReactNode } from 'react'
import cls from './Table.module.scss'

export type TableRowsType = [string, ReactNode][]

interface TableItems {
	titles: string[],
	rows?: TableRowsType
}

interface TableProps {
	className?: string,
	items?: TableItems
}

export const Table = memo((props: TableProps) => {
	
	const {
		className,
		items
	} = props
	
	return (
		<table className={classNames(cls.Table, {}, [className])} border={1}>  
    		<thead>  
        		<tr>  
					{items?.titles.map(title => (
						<th 
							className={cls.th}
							key={`table-title-${title}`}
						>
							{title}
						</th>  
					))} 
        		</tr>  
    		</thead>  
    		<tbody>  
				{items?.rows && items.rows.map((row, index) => (
					<tr key={`table-row-${index}`}>
						{row.map(item => (
							<td className={cls.td} key={`table-row-item${item}`}>{item}</td>  
						))}
					</tr>
				))}
    		</tbody>  
		</table>  
	)
})

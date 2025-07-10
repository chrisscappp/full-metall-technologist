import { DetailMaterialValueType } from '@/components/SelectMaterial'

export interface MechanicalDetailInfo {
	material: DetailMaterialValueType            // Материал
    operator_name: string,                       // Имя оператора
    organization_name: string,                   // Название организации
    detail_name: string                          // Наименование детали
}

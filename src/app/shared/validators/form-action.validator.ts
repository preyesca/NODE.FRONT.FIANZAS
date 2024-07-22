import { EFormAction } from '../helpers/enums/form-action.enum';

export class FormActionValidator {
    static checkRoute(path : string | undefined, id : string | undefined): | {
        id: string | null;
        action: EFormAction;
        breadcrumb: string;
    } | undefined {
        if (path) {
            if (path.includes('/crear')) 
                return {id: null, action: EFormAction.CREATE, breadcrumb: 'general.options.new' };
            
            if (path.includes('/actualizar/')) {
                return id ? {
                    id,
                    action: EFormAction.UPDATE,
                    breadcrumb: 'general.options.edit'
                } : undefined;
            }

            if (path.includes('/ver/')) {
                return id ? {
                    id,
                    action: EFormAction.VIEW,
                    breadcrumb: 'general.options.view'
                } : undefined;
            }
        }
        return;
    }
}

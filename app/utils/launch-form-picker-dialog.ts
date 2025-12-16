import type { ButtonProps } from '@nuxt/ui';
import FormPickerDialog from '../dialogs/form-picker-dialog.vue';


interface IOptions {
  icon?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  fields: any[];
  initialForm?: any;
  submitButton?: Omit<ButtonProps, 'disabled'> & { disabled?: boolean | ((form: any) => boolean) | Record<string, any> };
  cancelButton?: ButtonProps;
}

export function launchFormPickerDialog(options: IOptions) {
  return launchDialog({
    component: FormPickerDialog,
    props: options,
  });
}

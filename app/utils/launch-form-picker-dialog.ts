import type { ButtonProps } from '@nuxt/ui';
import FormPickerDialog from '../dialogs/form-picker-dialog.vue';


interface IOptions {
  icon?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  fields: any[];
  initialForm?: any;
  submitButton?: ButtonProps & { disabled?: boolean | (() => boolean) | object };
  cancelButton?: ButtonProps;
}

export function launchFormPickerDialog(options: IOptions) {
  return launchDialog({
    component: FormPickerDialog,
    props: options,
  });
}

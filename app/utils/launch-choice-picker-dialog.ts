import type { ButtonProps, ModalProps } from '@nuxt/ui';
import ChoicePickerDialog from '../dialogs/choice-picker-dialog.vue';


interface IOptions {
  icon?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  modalOptions?: ModalProps;
  startButtons?: ( ButtonProps & { value?: string } )[];
  endButtons?: ( ButtonProps & { value?: string } )[];
}

export function launchChoicePickerDialog(options: IOptions) {
  return launchDialog({
    component: ChoicePickerDialog,
    props: options,
  });
}



type IToast = Parameters<ReturnType<typeof useToast>['add']>['0'];
type ITypedToast = Omit<IToast, 'icon' | 'color'>;


export function toast(options: IToast) {
  (useNuxtApp().$toaster as ReturnType<typeof useToast>).add(options);
}


export function toastSuccess(options: ITypedToast) {
  toast({
    icon: 'lucide:check',
    color: 'success',
    ...options,
  });
}

export function toastError(options: ITypedToast) {
  toast({
    icon: 'lucide:circle-alert',
    color: 'error',
    ...options,
  });
}

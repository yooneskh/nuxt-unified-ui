<script setup>

/* interface */

const props = defineProps({
  icon: {
    type: String,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  text: {
    type: String,
  },
  fields: {
    type: Array,
    required: true,
  },
  initialForm: {
    type: Object,
  },
  submitButton: {
    type: Object,
  },
  cancelButton: {
    type: Object,
  },
});

const emit = defineEmits([
  'close',
]);


/* form */

const { form, formTag } = useForm({
  target: !props.initialForm ? undefined : JSON.parse(JSON.stringify(props.initialForm)),
  fields: () => props.fields,
});


/* actions */

async function handleSubmit() {
  await props.submitButton?.onClick?.(form.value);
  emit('close', form.value);
}

</script>


<template>
  <u-modal @update:open="!$event && emit('close')">
    <template #content>
      <un-card
        :icon="props.icon"
        :title="props.title"
        :subtitle="props.subtitle"
        :text="props.text"
        :actions="[
          {
            label: 'Submit',
            ...props.submitButton,
            disabled: smartMatch(props.submitButton?.disabled, form),
            loadingAuto: true,
            onClick: handleSubmit,
          },
          {
            actionType: 'spacer',
          },
          {
            variant: 'ghost',
            label: 'Cancel',
            ...props.cancelButton,
            loadingAuto: true,
            onClick: () => emit('close'),
          },
        ]">
        <form-tag />
      </un-card>
    </template>
  </u-modal>
</template>

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
  startButtons: {
    type: Array,
  },
  endButtons: {
    type: Array,
  },
});

const emit = defineEmits([
  'close',
]);


const startButtons = computed(() => {
  return props.startButtons || [
    {
      label: $t('common.submit'),
      value: true,
    },
  ];
});

const endButtons = computed(() => {
  return props.endButtons ?? [
    {
      variant: 'ghost',
      label: $t('common.cancel'),
      value: false,
    },
  ];
});


/* actions */

async function handleButtonClick(button) {
  await button.onClick?.(button.value);
  emit('close', button.value);
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
          ...startButtons.map(button => ({
            ...button,
            onClick: () => handleButtonClick(button),
          })),
          {
            actionType: 'spacer',
          },
          ...endButtons.map(button => ({
            ...button,
            onClick: () => handleButtonClick(button),
          })),
        ]"
      />
    </template>
  </u-modal>
</template>

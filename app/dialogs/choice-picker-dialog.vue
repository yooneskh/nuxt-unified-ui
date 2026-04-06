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
    default: () => [
      {
        label: $t('common.submit'),
        value: true,
      },
    ],
  },
  endButtons: {
    type: Array,
    default: () => [
      {
        variant: 'ghost',
        label: $t('common.cancel'),
        value: false,
      },
    ],
  },
});

const emit = defineEmits([
  'close',
]);


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
          ...(props.startButtons || []).map(button => ({
            ...button,
            onClick: () => handleButtonClick(button),
          })),
          {
            actionType: 'spacer',
          },
          ...(props.endButtons || []).map(button => ({
            ...button,
            onClick: () => handleButtonClick(button),
          })),
        ]"
      />
    </template>
  </u-modal>
</template>

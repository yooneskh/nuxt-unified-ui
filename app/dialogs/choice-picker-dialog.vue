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
        label: 'Submit',
        value: true,
      },
    ],
  },
  endButtons: {
    type: Array,
    default: () => [
      {
        variant: 'ghost',
        label: 'Cancel',
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

  if (button.onClick) {
    await button.onClick(button.value);
  }

  emit('close', button.value);

}

</script>


<template>
  <u-modal @update:open="!$event && emit('close')">
    <template #content>
      <u-card>

        <un-typography
          :icon="props.icon"
          :title="props.title"
          :subtitle="props.subtitle"
          :text="props.text"
        />

        <div class="flex items-end gap-2 mt-4">

          <u-button
            v-for="button of props.startButtons" :key="button.value || button.label || button.icon"
            v-bind="radOmit(button, [ 'value', 'onClick' ])"
            loading-auto
            @click="handleButtonClick(button)"
          />

          <div class="grow" />

          <u-button
            v-for="button of props.endButtons" :key="button.value || button.label || button.icon"
            v-bind="radOmit(button, [ 'value', 'onClick' ])"
            loading-auto
            @click="handleButtonClick(button)"
          />

        </div>

      </u-card>
    </template>
  </u-modal>
</template>

<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();


/* dates */

import { CalendarDate } from '@internationalized/date';


const internalModel = computed({
  get: () => {

    if (!modelValue.value) {
      return null;
    }

    const date = new Date(modelValue.value);

    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

  },
  set: v => {
    modelValue.value = parseDate(String(v), 'YYYY-MM-DD');
  },
});


const inputTitle = computed(() => {

  if (!modelValue.value) {
    return '';
  }

  return formatDate(modelValue.value, 'YYYY-MM-DD');

});

</script>


<template>
  <u-popover>

    <u-form-field v-bind="radPick(props.field, [ 'label', 'hint', 'help' ])">
      <u-input
        class="w-full"
        v-bind="radOmit(props.field, [ 'key', 'identifier', 'label', 'hint', 'help' ])"
        readonly
        :model-value="inputTitle"
      />
    </u-form-field>

    <template #content>

      <u-calendar
        class="ltr p-2 [&_th]:text-center!"
        v-model="internalModel"
      />

    </template>

  </u-popover>
</template>

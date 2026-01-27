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

const availableYears = computed(() => {
  return Array.from({ length: 80 }, (_, i) => new Date().getFullYear() + 10 - i);
});


function setMonthTo(month) {
  internalModel.value = new CalendarDate(internalModel.value?.toDate()?.getFullYear(), month, internalModel.value?.toDate()?.getDate());
}

function setYearTo(year) {
  internalModel.value = new CalendarDate(year, internalModel.value?.toDate()?.getMonth() + 1, internalModel.value?.toDate()?.getDate());
}

</script>


<template>
  <u-popover>

    <u-form-field v-bind="radPick(props.field, [ 'label', 'hint', 'help', 'description' ])">
      <u-input
        class="w-full"
        v-bind="radOmit(props.field, [ 'key', 'identifier', 'label', 'hint', 'help', 'description' ])"
        readonly
        :model-value="inputTitle"
      />
    </u-form-field>

    <template #content>

      <u-calendar
        class="ltr p-2 [&_th]:text-center!"
        v-model="internalModel">
        <template #heading="{ value }">

          <template v-if="value?.split(' ')?.[0]">
            <u-dropdown-menu
              :items="[
                {
                  label: 'January',
                  onClick: () => setMonthTo(1)
                },
                {
                  label: 'February',
                  onClick: () => setMonthTo(2)
                },
                {
                  label: 'March',
                  onClick: () => setMonthTo(3)
                },
                {
                  label: 'April',
                  onClick: () => setMonthTo(4),
                },
                {
                  label: 'May',
                  onClick: () => setMonthTo(5),
                },
                {
                  label: 'June',
                  onClick: () => setMonthTo(6),
                },
                {
                  label: 'July',
                  onClick: () => setMonthTo(7),
                },
                {
                  label: 'August',
                  onClick: () => setMonthTo(8),
                },
                {
                  label: 'September',
                  onClick: () => setMonthTo(9),
                },
                {
                  label: 'October',
                  onClick: () => setMonthTo(10),
                },
                {
                  label: 'November',
                  onClick: () => setMonthTo(11),
                },
                {
                  label: 'December',
                  onClick: () => setMonthTo(12),
                },
              ]">
              <u-button
                variant="subtle"
                size="sm"
                :label="value?.split(' ')?.[0]"
              />
            </u-dropdown-menu>
          </template>

          <template v-if="value?.split(' ')?.[1]">
            <u-dropdown-menu
              :items="availableYears.map(year => ({
                label: String(year),
                onClick: () => setYearTo(year),
              }))"
              :ui="{
                content: 'max-h-40'
              }">
              <u-button
                variant="subtle"
                size="sm"
                :label="value?.split(' ')?.[1]"
                class="ms-1"
              />
            </u-dropdown-menu>
          </template>

        </template>
      </u-calendar>

    </template>

  </u-popover>
</template>

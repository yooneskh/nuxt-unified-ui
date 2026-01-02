<script setup>

/* interface */

const props = defineProps({
  target: Object,
  fields: Array,
});


/* elements */

import FormElementInput from '../elements/form-element-input.vue';
import FormElementTextarea from '../elements/form-element-textarea.vue';
import FormElementSelect from '../elements/form-element-select.vue';
import FormElementSeries from '../elements/form-element-series.vue';
import FormElementCheckbox from '../elements/form-element-checkbox.vue';
import FormElementDate from '../elements/form-element-date.vue';
import FormElementMedia from '../elements/form-element-media.vue';


const elementsMap = {
  'input': FormElementInput,
  'textarea': FormElementTextarea,
  'select': FormElementSelect,
  'series': FormElementSeries,
  'date': FormElementDate,
  'checkbox': FormElementCheckbox,
  'media': FormElementMedia,
};


/* v-if */

const filteredFields = computed(() => {
  return props.fields?.filter(it =>
    !('if' in it) || smartMatch(it.if, props.target)
  );
});

</script>


<template>
  <div class="grid grid-cols-12 gap-3">
    <div
      v-for="field of filteredFields" :key="field.key"
      :class="{
        'col-span-12': field.width === 12 || !field.width,
        'col-span-11': field.width === 11,
        'col-span-10': field.width === 10,
        'col-span-9': field.width === 9,
        'col-span-8': field.width === 8,
        'col-span-7': field.width === 7,
        'col-span-6': field.width === 6,
        'col-span-5': field.width === 5,
        'col-span-4': field.width === 4,
        'col-span-3': field.width === 3,
        'col-span-2': field.width === 2,
        'col-span-1': field.width === 1,
      }">
      <component
        :is="elementsMap[field.identifier]"
        :field="field"
        :model-value="radGet(props.target, field.key)"
        @update:model-value="radSet(props.target, field.key, $event)"
      />
    </div>
  </div>
</template>

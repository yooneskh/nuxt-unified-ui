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


const formExtraElements = useFormExtraElements();


const elementsMap = computed(() => {
  return {
    'input': FormElementInput,
    'textarea': FormElementTextarea,
    'select': FormElementSelect,
    'series': FormElementSeries,
    'date': FormElementDate,
    'checkbox': FormElementCheckbox,
    ...(Object.fromEntries(
      formExtraElements.value.map(it =>
        [
          it.identifier,
          it.component,
        ],
      ),
    )),
  };
});


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
      class="col-span-12"
      :class="{
        'tablet:col-span-12': field.width === 12 || !field.width,
        'tablet:col-span-11': field.width === 11,
        'tablet:col-span-10': field.width === 10,
        'tablet:col-span-9': field.width === 9,
        'tablet:col-span-8': field.width === 8,
        'tablet:col-span-7': field.width === 7,
        'tablet:col-span-6': field.width === 6,
        'tablet:col-span-5': field.width === 5,
        'tablet:col-span-4': field.width === 4,
        'tablet:col-span-3': field.width === 3,
        'tablet:col-span-2': field.width === 2,
        'tablet:col-span-1': field.width === 1,
      }">
      <component
        :is="elementsMap[field.identifier]"
        :field="field"
        :model-value="radGet(props.target, field.key)"
        @update:model-value="unSet(props.target, field.key, $event)"
      />
    </div>
  </div>
</template>

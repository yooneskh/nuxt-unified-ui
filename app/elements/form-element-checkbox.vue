<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();


/* field */

const fieldProps = computed(() => {

  const fields = radPick(props.field, [ 'hint', 'help', 'description' ]);


  if (props.field.controlLabel) {
    fields.label = props.field.label;
  }


  return fields;

});

const controlProps = computed(() => {

  const fields = radOmit(props.field, [ 'key', 'identifier', 'label', 'controlLabel', 'hint', 'help', 'description' ]);


  if (!props.field.controlLabel) {
    fields.label = props.field.label;
  }
  else {
    fields.label = props.field.controlLabel;
  }


  return fields;

});

</script>


<template>
  <u-form-field v-bind="fieldProps">
    <u-checkbox
      class="w-full"
      v-bind="controlProps"
      v-model="modelValue"
    />
  </u-form-field>
</template>

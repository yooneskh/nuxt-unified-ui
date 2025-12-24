<script setup>

/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();


/* smart model */

const smartModel = computed({
  get: () => {
    if (props.field.type === 'file') {
      return '';
    }
    else {
      return modelValue.value;
    }
  },
  set: v => {
    if (props.field.type !== 'file') {
      modelValue.value = v;
    }
  },
});

function handleChange(event) {
  if (props.field.type === 'file') {
    modelValue.value = props.field.multiple ? event.target.files : event.target.files?.[0];
  }
}

</script>


<template>
  <u-form-field v-bind="radPick(props.field, [ 'label', 'hint', 'help', 'description' ])">
    <u-input
      class="w-full"
      v-bind="radOmit(props.field, [ 'key', 'identifier', 'label', 'hint', 'help', 'description' ])"
      v-model="smartModel"
      @change="handleChange($event)"
    />
  </u-form-field>
</template>

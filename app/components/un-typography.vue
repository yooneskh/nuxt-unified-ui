<script setup>

/* interface */

const props = defineProps({
  icon: {
    type: String,
  },
  iconClasses: {
    type: String,
  },
  title: {
    type: String,
  },
  titleClasses: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  subtitleClasses: {
    type: String,
  },
  text: {
    type: String,
  },
  textClasses: {
    type: String,
  },
});

const slots = useSlots();


/* flags */

const shouldShow = computed(() => {
  return props.icon || props.title || props.subtitle || props.text || slots.append;
});

</script>


<template>
  <div v-if="shouldShow">

    <div v-if="props.title || props.subtitle || props.icon || slots.append" class="flex items-start">
      <div>
        <div v-if="props.title || props.icon" class="flex items-center" style="gap: 0.5em;">
          <u-icon
            v-if="props.icon"
            :name="props.icon"
            :class="props.iconClasses"
            style="width: 1.3em; height: 1.3em; flex-shrink: 0; flex-grow: 0;"
          />
          <h1
            v-if="props.title"
            class="font-medium"
            :class="props.titleClasses"
            style="font-size: 1.3em;">
            {{ props.title }}
          </h1>
        </div>
        <h2
          v-if="props.subtitle"
          class="font-light"
          :class="props.subtitleClasses"
          style="font-size: 0.9em;"
          :style="{
            marginInlineStart: props.icon ? '2em' : '0',
          }">
          {{ props.subtitle }}
        </h2>
      </div>
      <template v-if="slots.append">
        <div class="ms-auto flex items-center gap-1">
          <slot name="append" />
        </div>
      </template>
    </div>

    <p
      v-if="props.text"
      :class="[
        {
          'mt-2': props.title || props.subtitle,
        },
        props.textClasses
      ]">
      {{ props.text }}
    </p>

  </div>
</template>

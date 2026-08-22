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
  headerLevel: {
    type: Number,
    default: 2,
  },
});

const slots = useSlots();


/* header */

const titleTag = computed(() => {
  return `h${resolveHeaderLevel(props.headerLevel)}`;
});

const subtitleTag = computed(() => {
  return `h${Math.min(resolveHeaderLevel(props.headerLevel) + 1, 6)}`;
});


function resolveHeaderLevel(level) {
  if (level >= 1 && level <= 6) {
    return level;
  }
  else {
    return 2;
  }
}


/* flags */

const shouldShow = computed(() => {
  return props.icon || props.title || isSlotFilled(slots.title) || props.subtitle || isSlotFilled(slots.subtitle) || props.text || isSlotFilled(slots.append);
});

</script>


<template>
  <div v-if="shouldShow">

    <div v-if="props.title || props.subtitle || props.icon || slots.append" class="flex items-start">
      <div class="w-0 grow">

        <div v-if="props.title || props.icon" class="flex items-center" style="gap: 0.5em;">

          <u-icon
            v-if="props.icon"
            :name="props.icon"
            :class="props.iconClasses"
            style="width: 1.3em; height: 1.3em; flex-shrink: 0; flex-grow: 0;"
          />

          <template v-if="props.title || isSlotFilled(slots.title)">
            <div style="font-size: 1.3em;">
              <slot name="title">
                <component
                  :is="titleTag"
                  class="font-medium"
                  :class="props.titleClasses">
                  {{ props.title }}
                </component>
              </slot>
            </div>
          </template>

        </div>

        <template v-if="props.subtitle || isSlotFilled(slots.subtitle)">
          <div style="font-size: 0.9em;" :style="{ marginInlineStart: props.icon ? '2em' : '0' }">
            <slot name="subtitle">
              <component
                :is="subtitleTag"
                class="font-light"
                :class="props.subtitleClasses">
                {{ props.subtitle }}
              </component>
            </slot>
          </div>
        </template>

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

<script setup>

/* interface */

import { tv } from '@nuxt/ui/utils/tv';


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
  headerLevel: {
    type: Number,
    default: 2,
  },
  ui: {
    type: Object,
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


/* theme */

const appConfig = useAppConfig();

const typographyTheme = {
  slots: {
    root: '',
    wrapper: 'flex items-start',
    content: 'w-0 grow',
    heading: 'flex items-center gap-[0.5em]',
    icon: 'size-[1.3em] shrink-0 grow-0',
    titleWrapper: 'text-[1.3em]',
    title: 'font-medium',
    subtitleWrapper: 'text-[0.9em]',
    subtitle: 'font-light',
    append: 'ms-auto flex items-center gap-1',
    text: '',
  },
  variants: {
    hasIcon: {
      true: {
        subtitleWrapper: 'ms-[2em]',
      },
    },
    hasHeading: {
      true: {
        text: 'mt-2',
      },
    },
  },
};

const ui = computed(() => {
  return tv({
    extend: typographyTheme,
    ...(appConfig.ui?.unTypography || {}),
  })({
    hasIcon: !!props.icon,
    hasHeading: !!(props.title || props.subtitle),
  });
});

</script>


<template>
  <div v-if="shouldShow" :class="ui.root({ class: props.ui?.root })">

    <div v-if="props.title || props.subtitle || props.icon || slots.append" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div :class="ui.content({ class: props.ui?.content })">

        <div v-if="props.title || props.icon" :class="ui.heading({ class: props.ui?.heading })">

          <u-icon
            v-if="props.icon"
            :name="props.icon"
            :class="ui.icon({ class: props.ui?.icon })"
          />

          <template v-if="props.title || isSlotFilled(slots.title)">
            <div :class="ui.titleWrapper({ class: props.ui?.titleWrapper })">
              <slot name="title">
                <component
                  :is="titleTag"
                  :class="ui.title({ class: props.ui?.title })">
                  {{ props.title }}
                </component>
              </slot>
            </div>
          </template>

        </div>

        <template v-if="props.subtitle || isSlotFilled(slots.subtitle)">
          <div :class="ui.subtitleWrapper({ class: props.ui?.subtitleWrapper })">
            <slot name="subtitle">
              <component
                :is="subtitleTag"
                :class="ui.subtitle({ class: props.ui?.subtitle })">
                {{ props.subtitle }}
              </component>
            </slot>
          </div>
        </template>

      </div>
      <template v-if="slots.append">
        <div :class="ui.append({ class: props.ui?.append })">
          <slot name="append" />
        </div>
      </template>
    </div>

    <p
      v-if="props.text"
      :class="ui.text({ class: props.ui?.text })">
      {{ props.text }}
    </p>

  </div>
</template>

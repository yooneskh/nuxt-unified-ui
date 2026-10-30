<script setup>

/* responsibility */

// Frames every playground page
// with the sidebar and the top bar.


/* navigation */

const route = useRoute();


const sectionTitle = computed(() => {
  return playgroundSections.find(item => item.name === route.name)?.label ?? 'Playground';
});

const navItems = computed(() => {
  return [
    playgroundSections.map(item => {
      return {
        icon: item.icon,
        label: item.label,
        exact: item.name === 'playground.overview',
        to: {
          name: item.name,
        },
      };
    }),
  ];
});


watch(
  () => route.fullPath,
  resetPanelScroll,
);


function resetPanelScroll() {
  document.getElementById('dashboard-panel-playground')?.querySelector(':scope > [data-slot="body"]')?.scrollTo(0, 0);
}

</script>


<template>
  <u-dashboard-group>

    <u-dashboard-sidebar
      collapsible
      :default-size="12"
      :ui="{
        header: 'h-12 px-2.5',
        body: 'gap-1 px-2 py-1.5',
      }">

      <template #header="{ collapsed }">

        <template v-if="collapsed">
          <div class="mx-auto flex size-6 items-center justify-center rounded-md bg-elevated ring ring-default">
            <u-icon
              name="lucide:package"
              class="size-3.5"
            />
          </div>
        </template>

        <template v-else>
          <div class="flex min-w-0 items-center gap-2">

            <div class="flex size-6 shrink-0 items-center justify-center rounded-md bg-elevated ring ring-default">
              <u-icon
                name="lucide:package"
                class="size-3.5"
              />
            </div>

            <p class="truncate text-sm font-semibold text-highlighted">
              Unified UI
            </p>

          </div>
        </template>

      </template>

      <template #default="{ collapsed }">
        <u-navigation-menu
          size="xs"
          orientation="vertical"
          :collapsed="collapsed"
          :items="navItems"
        />
      </template>

    </u-dashboard-sidebar>

    <u-dashboard-panel id="playground">

      <template #header>
        <u-dashboard-navbar :title="sectionTitle">

          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #right>

            <u-badge
              variant="subtle"
              icon="lucide:sparkles"
              label="Layer demo"
            />

            <u-button
              variant="subtle"
              size="xs"
              icon="lucide:book-open"
              label="Nuxt UI"
              href="https://ui.nuxt.com"
              target="_blank"
            />

          </template>

        </u-dashboard-navbar>
      </template>

      <template #body>
        <slot />
      </template>

    </u-dashboard-panel>

  </u-dashboard-group>
</template>

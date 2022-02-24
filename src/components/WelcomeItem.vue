<script>
import { useApollo } from "@/plugins/apollo.js";
import { gql } from "@apollo/client/core";
import { defineStore, mapActions, mapState, mapStores } from "pinia";

const useCounterStore = defineStore("counter", {
  state: () => {
    return { hello: "" };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    sayHello() {
      const apollo = useApollo();
      apollo.query({
          query: gql`
            query {
              hello
            }
          `,
        })
        .then(({ data }) => {
          this.hello = data.hello;
        });
    },
  },
});

export default {
  setup() {
    const counter = useCounterStore();
    counter.sayHello();
  },
  computed: {
    // other computed properties

    // gives access to this.counterStore and this.userStore
    ...mapStores(useCounterStore),
    // gives read access to this.count and this.double
    ...mapState(useCounterStore, ["hello"]),
  },
  methods: {
    // gives access to this.increment()
    ...mapActions(useCounterStore, ["sayHello"]),
  },
};
</script>

<template>
  <div class="item">
    {{ hello }}
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;

  color: var(--color-text);
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: " ";
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: " ";
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>

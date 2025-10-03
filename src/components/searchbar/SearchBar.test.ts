import SearchBar from "@/components/searchbar/SearchBar.vue";
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("SearchBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the input correctly", () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: "" },
    });

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
  });

  it("should show the initial value", () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: "pikachu" },
    });

    const input = wrapper.find("input");
    expect(input.element.value).toBe("pikachu");
  });

  it("should emit update:modelValue when typing", async () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: "" },
    });

    const input = wrapper.find("input");
    await input.setValue("bulbasaur");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["bulbasaur"]);
  });

  it("should emit search after debounce", async () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: "" },
    });

    const input = wrapper.find("input");
    await input.setValue("charmander");

    expect(wrapper.emitted("search")).toBeFalsy();

    vi.advanceTimersByTime(1000);

    expect(wrapper.emitted("search")).toBeTruthy();
    expect(wrapper.emitted("search")?.[0]).toEqual(["charmander"]);
  });

  it("should not emit search before completing debounce", async () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: "" },
    });

    const input = wrapper.find("input");
    await input.setValue("squirtle");

    vi.advanceTimersByTime(500);

    expect(wrapper.emitted("search")).toBeFalsy();
  });

  it("should cancel previous search if typing quickly", async () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: "" },
    });

    const input = wrapper.find("input");

    await input.setValue("char");
    vi.advanceTimersByTime(500);

    await input.setValue("charmander");
    vi.advanceTimersByTime(1000);

    expect(wrapper.emitted("search")?.length).toBe(1);
    expect(wrapper.emitted("search")?.[0]).toEqual(["charmander"]);
  });

  it("should use default placeholder", () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: "" },
    });

    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe("Search");
  });

  it("should use custom placeholder", () => {
    const wrapper = mount(SearchBar, {
      props: {
        modelValue: "",
        placeholder: "Search Pokémon...",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe("Search Pokémon...");
  });
});

import { useContributionStore } from "@/stores/contributionStore";
import { useUserStore } from "@/stores/userStore";
import { UseBoundStore, StoreApi } from "zustand";

type StoreReset = { reset: () => void };

type StoreWithReset = UseBoundStore<StoreApi<object & StoreReset>>;

const storeRegister: StoreWithReset[] = [useUserStore, useContributionStore];

export const resetAllStores = () => {
    storeRegister.forEach((store) => store.getState().reset());
};

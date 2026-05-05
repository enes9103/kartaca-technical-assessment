"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { bootstrapRequested } from "@/lib/features/app/appSlice";
import { sessionRequested } from "@/lib/features/auth/authSlice";
import { makeStore } from "@/lib/store";

type StoreProviderProps = {
  children: React.ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(bootstrapRequested());
    store.dispatch(sessionRequested());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}

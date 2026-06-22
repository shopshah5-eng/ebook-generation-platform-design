"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import { BillingPanel } from "../../../components/sections/BillingPanel";

export default function BillingRoute() {
  const [ebookCount, setEbookCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const loadBillingData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch ebooks count
        const { count, error } = await supabase
          .from("ebooks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (!error && count !== null) {
          setEbookCount(count);
        }
      }
    };
    loadBillingData();
  }, []);

  return (
    <div className="py-2">
      <BillingPanel ebookCount={ebookCount} />
    </div>
  );
}

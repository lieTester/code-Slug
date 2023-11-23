import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useQueryParams<T = {}>() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const urlSearchParams = new URLSearchParams(
      Array.from(searchParams ? searchParams.entries() : [])
   );

   function setQueryParams(params: Partial<Record<string, string>>) {
      Object.entries(params).forEach(([key, value]) => {
         if (value !== undefined) {
            if (key === "topics" || key === "companies") {
               const existingValue = urlSearchParams.get(key) || "";
               if (existingValue) value = `${existingValue}~${value}`;
            }
            urlSearchParams.set(key, String(value));
         }
      });

      const search = urlSearchParams.toString();
      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
   }

   function removeQueryParams(
      params: Partial<Record<string, string | undefined>>
   ) {
      Object.entries(params).forEach(([key, value]) => {
         if (value !== undefined) {
            if (key === "topics" || key === "companies") {
               const arr: string[] = urlSearchParams.get(key)?.split("~") || [];

               const newValue = arr.filter((item: string) =>
                  value.localeCompare(item)
               );
               if (newValue.length > 0) {
                  urlSearchParams.set(key, String(newValue.join("~")));
               } else {
                  urlSearchParams.delete(key);
               }
            } else {
               urlSearchParams.delete(key);
            }
         }
      });
      const search = urlSearchParams.toString();
      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
   }

   return { urlSearchParams, setQueryParams, removeQueryParams };
}
